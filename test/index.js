const test = require('tape')
const righto = require('righto')
righto._debug = true;
righto._autotraceOnError = true;

const passwordHash = require('../lib')

test('password hash with config', async t => {
  t.plan(3)

  const config = {
    encoding: 'hex',
    digest: 'sha512',
    hashBytes: 64,
    saltBytes: 32,
    iterations: 30000
  }

  const password = passwordHash.hash('test-password', config)
  const equality = passwordHash.verify('test-password', password, config)

  const results = righto.mate(password, equality)

  results(function(error, password, equality){
    t.notOk(error)
    t.ok(password.startsWith('0000002'))
    t.ok(equality)
  })
})

test('promises - password hash with config', async t => {
  t.plan(2)

  const config = {
    encoding: 'hex',
    digest: 'sha512',
    hashBytes: 64,
    saltBytes: 32,
    iterations: 30000
  }

  const password = await passwordHash.hash('test-password', config)
  const equality = await passwordHash.verify('test-password', password, config)

  t.ok(password.startsWith('0000002'))
  t.ok(equality)
})

test('promises - password hash', async t => {
  t.plan(1)

  const password = await passwordHash.hash('test-password')

  t.ok(password.startsWith('0000001'))
})

test('promises - password verify correct', async t => {
  t.plan(1)

  const password = await passwordHash.hash('test-password')
  const equality = await passwordHash.verify('test-password', password)

  t.ok(equality)
})

test('promises - password verify incorrect', async t => {
  t.plan(1)


  const password = await passwordHash.hash('test-password')
  const equality = await passwordHash.verify('wrong-test-password', password)

  t.notOk(equality)
})
