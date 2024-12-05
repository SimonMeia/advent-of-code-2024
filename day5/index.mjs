import { readFile } from 'fs'

const filename = './data.txt'
const formatedRules = {}

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    const rules = data
        .split('\n\n')[0]
        .split('\n')
        .map((line) => line.split('|'))

    for (let rule of rules) {
        if (!formatedRules[rule[1]]) formatedRules[rule[1]] = { nextPages: new Set() }
        formatedRules[rule[1]]['nextPages'].add(parseInt(rule[0]))
    }

    const updates = data
        .split('\n\n')[1]
        .split('\n')
        .map((line) => line.split(','))
        .map((line) => line.map((page) => parseInt(page)))

    const validUpdates = []
    const correctedUpdates = []

    for (let update of updates) {
        isUpdateValid(update)
            ? validUpdates.push(update)
            : correctedUpdates.push(correctUpdate(update))
    }

    console.log('Somme de toutes les pages centrales : ', calculateMiddlePageSum(validUpdates))
    console.log(
        'Somme de toutes les pages centrales corrigées : ',
        calculateMiddlePageSum(correctedUpdates)
    )
})

function isUpdateValid(update) {
    const beforeCurrentPage = new Set()

    for (let page of update) {
        for (let previousPage of beforeCurrentPage) {
            // On test si une page devant se trouver après la page courante est avant la page courante
            if (!formatedRules[page]['nextPages'].has(previousPage)) {
                return false
            }
        }

        beforeCurrentPage.add(page)
    }

    return true
}

function correctUpdate(update) {
    // On crée une copie de l'update
    let correctedUpdate = [...update]

    let changesMade = false

    // On boucle tant que le update n'est pas correct et que des modifications sont faites
    do {
        changesMade = false
        const beforeCurrentPage = new Set()

        // On test une a une chaque page de l'update
        for (let i = 0; i < correctedUpdate.length; i++) {
            const page = correctedUpdate[i]

            // On test si une page devant se trouver après la page courante est avant la page courante
            for (let previousPage of beforeCurrentPage) {
                // Si une page est mal positionnée
                if (!formatedRules[page]['nextPages'].has(previousPage)) {
                    // On la déplace un cran en arriere
                    correctedUpdate = moveElementInArray(correctedUpdate, i, i - 1)
                    changesMade = true
                    // On break tester avec l'update modifiée
                    break
                }
            }

            //Si la position de la page courante a été modifiée on break pour testé
            if (changesMade) break

            // Si la position de la page courante n'a pas été modifiée (donc qu'elle est correcte)
            // alors, on l'ajoute à la liste et on poursuit
            beforeCurrentPage.add(page)
        }
    } while (changesMade && !isUpdateValid(correctedUpdate))

    return correctedUpdate
}

function calculateMiddlePageSum(updates) {
    return updates.reduce((total, update) => {
        return total + update[Math.round((update.length - 1) / 2)]
    }, 0)
}

function moveElementInArray(array, oldIndex, newIndex) {
    // Si la nouvelle position est hors de l'array, on l'ajoute en fin
    if (newIndex >= array.length) {
        array.push(array.splice(oldIndex, 1)[0])
    } else if (newIndex < 0) {
        // Si la nouvelle position est hors de l'array, on l'ajoute en debut
        array.unshift(array.splice(oldIndex, 1)[0])
    } else {
        // Sinon, on bouge l'element
        const elementToMove = array.splice(oldIndex, 1)[0]
        array.splice(newIndex, 0, elementToMove)
    }
    return array
}
