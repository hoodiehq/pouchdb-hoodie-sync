var test = require('tape')

var connect = require('../../lib/connect')

test('connect options', function (t) {
  var errorEvents = []
  var state = {
    emitter: {
      emit: function (event) {
        if (event === 'error') {
          errorEvents.push(arguments)
        }
      }
    },
    remote: 'remoteDb',
    db: {
      constructor: {
        utils: {
          Promise: {
            resolve: function () {}
          }
        }
      },
      sync: function () {
        syncArgs = arguments
        return {
          on: function (event, callback) {
            if (event === 'error') {
              callback('foo')
            }
          }
        }
      }
    }
  }
  var syncArgs
  connect(state)

  t.is(syncArgs[0], 'remoteDb', 'calls api.sync with "remoteDb"')
  t.is(syncArgs[1].live, true, 'calls api.sync with live: true')
  t.is(syncArgs[1].retry, true, 'calls api.sync with retry: true')
  t.is(syncArgs[1].create_target, true, 'calls api.sync with create_target: true')
  t.is(errorEvents.length, 1, 'listens to error event')
  t.is(errorEvents[0][1], 'foo', 'emits error on API')
  t.end()
})
