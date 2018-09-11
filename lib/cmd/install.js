const path = require('path')
const spawn = require('child_process').spawn

const log = require('@vardevs/log')({
    level: require('../loglevel.js'),
    prefix: 'install',
})

const exec = require('./exec').fn
const die = require('../die.js')
const { bold } = require('../colors.js')

module.exports = {
    id: 'install',
    doc: `usage: packages install
    
tl;dr shortcut for "packages exec yarn/npm install"
    `,
    fn: (cwd, cmd, args, opts) => {
        if (opts.is_monorepo) {
            const print = (name, data) => {
                log.info(`[${name}]\n${data}`)
            }

            const error = (name, err) => {
                log.error(`[${name}]\n${err}`)
                die(`[${name}] error: ${err}`)
            }

            const close = (name, code) => {
                log.debug(
                    `[${name}] "yarn install" exited with code: ${code}`
                )
                exec(cwd, cmd, [cmd, 'install'])
            }

            const rootdir = path.resolve(cwd, '..')

            const install = spawn(cmd, ['install'], {
                cwd: rootdir,
                encoding: 'utf8',
            })

            const pkg_name = path.basename(path.basename(rootdir))
            const name = bold(`${pkg_name}`)

            log.info(`[${name}] executing command "yarn install" in root package...`)

            install.stdout.on('data', print.bind(this, name))

            install.stderr.on('data', print.bind(this, name))

            install.on('error', error.bind(this, name))

            install.on('close', close.bind(this, name))
        } else {
            exec(cwd, cmd, [cmd, 'install'])
        }
    }
}
