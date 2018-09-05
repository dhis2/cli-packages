/** @format */

const log = require('@vardevs/log')({
    level: require('./loglevel.js'),
    prefix: 'die',
})

const { bold } = require('./colors.js')

module.exports = function die(reason = '') {
    log.error(`[${bold('HALT')}] process halted: ${reason}`)
    process.exit(1)
}
