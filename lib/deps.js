const path = require('path')

function findDependencies(deps, pkgs) {
    const res = []
    for (dep of deps) {
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

function dep_graph (packages = []) {
    return packages
    .map(p => {
        const pkg = require(p)
        const { name, dependencies } = pkg

        const deps = Object.keys(dependencies)

        return {
            name,
            deps,
            path: path.dirname(p)
        }
    })
    .map((package, index, arr) => {
        const { name, deps } = package
        const hasDependents = findDependents(name, arr)
        const hasDependencies = findDependencies(deps, arr)
        
        return { 
            name: name,
            dependents: hasDependents,
            depends: hasDependencies,
            path: package.path
        }
    })
}

function empty (arr) {
    return arr.length === 0
}

// TODO: this function doesn't work right yet
function sort (deps, resolved = new Set()) {
    const foo = deps
        .map((d, i, arr) => {
            d.depends = d.depends.filter(x => {
                const res = resolved.has(x)
                console.log(`${x} resolved?`, res)
                return !res
            })
            if (empty(d.depends)) {
                resolved.add(d)
            }
            return d
        })

    if (foo.filter(x => resolved.has(x.name)).length === 0) {
        console.log('all resolved')
        return resolved
    } else {
        console('still resolving')
        return sort(foo, resolved)
    }
}

module.exports = {
    dep_graph,
    sort
}
