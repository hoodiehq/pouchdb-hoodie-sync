module.exports = changeRemote

var Promise = require('lie')

var getState = require('./utils/get-state')

/**
 * disconnects local and remote database
 *
 * @return {Promise}
 */
function changeRemote (state, options) {
  var newState = getState(state.db, options)
  state.remote = newState.remote
  state.ajaxOptions = newState.ajaxOptions

  if (state.replication) {
    state.replication.cancel()
    state.emitter.emit('disconnect')
  }

  return Promise.resolve()
}
