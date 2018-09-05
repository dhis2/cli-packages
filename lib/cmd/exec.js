/** @format */

const path = require('path')

const spawn = require('child_process').spawn

const { collect } = require('@vardevs/io')
const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'exec',
})

const die = require('../die.js')
const { bold } = require('../colors.js')

module.exports = {
    doc: `usage: packages exec COMMAND [ARG]...
    
examples:

    packages exec yarn build
    packages exec yarn list
    packages exec ls -la

tl;dr:

Runs the given COMMAND on each package which is found in the current base dir.

...

Works with monorepos and standard repos.
    
`,
    id: 'exec',
    fn: async (cwd, cmd, args) => {
        const packages = collect(cwd, {
            blacklist: ['node_modules', '.git', 'src', 'build'],
            whitelist: ['package.json'],
        })

        const subcmd = args.shift()
        const str_args = args.join(' ')

        const print = (name, data) => {
            log.info(`[${name}]\n${data}`)
        }

        const error = (name, err) => {
            log.error(`[${name}]\n${err}`)
            die(`[${name}] error: ${err}`)
        }

        const close = (name, code) => {
            log.debug(
                `[${name}] "${subcmd} ${str_args}" exited with code: ${code}`
            )
        }

        for (const pkg of packages) {
            const exec = spawn(subcmd, args, {
                cwd: path.dirname(pkg),
                encoding: 'utf8',
            })

            const pkg_name = path.basename(path.dirname(pkg))
            const name = bold(`${pkg_name}`)

            log.info(`[${name}] executing command "${subcmd} ${str_args}"...`)

            exec.stdout.on('data', print.bind(this, name))

            exec.stderr.on('data', print.bind(this, name))

            exec.on('error', error.bind(this, name))

            exec.on('close', close.bind(this, name))
        }
    },
}
