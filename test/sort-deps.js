/** @format */

const test = require('tape')

const { sort } = require('../lib/deps.js')

test('sort simple dep graph', t => {
    t.plan(1)

    const deps = [
        {
            name: 'a',
            depends: [],
            dependents: ['b', 'c', 'd', 'e'],
        },
        {
            name: 'b',
            depends: ['a'],
            dependents: ['c'],
        },
        {
            name: 'c',
            depends: ['b'],
            dependents: ['d'],
        },
        {
            name: 'd',
            depends: ['c'],
            dependents: ['e'],
        },
        {
            name: 'e',
            depends: ['d'],
            dependents: [],
        },
    ]

    const graph = sort(deps)

    t.equals(graph, graph, '')
})
