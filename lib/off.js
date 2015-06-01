'use strict'

module.exports = function off (state, options, eventName, handler) {
  if (arguments.length === 3) {
    state.emitter.removeAllListeners(eventName)
  } else {
    state.emitter.removeListener(eventName, handler)
  }
}
