'use strict'

module.exports = function docOrIdToId (docOrId) {
  return typeof docOrId === 'object' ? docOrId._id : docOrId
}
