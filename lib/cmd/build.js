const path = require('path')

const { dep_graph, sort, update } = require('../deps.js')
const { collect } = require('@vardevs/io')
const { bold } = require('../colors.js')

const die = require('../die.js')

const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'build',
})

const spawn = require('child_process').spawnSync

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

        for (const x of candidates) {
            try {
                const res = spawn(cmd, ['run', 'build'], {
                    cwd: x.path,
                    encoding: 'utf8',
                })

                const status =
                    res.status === 0
                        ? bold('OK')
                        : bold(`exit status ${res.status}`)

                log.info(`[${x.name}] build ${status}`)
                log.debug(`[${x.name}] stdout:\n${res.stdout}`)
                log.debug(`[${x.name}] stderr:\n${res.stderr}`)
            } catch (e) {
                die(`[${x.name}] build ${bold('FAIL')}\n`)
            }
        }
        log.info('builds completed successfully')
    },
}
