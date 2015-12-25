var test = require('tape')
var dbFactory = require('../utils/db')
var uniqueName = require('../utils/unique-name.js')

/* create if db does not exist, ping if exists or created */
test('api.pull() creates 2 db`s and puts data in first, second remains empty', function (t) {
  t.plan(2)
  var db1 = dbFactory('pullDB1')
  var db2 = dbFactory('pullDB2')
  var remoteName = uniqueName('remote-pull')
  var api = db1.hoodieSync({remote: remoteName})

  db1.put({_id: 'test'})

  .then(function () {
    return api.pull()
  })

  .then(function () {
    return db2.info()
  })

  .then(function (info) {
    t.equal(info.db_name, 'pullDB2', 'remote db2 exists ')
  })

  .then(function () {
    return db1.info()
  })

  .then(function (info) {
    t.equal(info.doc_count, 1, 'remote db1 exists and 1 doc got added')
  })
})

test('api.pull()', function (t) {
  t.plan(2)
  var db3 = dbFactory('pullDB3')
  var db4 = dbFactory('pullDB4')
  var api = db3.hoodieSync({remote: 'pullDB4'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  db4.bulkDocs([obj1, obj2])

  .then(function () {
    api.pull() // empty
    .then(function (pulledObjects) {
      t.equal(pulledObjects.length, 2, '2 objects pulled')
      t.equal(pulledObjects[0]._id, 'test1', 'pulledObjects[0]._id match')
    })
  })
})

test('api.pull(string)', function (t) {
  t.plan(2)
  var db3 = dbFactory('pullDB5')
  var db4 = dbFactory('pullDB6')
  var api = db3.hoodieSync({remote: 'pullDB6'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  db4.bulkDocs([obj1, obj2])

  .then(function () {
    api.pull('test1') // string
    .then(function (pulledObjects) {
      t.equal(pulledObjects.length, 1, '1 object pulled')
      t.equal(pulledObjects[0]._id, 'test1', 'pulledObjects[0]._id match')
    })
  })
})

test('api.pull(objects)', function (t) {
  t.plan(3)
  var db3 = dbFactory('pullDB7')
  var db4 = dbFactory('pullDB8')
  var api = db3.hoodieSync({remote: 'pullDB8'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  var obj3 = {_id: 'test3', foo1: 'bar3'}
  db4.bulkDocs([obj1, obj2, obj3])

  .then(function () {
    api.pull([obj1, 'test2']) // objects
    .then(function (pulledObjects) {
      t.equal(pulledObjects.length, 2, '2 objects pulled')
      var ids = [
        pulledObjects[0]._id,
        pulledObjects[1]._id
      ].sort()
      t.equal(ids[0], 'test1', 'pulledObjects[0]._id match')
      t.equal(ids[1], 'test2', 'pulledObjects[1]._id match')
    })
  })
})

test('api.pull(object)', function (t) {
  t.plan(2)
  var db3 = dbFactory('pullDB9')
  var db4 = dbFactory('pullDB10')
  var api = db3.hoodieSync({remote: 'pullDB10'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  var obj3 = {_id: 'test3', foo1: 'bar3'}
  db4.bulkDocs([obj1, obj2, obj3])

  .then(function () {
    api.pull(obj3) // object
    .then(function (pulledObjects) {
      t.equal(pulledObjects.length, 1, '1 object pulled')
      t.equal(pulledObjects[0]._id, 'test3', 'pulledObjects[0]._id match')
    })
  })
})

test('api.pull("inexistentID")', function (t) {
  t.plan(1)
  var db11 = dbFactory('pullDB11')
  var remoteName = uniqueName('remote-pull')
  var api = db11.hoodieSync({remote: remoteName})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  var obj3 = {_id: 'test3', foo1: 'bar3'}
  db11.bulkDocs([obj1, obj2, obj3])

  .then(function () {
    api.pull('inexistentID') // string
    .then(function (pulledObjects) {
      t.equal(pulledObjects.length, 0, '0 objects pulled')
    })
  })
})

test('api.pull() when local / remote in sync', function (t) {
  t.plan(2)
  var db13 = dbFactory('pullDB13')
  var db14 = dbFactory('pullDB14')
  var api = db13.hoodieSync({remote: 'pullDB14'})

  db14.put({_id: 'test1', foo1: 'bar1'})

  .then(function () {
    api.pull()
    .then(function (pulledObjects) {
      t.equal(pulledObjects.length, 1, 'pulledObjects length is 1')
      return api.pull()
    })
    .then(function (pulledObjects) {
      t.equal(pulledObjects.length, 0, 'pulledObjects length is 0')
    })
  })
})

test('api.pull(reject)', function (t) {
  t.plan(2)
  var db15 = dbFactory('pullDB15')
  var db16 = dbFactory('pullDB16')
  var api = db15.hoodieSync({remote: 'pullDB16'})

  db16.put({_id: 'test1', foo1: 'bar1'})

  .then(function () {
    return api.pull({})
  })

  .catch(function (error) {
    t.pass(error.message)
  })
  .then(function () {
    return api.pull([1, 2, undefined])
  })
  .catch(function () {
    t.pass('One object within the array is undefined')
  })
})

test('api.push() error', function (t) {
  t.plan(1)
  var db17 = dbFactory('pullDB17')
  var db18 = dbFactory('pullDB18')
  var api = db17.hoodieSync({remote: 'pullDB18'})

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

  db18.bulkDocs([data, obj1])
  .then(function () {
    return api.pull(data)
  })
  .catch(function () {
    t.pass('The error event was fired!')
  })
})
