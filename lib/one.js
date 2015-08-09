'use strict'

module.exports = one

/**
 * binds event only once to handler
 *
 * @param  {String} eventName   push, pull, connect, disconnect
 * @param  {Function} handler   function once bound to event
 * @return {Promise}
 */

function one (state, options, eventName, handler) {
  state.emitter.once(eventName, handler)

  return state.api
}
