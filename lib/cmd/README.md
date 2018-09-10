<!-- @format -->

# Commands

A command is a plugin `module` which exports an object with two
properties: `doc`, `id`, and `fn`.

```
module.exports = {
    id: 'command name',
    fn: (cwd, cmd, args, opts) => {}
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

## `doc`

This contains the documentation for a given command. At the minimum a string which defines the usage, but preferably a template string which has the format:

```
doc: `usage: packages COMMAND ARGS

tl;dr: this COMMAND does so and so with ARGS.

...

With certain ARGS the COMMAND might behave in weird ways, here are some examples:

    ex. 1
    ex. 2
    ex. 3

The COMMAND is monorepo aware.
`
```

## `fn`

A function which receives four parameters: `cwd`, `cmd`, `args`, `opts`.

-   `cwd` is the current working directory for the script
-   `cmd` is the runner to use, e.g. yarn or npm
-   `args` is any other parameters which were passed from the command
    line.
-   `opts` contains additional properties which are needed in the commands.
