import { readFile } from 'fs'

const filename = './data.txt'

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    const crossword = data.split('\n').map((line) => line.split(''))
    const search = 'XMAS'
    let resultCount = 0

    for (let line = 0; line < crossword.length; line++) {
        for (let column = 0; column < crossword[line].length; column++) {
            if (crossword[line][column] === search[0]) {
                if (checkRight(search, crossword, line, column)) resultCount++
                if (checkRightDown(search, crossword, line, column)) resultCount++
                if (checkDown(search, crossword, line, column)) resultCount++
                if (checkLeftDown(search, crossword, line, column)) resultCount++
                if (checkLeft(search, crossword, line, column)) resultCount++
                if (checkLeftUp(search, crossword, line, column)) resultCount++
                if (checkUp(search, crossword, line, column)) resultCount++
                if (checkRightUp(search, crossword, line, column)) resultCount++
            }
        }
    }

    console.log('Total', search, 'found  (Part 1) : ', resultCount)
})

function checkRight(search, crossword, line, column) {
    if (enoughSpaceRight(search, crossword, line, column)) {
        for (let i = 1; i < search.length; i++) {
            if (crossword[line][column + i] !== search[i]) return false
        }
        return true
    }
    return false
}

function checkLeft(search, crossword, line, column) {
    if (enoughSpaceLeft(search, column)) {
        for (let i = 1; i < search.length; i++) {
            if (crossword[line][column - i] !== search[i]) return false
        }
        return true
    }
    return false
}

function checkUp(search, crossword, line, column) {
    if (enoughSpaceUp(search, line)) {
        for (let i = 1; i < search.length; i++) {
            if (crossword[line - i][column] !== search[i]) return false
        }
        return true
    }
    return false
}

function checkDown(search, crossword, line, column) {
    if (enoughSpaceDown(search, crossword, line)) {
        for (let i = 1; i < search.length; i++) {
            if (crossword[line + i][column] !== search[i]) return false
        }
        return true
    }
    return false
}

function checkRightDown(search, crossword, line, column) {
    if (
        enoughSpaceRight(search, crossword, line, column) &&
        enoughSpaceDown(search, crossword, line)
    ) {
        for (let i = 1; i < search.length; i++) {
            if (crossword[line + i][column + i] !== search[i]) return false
        }
        return true
    }
    return false
}

function checkRightUp(search, crossword, line, column) {
    if (enoughSpaceRight(search, crossword, line, column) && enoughSpaceUp(search, line)) {
        for (let i = 1; i < search.length; i++) {
            if (crossword[line - i][column + i] !== search[i]) return false
        }
        return true
    }
    return false
}

function checkLeftUp(search, crossword, line, column) {
    if (enoughSpaceLeft(search, column) && enoughSpaceUp(search, line)) {
        for (let i = 1; i < search.length; i++) {
            if (crossword[line - i][column - i] !== search[i]) return false
        }
        return true
    }
    return false
}

function checkLeftDown(search, crossword, line, column) {
    if (enoughSpaceLeft(search, column) && enoughSpaceDown(search, crossword, line)) {
        for (let i = 1; i < search.length; i++) {
            if (crossword[line + i][column - i] !== search[i]) return false
        }
        return true
    }
    return false
}

function enoughSpaceDown(search, crossword, line) {
    return line + search.length - 1 < crossword.length
}

function enoughSpaceLeft(search, column) {
    return column - search.length + 1 >= 0
}

function enoughSpaceUp(search, line) {
    return line - search.length + 1 >= 0
}

function enoughSpaceRight(search, crossword, line, column) {
    return column + search.length - 1 < crossword[line].length
}
