module.exports = { hoodieSync: hoodieSync }

var getState = require('./lib/utils/get-state')

function hoodieSync (options) {
  var state = getState(this, options)

  state.api = {
    db: this,
    pull: require('./lib/pull').bind(null, state),
    push: require('./lib/push').bind(null, state),
    sync: require('./lib/sync').bind(null, state),
    connect: require('./lib/connect').bind(null, state),
    disconnect: require('./lib/disconnect').bind(null, state),
    isConnected: require('./lib/is-connected').bind(null, state),
    changeRemote: require('./lib/change-remote').bind(null, state),
    on: require('./lib/on').bind(null, state),
    off: require('./lib/off').bind(null, state),
    one: require('./lib/one').bind(null, state)
  }

  return state.api
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(module.exports)
}
