const path = require('path')
const yaml = require('js-yaml')
const slugify = require('slug')

const file = require('./file.js')
const Reporter = require('./reporter.class.js')

const ROOTPATH = process.cwd()

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
      const bytecode = Buffer.from(hex, 'hex')

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

  /**
   * Initializes a Scheme instance for each scheme file found
   * in the current working directory.
   */
  static populate () {
    const log = Reporter.createChannel('Parsing scheme definitions...')

    const schemeRoot = path.join(ROOTPATH, 'schemes')
    const schemeDirectories = file.getDirectories(schemeRoot)

    return new Promise((resolve, reject) => {
      // not sure if this has to be made recursive
      const schemes = schemeDirectories.reduce((accumulator, dir, idx) => {
        log.details(`${idx} / ${schemeDirectories.length} directories`)

        const schemes = file.getFiles(dir, 'yaml')
          .map(f => new Scheme(f))

        return accumulator.concat(schemes)
      }, [])

      log.details('').done(`${schemes.length} schemes found.`)
      resolve(schemes)
    })
  }
}

module.exports = Scheme
