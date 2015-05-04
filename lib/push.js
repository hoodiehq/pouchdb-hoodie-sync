'use strict'

var toId = require('./utils/to-id')

module.exports = function push (options, docsOrIds) {
  var pushedObjects = []
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

  if (typeof docsOrIds === 'string') {
    docsOrIds = [docsOrIds]
  }
  if (Array.isArray(docsOrIds)) {
    docsOrIds = docsOrIds.map(toId)
  }
  var replication = this.replicate.to(options.remote, {
    create_target: true,
    doc_ids: docsOrIds,
    include_docs: true
  })
  replication.on('complete', function () {
    defer.resolve(pushedObjects)
  })
  replication.on('error', defer.reject)
  replication.on('change', function (change) {
    pushedObjects.push(change.doc)
  })

  return defer.promise
}
