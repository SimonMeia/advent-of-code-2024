import { readFile } from 'fs'

const filename = './data.txt'

readFile(filename, 'utf-8', function (err, data) {
    if (err) {
        return console.warn(`Could not read file because: ${err.message}`)
    }

    const lines = data.split('\n').map((line) => line.split(' ').map((level) => parseInt(level)))

    // Patie 1
    let totalSafeReport = 0

    for (let report of lines) {
        const isReportSafe = checkReportSafety(report)

        if (isReportSafe) totalSafeReport++
    }

    console.log('Total valid reports (Part 1) : ', totalSafeReport)

    // Partie 2
    totalSafeReport = 0

    for (let report of lines) {
        if (checkReportSafety(report)) {
            totalSafeReport++
        } else {
            let reportIsSafeAfterRemoval = false
            for (let i = 0; i < report.length; i++) {
                const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)]
                if (checkReportSafety(modifiedReport)) {
                    reportIsSafeAfterRemoval = true
                    break
                }
            }

            if (reportIsSafeAfterRemoval) {
                totalSafeReport++
            }
        }
    }

    console.log('Total valid reports (Part 2) : ', totalSafeReport)
})

function checkReportSafety(report) {
    let previousLevel = null
    let isIncreasing = null
    let isReportSafe = true

    for (let currentLevel of report) {
        if (!previousLevel) {
            previousLevel = currentLevel
            continue
        }

        const difference = currentLevel - previousLevel

        if (isIncreasing === null) {
            isIncreasing = difference > 0
        } else {
            if ((isIncreasing && difference < 1) || (!isIncreasing && difference >= 0)) {
                isReportSafe = false
                break
            }
        }

        const absoluteDifference = Math.abs(difference)
        if (absoluteDifference < 1 || absoluteDifference > 3) {
            isReportSafe = false
            break
        }

        previousLevel = currentLevel
    }

    return isReportSafe
}
