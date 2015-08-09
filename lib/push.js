'use strict'

var toId = require('./utils/to-id')

module.exports = push

/**
 * pushes one or multiple objects from local to remote database
 *
 * @param  {StringOrObject} docsOrIds   object or ID of object or array of objects/ids (all optional)
 * @return {Promise}
 */

function push (state, options, docsOrIds) {
  var pushedObjects = []
  var Promise = this.constructor.utils.Promise
  var errors = this.constructor.Errors
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

  if (docsOrIds && docsOrIds.filter(Boolean).length !== docsOrIds.length) {
    return Promise.reject(errors.NOT_AN_OBJECT)
  }

  var replication = this.replicate.to(options.remote, {
    create_target: true,
    doc_ids: docsOrIds,
    include_docs: true
  })

  replication.catch(function () {
    // handled trough 'error' event
  })

  replication.on('complete', function () {
    defer.resolve(pushedObjects)
  })
  replication.on('error', defer.reject)
  replication.on('change', function (change) {
    pushedObjects = pushedObjects.concat(change.docs)

    for (var i = 0; i < change.docs.length; i++) {
      state.emitter.emit('push', change.docs[i])
    }
  })

  return defer.promise
}
