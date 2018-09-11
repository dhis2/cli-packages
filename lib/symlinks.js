/** @format */

const path = require('path')
const fs = require('fs-extra')

function find_pkg_dir(name, cwd) {
    let prefix = path.basename(cwd) + '-'

    const result = {
        scope: '',
        dir: '',
        name: name,
    }

    if (name.includes('/')) {
        const n = name.split('/')

        const scope = n.shift()
        const dir = n.shift().replace(prefix, '')

        result.scope = scope
        result.dir = dir
    }

    return result
}

function setup_symlinks(pkg, build_dir, cwd, pwd) {
    pkg.dependents.map(async x => {
        const { dir } = find_pkg_dir(x, cwd)
        const target = path.join(pwd, dir, 'node_modules', pkg.name)

        await fs.ensureSymlink(build_dir, target)
    })
}

module.exports = {
    setup_symlinks,
}
