const fs = require('fs')
const path = require('path')

function mono_path (dir) {
    return path.join(dir, 'packages')
}

function is_monorepo (dir) {
    const d = mono_path(dir)
    try {
        fs.accessSync(d)
        return true
    } catch (err) {
        log.info('No "packages/" folder found, treating as a standard repo')
        return false
    }
}

module.exports = {
    is_monorepo,
    mono_path
}
