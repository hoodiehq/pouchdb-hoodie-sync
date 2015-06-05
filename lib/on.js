'use strict'

module.exports = on

/**
 * binds event to handler
 *
 * @param  {event} event   push, pull, connect, disconnect
 * @param  {handler} handler   function bound to event
 * @return {Promise}
 */

function on (state, options, eventName, handler) {
  state.emitter.on(eventName, handler)
}
