var uniqueName = require('./unique-name.js')

var PouchDB = require('pouchdb').defaults({
  db: require('memdown')
})

if (!PouchDB.prototype.hoodieSync) PouchDB.plugin(require('../../'))

module.exports = function (name) {
  name = name || uniqueName()

  return new PouchDB(name)
}
