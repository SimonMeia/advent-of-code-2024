import { readFile } from 'fs'

const filename = './data.txt'

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    // Partie 1 : Expression régulière pour trouver 'mul(X,Y)'
    let pattern = /mul\((-?\d+),\s*(-?\d+)\)/g

    /**
     * mul\(        : Cherche littéralement "mul(".
     * \(' et '\)   : Les parenthèses sont des caractères spéciaux en regex, donc elles sont échappées avec un antislash.
     * -?           : Le signe moins est facultatif, permettant de capturer à la fois des nombres positifs et négatifs.
     * \d+          : Capture un ou plusieurs chiffres (0-9) pour le premier nombre X.
     * ,\s*         : Cherche une virgule suivie de zéro ou plusieurs espaces blancs (espaces, tabulations, nouvelles lignes).
     * (-?\d+)      : Capture le deuxième nombre Y, qui peut également être négatif ou positif.
     * g            : Flag global pour trouver toutes les correspondances dans la chaîne (et pas seulement la première).
     *
     * match[0]      : La correspondance complète (mul(X,Y), do(), don't() ou rien).
     * match[1]      : Retourne le premier argument de l'instruction (ce qui se trouve dans les parenthèses (-?\d+)).
     * match[2]      : Retourne le deuxième argument de l'instruction (ce qui se trouve dans les parenthèses (-?\d+).
     */

    let match
    let total = 0

    while ((match = pattern.exec(data)) !== null) {
        const x = parseInt(match[1])
        const y = parseInt(match[2])

        total += x * y
    }

    console.log('Résultat total de toutes les multiplications :', total)

    // Partie 2 : Expression régulière pour trouver 'mul(X,Y)', 'do()', 'don't()'
    pattern = /mul\((-?\d+),\s*(-?\d+)\)|do\(\)|don't\(\)/g

    /**
     * mul\((-?\d+),\s*(-?\d+)\)    : C'est la même regex que précédemment pour capturer les instructions 'mul(X,Y)'.
     * |            : L'opérateur 'OU' permet de chercher aussi les autres types d'instructions (do() et don't()).
     * do\(\)       : Capture l'instruction 'do()', qui n'a pas d'argument et se compose uniquement de 'do()' avec des parenthèses vides.
     * \(           : Cherche littéralement la parenthèse ouvrante '('.
     * \)           : Cherche littéralement la parenthèse fermante ')'.
     * don't\(\)    : Capture l'instruction 'don't()', qui est similaire à 'do()', mais avec 'don't' au lieu de 'do'.
     * g            : Flag global pour rechercher toutes les correspondances dans la chaîne d'entrée.
     *
     * match[0]      : La correspondance complète (mul(X,Y), do(), don't() ou rien).
     * match[1]      : Retourne le premier argument de l'instruction (ce qui se trouve dans les parenthèses (-?\d+)).
     * match[2]      : Retourne le deuxième argument de l'instruction (ce qui se trouve dans les parenthèses (-?\d+).
     */

    total = 0
    let isEnabled = true

    while ((match = pattern.exec(data)) !== null) {
        if (match[0] === 'do()') {
            isEnabled = true
        } else if (match[0] === "don't()") {
            isEnabled = false
        } else if (match[0].startsWith('mul') && isEnabled) {
            const x = parseInt(match[1], 10)
            const y = parseInt(match[2], 10)

            total += x * y
        }
    }

    console.log('Résultat total de toutes les multiplications :', total)
})
