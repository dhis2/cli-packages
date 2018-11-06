const path = require('path')

const { dep_graph, sort, update } = require('../deps.js')
const { collect } = require('@vardevs/io')
const { bold } = require('../colors.js')

const die = require('../die.js')

const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'build',
})

const run = require('../run.js')

module.exports = {
    id: 'build',
    doc: `usage: packages build
    
tl;dr builds everything sequentially, based on inter-dependencies

This command is monorepo aware, so if there are multiple packages, it
figures out dependencies between packages, and builds them in the
required order.

This command does not need the packages to be linked, so useful in a CI
environment.
    `,
    fn: (cwd, cmd, args, opts) => {
        const pkgs = collect(opts.cwd, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json'],
        })

        const deps = dep_graph(pkgs)
        const candidates = sort(deps)

        for (const candidate of candidates) {
            run(cmd, ['run', 'build'], candidate.name, candidate.path)
        }

        log.info('builds completed successfully')
    },
}
