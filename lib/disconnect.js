module.exports = disconnect

/**
 * disconnects local and remote database
 *
 * @return {Promise}
 */

function disconnect (state) {
  var Promise = state.db.constructor.utils.Promise

  if (state.replication) {
    state.replication.cancel()
    state.emitter.emit('disconnect')
  }

  return Promise.resolve()
}
