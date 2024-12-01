import { readFile } from 'fs'

const filename = './data.txt'

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    const lines = data.split('\n')

    // Mettre les listes dans un tableau
    const list1 = []
    const list2 = []

    lines.forEach((line) => {
        const lineValues = line.split('   ')
        list1.push(parseInt(lineValues[0]))
        list2.push(parseInt(lineValues[1]))
    })

    // Patie 1
    list1.sort((a, b) => a - b)
    list2.sort((a, b) => a - b)

    let totalDifference = 0

    for (let i = 0; i < list1.length; i++) {
        const difference = Math.abs(list1[i] - list2[i])
        totalDifference += difference
    }

    console.log('Différence totale : ', totalDifference)

    // Patie 2
    let totalSimilarity = 0

    for (let itemFromList1 of list1) {
        const similarValues = list2.filter((itemFromList2) => itemFromList2 === itemFromList1)
        if (similarValues.length > 0) {
            totalSimilarity += itemFromList1 * similarValues.length
        }
    }

    console.log('Somme des scores de similarité : ', totalSimilarity)
})
