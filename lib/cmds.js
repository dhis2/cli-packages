const cmds = [
    require('./cmd/link.js'),
    require('./cmd/publish.js'),
    require('./cmd/copy.js'),
    require('./cmd/run.js'),
]

const cmd_obj = {}

cmds.map(cmd => cmd_obj[cmd.id] = cmd.fn)

module.exports = {
    ...cmd_obj,
    list: cmds.map(cmd => cmd.id)
}
