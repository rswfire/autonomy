// scripts/commands/import-docs.js
const fs = require('fs')
const path = require('path')

const TEXT_EXTENSIONS = ['.txt', '.md', '.markdown', '.text', '.log', '.json', '.yml', '.yaml', '.xml', '.csv']

function detectFormat(filename) {
    const ext = path.extname(filename).toLowerCase()
    if (['.md', '.markdown'].includes(ext)) return 'markdown'
    if (['.html', '.htm'].includes(ext)) return 'html'
    return 'plain'
}

function countWords(text) {
    return text.trim().split(/\s+/).filter(Boolean).length
}

function detectLanguage(text) {
    const englishWords = /\b(the|and|is|are|was|were|in|on|at|to|for|of|with|by)\b/gi
    const matches = text.match(englishWords)
    return matches && matches.length > 10 ? 'en' : null
}

function generateUlid() {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 15)
    return (timestamp + random).toUpperCase().padEnd(26, '0').substring(0, 26)
}

function createSignalFromFile(filePath, realmId, author) {
    const stats = fs.statSync(filePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    const filename = path.basename(filePath)
    const ext = path.extname(filePath)
    const format = detectFormat(filename)

    const title = path.basename(filename, ext)
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .substring(0, 100)

    return {
        signal_id: generateUlid(),
        realm_id: realmId,
        signal_type: 'DOCUMENT',
        signal_context: 'CAPTURE',
        signal_title: title,
        signal_description: `Imported from ${filename}`,
        signal_author: author,
        signal_temperature: 0.0,
        signal_status: 'PENDING',
        signal_visibility: 'PRIVATE',

        signal_payload: {
            content: content,
            format: format,
        },

        signal_metadata: {
            word_count: countWords(content),
            character_count: content.length,
            language: detectLanguage(content),
            file_extension: ext,
            encoding: 'utf-8',
            mime_type: `text/${format === 'html' ? 'html' : 'plain'}`,
        },

        signal_tags: [],

        stamp_created: stats.birthtime || stats.mtime,
        stamp_imported: new Date(),
    }
}

function findTextFiles(dir) {
    const files = []

    function traverse(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name)

            if (entry.isDirectory()) {
                if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    traverse(fullPath)
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase()
                if (TEXT_EXTENSIONS.includes(ext)) {
                    files.push(fullPath)
                }
            }
        }
    }

    traverse(dir)
    return files
}

async function run(directoryPath, realmId, author) {
    console.log(`\n🔍 Scanning directory: ${directoryPath}`)
    console.log(`📦 Target realm: ${realmId}`)
    console.log(`✍️  Author: ${author}\n`)

    if (!fs.existsSync(directoryPath)) {
        console.error(`❌ Error: Directory not found: ${directoryPath}`)
        process.exit(1)
    }

    const textFiles = findTextFiles(directoryPath)
    console.log(`📄 Found ${textFiles.length} text files\n`)

    if (textFiles.length === 0) {
        console.log('No text files to import.')
        return
    }

    const signals = []
    let successCount = 0
    let errorCount = 0

    for (const filePath of textFiles) {
        try {
            const signal = createSignalFromFile(filePath, realmId, author)
            signals.push(signal)
            console.log(`✅ ${path.relative(directoryPath, filePath)} → ${signal.signal_title}`)
            successCount++
        } catch (error) {
            console.error(`❌ ${path.relative(directoryPath, filePath)} → Error: ${error.message}`)
            errorCount++
        }
    }

    const outputFile = `signals-import-${Date.now()}.json`
    fs.writeFileSync(outputFile, JSON.stringify(signals, null, 2))

    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📁 Output: ${outputFile}`)
    console.log(`\n💡 Next steps:`)
    console.log(`   1. Review ${outputFile}`)
    console.log(`   2. Import via: autonomy import:bulk ${outputFile}`)
}

module.exports = { run }
