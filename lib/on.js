'use strict'

module.exports = function on (state, options, eventName, handler) {
  state.emitter.on(eventName, handler)
}
