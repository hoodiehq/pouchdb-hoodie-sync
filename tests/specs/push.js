var test = require('tape')
var dbFactory = require('../utils/db')

test('sync creates new db', function (t) {
  t.plan(1)
  var db = dbFactory()
  var PouchDB = db.constructor
  var remoteName = PouchDB.utils.uuid(10)
  var api = db.hoodieSync({remote: remoteName})

  db.put({_id: 'test'})

  .then(function () {
    return api.push()
  })

  .then(function () {
    return new PouchDB(remoteName).info()
  })

  .then(function (info) {
    t.is(info.db_name, remoteName, 'remote db exists')
  })
})
