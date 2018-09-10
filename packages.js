#!/usr/bin/env node
/** @format */

const path = require('path')
const fs = require('fs-extra')

const die = require('./lib/die.js')

const log = require('@vardevs/log')({
    level: require('./lib/loglevel.js'),
    prefix: 'packages',
})

const { reverse } = require('./lib/colors.js')

const { is_monorepo, mono_path } = require('./lib/mono.js')

const cmds = require('./lib/cmds.js')
const help = require('./lib/help.js')

const repoDir = process.cwd()

async function tool(dir) {
    const yarnlock = path.join(dir, 'yarn.lock')
    try {
        await fs.access(yarnlock)
        log.debug('[setup] using "yarn"...')
        return 'yarn'
    } catch (err) {
        log.debug('[setup] using "npm"...')
        return 'npm'
    }
}

async function is_package(dir) {
    const pkg = path.join(dir, 'package.json')
    try {
        await fs.access(pkg)
        log.debug('[setup] "package.json" found...')
        return true
    } catch (err) {
        log.error('[setup] "package.json" not found!')
        die(`Could not find "package.json" in "${repoDir}".`)
    }
}

async function setup(cwd) {
    const monorepo = await is_monorepo(cwd)

    let pwd = cwd
    if (monorepo) {
        log.debug('[setup] monorepo detected...')
        pwd = mono_path(cwd)
    }

    return pwd
}

async function main(args = []) {
    log.info(reverse(`     DHIS2 Packages     `))

    const binary = args.shift()
    const script = args.shift()
    log.trace(`binary: ${binary}`)
    log.trace(`script: ${script}`)

    const cmd = args.shift()

    if (cmd === 'help') {
        // special case when the user calls for help
        help(args)
        process.exit(0)
    }

    await is_package(repoDir)

    const npm_yarn = await tool(repoDir)
    const cwd = await setup(repoDir)

    if (!cmds.list.includes(cmd)) {
        die(`No supported arguments, got "${cmd}"`)
    }

    cmds[cmd].fn.call(this, cwd, npm_yarn, args, {
        is_monorepo: repoDir !== cwd,
        root_dir: repoDir
    })
}

// start it!
main(process.argv)
