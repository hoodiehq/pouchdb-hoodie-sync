var test = require('tape')
var dbFactory = require('../utils/db')
var EventEmitter = require('events').EventEmitter

test('db.hoodieSync(options) returns sync api', function (t) {
  var db = dbFactory()
  var api = db.hoodieSync({remote: 'foo'})

  t.is(typeof api.connect, 'function', 'returns api.connect')
  t.is(typeof api.disconnect, 'function', 'returns api.disconnect')
  t.is(typeof api.isConnected, 'function', 'returns api.isConnected')
  t.is(typeof api.pull, 'function', 'returns api.pull')
  t.is(typeof api.push, 'function', 'returns api.push')
  t.is(typeof api.sync, 'function', 'returns api.sync')
  t.is(typeof api.changeRemote, 'function', 'returns api.changeRemote')
  t.is(typeof api.on, 'function', 'returns api.on')
  t.is(typeof api.one, 'function', 'returns api.one')
  t.is(typeof api.off, 'function', 'returns api.off')
  t.is(api.db, db, 'exposes db')

  t.end()
})

test('db.hoodiesync(options)', function (t) {
  var db = dbFactory()
  t.throws(db.hoodieSync, 'Throws if no options passed')
  t.throws(db.hoodieSync.bind(db, {}), 'Throws if no options.remote passed')

  t.end()
})

test('db.hoodiesync("http://localhost:5984")', function (t) {
  var db = dbFactory()
  t.doesNotThrow(db.hoodieSync.bind(db, 'http://localhost:5984'), 'takes string')

  t.end()
})

test('db.hoodieSync({remote, emitter})', function (t) {
  var db = dbFactory()
  var emitter = new EventEmitter()
  var store = db.hoodieSync({
    remote: 'http://localhost:5984',
    emitter: emitter
  })

  store.on('foo', function () {
    t.ok('emitter used from options')
  })
  emitter.emit('foo')

  t.end()
})
