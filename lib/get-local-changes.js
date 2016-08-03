module.exports = getLocalChanges

var generateReplicationId = require('pouchdb-generate-replication-id')

function getLocalChanges (state) {
  var remoteDb = new state.db.constructor(state.remote)

  return generateReplicationId(state.db, remoteDb, {})

  .then(function (id) {
    return state.db.get(id)
  })

  .then(function (replicationStateDoc) {
    return state.db.changes({
      since: replicationStateDoc.last_seq,
      include_docs: true
    })
  })

  .then(function (changes) {
    return changes.results.map(function (result) {
      return result.doc
    })
  })
}
