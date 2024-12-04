const filename = './data.txt'
let crossword = []
const speed = 1
const directions = {
    right: { line: 0, column: 1 },
    rightDown: { line: 1, column: 1 },
    down: { line: 1, column: 0 },
    leftDown: { line: 1, column: -1 },
    left: { line: 0, column: -1 },
    leftUp: { line: -1, column: -1 },
    up: { line: -1, column: 0 },
    rightUp: { line: -1, column: 1 },
}

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

document.getElementById('start-button').addEventListener('click', async function (event) {
    const search = document.getElementById('search-input').value

    let resultCount = 0

    for (let line = 0; line < crossword.length; line++) {
        for (let column = 0; column < crossword[line].length; column++) {
            document.getElementById(`cell-${line}-${column}`).classList.add('selected')
            await wait(speed)

            if (crossword[line][column] === search[0]) {
                const initialCount = resultCount

                // Vérifie toutes les directions possibles
                for (const direction in directions) {
                    if (await checkDirection(search, crossword, line, column, direction)) {
                        resultCount++
                    }
                }

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

function hasEnoughSpace(search, crossword, line, column, dir) {
    const endLine = line + dir.line * (search.length - 1)
    const endColumn = column + dir.column * (search.length - 1)

    // Vérifie que les indices restent dans les limites du tableau
    if (
        endLine < 0 ||
        endLine >= crossword.length ||
        endColumn < 0 ||
        endColumn >= crossword[line].length
    ) {
        return false
    }

    return true
}

async function checkDirection(search, crossword, line, column, direction) {
    const dir = directions[direction]
    const cells = []

    // Vérifie si l'espace est suffisant dans la direction donnée
    if (!hasEnoughSpace(search, crossword, line, column, dir)) {
        return false
    }

    // Vérifie chaque cellule dans la direction donnée
    for (let i = 0; i < search.length; i++) {
        const newLine = line + dir.line * i
        const newColumn = column + dir.column * i
        const cell = document.getElementById(`cell-${newLine}-${newColumn}`)
        cell.classList.add('checked')
        cells.push(cell)
        await wait(speed)

        // Si le caractère ne correspond pas, la recherche échoue
        if (crossword[newLine][newColumn] !== search[i]) {
            cells.forEach((cell) => {
                cell.classList.remove('checked')
            })
            return false
        }
    }

    // Si on a trouvé le mot, marque toutes les cellules comme valides
    cells.forEach((cell) => {
        cell.classList.remove('checked')
        cell.classList.add('valid')
    })

    return true
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
