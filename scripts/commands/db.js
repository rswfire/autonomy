// scripts/commands/db.js
const { execSync } = require('child_process')

function migrate() {
    console.log('🔄 Running database migrations...')
    try {
        execSync('npx prisma migrate dev', { stdio: 'inherit' })
        console.log('✅ Migrations complete')
    } catch (error) {
        console.error('❌ Migration failed')
        process.exit(1)
    }
}

function seed() {
    console.log('🌱 Seeding database...')
    try {
        execSync('npx prisma db seed', { stdio: 'inherit' })
        console.log('✅ Seeding complete')
    } catch (error) {
        console.error('❌ Seeding failed')
        process.exit(1)
    }
}

function reset() {
    console.log('⚠️  Resetting database...')
    try {
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' })
        console.log('✅ Database reset')
    } catch (error) {
        console.error('❌ Reset failed')
        process.exit(1)
    }
}

function studio() {
    console.log('🎨 Opening Prisma Studio...')
    try {
        execSync('npx prisma studio', { stdio: 'inherit' })
    } catch (error) {
        console.error('❌ Failed to open Prisma Studio')
        process.exit(1)
    }
}

module.exports = { migrate, seed, reset, studio }
