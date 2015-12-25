module.exports = getState

var EventEmitter = require('events').EventEmitter

function getState (db, options) {
  if (typeof options === 'string') {
    options = {
      remote: options
    }
  }

  if (!options || !options.remote) {
    throw new Error('options.remote required')
  }

  return {
    emitter: options && options.emitter || new EventEmitter(),
    remote: options.remote,
    ajaxOptions: options.ajax,
    db: db
  }
}
