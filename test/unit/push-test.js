var simple = require('simple-mock')
var test = require('tape')

var push = require('../../lib/push')

test('push with ajaxOptions', function (t) {
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
      replicate: {
        to: simple.stub()
      }
    },
    ajaxOptions: {
      foo: 'bar'
    }
  }
  simple.mock(state.db.replicate, 'to').returnWith(syncApi)

  push(state)

  t.is(state.db.replicate.to.lastCall.args[1].ajax.foo, 'bar', 'calls api.sync with ajaxOptions')

  t.end()
})

test('push with ajaxOptions function', function (t) {
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
      replicate: {
        to: simple.stub()
      }
    },
    ajaxOptions: function () {
      return { foo: 'bar' }
    }
  }
  simple.mock(state.db.replicate, 'to').returnWith(syncApi)

  push(state)

  t.is(state.db.replicate.to.lastCall.args[1].ajax.foo, 'bar', 'calls api.sync with ajaxOptions')

  t.end()
})
