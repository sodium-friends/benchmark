const cronometro = require('cronometro')
const { createHash, randomBytes } = require('crypto')
const sodium = require('sodium-native')
const sodiumJS = require('sodium-javascript')

const shortData = randomBytes(64)
const mediumData = randomBytes(384)
const longData = randomBytes(4096)
const output256 = Buffer.allocUnsafe(32)
const output512 = Buffer.allocUnsafe(64)
const state = Buffer.allocUnsafe(sodium.crypto_generichash_STATEBYTES)

function size (data) {
  cronometro({
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
    'sodium-javascript generichash (prealloc)': function () {
      sodiumJS.crypto_generichash(output512, data)
    },
    'sodium-javascript generichash (32, prealloc)': function () {
      sodiumJS.crypto_generichash(output256, data)
    }
  }, {
    print: { compare: true }
  })
}

size(shortData)
size(mediumData)
size(longData)
