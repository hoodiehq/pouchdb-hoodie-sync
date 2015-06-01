'use strict'

module.exports = function isConnected (state, options) {
  return !!state.replication
}
