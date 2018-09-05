const log = require('@vardevs/log')({
    level: require('./loglevel.js'),
    prefix: 'PKGS/die'
})

const { bold } = require('./colors.js')

module.exports = function die(reason = '') {
    log.error(`[${bold('die')}] ${reason}`)
    process.exit(1)
}

