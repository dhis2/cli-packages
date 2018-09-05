const fs = require('fs-extra')
const path = require('path')

const log = require('@vardevs/log')({
    level: 2,
    prefix: 'PKGS/mono'
})

function mono_path (dir) {
    return path.join(dir, 'packages')
}

async function is_monorepo (dir) {
    const d = mono_path(dir)
    try {
        await fs.access(d)
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
