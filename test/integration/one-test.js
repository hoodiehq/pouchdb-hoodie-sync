var test = require('tape')
var dbFactory = require('../utils/db')

/* create if db does not exist, ping if exists or created */
test('api.one()', function (t) {
  t.plan(1)
  var db = dbFactory()
  var api = db.hoodieSync({remote: 'remote'})
  t.is(typeof api.one, 'function', 'has method')
})

test('api.one("push")', function (t) {
  t.plan(3)

  var db = dbFactory('onePushDB1')
  var remoteName = 'onePushDB1-remote'
  var api = db.hoodieSync({remote: remoteName})

  var pushEvents = []
  api.one('push', pushEvents.push.bind(pushEvents))

  var obj1 = {_id: 'test1', foo: 'bar1'}
  var obj2 = {_id: 'test2', foo: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    return api.push()
  })

  .then(function () {
    t.is(pushEvents.length, 1, 'triggers 1 push event')
    t.is(pushEvents[0].foo, 'bar1', 'event passes object')
  })

  .then(function () {
    return api.push()
  })

  .then(function () {
    t.is(pushEvents.length, 1, 'triggers no second push event')
  })
})

test('api.one("push") chained', function (t) {
  t.plan(4)

  var db = dbFactory('onePushChained')
  var remoteName = 'onePushChained-remote'
  var api = db.hoodieSync({remote: remoteName})

  var pushEvents = []
  var pushEvents2 = []
  api
    .one('push', pushEvents.push.bind(pushEvents))
    .one('push', pushEvents2.push.bind(pushEvents2))

  var obj1 = {_id: 'test1', foo: 'bar1'}
  var obj2 = {_id: 'test2', foo: 'bar2'}

  db.bulkDocs([obj1, obj2])

  .then(function () {
    return api.push()
  })

  .then(function () {
    t.is(pushEvents.length, 1, 'triggers 1 push event')
    t.is(pushEvents[0].foo, 'bar1', 'event passes object')
    t.is(pushEvents2.length, 1, 'triggers 1 push event')
    t.is(pushEvents2[0].foo, 'bar1', 'event passes object')
  })
})
