var test = require('tape')
var dbFactory = require('../utils/db')

/* create if db does not exist, ping if exists or created */
test('api.connect()', function (t) {
  t.plan(1)
  var db1 = dbFactory('connectDB1')
  var api = db1.hoodieSync({remote: 'connectDB2'})

  api.connect().then(function () {
    t.pass('connection is open')
  })
})
