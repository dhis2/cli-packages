<!-- @format -->

# packages

Package helper for monorepos where packages are published from e.g.
`build` instead of the repository root.

# examples

##packages help

```
[packages]      DHIS2 Packages
[help]
[help] usage: help COMMAND
[help]
[help] Available commands are:
[help]  - link
[help]  - publish
[help]  - copy
[help]  - exec
```

## `packages copy`

```
[packages]      DHIS2 Packages
[copy] wrote: example-app/build/package.json
[copy] wrote: build/package.json
```

## packages exec COMMAND

```
[packages]      DHIS2 Packages
[exec] [example-app] executing command "ls "...
[exec] [ui] executing command "ls "...
[exec] [example-app]
build
node_modules
package.json
package-lock.json
public
README.md
src
yarn.lock

[exec] [ui]
babel.config.js
build
bundle.stats.json
copy-files.config.js
example-app
foo.sh
greenkeeper.json
LICENSE
node_modules
package.json
package-lock.json
postcss.config.js
README.md
scripts
src
webpack.config.js
yarn.lock
```

##packages link

```
[packages]      DHIS2 Packages
[copy] wrote: example-app/build/package.json
[copy] wrote: build/package.json

[link] linking: 1/2 links created...
[link] linking: 2/2 links created...
[link] [example-app] linked: ui
```

# features

-   monorepo support (packages in `${repo}/packages`)
-   creating links from inside `build/` directory
-   copies `package.json` from `${repo}` to `build/`
-   figures out interdependencies between packages

# todo

-   publish packages
-   tests!
-   figure out build order based on dependency graph
