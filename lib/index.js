const crypto = require('crypto')
const righto = require('righto')

const defaultConfig = {
  encoding: 'hex',
  digest: 'sha256',
  hashBytes: 32,
  saltBytes: 16,
  iterations: 372791
}

function hashPassword (password, config, callback) {
  if (arguments.length === 2) {
    callback = config
    config = defaultConfig
  }

  crypto.randomBytes(config.saltBytes, function (error, salt) {
    if (error) {
      return callback(error)
    }

    crypto.pbkdf2(password, salt, config.iterations, config.hashBytes, config.digest,
      function (error, hash) {
        if (error) {
          return callback(error)
        }

        const combined = Buffer.alloc(hash.length + salt.length + 8)

        combined.writeUInt32BE(salt.length, 0, true)
        combined.writeUInt32BE(config.iterations, 4, true)

        salt.copy(combined, 8)
        hash.copy(combined, salt.length + 8)
        callback(null, combined.toString(config.encoding))
      })
  })
}

function verifyPassword (password, combined, config, callback) {
  if (arguments.length === 3) {
    callback = config
    config = defaultConfig
  }

  combined = Buffer.from(combined, config.encoding)
  const saltBytes = combined.readUInt32BE(0)
  const hashBytes = combined.length - saltBytes - 8
  const iterations = combined.readUInt32BE(4)
  const salt = combined.slice(8, saltBytes + 8)
  const hash = combined.toString('binary', saltBytes + 8)

  crypto.pbkdf2(password, salt, iterations, hashBytes, config.digest, function (error, verify) {
    if (error) {
      return callback(error)
    }

    callback(null, verify.toString('binary') === hash)
  })
}

module.exports = {
  hash: (...args) => righto(hashPassword, ...args),
  verify: (...args) => righto(verifyPassword, ...args)
}
