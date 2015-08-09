'use strict'

module.exports = off

/**
 * unbinds event from handler
 *
 * @param  {String} eventName   push, pull, connect, disconnect
 * @param  {Function} handler   function unbound from event
 * @return {Promise}
 */

function off (state, options, eventName, handler) {
  if (arguments.length === 3) {
    state.emitter.removeAllListeners(eventName)
  } else {
    state.emitter.removeListener(eventName, handler)
  }

  return state.api
}
