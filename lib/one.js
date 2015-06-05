'use strict'

module.exports = one

/**
 * binds event only once to handler
 *
 * @param  {event} event   push, pull, connect, disconnect
 * @param  {handler} handler   function once bound to event
 * @return {Promise}
 */

function one (state, options, eventName, handler) {
  state.emitter.once(eventName, handler)
}
