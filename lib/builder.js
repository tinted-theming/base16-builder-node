import { BaseXScheme } from "./systems/basex/scheme.js"
import { BaseXTemplate } from "./systems/basex/template.js"
import shelljs from "shelljs"
const { rm } = shelljs

let builder = {}

builder.build = function (path, opts) {

  global.verbose = opts.verbose

  return Promise.all([
    // these aren't really async yet
    BaseXScheme.populate(path),
    BaseXTemplate.populate(path)
  ])
    .then(results => {
      const [schemes, templates] = results
      if (schemes.length === 0 || templates.length === 0) {
        console.log('\nNo schemes and/or templates found.')
        return results
      }

      templates.forEach(t => {
        if (opts.prefix) {
          t.prefix = opts.prefix
        }
      })

      console.log('Rendering themes...')
      templates.forEach(t => {
        let file = `${t.outputPath}/*${t.extension}`
        rm("-f",file);
        schemes.forEach(s => t.render(s))
      })

      console.log(`${schemes.length * templates.length} themes rendered.`)
    })
}

export { builder }
