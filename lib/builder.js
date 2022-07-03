import { Scheme } from "./scheme.class.js"
import { Template } from "./template.class.js"
import shelljs from "shelljs"
const { rm } = shelljs

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
        console.log('\nNo schemes and/or templates found.')
        return results
      }

      console.log('Rendering themes...')
      templates.forEach(t => {
        rm("-f",`${t.outputPath}/*${t.extension}`);
        schemes.forEach(s => t.render(s))
      })

      console.log(`${schemes.length * templates.length} themes rendered.`)
    })
}

export { builder }
