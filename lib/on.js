'use strict'

module.exports = on

/**
 * binds event to handler
 *
 * @param  {String} eventName   push, pull, connect, disconnect
 * @param  {Function} handler   function bound to event
 * @return {Promise}
 */

function on (state, options, eventName, handler) {
  state.emitter.on(eventName, handler)

  return state.api
}
