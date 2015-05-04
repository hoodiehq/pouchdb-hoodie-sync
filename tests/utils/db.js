'use strict'

var PouchDB = require('pouchdb').defaults({
  db: require('memdown')
})
var uuid = PouchDB.utils.uuid

if (!PouchDB.prototype.hoodieSync) PouchDB.plugin(require('../../'))

module.exports = function (name) {
  name = name || uuid(10)

  return new PouchDB(name)
}
