var test = require('tape')
var dbFactory = require('../utils/db')

/* create if db does not exist, ping if exists or created */
test('api.off()', function (t) {
  t.plan(1)
  var db = dbFactory()
  var api = db.hoodieSync({remote: 'remote'})
  t.is(typeof api.off, 'function', 'has method')
})

test('api.off("push")', function (t) {
  t.plan(2)

  var db = dbFactory('off-1')
  var remoteName = 'off-1-remote'
  var api = db.hoodieSync({remote: remoteName})

  var pushEvents = []
  api.on('push', pushHandler)
  function pushHandler (doc) {
    pushEvents.push(doc)
  }

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    return api.push('test2')
  })

  .then(function () {
    t.is(pushEvents.length, 1, 'triggers 1 push event')

    api.off('push', pushHandler)
    return api.push('test1')
  })

  .then(function () {
    t.is(pushEvents.length, 1, 'push event was removed')
  })
})

test('api.off("push"), 2 handlers, passing 1, removing 1', function (t) {
  t.plan(2)

  var db = dbFactory('off-2')
  var remoteName = 'off-2-remote'
  var api = db.hoodieSync({remote: remoteName})

  var pushEvents1 = []
  api.on('push', pushHandler1)
  function pushHandler1 (doc) {
    pushEvents1.push(doc)
  }

  var pushEvents2 = []
  api.on('push', pushHandler2)
  function pushHandler2 (doc) {
    pushEvents2.push(doc)
  }

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    return api.push('test2')
  })

  .then(function () {
    t.is(pushEvents1.length, 1, 'triggers 1 push event')

    api.off('push', pushHandler1)
    return api.push('test1')
  })

  .then(function () {
    t.is(pushEvents1.length, 1, 'push event was removed')
  })
})

test('api.off("push"), 2 handlers, removing all', function (t) {
  t.plan(2)

  var db = dbFactory('off-3')
  var remoteName = 'off-3-remote'
  var api = db.hoodieSync({remote: remoteName})

  var pushEvents1 = []
  var pushEvents2 = []

  api
    .on('push', pushHandler1)
    .on('push', pushHandler2)
    .off('push')

  function pushHandler1 (doc) {
    pushEvents1.push(doc)
  }
  function pushHandler2 (doc) {
    pushEvents2.push(doc)
  }

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    return api.push('test2')
  })

  .then(function () {
    t.is(pushEvents1.length, 0, 'all push events were removed')
    t.is(pushEvents2.length, 0, 'all push events were removed')
  })
})
