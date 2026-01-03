// scripts/lib/config.js
const fs = require('fs')
const path = require('path')

const CONFIG_FILE = path.join(process.cwd(), '.autonomy.json')

function loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
        } catch (error) {
            console.error('Error reading config file:', error.message)
            return {}
        }
    }
    return {}
}

function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
    } catch (error) {
        console.error('Error saving config file:', error.message)
    }
}

function get(key, fallback = null) {
    const config = loadConfig()
    return config[key] ?? fallback
}

function set(key, value) {
    const config = loadConfig()
    config[key] = value
    saveConfig(config)
}

function getAll() {
    return loadConfig()
}

function reset() {
    if (fs.existsSync(CONFIG_FILE)) {
        fs.unlinkSync(CONFIG_FILE)
        console.log('✅ Config reset')
    } else {
        console.log('ℹ️  No config file to reset')
    }
}

module.exports = { get, set, getAll, reset, loadConfig, saveConfig }
