# 🔨 Contributing to `dynamic-styles`

First of all, thanks for showing interest in contributing to `dynamic-styles`.
All your contributions are extremely welcome and valuable to this project. Thanks!

### 😊 Commit convention

`dynamic-styles` is a monorepo, and it is important to write correct and understandable commit messages
to keep the git history clean. All commits made in this repository are divided into **3 groups**:
- `package commits` related to a particular package (e.g. `react` package, `native` package, ..)
- `docs commits` related to any kind of documentation (e.g. README, documentation website, ..)
- `core commits` only related to repository tooling and not associated with any package (e.g. script, config), ..

Commit message consists of **2 parts**:
1. `[area]` - To which area the commit message refers.
2. `message` - Message describing the changes you made.

```text
[area] (Optional title): message
```

Examples
```text
// Change in '@dyst/react' package at the 'useCSS()' hook
$ [`@dyst/react`] Optimized performance of 'useCss()' hook

// Change related to documentation website
$ [docs] Fixed grammar error in `Get Started` section

// Change made in repository script, it is not related to documentation or any package
$ [core] Fixed auth issue during package publish
```

### ⭐️ Git branches

- **master** - current version, patches for current minor version (`1.0.x`)
- **develop** - contains the next version (`1.x.0`), most likely you would want to create a PR to this branch

### 🚀 Release

1. Create `.npmrc` file and specify credential necessary for publishing a package.
    ```text
    registry=https://registry.npmjs.com/
    _auth="[AUTH_TOKEN_PROVIDED_BY_OWNER]"
    email=[PUBLISHING_EMAIL]
    ```
   
2. Release package by executing `yarn run release:[RELEASE_TYPE]`. <br/>
   Possible `[RELEASE_TYPES]`: `patch`, `minor`, `major`


