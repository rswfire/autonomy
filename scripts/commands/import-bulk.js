// scripts/commands/import-bulk.js
const fs = require('fs')

async function run(jsonFile, apiUrl) {
    console.log(`\n📦 Loading signals from ${jsonFile}`)

    let signals
    try {
        const content = fs.readFileSync(jsonFile, 'utf-8')
        signals = JSON.parse(content)
        console.log(`   Found ${signals.length} signals\n`)
    } catch (error) {
        console.error(`❌ Error reading JSON file: ${error.message}`)
        process.exit(1)
    }

    let successCount = 0
    let errorCount = 0

    for (const signal of signals) {
        try {
            const response = await fetch(`${apiUrl}/api/admin/signals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signal),
            })

            if (response.ok) {
                console.log(`✅ Imported: ${signal.signal_title}`)
                successCount++
            } else {
                const error = await response.text()
                console.error(`❌ Failed: ${signal.signal_title} → ${error}`)
                errorCount++
            }
        } catch (error) {
            console.error(`❌ Failed: ${signal.signal_title} → ${error.message}`)
            errorCount++
        }
    }

    console.log(`\n📊 Import Summary:`)
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
}

module.exports = { run }
