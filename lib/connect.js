'use strict'

module.exports = connect

/**
 * connects local and remote database
 *
 * @return {Promise}
 */

function connect (state, options) {
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
