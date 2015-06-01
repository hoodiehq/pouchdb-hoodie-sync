'use strict'

module.exports = function one (state, options, eventName, handler) {
  state.emitter.once(eventName, handler)
}
