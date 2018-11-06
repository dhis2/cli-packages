const spawn = require('child_process').spawnSync

const die = require('./die.js')

const { bold } = require('./colors.js')

const log = require('@vardevs/log')({
    level: require('./loglevel.js'),
    prefix: 'run',
})

module.exports = function run(cmd, args, name, cwd) {
    try {
        const res = spawn(cmd, args, {
            cwd: cwd,
            encoding: 'utf8',
        })

        const status =
            res.status === 0
                ? bold('OK')
                : bold(`exit status ${res.status}`)

        const op = args.join(' ')

        log.info(`[${name}] '${op}' ${status}`)
        log.debug(`[${name}] stdout:\n${res.stdout}`)
        log.debug(`[${name}] stderr:\n${res.stderr}`)
    } catch (e) {
        die(`[${name}] install ${bold('FAIL')}\n`)
    }
}
