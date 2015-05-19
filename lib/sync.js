'use strict'

var toId = require('./utils/to-id')

module.exports = function sync (options, docsOrIds) {
  var syncedObjects = []
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

  var replication = this.sync(options.remote, {
    doc_ids: docsOrIds,
    include_docs: true
  })

  replication.on('complete', function () {
    defer.resolve(syncedObjects)
  })
  replication.on('error', defer.reject)

  replication.on('change', function (change) {
    syncedObjects = syncedObjects.concat(change.change.docs)
  })
  return defer.promise
}
