const Reporter = require('./reporter.class.js')
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
  return Promise.all([
    // these aren't really async yet
    Scheme.populate(),
    Template.populate()
  ])
    .then(results => {
      const [schemes, templates] = results
      if (schemes.length === 0 || templates.length === 0) {
        console.log('\nNo schemes and/or templates found. Will attempt an update.')
        return builder.update()
          .then(_ => Promise.all([
            Scheme.populate(),
            Template.populate()
          ]))
      } else {
        return results
      }
    })
    .then(results => {
      const log = Reporter.createChannel('Rendering themes...')
        .status('working')
      const [schemes, templates] = results
      templates.forEach(t =>
        schemes.forEach(s => t.render(s))
      )

      log.done(`${schemes.length * templates.length} themes rendered.`)
    })
}

module.exports = builder
