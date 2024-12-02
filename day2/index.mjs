import { readFile } from 'fs'

const filename = './data.txt'

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    const lines = data.split('\n').map((line) => line.split(' ').map((level) => parseInt(level)))

    let totalSafeReport = 0

    for (let report of lines) {
        let previousLevel = null
        let isIncreasing = null
        let isReportSafe = true

        for (let currentLevel of report) {
            // Si c'est le premier level on ne fais pas les tests
            if (!previousLevel) {
                previousLevel = currentLevel
                continue
            }

            const difference = currentLevel - previousLevel
            if (difference === 0) {
                isReportSafe = false
                break
            }

            // Set la direction générale en fonction des 2 premiers levels
            if (isIncreasing === null) {
                isIncreasing = difference > 0
            } else {
                // Fait les tests pour savoir si c'est toujours increasing / decreasing
                if ((isIncreasing && difference < 1) || (!isIncreasing && difference >= 0)) {
                    isReportSafe = false
                    break
                }
            }

            // Test l'écarts entre les 2 level
            const absoluteDifference = Math.abs(difference)
            if (absoluteDifference < 1 || absoluteDifference > 3) {
                isReportSafe = false
                break
            }

            previousLevel = currentLevel
        }
        if (isReportSafe) totalSafeReport++
    }

    console.log('Total valid reports : ', totalSafeReport)
})
