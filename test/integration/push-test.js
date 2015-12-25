var test = require('tape')
var dbFactory = require('../utils/db')
var uniqueName = require('../utils/unique-name.js')

/* create if db does not exist, ping if exists or created */
test('api.push() creates new db', function (t) {
  t.plan(1)
  var db = dbFactory()
  var remoteName = uniqueName('remote-push')
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
  t.plan(2)
  var db = dbFactory('hoodieDB2')
  var remoteName = uniqueName('remote-push')
  var api = db.hoodieSync({remote: remoteName})

  db.put({_id: 'test1', foo1: 'bar1'})

  .then(function () {
    api.push() // leer
    .then(function (pushedObjects) {
      t.equal(pushedObjects.length, 1, 'pushedObjects length is 1')
      t.equal(pushedObjects[0]._id, 'test1', 'pushedObjects[0]._id match')
    })
  })
})

test('api.push(string)', function (t) {
  t.plan(2)
  var db = dbFactory('hoodieDB3')
  var remoteName = uniqueName('remote-push')
  var api = db.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    api.push('test1') // string
    .then(function (pushedObjects) {
      t.equal(pushedObjects.length, 1, '1 object pushed')
      t.equal(pushedObjects[0]._id, 'test1', 'pushedObjects[0]._id match')
    })
  })
})

test('api.push(objects)', function (t) {
  t.plan(3)
  var db = dbFactory('hoodieDB4')
  var remoteName = uniqueName('remote-push')
  var api = db.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  var obj3 = {_id: 'test3', foo1: 'bar3'}
  db.bulkDocs([obj1, obj2, obj3])

  .then(function () {
    api.push([obj1, 'test2']) // array
    .then(function (pushedObjects) {
      t.equal(pushedObjects.length, 2, '2 objects pushed')
      var ids = [
        pushedObjects[0]._id,
        pushedObjects[1]._id
      ].sort()
      t.equal(ids[0], 'test1', 'pushedObjects[0]._id match')
      t.equal(ids[1], 'test2', 'pushedObjects[1]._id match')
    })
  })
})

test('api.push(object)', function (t) {
  t.plan(2)
  var db = dbFactory('hoodieDB5')
  var remoteName = uniqueName('remote-push')
  var api = db.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    api.push(obj1) // object
    .then(function (pushedObjects) {
      t.equal(pushedObjects.length, 1, '1 object pushed')
      t.equal(pushedObjects[0]._id, 'test1', 'pushedObjects[0]._id match')
    })
  })
})

test('api.push("inexistentID")', function (t) {
  t.plan(1)
  var db = dbFactory('hoodieDB6')
  var remoteName = uniqueName('remote-push')
  var api = db.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    api.push('inexistentID') // string
    .then(function (pushedObjects) {
      t.equal(pushedObjects.length, 0, '0 objects pushed')
    })
  })
})

test('api.push() when local / remote in sync', function (t) {
  t.plan(2)
  var db = dbFactory('hoodieDB7')
  var remoteName = uniqueName('remote-push')
  var api = db.hoodieSync({remote: remoteName})

  db.put({_id: 'test1', foo1: 'bar1'})

  .then(function () {
    api.push()
    .then(function (pushedObjects) {
      t.equal(pushedObjects.length, 1, 'pushedObjects length is 1')
      return api.push()
    })
    .then(function (pushedObjects) {
      t.equal(pushedObjects.length, 0, 'pushedObjects length is 0')
    })
  })
})

test('api.push({}) rejects', function (t) {
  t.plan(2)
  var db = dbFactory('hoodieDB8')
  var remoteName = uniqueName('remote-push')
  var api = db.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    return api.push({})
  })

  .catch(function (error) {
    t.pass(error.message)
  })
  .then(function () {
    return api.push([1, 2, undefined])
  })
  .catch(function () {
    t.pass('One object within the array is undefined')
  })
})

test('api.push() error', function (t) {
  t.plan(1)
  var db = dbFactory('hoodieDB8')
  var remoteName = uniqueName('remote-push')
  var api = db.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}

  var first = true
  var data = {
    get _id () {
      if (first) {
        first = false
        return 'test1'
      } else {
        return {}
      }
    },
    foo: 'bar'
  }

  db.bulkDocs([data, obj1])
  .then(function () {
    return api.push(data)
  })
  .catch(function () {
    t.pass('The error event was fired!')
  })
})
