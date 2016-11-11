const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const mustache = require('mustache')

const file = require('./file.js')
const ROOTPATH = process.cwd()

/**
 * Represents a Base16 template definition
 */
class Template {
  /**
   * Initializes a Base16 template file
   *
   * @param {string} templatePath - The absolute path to the template mustache path.
   */
  constructor (templatePath) {
    this.template = file.loadFile(templatePath)
  }

  render (scheme, config) {
    const view = mustache.render(
      this.template, scheme.definition
    )

    const targetPath = path.join(
      config.outputPath,
      `base16-${scheme.definition['scheme-slug']}${config.extension}`
    )

    file.writeFile(targetPath, view)
    return targetPath
  }

  static populate () {
    const templateRoot = path.join(ROOTPATH, 'templates')
    const templateDirectories = file.getDirectories(templateRoot)

    return templateDirectories.reduce((accumulator, dir) => {
      // get the directory name at the tail of the path
      const templateSlug = dir.match(/[^/]*$/)[0]
      const templatesPath = path.join(dir, 'templates')

      const configData = file.loadFile(path.join(templatesPath, 'config.yaml'), yaml.safeLoad)

      const configs = Object.keys(configData)
        .reduce((accumulator, key) => {
          const ext = configData[key].extension
          return Object.assign({}, accumulator, {
            [key]: {
              extension: /^\./.test(ext) ? ext : `.${ext}`,
              outputPath: path.join(dir, configData[key].output)
            }
          })
        }, {})

      const templates = file.getFiles(templatesPath, 'mustache')
        .map(f => new Template(f))

      return Object.assign({}, accumulator, {
        [templateSlug]: {
          configs: configs,
          templates: templates
        }
      })
    })
  }
}

module.exports = Template
