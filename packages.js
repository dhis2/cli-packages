#!/usr/bin/env node

const die = require('./lib/die.js')

const log = require('@vardevs/log')({
    level: 2,
    prefix: 'PKGS'
})
const { read, write } = require('@vardevs/io')

const cmds = require('./lib/cmds.js')

const repoDir = process.cwd()

async function main(args = []) {
    const binary = args.shift()
    const script = args.shift()

    const cmd = args.shift()

    if (!cmds.list.includes(cmd)) {
        die(`No supported arguments, got "${cmd}"`)
    }

    cmds[cmd].call(this, repoDir, args)
}

main(process.argv)
