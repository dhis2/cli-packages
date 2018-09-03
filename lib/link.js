const path = require('path')
const { spawnSync } = require('child_process')

const log = require('@vardevs/log')({
    level: 2,
    prefix: 'LINKER/link'
})

const { collect } = require('@vardevs/io')

const die = require('./die.js')
const deps = require('./deps')

const copy_package_json = require('./copy.js').fn

function npm_link_register (pkg) {
    const build_dir = path.join(pkg, 'build')

    const linked = spawnSync('npm', ['link'], { 
        cwd: build_dir,
        encoding: 'utf8'
    })

    log.info(`NPM link output:\n${linked.stdout}`)

    if (linked.error) {
        log.error(`NPM link error:\n${linked.stderr}`)
        die('Failed to link build dir', linked.error)
    }
}

module.exports = { 
    id: 'link',
    fn: async (cwd) => {
        //if monorepo, do dive into packages
        //if () {}
        copy_package_json(cwd)

        const packages = await collect(cwd, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json']
        })

        deps(packages)

        //npm_link_use(cwd)
    }
}
