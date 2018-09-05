const path = require('path')
const fs = require('fs-extra')

const die = require('../die.js')

const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'PKGS/copy'
})

const { collect } = require('@vardevs/io')
const { dep_graph, sort } = require('../deps.js')

module.exports = { 
    id: 'copy',
    fn: async (cwd, cmd, args) => {
        const packages = collect(cwd, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json']
        })

        const deps = dep_graph(packages)

        for (pkg of deps) {
            const src_pkg = require(path.join(pkg.path, 'package.json'))

            const dist_pkg = JSON.stringify({
                ...src_pkg,
                private: false,
                publishConfig: {
                    'access': 'public'
                }
            }, null, 2)

            const target_pkg = path.join(pkg.path, 'build', 'package.json')
            const relative = path.relative(cwd, target_pkg)

            try {
                await fs.ensureFile(target_pkg)
                await fs.writeFile(target_pkg, dist_pkg, 'utf8')
                log.info(`wrote: ${relative}`)
            } catch (err) {
                log.error(`Could not write file "${relative}"`, err)
                die('Failed to write file')
            }
        }
    }
}
