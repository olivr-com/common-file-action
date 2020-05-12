const io = require('@actions/io')
const fetch = require('node-fetch')
const fs = require('fs')

let downloadRemoteFile = async function (
  url,
  path = '',
  overwrite = true,
  filename = ''
) {
  const url_parts = url.match(/^(https?).+\/([^/]+)$/)

  if (!url_parts || !url_parts[1] || !url_parts[2])
    throw Error(
      'Please ensure your url is a valid http(s) url and ends with an actual file name'
    )

  const path_parts = path.match(/^((\.?\/)|\/)?(.*)\/?$/)
  const dir = (path_parts[3] ? path_parts[3].replace(/\/$/, '') : '.') + '/'
  const new_filename = dir + (filename ? filename : url_parts[2])

  return await fetch(url)
    .then((res) => res.buffer())
    .then(async (buffer) => {
      if (fs.existsSync(new_filename)) {
        const original_file = fs.readFileSync(new_filename)
        const new_file = buffer

        if (original_file.equals(new_file)) {
          return ''
        } else if (!original_file.equals(new_file) && overwrite == false) {
          throw Error('This file already exists and is different')
        }
      }

      await io.mkdirP(dir)
      fs.writeFileSync(new_filename, buffer)

      return new_filename
    })
}

module.exports = downloadRemoteFile
