import { readFile } from 'fs'

const filename = './data.txt'
const equations = []

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    data.split('\r\n').forEach((line) => {
        equations.push({
            result: parseInt(line.split(': ')[0]),
            numbers: line.split(': ')[1].split(' ').map(Number),
        })
    })

    let totalCalibration = 0

    for (let equation of equations) {
        if (checkIfEquationCanBeTrue(equation)) {
            totalCalibration += equation.result
        }
    }

    console.log('Total calibration result:', totalCalibration)
})

function checkIfEquationCanBeTrue(equation) {
    const { numbers, result } = equation
    const operations = getOperations(numbers.length, ['+', '*', '||'])

    for (let ops of operations) {
        let computedValue = numbers[0]
        for (let i = 0; i < ops.length; i++) {
            computedValue = applyOperation(computedValue, numbers[i + 1], ops[i])
            if (typeof computedValue === 'string') {
                computedValue = parseInt(computedValue)
            }
        }

        if (computedValue === result) {
            return true
        }
    }
    return false
}

function applyOperation(a, b, operator) {
    switch (operator) {
        case '+':
            return a + b
        case '*':
            return a * b
        case '||':
            return a.toString() + b.toString()
        default:
            throw new Error(`Unsupported operator ${operator}`)
    }
}

function getOperations(numberOfDigits, allowedOperations = []) {
    if (numberOfDigits < 2) {
        return []
    }

    function generateCombinations(currentLength) {
        if (currentLength === 1) {
            return allowedOperations.map((op) => [op])
        }

        const smallerCombinations = generateCombinations(currentLength - 1)
        const combinations = []

        smallerCombinations.forEach((combination) => {
            allowedOperations.forEach((op) => {
                combinations.push([...combination, op])
            })
        })

        return combinations
    }

    return generateCombinations(numberOfDigits - 1)
}
