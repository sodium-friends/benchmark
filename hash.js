const cronometro = require('cronometro')
const { createHash, randomBytes } = require('crypto')
const sodium = require('sodium-native')

const shortData = randomBytes(64)
const mediumData = randomBytes(384)
const longData = randomBytes(4096)
const megaData = randomBytes(2 ** 23)
const output256 = Buffer.alloc(32)
const output512 = Buffer.alloc(64)
const state = Buffer.alloc(sodium.crypto_generichash_STATEBYTES)

function size (name, data) {
  return cronometro({
    'crypto sha256 (no prealloc)': function () {
      createHash('sha256').update(data).digest()
    },
    'crypto sha256 (prealloc)': function () {
      createHash('sha256').update(data).digest(output256)
    },
    'crypto sha512 (no prealloc)': function () {
      createHash('sha512').update(data).digest()
    },
    'crypto sha512 (prealloc)': function () {
      createHash('sha512').update(data).digest(output512)
    },
    'crypto blake2b512 (no prealloc)': function () {
      createHash('blake2b512').update(data).digest()
    },
    'crypto blake2b512 (prealloc)': function () {
      createHash('blake2b512').update(data).digest(output512)
    },
    'sodium-native generichash (prealloc)': function () {
      sodium.crypto_generichash(output512, data)
    },
    'sodium-native generichash (state reuse)': function () {
      sodium.crypto_generichash_init(state, null, 64)
      sodium.crypto_generichash_update(state, data)
      sodium.crypto_generichash_final(state, output512)
    },
    'sodium-native generichash (32, prealloc)': function () {
      sodium.crypto_generichash(output256, data)
    },
    'sodium-native generichash (32, state reuse)': function () {
      sodium.crypto_generichash_init(state, null, 32)
      sodium.crypto_generichash_update(state, data)
      sodium.crypto_generichash_final(state, output256)
    },
    'sodium-native generichash (no prealloc)': function () {
      const output512 = Buffer.alloc(64)
      sodium.crypto_generichash(output512, data)
    },
    'sodium-native generichash (state no reuse)': function () {
      const output512 = Buffer.alloc(64)
      const state = Buffer.alloc(sodium.crypto_generichash_STATEBYTES)
      sodium.crypto_generichash_init(state, null, 64)
      sodium.crypto_generichash_update(state, data)
      sodium.crypto_generichash_final(state, output512)
    },
    'sodium-native generichash (32, no prealloc)': function () {
      const output256 = Buffer.alloc(32)
      sodium.crypto_generichash(output256, data)
    },
    'sodium-native generichash (32, state no reuse)': function () {
      const output256 = Buffer.alloc(32)
      const state = Buffer.alloc(sodium.crypto_generichash_STATEBYTES)
      sodium.crypto_generichash_init(state, null, 32)
      sodium.crypto_generichash_update(state, data)
      sodium.crypto_generichash_final(state, output256)
    },
    'crypto sha256 (no prealloc, digest)': function () {
      createHash('sha256').update(data).digest('hex')
    },
    'crypto sha512 (no prealloc, digest)': function () {
      createHash('sha512').update(data).digest('hex')
    },
    'crypto blake2b512 (no prealloc, digest)': function () {
      createHash('blake2b512').update(data).digest('hex')
    },
    'sodium-native generichash (prealloc, digest)': function () {
      sodium.crypto_generichash(output512, data)
      output512.toString('hex')
    },
    'sodium-native generichash (state reuse, digest)': function () {
      sodium.crypto_generichash_init(state, null, 64)
      sodium.crypto_generichash_update(state, data)
      sodium.crypto_generichash_final(state, output512)
      output512.toString('hex')
    },
    'sodium-native generichash (32, prealloc, digest)': function () {
      sodium.crypto_generichash(output256, data)
      output256.toString('hex')
    },
    'sodium-native generichash (32, state reuse, digest)': function () {
      sodium.crypto_generichash_init(state, null, 32)
      sodium.crypto_generichash_update(state, data)
      sodium.crypto_generichash_final(state, output256)
      output256.toString('hex')
    },
    'sodium-native generichash (no prealloc, digest)': function () {
      const output512 = Buffer.alloc(64)
      sodium.crypto_generichash(output512, data)
      output512.toString('hex')
    },
    'sodium-native generichash (state no reuse, digest)': function () {
      const output512 = Buffer.alloc(64)
      const state = Buffer.alloc(sodium.crypto_generichash_STATEBYTES)
      sodium.crypto_generichash_init(state, null, 64)
      sodium.crypto_generichash_update(state, data)
      sodium.crypto_generichash_final(state, output512)
      output512.toString('hex')
    },
    'sodium-native generichash (32, no prealloc, digest)': function () {
      const output256 = Buffer.alloc(32)
      sodium.crypto_generichash(output256, data)
      output256.toString('hex')
    },
    'sodium-native generichash (32, state no reuse, digest)': function () {
      const output256 = Buffer.alloc(32)
      const state = Buffer.alloc(sodium.crypto_generichash_STATEBYTES)
      sodium.crypto_generichash_init(state, null, 32)
      sodium.crypto_generichash_update(state, data)
      sodium.crypto_generichash_final(state, output256)
      output256.toString('hex')
    }
  }, {
    iterations: 10000,
    print: {
      compare: true,
      compareMode: 'base'
    }
  })
}

;(async () => {
  await size('64 bytes', shortData)
  await size('384 bytes', mediumData)
  await size('4096 bytes', longData)
  await size('4 MB', megaData)
})()
