var test = require('tape')
var dbFactory = require('../utils/db')

/* create if db does not exist, ping if exists or created */
test('api.sync()', function (t) {
  t.plan(3)
  var db1 = dbFactory('syncDB1')
  var db2 = dbFactory('syncDB2')
  var api = db1.hoodieSync({remote: 'syncDB2'})

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}
  db1.bulkDocs([remoteObj1, remoteObj2])

  db2.put({_id: 'test3', foo1: 'bar3'})

  .then(function () {
    api.sync()
    .then(function (syncedObjects) {
      t.equal(syncedObjects.length, 3, '3 objects synced in db1 and db2')
    })
    .then(function () {
      return db1.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 3, '3 docs in db1')
    })
    .then(function () {
      return db2.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 3, '3 docs in db2')
    })
  })
})

test('api.sync()', function (t) {
  t.plan(7)
  var db3 = dbFactory('syncDB3')
  var db4 = dbFactory('syncDB4')
  var api = db3.hoodieSync({remote: 'syncDB4'})

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}
  db3.bulkDocs([remoteObj1, remoteObj2])

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}
  db4.bulkDocs([localObj1, localObj2])

  .then(function () {
    api.sync() // empty
    .then(function (syncedObjects) {
      t.equal(syncedObjects.length, 4, '4 objects synced in db3 and db4')
      var ids = [
        syncedObjects[0]._id,
        syncedObjects[1]._id,
        syncedObjects[2]._id,
        syncedObjects[3]._id
      ].sort()

      t.equal(ids[0], 'test1', 'syncedObjects[0]._id match')
      t.equal(ids[1], 'test2', 'syncedObjects[1]._id match')
      t.equal(ids[2], 'test3', 'syncedObjects[2]._id match')
      t.equal(ids[3], 'test4', 'syncedObjects[3]._id match')
    })
    .then(function () {
      return db3.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 4, '4 docs in db3')
    })
    .then(function () {
      return db4.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 4, '4 docs in db4')
    })
  })
})

test('api.sync(string)', function (t) {
  t.plan(4)
  var db5 = dbFactory('syncDB5')
  var db6 = dbFactory('syncDB6')
  var api = db5.hoodieSync({remote: 'syncDB6'})

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}
  db5.bulkDocs([remoteObj1, remoteObj2])

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}
  db6.bulkDocs([localObj1, localObj2])

  .then(function () {
    api.sync('test1') // string
    .then(function (syncedObjects) {
      t.equal(syncedObjects.length, 1, '1 object synced to db6')
      t.equal(syncedObjects[0]._id, 'test1', 'syncedObjects[0]._id match')
    })
    .then(function () {
      return db5.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 2, '2 docs in db5, like before sync')
    })
    .then(function () {
      return db6.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 3, '3 docs in db6, 1 obj from db5 got synced')
    })
  })
})

test('api.sync(objects)', function (t) {
  t.plan(5)
  var db7 = dbFactory('syncDB7')
  var db8 = dbFactory('syncDB8')
  var api = db7.hoodieSync({remote: 'syncDB8'})

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}
  db7.bulkDocs([remoteObj1, remoteObj2])

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}
  db8.bulkDocs([localObj1, localObj2])

  .then(function () {
    api.sync([remoteObj1, 'test3']) // objects
    .then(function (syncedObjects) {
      t.equal(syncedObjects.length, 2, '2 objects synced')
      var ids = [
        syncedObjects[0]._id,
        syncedObjects[1]._id
      ].sort()

      t.equal(ids[0], 'test1', 'syncedObjects[0]._id match')
      t.equal(ids[1], 'test3', 'syncedObjects[1]._id match')
    })
    .then(function () {
      return db7.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 3, '3 docs in db7, like before sync')
    })
    .then(function () {
      return db8.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 3, '2 docs in db8, 1 obj from db8 got synced')
    })
  })
})

test('api.sync(object)', function (t) {
  t.plan(4)
  var db9 = dbFactory('syncDB9')
  var db10 = dbFactory('syncDB10')
  var api = db9.hoodieSync({remote: 'syncDB10'})

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}
  db9.bulkDocs([remoteObj1, remoteObj2])

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}
  db10.bulkDocs([localObj1, localObj2])

  .then(function () {
    api.sync(remoteObj2) // object
    .then(function (syncedObjects) {
      t.equal(syncedObjects.length, 1, '1 object synced')
      t.equal(syncedObjects[0]._id, 'test2', 'syncedObjects[0]._id match')
    })
    .then(function () {
      return db9.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 2, '2 docs in db9, like before sync')
    })
    .then(function () {
      return db10.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 3, '3 docs in db10, 1 obj from db9 got synced')
    })
  })
})

test('api.sync("inexistentID")', function (t) {
  t.plan(3)
  var db11 = dbFactory('syncDB11')
  var db12 = dbFactory('syncDB12')
  var api = db11.hoodieSync({remote: 'syncDB12'})

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}
  db11.bulkDocs([remoteObj1, remoteObj2])

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}
  db12.bulkDocs([localObj1, localObj2])

  .then(function () {
    api.sync('inexistentID') // string
    .then(function (syncedObjects) {
      t.equal(syncedObjects.length, 0, '0 object synced to db11, object not found')
    })
    .then(function () {
      return db11.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 2, '2 docs in db11, like before sync')
    })
    .then(function () {
      return db12.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 2, '3 docs in db12, like before sync')
    })
  })
})

test('api.sync(), when local / remote in sync', function (t) {
  t.plan(8)
  var db13 = dbFactory('syncDB13')
  var db14 = dbFactory('syncDB14')
  var api = db13.hoodieSync({remote: 'syncDB14'})

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}
  db13.bulkDocs([remoteObj1, remoteObj2])

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}
  db14.bulkDocs([localObj1, localObj2])

  .then(function () {
    api.sync()
    .then(function (syncedObjects) {
      t.equal(syncedObjects.length, 4, '4 objects synced to db13 / db14')
      var ids = [
        syncedObjects[0]._id,
        syncedObjects[1]._id,
        syncedObjects[2]._id,
        syncedObjects[3]._id
      ].sort()

      t.equal(ids[0], 'test1', 'syncedObjects[0]._id match')
      t.equal(ids[1], 'test2', 'syncedObjects[1]._id match')
      t.equal(ids[2], 'test3', 'syncedObjects[2]._id match')
      t.equal(ids[3], 'test4', 'syncedObjects[3]._id match')
      return api.sync()
    })
    .then(function (syncedObjects) {
      t.equal(syncedObjects.length, 0, '0 object synced')
    })
    .then(function () {
      return db13.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 4, '4 docs in db13')
    })
    .then(function () {
      return db14.info()
    })
    .then(function (info) {
      t.equal(info.doc_count, 4, '4 docs in db14')
    })
  })
})

test('api.sync(reject)', function (t) {
  t.plan(2)
  var db15 = dbFactory('syncDB15')
  var db16 = dbFactory('syncDB16')
  var api = db15.hoodieSync({remote: 'syncDB16'})

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}
  db15.bulkDocs([remoteObj1, remoteObj2])

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}
  db16.bulkDocs([localObj1, localObj2])

  .then(function () {
    return api.sync({})
  })
  .catch(function (error) {
    t.pass(error.message)
  })

  .then(function () {
    return api.sync([1, 2, undefined])
  })
  .catch(function () {
    t.pass('One object within the array is undefined')
  })
})

test('api.sync(error)', function (t) {
  t.plan(1)
  var db17 = dbFactory('syncDB17')
  var db18 = dbFactory('syncDB18')
  var api = db17.hoodieSync({remote: 'syncDB18'})

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

  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}

  db17.bulkDocs([remoteObj1, remoteObj2, data])

  .then(function () {
    return db18.bulkDocs([localObj1, localObj2])
  })

  .then(function () {
    return api.sync(data)
  })

  .catch(function () {
    t.pass('The error event was fired!')
  })
})

test('api.sync()', function (t) {
  t.plan(1)

  var db19 = dbFactory('syncDB19')
  var db20 = dbFactory('syncDB20')
  var api = db19.hoodieSync({remote: 'syncDB20'})

  db20.put({_id: 'test1', foo1: 'bar1'})

  .then(function () {
    return api.sync({id: 'test1'})
  })

  .then(function (syncedObjects) {
    t.equal(syncedObjects.length, 1, 'object with .id synced successfully')
  })
})
