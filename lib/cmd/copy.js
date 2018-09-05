const path = require('path')
const fs = require('fs-extra')

const die = require('../die.js')

module.exports = { 
    id: 'copy',
    fn: async (cwd) => {
        const src_pkg = require(path.join(cwd, 'package.json'))

        const dist_pkg = JSON.stringify({
            ...src_pkg,
            private: false,
            publishConfig: {
                'access': 'public'
            }
        }, null, 2)

        const target_pkg = path.join(cwd, 'build', 'package.json')

        try {
            await fs.ensureFile(target_pkg)
            await fs.writeFile(target_pkg, dist_pkg, 'utf8')
        } catch (err) {
            log.error(`Could not write file "${filepath}"`, err)
            die('Failed to write file')
        }
    }
}
