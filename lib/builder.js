const Manifest = require('./manifest.class.js')

let builder = {}

builder.update = function () {
  const sourcesManifest = new Manifest('sources', 'sources.yaml')
  const schemesManifest = new Manifest('schemes', 'sources/schemes/list.yaml')
  const templatesManifest = new Manifest('templates', 'sources/templates/list.yaml')

  return sourcesManifest.update('/sources')
    .then(_ => Promise.all([
      schemesManifest.update('/schemes'),
      templatesManifest.update('/templates')
    ]))
}

builder.build = function () {
  return builder.update()
}

module.exports = builder
