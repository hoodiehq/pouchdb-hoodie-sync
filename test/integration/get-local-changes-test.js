var test = require('tape')
var dbFactory = require('../utils/db')

test('api.getLocalChanges()', function (t) {
  t.plan(2)
  var localDb = dbFactory('localChangesDB1')
  var api = localDb.hoodieSync({remote: 'localChangesDB2'})

  var doc1 = {_id: 'test1', foo: 'bar1'}
  var doc2 = {_id: 'test2', foo: 'bar2'}

  localDb.put(doc1)

  .then(function () {
    return api.sync()
  })

  .then(function () {
    return localDb.put(doc2)
  })

  .then(function () {
    return api.getLocalChanges()
  })

  .then(function (docs) {
    t.equal(docs.length, 1, '1 local change')
    t.equal(docs[0].foo, 'bar2', 'changed properties')
  })

  .catch(t.error)
})
