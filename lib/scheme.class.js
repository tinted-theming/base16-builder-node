const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const sh = require('shelljs')
const slugify = require('slug')

const ROOTPATH = process.cwd()

function loadFile (filePath) {
  if (!fs.existsSync(filePath)) {
    sh.echo(`ERROR: ${filePath} not found.`)
    process.exit(1)
  }

  return yaml.safeLoad(fs.readFileSync(filePath))
}

/**
 * Represents a Base16 scheme definition.
 */
class Scheme {
  /**
   * Initializes a Base16 scheme file.
   *
   * @param {string} schemePath - The path to the scheme file, relative to the working directory.
   */
  constructor (schemePath) {
    this.data = loadFile(path.join(ROOTPATH, schemePath))
    this.scheme = this.parseScheme(this.data)
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
      const bytecode = new Buffer(hex, 'hex')

      return Object.assign({}, accumulator, {
        [`${key}-hex`]: hex,
        [`${key}-hex-r`]: bytecode[0].toString(16),
        [`${key}-rgb-r`]: bytecode[0],
        [`${key}-hex-g`]: bytecode[1].toString(16),
        [`${key}-rgb-g`]: bytecode[1],
        [`${key}-hex-b`]: bytecode[2].toString(16),
        [`${key}-rgb-b`]: bytecode[2]
      })
    }, {})

    return Object.assign({}, hexDefinitions, {
      'scheme-name': data.scheme,
      'scheme-author': data.author,
      'scheme-slug': slugify(data.scheme, { lower: true })
    })
  }
}

module.exports = Scheme
