'use strict'

module.exports = function connect (state, options) {
  var Promise = this.constructor.utils.Promise

  if (!state.replication) {
    state.replication = this.sync(options.remote, {
      live: true,
      create_target: true
    })

    state.emitter.emit('connect')
  }

  return Promise.resolve()
}
