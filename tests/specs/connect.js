var PouchDB = require('pouchdb')
var test = require('tape')

var dbFactory = require('../utils/db')
var connect = require('../../lib/connect')

/* create if db does not exist, ping if exists or created */
test('api.connect()', function (t) {
  t.plan(1)
  var db1 = dbFactory('connectDB1')
  var api = db1.hoodieSync({remote: 'connectDB2'})

  api.connect().then(function () {
    t.pass('connection is open')
  })
})

test('connect options', function (t) {
  var state = {
    emitter: {
      emit: function () {}
    }
  }
  var syncArgs
  connect.bind({
    constructor: PouchDB,
    sync: function () {
      syncArgs = arguments
      return {
        on: function () {}
      }
    }
  })(state, {remote: 'remoteDb'})

  t.is(syncArgs[0], 'remoteDb', 'calls api.sync with "remoteDb"')
  t.is(syncArgs[1].live, true, 'calls api.sync with live: true')
  t.is(syncArgs[1].retry, true, 'calls api.sync with retry: true')
  t.is(syncArgs[1].create_target, true, 'calls api.sync with create_target: true')
  t.is(syncArgs[1].since, 'now', 'calls api.sync with since: "now"')
  t.end()
})
