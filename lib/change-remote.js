module.exports = changeRemote

var Promise = require('lie')

/**
 * disconnects local and remote database
 *
 * @return {Promise}
 */
function changeRemote (state, options) {
  if (state.replication) {
    state.replication.cancel()
    state.emitter.emit('disconnect')
  }

  return Promise.resolve()
}
