const exec = require('./exec').fn

module.exports = {
    id: 'build',
    doc: `usage: packages build
    
tl;dr shortcut for "packages exec yarn/npm run build"
    `,
    fn: (cwd, cmd, args, opts) => {
        exec(cwd, cmd, [cmd, 'run', 'build'])
    }
}
