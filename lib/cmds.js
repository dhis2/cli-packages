/** @format */

const cmds = [
    require('./cmd/link.js'),
    require('./cmd/publish.js'),
    require('./cmd/copy.js'),
    require('./cmd/exec.js'),
    require('./cmd/build.js'),
    require('./cmd/version.js'),
    require('./cmd/install.js'),
]

const cmd_obj = {}

cmds.map(
    cmd =>
        (cmd_obj[cmd.id] = {
            fn: cmd.fn,
            doc: cmd.doc,
        })
)

module.exports = {
    ...cmd_obj,
    list: cmds.map(cmd => cmd.id),
}
