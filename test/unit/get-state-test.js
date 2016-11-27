var EventEmitter = require('events').EventEmitter

var test = require('tape')

var getState = require('../../lib/utils/get-state')

test('getState(db)', function (t) {
  t.throws(getState.bind(null), 'throws without options')
  t.end()
})

test('getState(db, {})', function (t) {
  t.throws(getState.bind(null, {}), 'throws without options.remote')
  t.end()
})

test('getState(db, {remote: "foo"})', function (t) {
  var state = getState('db', {remote: 'foo'})

  t.is(state.remote, 'foo', 'sets remote to "foo"')
  t.is(state.db, 'db', 'sets db')
  t.ok(state.emitter instanceof EventEmitter, 'initialises emitter')
  t.end()
})

test('getState(db, {remote: "foo", emitter: emitter})', function (t) {
  var state = getState(null, {remote: 'foo', emitter: 'myemitter'})

  t.is(state.remote, 'foo', 'sets remote to "foo"')
  t.is(state.emitter, 'myemitter', 'sets emitter')
  t.end()
})
