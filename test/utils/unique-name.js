var uniqueNr = 0
module.exports = function (name) {
  name = name || 'db'
  uniqueNr += 1

  return name + '-' + uniqueNr
}
