'use strict'

module.exports = function disconnect (state, options) {
  var Promise = this.constructor.utils.Promise

  if (state.replication) {
    state.replication.cancel()

    state.emitter.emit('disconnect')
  }

  return Promise.resolve()
}
