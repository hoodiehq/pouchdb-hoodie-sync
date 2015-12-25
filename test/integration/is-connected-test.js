var test = require('tape')
var dbFactory = require('../utils/db')

/* create if db does not exist, ping if exists or created */
test('api.isConnected()', function (t) {
  t.plan(1)
  var db1 = dbFactory('isConnectedDB1')
  var api = db1.hoodieSync({remote: 'isConnectedDB2'})

  t.equal(api.isConnected(), false, 'connection is closed')
})

test('api.isConnected() after connected', function (t) {
  t.plan(1)
  var db2 = dbFactory('isConnectedDB3')
  var api = db2.hoodieSync({remote: 'isConnectedDB4'})

  api.connect().then(function () {
    t.equal(api.isConnected(), true, 'connection is opened')
  })
})

test('api.isConnected() after disconnected', function (t) {
  t.plan(1)
  var db3 = dbFactory('isConnectedDB5')
  var api = db3.hoodieSync({remote: 'isConnectedDB6'})

  api.disconnect().then(function () {
    t.equal(api.isConnected(), false, 'connection is closed')
  })
})
