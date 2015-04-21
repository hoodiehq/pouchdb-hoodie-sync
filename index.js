'use strict'

var exports = module.exports = { hoodieSync: hoodieSync }

function hoodieSync (options) {
  return {
    db: this,
    pull: function () {},
    push: require('./lib/push').bind(this, options),
    sync: function () {},
    on: function () {}
  }
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports)
}
