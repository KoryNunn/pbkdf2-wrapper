const crypto = require('crypto')
const righto = require('righto')

const defaultConfig = {
  encoding: 'hex',
  digest: 'sha256',
  hashBytes: 32,
  saltBytes: 16,
  iterations: 372791
}

function generateHash(config, hash, salt) {
  const combined = Buffer.alloc(hash.length + salt.length + 8)

  combined.writeUInt32BE(salt.length, 0, true)
  combined.writeUInt32BE(config.iterations, 4, true)

  salt.copy(combined, 8)
  hash.copy(combined, salt.length + 8)

  return combined.toString(config.encoding)
}

function hashPassword (password, config, callback) {
  if (arguments.length === 2) {
    callback = config
    config = defaultConfig
  }

  const salt = righto(crypto.randomBytes, config.saltBytes)
  const hash = righto(crypto.pbkdf2, password, salt, config.iterations, config.hashBytes, config.digest);
  const hashedPassword = righto.sync(generateHash, config, hash, salt)

  hashedPassword(callback)
}

function checkHash(verifyHash, hash){
  return verifyHash.toString('binary') === hash
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

  const verifyHash = righto(crypto.pbkdf2, password, salt, iterations, hashBytes, config.digest)
  const verified = righto.sync(checkHash, verifyHash, hash)

  verified(callback)
}

module.exports = {
  hash: (...args) => righto(hashPassword, ...args),
  verify: (...args) => righto(verifyPassword, ...args)
}
