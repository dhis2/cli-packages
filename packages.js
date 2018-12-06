#!/usr/bin/env node
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

async function main() {
    log.info(reverse(`     DHIS2 Packages     `))

    await is_package(repoDir)

    const npm_yarn = await tool(repoDir)
    const cwd = await setup(repoDir)

    cmds.config({
        cwd: cwd,
        is_monorepo: repoDir !== cwd,
        root_dir: repoDir,
        tool: npm_yarn,
    })

    const argv = cmds.argv
    console.log(argv)
}

// start it!
main()
