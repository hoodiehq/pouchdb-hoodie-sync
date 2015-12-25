var simple = require('simple-mock')
var test = require('tape')

var changeRemote = require('../../lib/change-remote')

test('changeRemote("newdb")', function (t) {
  t.plan(2)

  var state = {}

  changeRemote(state, 'newdb')

  .then(function () {
    t.is(arguments[0], undefined, 'resolves without argument')
    t.is(state.remote, 'newdb', 'sets state.remote')
  })
})

test('changeRemote({name})', function (t) {
  t.plan(2)

  var state = {}

  changeRemote(state, {
    remote: 'newdb'
  })

  .then(function () {
    t.is(arguments[0], undefined, 'resolves without argument')
    t.is(state.remote, 'newdb', 'sets state.remote')
  })
})

test('changeRemote({name, ajax})', function (t) {
  t.plan(1)

  var state = {}

  changeRemote(state, {
    remote: 'newdb',
    ajax: 'ajax options'
  })

  .then(function () {
    t.is(state.ajaxOptions, 'ajax options', 'sets state.ajaxSettings')
  })
})

test('changeRemote("newdb") if connected', function (t) {
  t.plan(1)

  var state = {
    replication: {
      cancel: simple.stub()
    },
    emitter: {
      emit: simple.stub()
    }
  }

  changeRemote(state, 'newdb')

  .then(function () {
    t.is(state.replication.cancel.callCount, 1, 'cancelled replication')
  })
})
