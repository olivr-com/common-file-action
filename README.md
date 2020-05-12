# Download file action

[![tests](https://github.com/olivr-com/download-file-action/workflows/tests/badge.svg)](https://github.com/olivr-com/download-file-action/actions?query=workflow%3Atests)

GitHub action to download a remote file to the current repo.

We use it to maintain an organization-wide central repo with common files such as LICENSE, CONTRIBUTING.md, etc. Other repos sync with the latest versions of those files every time they're built.

## Usage

> This action doesn't commit the file. You can use [another action](https://github.com/marketplace?query=commit&type=actions) to do so.

### Simple example

Download the file `http://test.com/CONTRIBUTING.md` to this repo.

```yaml
uses: olivr-com/download-file-action@v1
with:
  url: http://test.com/CONTRIBUTING.md
```

### Complete example

Download the file `http://test.com/CONTRIBUTING.md` in the `docs` directory of this repo and name it `CONTRIBUTE`.

```yaml
uses: olivr-com/download-file-action@v1
with:
  url: http://test.com/CONTRIBUTING.md
  path: './docs/'
  filename: 'CONTRIBUTE'
  overwrite: true
```

> Set overwrite to false to throw an error in case the remote file is not the same of a local file

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
