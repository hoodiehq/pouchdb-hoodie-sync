'use strict'

var toId = require('./utils/to-id')

module.exports = pull

/**
 * pulles one or multiple objects from remote to local database
 *
 * @param  {String,Object} idOrObject   object, ID of object or array of objects/ids (all optional)
 * @return {Promise}
 */

function pull (state, options, docsOrIds) {
  var pulledObjects = []
  var Promise = this.constructor.utils.Promise
  var defer = {}

  defer.promise = new Promise(function (resolveCallback, rejectCallback) {
    defer.resolve = function resolve () {
      resolveCallback.apply(null, arguments)
    }
    defer.reject = function reject () {
      rejectCallback.apply(null, arguments)
    }
  })

  if (Array.isArray(docsOrIds)) {
    docsOrIds = docsOrIds.map(toId)
  } else {
    docsOrIds = docsOrIds && [toId(docsOrIds)]
  }

  var replication = this.replicate.from(options.remote, {
    doc_ids: docsOrIds
  })
  replication.on('complete', function () {
    defer.resolve(pulledObjects)
  })
  replication.on('error', defer.reject)

  replication.on('change', function (change) {
    pulledObjects = pulledObjects.concat(change.docs)
    for (var i = 0; i < change.docs.length; i++) {
      state.emitter.emit('pull', change.docs[i])
    }
  })

  return defer.promise
}
