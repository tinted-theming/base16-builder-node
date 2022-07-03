import { Scheme } from "./scheme.class.js"
import { Template } from "./template.class.js"
import shelljs from "shelljs"
const { rm } = shelljs

import { APCAcontrast, sRGBtoY, displayP3toY,
       calcAPCA, fontLookupAPCA } from 'apca-w3';

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

      let count = 0
      let bar = 30
      schemes.forEach(s => {
        let def = s.definition
        let bg = def["base00-hex"]
        let fg = def["base05-hex"]
        let Lc = calcAPCA(fg, bg)
        if (Math.abs(Lc) < bar) {
          console.log(def["scheme-name"], "- Lc", Lc, `${fg} / ${bg}`)
          count++;
        }
      })
      console.log(`${count} themes < ${bar} Lc`)

      console.log(`${schemes.length * templates.length} themes rendered.`)
    })
}

export { builder }
