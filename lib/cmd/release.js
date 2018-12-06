const std_version = require('standard-version')

module.exports = {
    id: 'release',
    doc: ``,
    fn: (cwd, cmd, args, opts) => {
        console.log(cwd, cmd, args, opts)

        const options = {
            noVerify: true,
            infile: `${opts.root_dir}/CHANGELOG.md`,
            silent: false,
            dryRun: true,
            message: 'chore(release): cut release %s',
            tagPrefix: '',
        }

        if (args.includes('--pre')) {
            options.prerelease = ''
        }

        if (args.includes('--first')) {
            options.firstRelease = true
        }

        std_version(options, function (err) {
            if (err) {
                console.error(`standard-version failed with message: ${err.message}`)
            }
            // standard-version is done
        })        
    },
}
