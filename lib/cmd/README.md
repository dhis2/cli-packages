<!-- @format -->

# Commands

A command is a plugin `module` which exports an object with two
properties: `id` and `fn`.

```
module.exports = {
    id: 'command name',
    fn: (cwd, cmd, args) => {}
}
```

The plugin is then added to the `cmds` array in `lib/cmds.js`:

```
const cmds = [
    require('./cmd/link.js'),
    require('./cmd/publish.js'),
    require('./cmd/copy.js'),
    require('./cmd/run.js'),
]
```

## `id`

This is the identifier for the command, which is also what is used from
the command line.

## `fn`

A function which receives three parameters: `cwd`, `cmd`, and `args`.

-   `cwd` is the current working directory for the script
-   `cmd` is the runner to use, e.g. yarn or npm
-   `args` is any other parameters which were passed from the command
    line.
