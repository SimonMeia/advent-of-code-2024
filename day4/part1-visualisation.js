const filename = './data.txt'
let crossword = []
const speed = 1

// Function to render the crossword grid in the HTML table
function renderCrossword(crossword) {
    const gridContainer = document.getElementById('crossword-grid')
    gridContainer.innerHTML = '' // Clear the grid first

    for (let i = 0; i < crossword.length; i++) {
        const row = document.createElement('tr')
        for (let j = 0; j < crossword[i].length; j++) {
            const cell = document.createElement('td')
            cell.id = `cell-${i}-${j}`
            cell.textContent = crossword[i][j]
            row.appendChild(cell)
        }
        gridContainer.appendChild(row)
    }
}

// Call the render function when the page loads
document.addEventListener('DOMContentLoaded', function () {
    // Récupérer le fichier data.txt en utilisant fetch
    fetch(filename)
        .then((response) => response.text())
        .then((data) => {
            crossword = data.split('\n').map((line) => line.split(''))
            renderCrossword(crossword)
        })
        .catch((error) => {
            console.error('Error loading crossword:', error)
        })
})

document.addEventListener('click', async function (event) {
    const search = document.getElementById('search-input').value

    let resultCount = 0

    for (let line = 0; line < crossword.length; line++) {
        for (let column = 0; column < crossword[line].length; column++) {
            document.getElementById(`cell-${line}-${column}`).classList.add('selected')
            await wait(speed)
            if (crossword[line][column] === search[0]) {
                const initialCount = resultCount
                if (await checkRight(search, crossword, line, column)) resultCount++
                if (await checkRightDown(search, crossword, line, column)) resultCount++
                if (await checkDown(search, crossword, line, column)) resultCount++
                if (await checkLeftDown(search, crossword, line, column)) resultCount++
                if (await checkLeft(search, crossword, line, column)) resultCount++
                if (await checkLeftUp(search, crossword, line, column)) resultCount++
                if (await checkUp(search, crossword, line, column)) resultCount++
                if (await checkRightUp(search, crossword, line, column)) resultCount++

                if (resultCount > initialCount) {
                    document.querySelector('.selected').classList.add('valid')
                    document.getElementById('result-count').textContent = resultCount
                }

                document.querySelectorAll('.checked').forEach((cell) => {
                    cell.classList.remove('checked')
                })
            }
            document.getElementById(`cell-${line}-${column}`).classList.remove('selected')
        }
    }
})

async function checkRight(search, crossword, line, column) {
    if (enoughSpaceRight(search, crossword, line, column)) {
        const cells = []
        for (let i = 1; i < search.length; i++) {
            const cell = document.getElementById(`cell-${line}-${column + i}`)
            cell.classList.add('checked')
            cells.push(cell)
            await wait(speed)
            if (crossword[line][column + i] !== search[i]) return false
        }
        cells.forEach((cell) => {
            cell.classList.remove('checked')
            cell.classList.add('valid')
        })
        return true
    }
    return false
}

async function checkLeft(search, crossword, line, column) {
    if (enoughSpaceLeft(search, column)) {
        const cells = []
        for (let i = 1; i < search.length; i++) {
            const cell = document.getElementById(`cell-${line}-${column - i}`)
            cell.classList.add('checked')
            cells.push(cell)
            await wait(speed)
            if (crossword[line][column - i] !== search[i]) return false
        }
        cells.forEach((cell) => {
            cell.classList.remove('checked')
            cell.classList.add('valid')
        })
        return true
    }
    return false
}

async function checkUp(search, crossword, line, column) {
    if (enoughSpaceUp(search, line)) {
        const cells = []
        for (let i = 1; i < search.length; i++) {
            const cell = document.getElementById(`cell-${line - i}-${column}`)
            cell.classList.add('checked')
            cells.push(cell)
            await wait(speed)
            if (crossword[line - i][column] !== search[i]) return false
        }
        cells.forEach((cell) => {
            cell.classList.remove('checked')
            cell.classList.add('valid')
        })
        return true
    }
    return false
}

async function checkDown(search, crossword, line, column) {
    if (enoughSpaceDown(search, crossword, line)) {
        const cells = []
        for (let i = 1; i < search.length; i++) {
            const cell = document.getElementById(`cell-${line + i}-${column}`)
            cell.classList.add('checked')
            cells.push(cell)
            await wait(speed)
            if (crossword[line + i][column] !== search[i]) return false
        }
        cells.forEach((cell) => {
            cell.classList.remove('checked')
            cell.classList.add('valid')
        })
        return true
    }
    return false
}

async function checkRightDown(search, crossword, line, column) {
    if (
        enoughSpaceRight(search, crossword, line, column) &&
        enoughSpaceDown(search, crossword, line)
    ) {
        const cells = []
        for (let i = 1; i < search.length; i++) {
            const cell = document.getElementById(`cell-${line + i}-${column + i}`)
            cell.classList.add('checked')
            cells.push(cell)
            await wait(speed)
            if (crossword[line + i][column + i] !== search[i]) return false
        }
        cells.forEach((cell) => {
            cell.classList.remove('checked')
            cell.classList.add('valid')
        })
        return true
    }
    return false
}

async function checkRightUp(search, crossword, line, column) {
    if (enoughSpaceRight(search, crossword, line, column) && enoughSpaceUp(search, line)) {
        const cells = []
        for (let i = 1; i < search.length; i++) {
            const cell = document.getElementById(`cell-${line - i}-${column + i}`)
            cell.classList.add('checked')
            cells.push(cell)
            await wait(speed)
            if (crossword[line - i][column + i] !== search[i]) return false
        }
        cells.forEach((cell) => {
            cell.classList.remove('checked')
            cell.classList.add('valid')
        })
        return true
    }
    return false
}

async function checkLeftUp(search, crossword, line, column) {
    if (enoughSpaceLeft(search, column) && enoughSpaceUp(search, line)) {
        const cells = []
        for (let i = 1; i < search.length; i++) {
            const cell = document.getElementById(`cell-${line - i}-${column - i}`)
            cell.classList.add('checked')
            cells.push(cell)
            await wait(speed)
            if (crossword[line - i][column - i] !== search[i]) return false
        }
        cells.forEach((cell) => {
            cell.classList.remove('checked')
            cell.classList.add('valid')
        })
        return true
    }
    return false
}

async function checkLeftDown(search, crossword, line, column) {
    if (enoughSpaceLeft(search, column) && enoughSpaceDown(search, crossword, line)) {
        const cells = []
        for (let i = 1; i < search.length; i++) {
            const cell = document.getElementById(`cell-${line + i}-${column - i}`)
            cell.classList.add('checked')
            cells.push(cell)
            await wait(speed)
            if (crossword[line + i][column - i] !== search[i]) return false
        }
        cells.forEach((cell) => {
            cell.classList.remove('checked')
            cell.classList.add('valid')
        })
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

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
