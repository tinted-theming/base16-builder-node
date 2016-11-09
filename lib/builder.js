let builder = {}

builder.update = function () {
  require('./sources').updateSources()
  return true
}

builder.build = function () {
  console.log('hey')
  return true
}

module.exports = builder
