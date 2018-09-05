const path = require('path')

const util = require('util')
const spawn = require('child_process').spawn

const { collect } = require('@vardevs/io')
const log = require('@vardevs/log')({
    level: 2,
    prefix: 'PKGS/exec'
})

const {
    is_monorepo,
    mono_path
} = require('../mono.js')

module.exports = { 
    id: 'exec',
    fn: async (cwd, args) => {
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

        const cmd = args.shift()
        const str_args = args.join(' ')

        for (pkg of packages) {
            const exec = spawn(cmd, args, { 
                cwd: path.dirname(pkg),
                encoding: 'utf8'
            })

            const pkg_name = path.basename(path.dirname(pkg))

            exec.stdout.on('data', data => {
                log.info(`[${pkg_name}] ${cmd} ${str_args} stdout:\n${data}`)
            })

            exec.stderr.on('data', data => {
                log.error(`[${pkg_name}] ${cmd} ${str_args} stderr:\n${data}`)
            })

            exec.on('error', err => {
                log.error(`[${pkg_name}] ${cmd} ${str_args} error:\n${err}`)
                die(`[${pkg_name}] error: ${err}`)
            })

            exec.on('close', code => {
                log.info(`[${pkg_name}] ${cmd} ${str_args} exited with code: ${code}`)
            })
        }
    }
}
