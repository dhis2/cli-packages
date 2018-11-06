const path = require('path')

const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'install',
})

const die = require('../die.js')

const { dep_graph, sort, update } = require('../deps.js')
const { collect } = require('@vardevs/io')
const { bold } = require('../colors.js')

const run = require('../run.js')

module.exports = {
    id: 'install',
    doc: `usage: packages install

    tl;dr: runs install
    `,
    fn: (cwd, cmd, args, opts) => {
        if (opts.is_monorepo) {
            const pkgs = collect(opts.cwd, {
                blacklist: ['node_modules', '.git', 'src', 'build'],
                whitelist: ['package.json'],
            })

            const deps = dep_graph(pkgs)
            const candidates = sort(deps)

            for (const candidate of candidates) {
                run(cmd, ['install'], candidate.name, candidate.path)
            }
        } else {
            const pkg_name = path.basename(path.basename(opts.root_dir))
            const name = bold(`${pkg_name}`)

            run(cmd, ['install'], name, opts.root_dir)
        }
    }
}
