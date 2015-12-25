module.exports = getState

var EventEmitter = require('events').EventEmitter

function getState (db, options) {
  if (!options || !options.remote) {
    throw new Error('options.remote required')
  }

  return {
    emitter: options && options.emitter || new EventEmitter(),
    remote: options.remote,
    db: db
  }
}
