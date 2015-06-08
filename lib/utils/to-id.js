'use strict'

module.exports = docOrIdToId

/**
 * It's an internal method. It checks if param is an doc object or an ID string and makes it an ID.
 *
 * @param  {String, Object} docOrId
 * @return {Promise}
 */

function docOrIdToId (docOrId) {
  return typeof docOrId === 'object' ? docOrId._id : docOrId
}
