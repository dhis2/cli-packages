/** @format */
const path = require('path')
const spawn = require('child_process').spawn
const semver = require('semver')
const fs = require('fs-extra')

const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'publish',
})

const { collect } = require('@vardevs/io')

const { dep_graph, sort, update } = require('../deps.js')
const { bold } = require('../colors.js')
const die = require('../die.js')

const exec = require('./exec.js')

module.exports = {
    id: 'publish',
    doc: `usage: packages publish

tl;dr: figures out the order to publish in

For a standard repo this is quite easy, but for a monorepo there needs to be done some additional sorting and analysis of inter-package-dependencies.
`,
    fn: async (cwd, cmd, args, opts) => {

        async function write(file, obj) {
            try {
                await fs.writeJson(file, obj, { spaces: 2 })
            } catch (err) {
                log.error(`failed to write ${file}`)
            }
        }

        async function read(file) {
            try {
                return await fs.readJson(file)
            } catch (err) {
                log.error(`failed to read ${file}`)
            }
        }

        function find(name, list) {
            for (const el of list) {
                if (el.name === name) {
                    return el
                }
            }
            return undefined
        }

        const root_path = path.join(opts.root_dir, 'package.json')
        const root_pkg = await read(root_path)
        let new_ver = root_pkg.version

        const release = args.shift()
        if (release) {
            new_ver = semver.inc(new_ver, release)
        }

        root_pkg.version = new_ver

        await write(root_path, root_pkg)

        const pkgs = collect(opts.root_dir, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json'],
        })

        const deps = dep_graph(pkgs)
        const candidates = sort(deps)

        for (const x of candidates) {
            const c_path = path.join(x.path, 'package.json')
            const xpkg = await read(c_path)

            log.info(`[${xpkg.name}] new release: ${bold(new_ver)}`)
            xpkg.version = new_ver
            await write(c_path, xpkg)

            for (const dep of x.dependents) {
                const el = find(dep, deps)

                const dpkg_path = path.join(el.path, 'package.json')
                const dpkg = await read(dpkg_path)

                log.info(`[${xpkg.name}] ${dpkg.name}: ${xpkg.name}@${dpkg.dependencies[xpkg.name]} => ${bold(new_ver)}`)

                dpkg.dependencies[xpkg.name] = new_ver

                await write(dpkg_path, dpkg)
            }
            log.info('')
        }

        // run copy command
        // run git tag command
        // run git push tag
        // run npm publish
    }
}
