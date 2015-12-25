module.exports = off

/**
 * unbinds event from handler
 *
 * @param  {String} eventName   push, pull, connect, disconnect
 * @param  {Function} handler   function unbound from event
 * @return {Promise}
 */
function off (state, eventName, handler) {
  if (arguments.length === 2) {
    state.emitter.removeAllListeners(eventName)
  } else {
    state.emitter.removeListener(eventName, handler)
  }

  return state.api
}
