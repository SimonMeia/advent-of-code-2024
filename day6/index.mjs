import { readFile } from 'fs'

const filename = './data.txt'
let guardPosition = {}
let map = []
let moves = 0

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    data.split('\n').forEach((line, lineIndex) => {
        if (line.includes('^')) {
            guardPosition = {
                line: lineIndex,
                row: line.indexOf('^'),
                facing: 'top',
            }
        }
    })

    map = data.split('\n').map((line) => line.split(''))

    let index = 0
    do {
        index++
        move()
        visualize()
    } while (guardPosition.line < map.length && guardPosition.row < map[0].length && guardPosition.row >= 0 && guardPosition.line >= 0)

    console.log('Nombre total de pas :', moves)
})

function move() {
    if (guardPosition.facing === 'top') {
        if (map[guardPosition.line - 1][guardPosition.row] === '#') {
            guardPosition.facing = 'right'
            move()
        } else {
            guardPosition.line--
            map[guardPosition.line][guardPosition.row] = 'X'
            moves++
        }
    } else if (guardPosition.facing === 'right') {
        if (map[guardPosition.line][guardPosition.row + 1] === '#') {
            guardPosition.facing = 'bottom'
            move()
        } else {
            guardPosition.row++

            map[guardPosition.line][guardPosition.row] = 'X'
            moves++
        }
    } else if (guardPosition.facing === 'bottom') {
        if (map[guardPosition.line + 1][guardPosition.row] === '#') {
            guardPosition.facing = 'left'
            move()
        } else {
            guardPosition.line++

            map[guardPosition.line][guardPosition.row] = 'X'
            moves++
        }
    } else if (guardPosition.facing === 'left') {
        if (map[guardPosition.line][guardPosition.row - 1] === '#') {
            guardPosition.facing = 'top'
            move()
        } else {
            guardPosition.row--
            map[guardPosition.line][guardPosition.row] = 'X'
            moves++
        }
    }
}

function visualize() {
    const visualMap = map.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
            rowIndex === guardPosition.line && colIndex === guardPosition.row
                ? 'G' // Represent the guard with 'G'
                : cell
        )
    )
    console.clear() // Clear the terminal for better visualization
    console.log(visualMap.map((row) => row.join('')).join('\n')) // Print the map
    // Print the map
    // console.log(`Guard Position: ${JSON.stringify(guardPosition)}`)
    // console.log(`Moves: ${moves}`)
}
