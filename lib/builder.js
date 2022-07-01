const Scheme = require('./scheme.class.js')
const Template = require('./template.class.js')
const { rm } = require('shelljs')

let builder = {}

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
      console.log('Rendering themes...')
      const [schemes, templates] = results
      templates.forEach(t => {
        rm("-f",`${t.outputPath}/*${t.extension}`);
        schemes.forEach(s => t.render(s))
      })

      console.log(`${schemes.length * templates.length} themes rendered.`)
    })
}

module.exports = builder
