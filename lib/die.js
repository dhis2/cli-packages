


module.exports = function die(reason = '') {
    log.error('Die triggered with reason:', reason)
    process.exit(1)
}

