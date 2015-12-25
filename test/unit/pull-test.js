var simple = require('simple-mock')
var test = require('tape')

var pull = require('../../lib/pull')

test('pull with ajaxOptions', function (t) {
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
        from: simple.stub()
      }
    },
    ajaxOptions: {
      foo: 'bar'
    }
  }
  simple.mock(state.db.replicate, 'from').returnWith(syncApi)

  pull(state)

  t.is(state.db.replicate.from.lastCall.args[1].ajax.foo, 'bar', 'calls api.sync with ajaxOptions')

  t.end()
})

test('pull with ajaxOptions function', function (t) {
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
        from: simple.stub()
      }
    },
    ajaxOptions: function () {
      return { foo: 'bar' }
    }
  }
  simple.mock(state.db.replicate, 'from').returnWith(syncApi)

  pull(state)

  t.is(state.db.replicate.from.lastCall.args[1].ajax.foo, 'bar', 'calls api.sync with ajaxOptions')

  t.end()
})
