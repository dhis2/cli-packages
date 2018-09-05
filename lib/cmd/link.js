const path = require('path')
const fs = require('fs-extra')
const { spawn } = require('child_process')

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

function npm_link_register (build_dir, completed) {
    const linked = spawn('npm', ['link'], { 
        cwd: build_dir,
        encoding: 'utf8'
    })

    linked.stdout.on('data', data => {
        log.info(`NPM link output:\n${data}`)
    })

    linked.stderr.on('data', data => {
        log.error(`NPM link output:\n${data}`)
    })

    linked.on('error', err => {
        log.error(`NPM link error:\n${err}`)
        die(`NPM link error: ${err}`)
    })

    linked.on('close', code => {
        log.info(`NPM link register "${build_dir}" exited with code: ${code}`)
        completed()
    })
}

function complete(max = 0, pkgs = []) {
    let total = max
    let deps = pkgs
    let count = 0

    log.info(`counting to ${total}`)

    return _ => {
        count++
        log.info(`${count}/${total}`)

        if (count === total) {
            log.info(`Consuming created links...`)

            for (pkg of deps) {
                pkg.depends.map(x => npm_link_use(pkg.path, x))
            }
        }

    }
}

function npm_link_use (package_dir, dep) {
    console.log('npm use link', package_dir, dep)

    const link = spawn('npm', ['link', dep], { 
        cwd: package_dir,
        encoding: 'utf8'
    })

    link.stdout.on('data', data => {
        log.info(`NPM link output:\n${data}`)
    })

    link.stderr.on('data', data => {
        log.error(`NPM link output:\n${data}`)
    })

    link.on('error', err => {
        log.error(`NPM link error:\n${err}`)
        die(`NPM link error: ${err}`)
    })

    link.on('close', code => {
        log.info(`NPM link use "${dep}" exited with code: ${code}`)
    })
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

        const total_pkgs = deps.length
        const counter = complete(total_pkgs, deps)

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

            npm_link_register(build_dir, counter)
        }
    }
}
