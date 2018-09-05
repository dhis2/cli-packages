const path = require('path')

const util = require('util')
const spawn = require('child_process').spawn

const { collect } = require('@vardevs/io')
const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'PKGS/exec'
})

const { bold } = require('../colors.js')

module.exports = { 
    id: 'exec',
    fn: async (cwd, cmd, args) => {
        const packages = collect(cwd, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json']
        })

        const subcmd = args.shift()
        const str_args = args.join(' ')

        for (pkg of packages) {
            const exec = spawn(subcmd, args, { 
                cwd: path.dirname(pkg),
                encoding: 'utf8'
            })


            const pkg_name = path.basename(path.dirname(pkg))
            const name = bold(`${pkg_name}`)

            log.info(`[${name}] executing command "${cmd} ${str_args}"...`)

            exec.stdout.on('data', data => {
                log.info(`[${name}]\n${data}`)
            })

            exec.stderr.on('data', data => {
                log.info(`[${name}]\n${data}`)
            })

            exec.on('error', err => {
                log.error(`[${name}]\n${err}`)
                die(`[${name}] error: ${err}`)
            })

            exec.on('close', code => {
                log.debug(`[${name}] "${cmd} ${str_args}" exited with code: ${code}`)
            })
        }
    }
}
