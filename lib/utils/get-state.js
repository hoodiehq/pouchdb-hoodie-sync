module.exports = getState

var EventEmitter = require('events').EventEmitter

function getState (db, options) {
  if (typeof options === 'string') {
    options = {
      remote: options
    }
  }

  if (isPouchDBInstance(db, options)) {
    options = {
      remote: options
    }
  }

  if (isPromise(options)) {
    options = {
      remote: options
    }
  }

  if (!options || !('remote' in options)) {
    throw new Error('options.remote required')
  }

  return {
    emitter: options.emitter || new EventEmitter(),
    get remote () {
      return options.remote
    },
    db: db
  }
}

function isPouchDBInstance (db, options) {
  return options instanceof db.constructor
}

function isPromise (options) {
  if (!options) {
    return false
  }

  return !!options.then
}
