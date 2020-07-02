const Benchmark = require('benchmark')
const sodiumJS = require('sodium-javascript')
const { randomBytes } = require('crypto')
const InvertedPromise = require('inverted-promise')
const shortData = randomBytes(64)
const mediumData = randomBytes(384)
const longData = randomBytes(4096)
const megaData = randomBytes(2 ** 23)
const output512 = Buffer.alloc(64)

function size (name, data) {
  const res = new InvertedPromise()
  new Benchmark.Suite({
    async: true,
    onAbort (err) {
      res.reject(err)
    },
    onCycle (event) {
      console.log(String(event.target))
    },
    onComplete () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
      res.resolve()
    }
  })
    .add('subtle (no prealloc)', {
      defer: true,
      fn (deferred) {
        crypto.subtle.digest('SHA-512', data).then(() => deferred.resolve())
      }
    })
    .add('sodium-javascript hash (no prealloc)', {
      fn () {
        const output512 = Buffer.alloc(64)
        sodiumJS.crypto_hash(output512, data)
      }
    })
    .add('sodium-javascript hash (prealloc)', {
      fn () {
        sodiumJS.crypto_hash(output512, data)
      }
    })
    // run async
    .run()

  return res
}

;(async () => {
  console.log('Warm up')
  await size('64 bytes', shortData)
  await size('384 bytes', mediumData)
  await size('4096 bytes', longData)
  await size('4 MB', megaData)

  console.log('Bench')
  await size('64 bytes', shortData)
  await size('384 bytes', mediumData)
  await size('4096 bytes', longData)
  await size('4 MB', megaData)
})()
