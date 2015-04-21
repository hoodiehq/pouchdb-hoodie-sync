'use strict'

var PouchDB = require('pouchdb')
var uuid = PouchDB.utils.uuid

if (!PouchDB.prototype.hoodieSync) PouchDB.plugin(require('../../'))

var options = {
  db: require('memdown')
}

module.exports = function (name) {
  name = name || uuid(10)

  return new PouchDB(name, options)
}
