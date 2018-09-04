const path = require('path')
const fs = require('fs-extra')
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

function npm_link_register (build_dir) {
    const linked = spawnSync('npm', ['link'], { 
        cwd: build_dir,
        encoding: 'utf8'
    })

    log.info(`NPM link output:\n${linked.stdout}`)

    if (linked.error) {
        log.error(`NPM link error:\n${linked.stderr}`)
        die(linked.error)
    }
}

function npm_link_use (package_dir, dep) {
    console.log('npm use link', package_dir, dep)

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

function find_pkg_dir (name, cwd) {

    let prefix = path.basename(cwd) + "-"

    const result = {
        scope: '',
        dir: '',
        name: name,
    }

    if (name.includes('/')) {
        const n = name
            .split('/')

        const scope = n.shift()
        const dir = n.shift()
            .replace(prefix, '')

        result.scope = scope
        result.dir = dir
    }

    return result
}

function setup_symlinks (pkg, build_dir, cwd, pwd) {
    pkg.dependents.map(async x => {
        const { dir } = find_pkg_dir(x, cwd)
        const target = path.join(pwd, dir, 'node_modules', pkg.name)

        await fs.ensureSymlink(build_dir, target)
    })
}

module.exports = { 
    id: 'link',
    fn: async (cwd) => {
        const monorepo = await is_monorepo(cwd)

        let pwd = cwd
        if (monorepo) {
            log.info('Monorepo detected. Ignoring root package.json and setting up packages')
            pwd = mono_path(cwd)
        }

        const packages = collect(pwd, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json']
        })

        const deps = dep_graph(packages)

        for (pkg of deps) {
            const pkg_dir = pkg.path
            const build_dir = path.join(pkg_dir, 'build')

            console.log(`found package: ${pkg_dir}}`)

            await copy_package_json(pkg_dir)

            /* 
             * We can use symlinks here, they are faster to create, with
             * a big "but": they only work within the monorepo. If we
             * use `npm link` we can re-use the links from other apps,
             * which is useful for development.
             *
             * setup_symlinks(pkg, build_dir, cwd, pwd)
             */

            npm_link_register(build_dir)
        }

        for (pkg of deps) {
            pkg.depends.map(x => npm_link_use(pkg.path, x))
        }
    }
}
