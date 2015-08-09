'use strict'

module.exports = isConnected

/**
 * checks if database connection is open and working
 *
 * @return {Boolean}
 */

function isConnected (state, options) {
  return !!state.replication
}
