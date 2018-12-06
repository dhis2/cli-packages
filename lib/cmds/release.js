const std_version = require('standard-version')

exports.command = 'release [options]'

exports.describe = 'Generate CHANGELOG.md based on Git history.'

exports.builder = {
    'prerelease': {
        type: 'string',
        describe: 'Use to cut a prerelease version, suffix can be a string e.g. "beta"',
    },
    'first-release': {
        type: 'boolean',
        describe: 'First time generation of a changelog',
        default: false,
    }
}

exports.handler = function (argv) {
    const { cwd, is_monorepo, root_dir, tool } = argv

    const options = {
        noVerify: true,
        infile: `${root_dir}/CHANGELOG.md`,
        silent: false,
        dryRun: true,
        message: 'chore(release): cut release %s',
        tagPrefix: '',
        firstRelease: argv.firstRelease,
        prerelease: argv.prerelease,
    }

    std_version(options, function (err) {
        if (err) {
            console.error(`standard-version failed with message: ${err.message}`)
        }
        // standard-version is done
    })        
}
