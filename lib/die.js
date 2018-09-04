const log = require('@vardevs/log')({
    level: 2,
    prefix: 'LINKER/die'
})

module.exports = function die(reason = '') {
    log.error('Die triggered with reason:', reason)
    process.exit(1)
}

