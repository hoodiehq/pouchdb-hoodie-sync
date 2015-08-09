'use strict'

var exports = module.exports = { hoodieSync: hoodieSync }
var EventEmitter = require('events').EventEmitter

function hoodieSync (options) {
  var state = {
    emitter: options && options.emitter || new EventEmitter()
  }

  state.api = {
    db: this,
    pull: require('./lib/pull').bind(this, state, options),
    push: require('./lib/push').bind(this, state, options),
    sync: require('./lib/sync').bind(this, state, options),
    connect: require('./lib/connect').bind(this, state, options),
    disconnect: require('./lib/disconnect').bind(this, state, options),
    isConnected: require('./lib/is-connected').bind(this, state, options),
    on: require('./lib/on').bind(this, state, options),
    off: require('./lib/off').bind(this, state, options),
    one: require('./lib/one').bind(this, state, options)
  }

  return state.api
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports)
}
