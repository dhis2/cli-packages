/** @format */

const path = require('path')
const { spawn } = require('child_process')

const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'link',
})

const { collect } = require('@vardevs/io')

const die = require('../die.js')
const { dep_graph } = require('../deps.js')

const copy_package_json = require('./copy.js').fn

const { bold } = require('../colors.js')

const { setup_symlinks } = require('../symlinks.js')

function link_register(build_dir, completed, cmd) {
    const linked = spawn(cmd, ['link'], {
        cwd: build_dir,
        encoding: 'utf8',
    })

    const name = bold(path.basename(path.dirname(build_dir)))

    linked.stdout.on('data', data => {
        log.debug(`[${name}]\n${data}`)
    })

    linked.stderr.on('data', data => {
        log.info(`[${name}]\n${data}`)
    })

    linked.on('error', err => {
        log.error(`[${name}]\n${err}`)
        die(`register link error: ${err}`)
    })

    linked.on('close', code => {
        log.trace(`link register "${name}" exited with code: ${code}`)
        completed()
    })
}

function complete(max = 0, pkgs = [], cmd) {
    let total = max
    let deps = pkgs
    let count = 0
    let tool = cmd

    log.debug(`Counting to ${total}`)

    return _ => {
        count++
        log.info(`linking: ${count}/${total} links created...`)

        if (count === total) {
            for (const pkg of deps) {
                pkg.depends.map(x => link_use(pkg.path, x, tool))
            }
        }
    }
}

function link_use(package_dir, dep, cmd) {
    const link = spawn(cmd, ['link', dep], {
        cwd: package_dir,
        encoding: 'utf8',
    })

    const name = path.basename(package_dir)
    const bname = bold(name)

    link.stdout.on('data', data => {
        log.debug(`[${bname}]\n${data}`)
    })

    link.stderr.on('data', data => {
        log.info(`[${bname}]\n${data}`)
    })

    link.on('error', err => {
        log.error(`[${bname}]\n${err}`)
        die(`link error: ${err}`)
    })

    link.on('close', code => {
        if (code === 0) {
            log.info(`[${bname}] linked: ${dep}`)
        } else {
            log.info(`[${bname}] link from "${dep}" exited with non-zero code`)
        }
    })
}

module.exports = {
    id: 'link',
    doc: `usage: packages link

tl;dr: Sets up inter-dependencies using symlinks.

...

The link command attempts to figure out which packages need links to which other packages which are inside of the base dir.

The command is monorepo aware.
`,
    fn: async (cwd, cmd, args, opts) => {
        // we need the package.json files in the build dir to do linking
        await copy_package_json(cwd, cmd, args)

        const pkgs = collect(cwd, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json'],
        })

        const deps = dep_graph(pkgs)

        const total_pkgs = deps.length
        const counter = complete(total_pkgs, deps, cmd)

        for (const pkg of deps) {
            const pkg_dir = pkg.path
            const build_dir = path.join(pkg_dir, 'build')

            /*
             * We can use yarn/npm links as well, but using symlinks for
             * more deterministic behaviour.
             *
             * link_register(build_dir, counter, cmd)
             */

            setup_symlinks(pkg, build_dir, cwd, opts.root_dir)

        }
    },
}
