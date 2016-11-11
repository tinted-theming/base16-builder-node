const Manifest = require('./manifest.class.js')
const Scheme = require('./scheme.class.js')
const Template = require('./template.class.js')

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

  //schemes = Scheme.populate()
  //templateDict = Template.populate()

  //scheme = schemes[0]
  //template = templateDict.vim.templates[0]
  //config = templateDict.vim.configs.default

  //console.log(template.render(scheme, config))

  return true
}

module.exports = builder
