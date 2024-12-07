import { readFile } from 'fs'

const filename = './data.txt'
let guardPosition = {}
let map = []
let distinctPositions = 0

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

    do {
        move()
        console.log(
            'Line: ',
            guardPosition.line,
            'Row: ',
            guardPosition.row,
            'Facing: ',
            guardPosition.facing
        )
    } while (guardPosition.line < map.length && guardPosition.row < map[0].length && guardPosition.row >= 0 && guardPosition.line >= 0)

    console.log('Total distinct positions visited: ', distinctPositions - 1)
})

function move() {
    if (guardPosition.facing === 'top') {
        if (map[guardPosition.line - 1][guardPosition.row] === '#') {
            guardPosition.facing = 'right'
            move()
        } else {
            guardPosition.line--
            visit()
        }
    } else if (guardPosition.facing === 'right') {
        if (map[guardPosition.line][guardPosition.row + 1] === '#') {
            guardPosition.facing = 'bottom'
            move()
        } else {
            guardPosition.row++
            visit()
        }
    } else if (guardPosition.facing === 'bottom') {
        if (map[guardPosition.line + 1][guardPosition.row] === '#') {
            guardPosition.facing = 'left'
            move()
        } else {
            guardPosition.line++
            visit()
        }
    } else if (guardPosition.facing === 'left') {
        if (map[guardPosition.line][guardPosition.row - 1] === '#') {
            guardPosition.facing = 'top'
            move()
        } else {
            guardPosition.row--
            visit()
        }
    }
}

function visit() {
    if (map[guardPosition.line][guardPosition.row] !== 'X') {
        map[guardPosition.line][guardPosition.row] = 'X'
        distinctPositions++
    }
}
