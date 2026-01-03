#!/usr/bin/env node
// scripts/autonomy.js

const { Command } = require('commander')
const config = require('./lib/config')
const importDocs = require('./commands/import-docs')
const importBulk = require('./commands/import-bulk')
const db = require('./commands/db')

const program = new Command()

program
    .name('autonomy')
    .description('Autonomy CLI - Signal management and system utilities')
    .version('0.1.0')

// ========== CONFIG COMMANDS ==========

program
    .command('config:set <key> <value>')
    .description('Set configuration value')
    .action((key, value) => {
        config.set(key, value)
        console.log(`✅ Set ${key} = ${value}`)
    })

program
    .command('config:get <key>')
    .description('Get configuration value')
    .action((key) => {
        const value = config.get(key)
        if (value !== null) {
            console.log(value)
        } else {
            console.log(`❌ ${key} is not set`)
        }
    })

program
    .command('config:list')
    .description('List all configuration values')
    .action(() => {
        const allConfig = config.getAll()
        if (Object.keys(allConfig).length === 0) {
            console.log('No configuration set')
        } else {
            console.log('\n📋 Configuration:')
            for (const [key, value] of Object.entries(allConfig)) {
                console.log(`   ${key}: ${value}`)
            }
        }
    })

program
    .command('config:reset')
    .description('Reset all configuration')
    .action(() => {
        config.reset()
    })

// ========== IMPORT COMMANDS ==========

program
    .command('import:docs <directory>')
    .description('Import text documents as signals')
    .option('-r, --realm <id>', 'Target realm ID')
    .option('-a, --author <name>', 'Author name')
    .action((directory, options) => {
        const realmId = options.realm || config.get('default_realm')
        const author = options.author || config.get('default_author') || process.env.USER || 'system'

        if (!realmId) {
            console.error('❌ Error: realm_id required. Set via --realm or: autonomy config:set default_realm <id>')
            process.exit(1)
        }

        importDocs.run(directory, realmId, author)
    })

program
    .command('import:bulk <jsonfile>')
    .description('Bulk import signals from JSON')
    .option('-u, --url <url>', 'API URL')
    .action((jsonfile, options) => {
        const apiUrl = options.url || config.get('api_url') || 'http://localhost:3000'
        importBulk.run(jsonfile, apiUrl)
    })

// ========== DATABASE COMMANDS ==========

program
    .command('db:migrate')
    .description('Run database migrations')
    .action(() => {
        db.migrate()
    })

program
    .command('db:seed')
    .description('Seed database with sample data')
    .action(() => {
        db.seed()
    })

program
    .command('db:reset')
    .description('Reset database (WARNING: destroys all data)')
    .action(() => {
        db.reset()
    })

program
    .command('db:studio')
    .description('Open Prisma Studio')
    .action(() => {
        db.studio()
    })

// ========== PARSE ==========

program.parse()
