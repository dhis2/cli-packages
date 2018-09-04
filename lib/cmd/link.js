const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')

const log = require('@vardevs/log')({
    level: 2,
    prefix: 'PKGS/link'
})

const { collect } = require('@vardevs/io')

const die = require('../die.js')
const { dep_graph, sort } = require('../deps.js')

const copy_package_json = require('./copy.js').fn
const {
    is_monorepo,
    mono_path
} = require('../mono.js')

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

function npm_link_use (package_dir, deps) {
    console.log('npm use link', package_dir)
    for (dep of deps) {
        const link = spawnSync('npm', ['link', dep], { 
            cwd: package_dir,
            encoding: 'utf8'
        })

        log.info(`NPM link output:\n${link.stdout}`)

        if (link.error) {
            log.error(`NPM link error:\n${link.stderr}`)
            die('Failed to link to package', link.error)
        }
    }
}


function cleanup (code) {
    if (code === 1) {
        log.error('clean up symlinks')
    }
}

process.on('exit', cleanup);

module.exports = { 
    id: 'link',
    fn: async (cwd) => {
        const monorepo = is_monorepo(cwd)

        let pwd = cwd
        if (monorepo) {
            log.info('Monorepo detected. Ignoring root package.json and setting up packages')
            pwd = mono_path(cwd)
        }

        const packages = await collect(pwd, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json']
        })

        const deps = dep_graph(packages)

        for (pkg of deps) {
            const pkg_dir = pkg.path
            console.log(`found package: ${pkg_dir}}`)
            copy_package_json(pkg_dir)
            npm_link_register(pkg_dir)
        }


        for (pkg of deps) {
            npm_link_use(pkg.path, pkg.depends)
        }
            
        console.dir(deps)
        //
        //const sorted = sort(d)

    }
}
