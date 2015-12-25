module.exports = getAjaxOptions

function getAjaxOptions (options) {
  if (!options) {
    return
  }

  if (typeof options === 'function') {
    return options()
  }

  return options
}
