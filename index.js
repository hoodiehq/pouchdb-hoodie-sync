'use strict'

var exports = module.exports = { hoodieSync: hoodieSync }

function hoodieSync (options) {
  var state = {}
  return {
    db: this,
    pull: require('./lib/pull').bind(this, state, options),
    push: require('./lib/push').bind(this, state, options),
    sync: require('./lib/sync').bind(this, state, options),
    connect: require('./lib/connect').bind(this, state, options),
    disconnect: require('./lib/disconnect').bind(this, state, options),
    on: function () {}
  }
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports)
}
