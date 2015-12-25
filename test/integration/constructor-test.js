var test = require('tape')
var dbFactory = require('../utils/db')
var EventEmitter = require('events').EventEmitter

test('throws if no options or no options.remote passed', function (t) {
  var db = dbFactory()
  t.throws(db.hoodieSync, 'Throws if no options passed')
  t.throws(db.hoodieSync.bind(db, {}), 'Throws if no options.remote passed')

  t.end()
})

test('returns hoodie.store-inspired sync API', function (t) {
  var db = dbFactory()

  t.is(typeof db.hoodieSync, 'function', 'exposes plugin initialisation method')

  var store = db.hoodieSync({
    remote: 'http://localhost:5984'
  })

  t.is(typeof store, 'object', 'is object')
  t.is(store.db, db, 'exposes db')

  t.end()
})

test('creates store with custom EventEmitter instance', function (t) {
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
