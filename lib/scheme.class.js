import path from "path"
import yaml from "js-yaml"
import { slugify } from "./util/slug.js"
import { file } from "./file.js"

const ROOTPATH = process.cwd()

/**
 * Convert 0-255 color numbers into 0 to 1
 * Returns a string
 */
function toDecimal(color) {
  return (color/255).toFixed(5)
}

/**
 * turns rgb into bgr
 */
function reverseHex(hex) {
  const m = /(\w\w)(\w\w)(\w\w)/.exec(hex)
  return `${m[3]}${m[2]}${m[1]}`;
}

/**
 * Represents a Base16 scheme definition.
 */
class Scheme {
  /**
   * Initializes a Base16 scheme file.
   *
   * @param {string} schemePath - The absolute path to the scheme file.
   */
  constructor (schemePath) {
    this.data = file.loadFile(schemePath, yaml.load)
    this.definition = this.parseScheme(this.data)
  }

  /**
   * Return a scheme definition in a format expected
   * for use with Base16 mustache templates.
   */
  parseScheme (data) {
    const hexDefinitions = Object.keys(data).reduce((accumulator, key) => {
      // we're only interested in the hex bases at this point
      if (!/^base/i.test(key)) return accumulator

      const hex = data[key]
        // strip leading # if present for 0.10.0 spec
        .replace(/^#/,"")

      const bytecode = Buffer.from(hex, 'hex')

      const red = bytecode[0];
      const green = bytecode[1];
      const blue = bytecode[2];

      return Object.assign({}, accumulator, {
        [`${key}-hex`]: hex,
        [`${key}-hex-r`]: red.toString(16),
        [`${key}-rgb-r`]: red,
        [`${key}-hex-g`]: green.toString(16),
        [`${key}-rgb-g`]: green,
        [`${key}-hex-b`]: blue.toString(16),
        [`${key}-rgb-b`]: blue,
        [`${key}-hex-bgr`]: reverseHex(hex),
        [`${key}-dec-r`]: toDecimal(red),
        [`${key}-dec-g`]: toDecimal(green),
        [`${key}-dec-b`]: toDecimal(blue)
      })
    }, {})

    return Object.assign({}, hexDefinitions, {
      'scheme-name': data.scheme,
      'scheme-author': data.author,
      'scheme-slug': slugify(data.scheme)
    })
  }

  /**
   * Initializes a Scheme instance for each scheme file found
   * in the current working directory.
   */
  static populate () {
    console.log('Parsing scheme definitions...')

    const schemeRoot = path.join(ROOTPATH, 'base16/schemes')
    return new Promise((resolve, reject) => {
      if (!file.exists(schemeRoot)) {
        console.error("ERROR: `base16/schemes` folder does not exist here.")
        resolve([])
        return
      }

      const schemeFiles = file.getFiles(schemeRoot, "yaml")

      // not sure if this has to be made recursive
      const schemes = schemeFiles.reduce((accumulator, file, idx) => {
        const scheme = new Scheme(file)

        return accumulator.concat(scheme)
      }, [])

      console.log(`${schemes.length} schemes found.`)
      resolve(schemes)
    })
  }
}

export { Scheme }
