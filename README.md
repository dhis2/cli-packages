<!-- @format -->

# packages

Package helper for monorepos where packages are published from e.g.
`build` instead of the repository root.

## for development

```
cd $repo
packages install
packages build
packages link
```

## for publish

```
cd $repo
packages install
packages link
packages build
packages publish <version>||major||minor
```

# examples

## `packages help`

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

## `packages exec COMMAND`

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

## `packages link`

```
[packages]      DHIS2 Packages
[copy] wrote: example-app/build/package.json
[copy] wrote: build/package.json

[link] linking: 1/2 links created...
[link] linking: 2/2 links created...
[link] [example-app] linked: ui
```

## `packages publish`

```
[packages]      DHIS2 Packages
[publish] [@dhis2/d2-ui] new release: 3.1.0
[publish]
[publish] [@dhis2/d2-ui-core] new release: 3.1.0
[publish] [@dhis2/d2-ui-core] example-cra: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-app: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-expression-manager: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-forms: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-group-editor: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-header-bar: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-icon-picker: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-interpretations: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-legend: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-org-unit-select: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-org-unit-tree: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-sharing-dialog: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-table: @dhis2/d2-ui-core@3.1.0 => 3.1.0
[publish] [@dhis2/d2-ui-core] @dhis2/d2-ui-translation-dialog: @dhis2/d2-ui-core@3.1.0 => 3.1.0
```

## `packages build`

Alias for `packages exec <yarn/npm> build`.

## `packages install`

Alias for `packages exec <yarn/npm> install`, but also runs the command for the root packages in the case of monorepos to install the development dependencies.

# features

-   monorepo support (packages in `${repo}/packages`)
-   creating links from inside `build/` directory
-   copies `package.json` from `${repo}` to `build/`
-   figures out interdependencies between packages
-   publishes from build directory for a flat package structure with transpiled sources
