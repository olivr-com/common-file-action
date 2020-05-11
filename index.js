const core = require('@actions/core')
const downloadRemoteFile = require('./downloadRemoteFile')

// most @actions toolkit packages have async methods
async function run() {
  try {
    const url = core.getInput('url')
    const path = core.getInput('path')
    const overwrite = core.getInput('overwrite')
    const filename = core.getInput('filename')

    const file_changed = await downloadRemoteFile(
      url,
      path,
      overwrite,
      filename
    )

    console.log(`File changed: ${file_changed || 'none'}`)

    core.setOutput('file_changed', file_changed)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
