var test = require('tape')
var dbFactory = require('../utils/db')

/* create if db does not exist, ping if exists or created */
test('api.disconnect()', function (t) {
  t.plan(1)
  var db1 = dbFactory('disconnectDB1')
  var api = db1.hoodieSync({remote: 'disconnectDB2'})

  api.disconnect().then(function () {
    t.pass('connection is closed')
  })
})

test('api.disconnect() after connected', function (t) {
  t.plan(1)
  var db1 = dbFactory('disconnectDB3')
  var api = db1.hoodieSync({remote: 'disconnectDB4'})

  api.connect().then(api.disconnect)
  .then(function () {
    t.pass('connection is closed after opening connection')
  })
})
