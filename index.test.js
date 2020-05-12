require('jest-fetch-mock').enableMocks()
const downloadRemoteFile = require('./downloadRemoteFile')
const io = require('@actions/io')

const TEST_DIRECTORY = '.test'
const TEST_TARGET = TEST_DIRECTORY + '/support.md'

beforeAll(() => io.mkdirP(TEST_DIRECTORY))

beforeEach(() => fetch.mockResponse('hello world'))

test('fails if URL is invalid', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile('test.com/file.md', TEST_DIRECTORY)
  ).rejects.toThrow(
    'Please ensure your url is a valid http(s) url and ends with an actual file name'
  )
})

test('fails if URL is valid but does not end with a file', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile('http://test.com/', TEST_DIRECTORY)
  ).rejects.toThrow(
    'Please ensure your url is a valid http(s) url and ends with an actual file name'
  )
})

test('fails if URL is valid but does not use http(s)', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile('ftp://test.com/file.md', TEST_DIRECTORY)
  ).rejects.toThrow(
    'Please ensure your url is a valid http(s) url and ends with an actual file name'
  )
})

test('succeeds if no file exists already', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile('http://test.com/support.md', TEST_DIRECTORY, true)
  ).resolves.toEqual(TEST_TARGET)
})

test('succeeds when changing the file name', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile(
      'http://test.com/support.md',
      TEST_DIRECTORY,
      true,
      'hello.md'
    )
  ).resolves.toEqual(TEST_DIRECTORY + '/hello.md')
})

test('succeeds if file already exists and overwite is set to TRUE and the file content IS the same', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile(
      'http://test.com/support.md',
      TEST_DIRECTORY,
      true
    ).then(() =>
      downloadRemoteFile('http://test.com/support.md', TEST_DIRECTORY, true)
    )
  ).resolves.toEqual('')
})

test('succeeds if file already exists and overwite is set to TRUE and the file content IS NOT the same', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile('http://test.com/support.md', TEST_DIRECTORY).then(
      () => {
        fetch.mockResponse('bye world')
        return downloadRemoteFile(
          'http://test.com/support.md',
          TEST_DIRECTORY,
          true
        )
      }
    )
  ).resolves.toEqual(TEST_TARGET)
})

test('succeeds if file already exists and overwite is set to FALSE and the file content IS the same', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile('http://test.com/support.md', TEST_DIRECTORY, true).then(
      () => {
        return downloadRemoteFile(
          'http://test.com/support.md',
          TEST_DIRECTORY,
          false
        )
      }
    )
  ).resolves.toEqual('')
})

test('fails if file already exists and overwite is set to FALSE and the file content IS NOT the same', () => {
  expect.assertions(1)
  return expect(
    downloadRemoteFile('http://test.com/support.md', TEST_DIRECTORY).then(
      () => {
        fetch.mockResponse('bye world')
        return downloadRemoteFile(
          'http://test.com/support.md',
          TEST_DIRECTORY,
          false
        )
      }
    )
  ).rejects.toThrow('This file already exists and is different')
})

afterAll(() => io.rmRF(TEST_DIRECTORY))
