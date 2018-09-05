<!-- @format -->

# packages

Package helper for monorepos where packages are published from e.g.
`build` instead of the repository root.

# features

-   monorepo support (packages in `${repo}/packages`)
-   creating links from inside `build/` directory
-   copies `package.json` from `${repo}` to `build/`
-   figures out interdependencies between packages

# todo

-   publish packages
-   tests!
-   figure out build order based on dependency graph
