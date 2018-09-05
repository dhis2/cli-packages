const path = require('path')

const log = require('@vardevs/log')({
    level: require('./loglevel.js'),
    prefix: 'tool'
})

async function tool (dir) {
    const yarnlock = path.join(dir, 'yarn.lock')

    let tool
    try {
        await fs.access(yarnlock)
        log.info('yarn lock file found, using "yarn"...')
        tool = 'yarn'
    } catch (err) {
        log.info('no yarn lock file found, using "npm"...')
        tool = 'npm'
    }

    return _ => tool
}

module.exports = tool(process.cwd())
