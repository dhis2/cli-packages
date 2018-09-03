#!/usr/bin/env node

const die = require('./lib/die.js')

const log = require('@vardevs/log')({
    level: 2,
    prefix: 'LINKER'
})
const { read, write } = require('@vardevs/io')

const cmds = require('./lib/cmds.js')

const repoDir = process.cwd()

async function main(args = []) {
    if (args.length === 0) die('No supported arguments')
    
    const cmd = args.shift()
    cmds[cmd].call(this, repoDir)
}

const args = process.argv.filter(cmd => cmds.list.includes(cmd))

main(args)
