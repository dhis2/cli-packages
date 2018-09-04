const path = require('path')
const { write } = require('@vardevs/io')

module.exports = { 
    id: 'copy',
    fn: async (cwd) => {
        const src_pkg = require(path.join(cwd, 'package.json'))

        const dist_pkg = JSON.stringify({
            ...src_pkg,
            private: false,
            publishConfig: {
                'access': 'public'
            }
        }, null, 2)

        const target_pkg = path.join(cwd, 'build', 'package.json')

        await write(target_pkg, dist_pkg)
    }
}
