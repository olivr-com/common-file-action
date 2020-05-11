![tests](https://github.com/olivr-com/common-file-action/workflows/tests/badge.svg)

# Common file action

GitHub action to add a remote file to the current repo. We use it to maintain an organization-wide central repo with common files such as LICENSE, CONTRIBUTING.md, etc. Other repos sync with the latest versions of those files every time they're built.

## Usage

Simplest example

```yaml
uses: olivr-com/common-file-action@v1
with:
  url: https://your-file.md
```

Complete example

```yaml
uses: olivr-com/common-file-action@v1
with:
  url: https://your-file.md

  # -You can download the file in a subdirectory
  path: './subdirectory/'

  # If you want to use this name as the file name to create
  # defaults to the downloaded file name
  filename: 'your-new-filename.md'

  # Will throw an errror if file content has changed
  overwrite: false
```

## Contribute

Checkout the v1 branch

Install the dependencies

```bash
npm install
```

Run the tests

```bash
npm test
```

### Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos. Packaging the action will create a packaged action in the dist folder.

Run package

```bash
npm run package
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```
