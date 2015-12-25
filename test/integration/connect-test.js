var test = require('tape')

var dbFactory = require('../utils/db')
var waitFor = require('../utils/wait-for')

/* create if db does not exist, ping if exists or created */
test('api.connect()', function (t) {
  t.plan(1)
  var db1 = dbFactory('connectDB1')
  var api = db1.hoodieSync({remote: 'connectDB2'})

  api.connect().then(function () {
    t.pass('connection is open')
  })

  .catch(t.error)
})

test('api.connect() syncs docs', function (t) {
  t.plan(2)
  var db1 = dbFactory('connectDBx1')
  var db2 = dbFactory('connectDBx2')
  var api = db1.hoodieSync({remote: db2})

  var pullEvents = []
  var pushEvents = []
  api.on('pull', pullEvents.push.bind(pullEvents))
  api.on('push', pushEvents.push.bind(pushEvents))

  return api.connect()

  .then(function () {
    return db1.put({_id: 'a'})
  })

  .then(waitFor(function () {
    // I think 1 should be correct here, see
    // https://github.com/pouchdb/pouchdb/issues/4293
    return pushEvents.length >= 1
  }, true))

  .then(function () {
    return db2.put({_id: 'b'})
  })

  .then(waitFor(function () {
    return pullEvents.length >= 1
  }, true))

  .then(function () {
    t.ok(pullEvents.length, 'triggers pull event')
    t.ok(pushEvents.length, 'triggers push event')
  })

  .catch(t.error)
})
