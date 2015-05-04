var test = require('tape')
var dbFactory = require('../utils/db')

/* create if db does not exist, ping if exists or created */
test('api.push() creates new db', function (t) {
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
    return dbFactory(remoteName).info()
  })

  .then(function (info) {
    t.equal(info.db_name, remoteName, 'remote db exists ')
  })
})

test('api.push()', function (t) {
  t.plan(1)
  var db = dbFactory('hoodieDB2')
  var PouchDB = db.constructor
  var remoteName = PouchDB.utils.uuid(10)
  var api = db.hoodieSync({remote: remoteName})

  db.put({_id: 'test1', foo1: 'bar1'})

  .then(function () {
    api.push() // leer
    .then(function (obj) {
      t.equal(obj.length, 1, 'no param: pushed obj length is 1')
    })
  })
})

test('api.push(string)', function (t) {
  t.plan(1)
  var db = dbFactory('hoodieDB3')
  var PouchDB = db.constructor
  var remoteName = PouchDB.utils.uuid(10)
  var api = db.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    api.push('test1') // string
    .then(function (obj) {
      t.equal(obj.length, 1, '1 object pushed')
    })
  })
})

test('api.push(objects)', function (t) {
  t.plan(1)
  var db = dbFactory('hoodieDB4')
  var PouchDB = db.constructor
  var remoteName = PouchDB.utils.uuid(10)
  var api = db.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  var obj3 = {_id: 'test3', foo1: 'bar3'}
  // var pushobj = (obj1, obj2)
  db.bulkDocs([obj1, obj2, obj3])

  .then(function () {
    api.push([obj1, 'test2']) // array
    .then(function (pushedObjects) {
      t.equal(pushedObjects.length, 2, '2 objects pushed')
    })
  })
})
