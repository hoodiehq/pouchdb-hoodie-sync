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
  var dbMock = {constructor: function () {}}
  var state = getState(dbMock, {remote: 'foo'})

  t.is(state.remote, 'foo', 'sets remote to "foo"')
  t.is(state.db, dbMock, 'sets db')
  t.ok(state.emitter instanceof EventEmitter, 'initialises emitter')
  t.end()
})

test('getState(db, {remote: "foo", emitter: emitter})', function (t) {
  var dbMock = {constructor: function () {}}
  var state = getState(dbMock, {remote: 'foo', emitter: 'myemitter'})

  t.is(state.remote, 'foo', 'sets remote to "foo"')
  t.is(state.emitter, 'myemitter', 'sets emitter')
  t.end()
})

test('getState(db, db2)', function (t) {
  var PouchDBMock = function () {}
  var dbMock = {constructor: PouchDBMock}
  var remoteDbMock = new PouchDBMock()
  var state = getState(dbMock, remoteDbMock)

  t.is(state.remote, remoteDbMock, 'sets remote to db instance')
  t.end()
})

test('getState(db, Promise.resolve("remote"))', function (t) {
  var dbMock = {constructor: function () {}}
  var state = getState(dbMock, Promise.resolve('remote'))

  Promise.resolve(state.remote).then(function (remoteDb) {
    t.is(remoteDb, 'remote', 'sets remote to "remote"')
    t.end()
  })
})

test('getState(db, {remote: Promise.resolve("remote")})', function (t) {
  var dbMock = {constructor: function () {}}
  var state = getState(dbMock, {
    remote: Promise.resolve('remote')
  })

  Promise.resolve(state.remote).then(function (remoteDb) {
    t.is(remoteDb, 'remote', 'sets remote to "remote"')
    t.end()
  })
})

test.only('getState(db, {get remote () {})', function (t) {
  var dbMock = {constructor: function () {}}
  getState(dbMock, {
    get remote () {
      t.fail('should not execute getter')
    }
  })

  t.end()
})
