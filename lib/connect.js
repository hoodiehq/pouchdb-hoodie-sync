'use strict'

module.exports = function connect (state, options) {
  var Promise = this.constructor.utils.Promise

  state.replication = this.sync(options.remote, {
    live: true,
    create_target: true
  })

  return Promise.resolve()
}
