function findDependencies(deps, pkgs) {
    const res = []
    for (dep of Object.keys(deps)) {
        for (pkg of pkgs) {
            if (dep === pkg.name) {
                res.push(pkg.name)
            }
        }
    }
    return res
}

function findDependents(name, pkgs) {
    const res = []
    for (let pkg of pkgs) {
        if (pkg.deps.includes(name)) {
            res.push(pkg.name)
        }
    }
    return res
}


function deps (packages = []) {
    const map = packages
    .map(p => {
        const pkg = require(p)
        const { name, dependencies } = pkg

        console.log(name, dependencies)
        const deps = Object.keys(dependencies)

        return {
            name,
            deps
        }
    })
    .map((package, index, arr) => {
        const { name, deps } = package
        const hasDependents = findDependents(name, arr)
        const hasDependencies = findDependencies(deps, arr)
        
        return { 
            name: name,
            dependents: hasDependents,
            depends: hasDependencies
        }
    })

    console.dir(map)
}

module.exports = deps
