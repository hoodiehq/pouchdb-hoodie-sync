var test = require('tape')
var dbFactory = require('../utils/db')
var waitFor = require('../utils/wait-for')

test('api.on()', function (t) {
  t.plan(1)
  var db = dbFactory()
  var api = db.hoodieSync({remote: 'remote'})
  t.is(typeof api.on, 'function', 'has method')
})

test('api.on("push") for api.push()', function (t) {
  t.plan(2)

  var db = dbFactory('on-1')
  var api = db.hoodieSync({remote: 'on-1-remote'})

  var pushEvents = []
  api.on('push', pushEvents.push.bind(pushEvents))

  db.put({_id: 'test', foo: 'bar'})

  .then(function () {
    return api.push()
  })

  .then(function () {
    t.is(pushEvents.length, 1, 'triggers 1 push event')
    t.is(pushEvents[0].foo, 'bar', 'event passes object')
  })
})

test('api.on("push") for api.pull()', function (t) {
  t.plan(1)

  var db1 = dbFactory('on-2')
  var db2 = dbFactory('on-2-remote')
  var api = db1.hoodieSync({remote: 'on-2-remote'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  var pushEvents = []
  api.on('push', pushEvents.push.bind(pushEvents))

  db2.bulkDocs([obj1, obj2])

  .then(function () {
    return api.pull()
  })

  .then(function () {
    t.is(pushEvents.length, 0, 'triggers no push events')
  })
})

test('api.on("pull") for api.pull()', function (t) {
  t.plan(3)

  var db1 = dbFactory('on-3')
  var db2 = dbFactory('on-3-remote')
  var api = db1.hoodieSync({remote: 'on-3-remote'})

  var obj1 = {_id: 'test1', foo: 'bar1'}
  var obj2 = {_id: 'test2', foo: 'bar2'}

  var pullEvents = []
  api.on('pull', pullEvents.push.bind(pullEvents))

  db2.bulkDocs([obj1, obj2])

  .then(function () {
    return api.pull()
  })

  .then(function () {
    t.is(pullEvents.length, 2, 'triggers pull event twice')
    var foo = [
      pullEvents[0].foo,
      pullEvents[1].foo
    ].sort()
    t.is(foo[0], 'bar1', 'event passes object1')
    t.is(foo[1], 'bar2', 'event passes object2')
  })
})

test('api.on("pull") for api.push()', function (t) {
  t.plan(1)

  var db = dbFactory('on-4')
  var api = db.hoodieSync({remote: 'on-4-remote'})

  var pullEvents = []
  api.on('pull', pullEvents.push.bind(pullEvents))

  db.put({_id: 'test', foo: 'bar'})

  .then(function () {
    return api.push()
  })

  .then(function () {
    t.is(pullEvents.length, 0, 'triggers no pull events')
  })
})

test('api.on("pull") / api.on("push") for api.sync()', function (t) {
  t.plan(5)
  var db1 = dbFactory('on-5')
  var db2 = dbFactory('on-5-remote')
  var api = db1.hoodieSync({remote: 'on-5-remote'})
  var Promise = db1.constructor.utils.Promise

  var pushEvents = []
  var pullEvents = []
  api
    .on('push', pushEvents.push.bind(pushEvents))
    .on('pull', pullEvents.push.bind(pullEvents))

  var localObj1 = {_id: 'test3', foo1: 'bar3'}
  var localObj2 = {_id: 'test4', foo1: 'bar4'}
  var remoteObj1 = {_id: 'test1', foo1: 'bar1'}
  var remoteObj2 = {_id: 'test2', foo1: 'bar2'}

  Promise.all([
    db1.bulkDocs([localObj1, localObj2]),
    db2.bulkDocs([remoteObj1, remoteObj2])
  ])

  .then(function () {
    return api.sync()
  })

  .then(function (syncedObjects) {
    t.is(pushEvents.length, 2, 'triggers push event twice')
    t.is(pullEvents.length, 2, 'triggers pull event twice')
    t.is(syncedObjects.length, 4, 'syncedObjects length is 4')

    return Promise.all([
      db1.info(),
      db2.info()
    ])
  })

  .then(function (info) {
    t.equal(info[0].doc_count, 4, '4 docs in db1')
    t.equal(info[1].doc_count, 4, '4 docs in db2')
  })
})

test('api.on("push") after api.push()', function (t) {
  t.plan(2)

  var db = dbFactory('on-6')
  var api = db.hoodieSync({remote: 'on-6-remote'})
  var pushEvents = []

  db.bulkDocs([
    {_id: 'test1'},
    {_id: 'test2'}
  ])

  .then(function () {
    return api.push('test1')
  })

  .then(function () {
    api.on('push', pushEvents.push.bind(pushEvents))

    return api.push('test2')
  })

  .then(waitFor(function () {
    return pushEvents.length
  }, 1))

  .then(function (info) {
    t.is(pushEvents.length, 1, 'triggers 1 push event')
    t.is(pushEvents[0]._id, 'test2')
  })
})

test('api.on("pull") after api.pull()', function (t) {
  t.plan(2)

  var db = dbFactory('on-7')
  var remoteDb = dbFactory('on-7-remote')
  var api = db.hoodieSync({remote: 'on-7-remote'})
  var pullEvents = []

  remoteDb.bulkDocs([
    {_id: 'test1', foo: 'bar1'},
    {_id: 'test2', foo: 'bar2'}
  ])

  .then(function () {
    return api.pull('test1')
  })

  .then(function () {
    api.on('pull', pullEvents.push.bind(pullEvents))

    return api.pull('test2')
  })

  .then(waitFor(function () {
    return pullEvents.length
  }, 1))

  .then(function () {
    t.is(pullEvents.length, 1, 'triggers 1 push event')
    t.is(pullEvents[0].foo, 'bar2', 'triggers for right object')
  })
})

test('api.on("connect") for api.connect()', function (t) {
  t.plan(1)

  var db = dbFactory('on-8')
  var api = db.hoodieSync({remote: 'on-8-remote'})

  var numConnectEvents = 0
  api.on('connect', function () {
    numConnectEvents += 1
  })

  api.connect()

  .then(function () {
    t.is(numConnectEvents, 1)
  })
})

test('api.on("connect") for multiple api.connect() calls', function (t) {
  t.plan(1)

  var db = dbFactory('on-8')
  var api = db.hoodieSync({remote: 'on-8-remote'})

  var numConnectEvents = 0
  api.on('connect', function () {
    numConnectEvents += 1
  })

  api.connect()
  api.connect()

  .then(function () {
    t.is(numConnectEvents, 1)
  })
})

test('api.on("disconnect") for api.disconnect()', function (t) {
  t.plan(1)

  var db = dbFactory('on-8')
  var api = db.hoodieSync({remote: 'on-8-remote'})

  var numDisconnectEvents = 0
  api.on('disconnect', function () {
    numDisconnectEvents += 1
  })

  api.disconnect()

  .then(function () {
    t.is(numDisconnectEvents, 0)
  })
})

test('api.on("disconnect") for api.disconnect() after api.connect()', function (t) {
  t.plan(1)

  var db = dbFactory('on-8')
  var api = db.hoodieSync({remote: 'on-8-remote'})

  var numDisconnectEvents = 0
  api.on('disconnect', function () {
    numDisconnectEvents += 1
  })

  api.connect()

  .then(api.disconnect)

  .then(function () {
    t.is(numDisconnectEvents, 1)
  })
})
