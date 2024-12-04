import { readFile } from 'fs'

const filename = './data.txt'

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    const crossword = data.split('\n').map((line) => line.split(''))
    let resultCount = 0

    for (let line = 1; line < crossword.length - 1; line++) {
        for (let column = 1; column < crossword[line].length - 1; column++) {
            if (crossword[line][column] === 'A') {
                if (
                    checkTopLeftToBottomRight(crossword, line, column) &&
                    checkTopRightToBottomLeft(crossword, line, column)
                )
                    resultCount++
            }
        }
    }

    console.log('Total', 'X-MAS', 'found  (Part 2) : ', resultCount)
})

function checkTopLeftToBottomRight(crossword, line, column) {
    let topLeftLetter = crossword[line - 1][column - 1]
    let bottomRightLetter = crossword[line + 1][column + 1]

    if (topLeftLetter === 'M' && bottomRightLetter === 'S') return true
    if (topLeftLetter === 'S' && bottomRightLetter === 'M') return true
    return false
}

function checkTopRightToBottomLeft(crossword, line, column) {
    let topRightLetter = crossword[line - 1][column + 1]
    let bottomLeftLetter = crossword[line + 1][column - 1]

    if (topRightLetter === 'M' && bottomLeftLetter === 'S') return true
    if (topRightLetter === 'S' && bottomLeftLetter === 'M') return true
    return false
}
