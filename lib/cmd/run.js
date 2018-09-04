const path = require('path')
const { spawnSync } = require('child_process')

const { collect } = require('@vardevs/io')
const log = require('@vardevs/log')({
    level: 2,
    prefix: 'PKGS/run'
})

const {
    is_monorepo,
    mono_path
} = require('../mono.js')

module.exports = { 
    id: 'run',
    fn: async (cwd, args) => {
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

        for (pkg of packages) {
            const run = spawnSync('npm', ['run', ...args], { 
                cwd: path.dirname(pkg),
                encoding: 'utf8'
            })

            log.info(`NPM run output:\n${run.stdout}`)

            if (run.error) {
                log.error(`NPM run error:\n${run.stderr}`)
                die(`Failed to run cmd with args"${args}":`, run.error)
            }
        }
    }
}
