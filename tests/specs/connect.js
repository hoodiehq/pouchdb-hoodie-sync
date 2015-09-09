var PouchDB = require('pouchdb')
var test = require('tape')

var dbFactory = require('../utils/db')
var waitFor = require('../utils/wait-for')

var connect = require('../../lib/connect')

/* create if db does not exist, ping if exists or created */
test('api.connect()', function (t) {
  t.plan(1)
  var db1 = dbFactory('connectDB1')
  var api = db1.hoodieSync({remote: 'connectDB2'})

  api.connect().then(function () {
    t.pass('connection is open')
  })

  .catch(t.fail)
})

test('api.connect() syncs docs', function (t) {
  t.plan(2)
  var db1 = dbFactory('connectDB1')
  var db2 = dbFactory('connectDB2')
  var api = db1.hoodieSync({remote: db2})

  var pullEvents = []
  var pushEvents = []
  api.on('pull', pullEvents.push.bind(pullEvents))
  api.on('push', pushEvents.push.bind(pushEvents))

  return api.connect()

  .then(function () {
    db1.put({_id: 'a'})
  })

  .then(waitFor(function () {
    // I think 1 should be correct here, see
    // https://github.com/pouchdb/pouchdb/issues/4293
    return pushEvents.length >= 1
  }, true))

  .then(function () {
    db2.put({_id: 'b'})
  })

  .then(waitFor(function () {
    return pullEvents.length >= 1
  }, true))

  .then(function () {
    t.ok(pullEvents.length, 'triggers pull event')
    t.ok(pushEvents.length, 'triggers push event')
  })

  .catch(t.fail)
})

test('connect options', function (t) {
  var errorEvents = []
  var state = {
    emitter: {
      emit: function (event) {
        if (event === 'error') {
          errorEvents.push(arguments)
        }
      }
    }
  }
  var syncArgs
  connect.bind({
    constructor: PouchDB,
    sync: function () {
      syncArgs = arguments
      return {
        on: function (event, callback) {
          if (event === 'error') {
            callback('foo')
          }
        }
      }
    }
  })(state, {remote: 'remoteDb'})

  t.is(syncArgs[0], 'remoteDb', 'calls api.sync with "remoteDb"')
  t.is(syncArgs[1].live, true, 'calls api.sync with live: true')
  t.is(syncArgs[1].retry, true, 'calls api.sync with retry: true')
  t.is(syncArgs[1].create_target, true, 'calls api.sync with create_target: true')
  t.is(errorEvents.length, 1, 'listens to error event')
  t.is(errorEvents[0][1], 'foo', 'emits error on API')
  t.end()
})
