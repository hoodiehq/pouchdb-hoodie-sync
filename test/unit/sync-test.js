var simple = require('simple-mock')
var test = require('tape')

var sync = require('../../lib/sync')

test('sync with ajaxOptions', function (t) {
  var syncApi = {
    on: simple.stub(),
    catch: simple.stub()
  }
  var state = {
    emitter: {
      emit: simple.stub()
    },
    remote: 'remoteDb',
    db: {
      sync: simple.stub()
    },
    ajaxOptions: {
      foo: 'bar'
    }
  }
  simple.mock(state.db, 'sync').returnWith(syncApi)

  sync(state)

  t.is(state.db.sync.lastCall.args[1].ajax.foo, 'bar', 'calls api.sync with ajaxOptions')

  t.end()
})

test('sync with ajaxOptions function', function (t) {
  var syncApi = {
    on: simple.stub(),
    catch: simple.stub()
  }
  var state = {
    emitter: {
      emit: simple.stub()
    },
    remote: 'remoteDb',
    db: {
      sync: simple.stub()
    },
    ajaxOptions: function () {
      return { foo: 'bar' }
    }
  }
  simple.mock(state.db, 'sync').returnWith(syncApi)

  sync(state)

  t.is(state.db.sync.lastCall.args[1].ajax.foo, 'bar', 'calls api.sync with ajaxOptions')

  t.end()
})
