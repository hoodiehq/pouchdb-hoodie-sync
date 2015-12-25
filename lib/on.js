module.exports = on

/**
 * binds event to handler
 *
 * @param  {String} eventName   push, pull, connect, disconnect
 * @param  {Function} handler   function bound to event
 * @return {Promise}
 */
function on (state, eventName, handler) {
  state.emitter.on(eventName, handler)

  return state.api
}
