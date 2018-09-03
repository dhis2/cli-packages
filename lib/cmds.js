const cmds = [
    require('./link.js'),
    require('./publish.js'),
    require('./copy.js'),
]

const cmd_obj = {}
cmds.map(cmd => cmd_obj[cmd.id] = cmd.fn)

module.exports = {
    ...cmd_obj,
    list: cmds.map(cmd => cmd.id)
}
