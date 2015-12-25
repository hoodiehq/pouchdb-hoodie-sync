module.exports = docOrIdToId

/**
 * It's an internal method. It checks if param is an doc object or an ID string and makes it an ID.
 *
 * @param  {String, Object} docOrId
 * @return {Promise}
 */

function docOrIdToId (docOrId) {
  if (typeof docOrId === 'object') {
    return docOrId._id || docOrId.id
  }

  return docOrId
}
