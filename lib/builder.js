const Manifest = require('./manifest.class.js')
const Scheme = require('./scheme.class.js')

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
    .then(_ => {
    })
}

builder.build = function () {
  const s = new Scheme('schemes/tomorrow/tomorrow-night.yaml')
  console.log(s.scheme)
  return true
}

module.exports = builder
