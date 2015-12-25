module.exports = connect

var Promise = require('lie')

var getAjaxOptions = require('./utils/get-ajax-options.js')

/**
 * connects local and remote database
 *
 * @return {Promise}
 */
function connect (state) {
  if (!state.replication) {
    state.replication = state.db.sync(state.remote, {
      create_target: true,
      live: true,
      retry: true,
      ajax: getAjaxOptions(state.ajaxOptions)
    })

    state.replication.on('error', function (error) {
      state.emitter.emit('error', error)
    })

    state.replication.on('change', function (change) {
      for (var i = 0; i < change.change.docs.length; i++) {
        state.emitter.emit(change.direction, change.change.docs[i])
      }
    })

    state.emitter.emit('connect')
  }

  return Promise.resolve()
}
