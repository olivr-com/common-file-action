const downloadRemoteFile = require('./downloadRemoteFile')
const io = require('@actions/io')
const fs = require('fs')

const TEST_DIRECTORY = './.test'

test('Setup tests', async () => {
  await io.mkdirP(TEST_DIRECTORY)
})

test('fails if URL is invalid', async () => {
  await expect(downloadRemoteFile('foo', TEST_DIRECTORY)).rejects.toThrow(
    'Please ensure your url is a valid http(s) url and ends with an actual file name'
  )
})

test('fails if URL is valid but does not end with a file', async () => {
  await expect(
    downloadRemoteFile('https://github.com/', TEST_DIRECTORY)
  ).rejects.toThrow(
    'Please ensure your url is a valid http(s) url and ends with an actual file name'
  )
})

test('fails if URL is valid but does not use http(s)', async () => {
  await expect(
    downloadRemoteFile(
      'ssh://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
      TEST_DIRECTORY
    )
  ).rejects.toThrow(
    'Please ensure your url is a valid http(s) url and ends with an actual file name'
  )
})

test('suceed if no file exists already', async () => {
  await expect(
    downloadRemoteFile(
      'https://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
      TEST_DIRECTORY,
      true
    )
  ).accepts
})

test('suceed when changing the file name', async () => {
  await expect(
    downloadRemoteFile(
      'https://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
      TEST_DIRECTORY,
      true,
      'Hello'
    )
  ).accepts
})

test('suceed if file already exists and overwite is set to TRUE and the file content IS the same', async () => {
  await expect(
    downloadRemoteFile(
      'https://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
      TEST_DIRECTORY,
      true
    ).then(() => {
      return downloadRemoteFile(
        'https://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
        TEST_DIRECTORY,
        true
      )
    })
  ).accepts
})

test('suceed if file already exists and overwite is set to TRUE and the file content IS NOT the same', async () => {
  await expect(
    downloadRemoteFile(
      'https://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
      TEST_DIRECTORY
    )
      .then(() => {
        return fs.renameSync(
          TEST_DIRECTORY + '/LICENSE',
          TEST_DIRECTORY + '/README.md'
        )
      })
      .then(() => {
        return downloadRemoteFile(
          'https://raw.githubusercontent.com/olivr-com/common-file-action/master/README.md',
          TEST_DIRECTORY,
          true
        )
      })
  ).accepts
})

test('suceed if file already exists and overwite is set to FALSE and the file content IS the same', async () => {
  await expect(
    downloadRemoteFile(
      'https://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
      TEST_DIRECTORY,
      true
    ).then(() => {
      return downloadRemoteFile(
        'https://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
        TEST_DIRECTORY,
        false
      )
    })
  ).accepts
})

test('fails if file already exists and overwite is set to FALSE and the file content IS NOT the same', async () => {
  await expect(
    downloadRemoteFile(
      'https://raw.githubusercontent.com/olivr-com/common-file-action/master/LICENSE',
      TEST_DIRECTORY
    )
      .then(() => {
        return fs.renameSync(
          TEST_DIRECTORY + '/LICENSE',
          TEST_DIRECTORY + '/package.json'
        )
      })
      .then(() => {
        return downloadRemoteFile(
          'https://raw.githubusercontent.com/olivr-com/common-file-action/master/package.json',
          TEST_DIRECTORY,
          false
        )
      })
  ).rejects.toThrow('This file already exists and is different')
})

test('Cleanup tests', async () => {
  await io.rmRF(TEST_DIRECTORY)
})
