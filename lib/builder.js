const Manifest = require('./manifest.class.js')

let builder = {}

builder.update = function () {
  // require('./sources').updateSources()
  const sourcesManifest = new Manifest('sources', 'sources.yaml')
  const schemesManifest = new Manifest('schemes', 'sources/schemes/list.yaml')
  const templatesManifest = new Manifest('templates', 'sources/templates/list.yaml')

  sourcesManifest.update('')

  return true
}

builder.build = function () {
  builder.update()

  return true
}

module.exports = builder
