const path = require('path')
const yaml = require('js-yaml')
const mustache = require('mustache')

const Reporter = require('./reporter.class.js')
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
   * @param {string} extension - The file extension for the output file.
   * @param {string} outputPath - Where to save the output file.
   * @param {string} group - The editor group this template belongs in.
   */
  constructor (templatePath, extension, outputPath, group) {
    this.template = file.loadFile(templatePath)
    this.extension = extension
    this.outputPath = outputPath
    this.group = group
  }

  render (scheme) {
    const view = mustache.render(this.template, scheme.definition)

    const targetPath = path.join(
      this.outputPath,
      `base16-${scheme.definition['scheme-slug']}${this.extension}`
    )

    file.writeFile(targetPath, view)
    return targetPath
  }

  /**
   * Initializes a Template instance for each template configuration found
   * in the corresponding config.yaml.
   *
   * config.yaml is expected to be in the /templates dir of each
   * template base directory.
   */
  static populate () {
    const log = Reporter.createChannel('Parsing template definitions...')

    const templateRoot = path.join(ROOTPATH, 'templates')
    const templateDirectories = file.getDirectories(templateRoot)

    return new Promise((resolve, reject) => {
      const templatesCollection = templateDirectories.reduce((accumulator, dir, idx) => {
        log.details(`${idx} / ${templateDirectories.length} directories`)

        // get the directory name at the tail of the path
        const templateSlug = dir.match(/[^/]*$/)[0]
        const templatesPath = path.join(dir, 'templates')

        const config = file.loadFile(path.join(templatesPath, 'config.yaml'), yaml.safeLoad)

        // get templates
        const templates = Object.keys(config).map(key => {
          const outputPath = path.join(dir, config[key].output)
          const templatePath = path.join(templatesPath, `${key}.mustache`)

          return new Template(
            templatePath,
            config[key].extension,
            outputPath,
            templateSlug
          )
        })

        return accumulator.concat(templates)
      }, [])

      log.details('').done(`${templatesCollection.length} templates found.`)
      resolve(templatesCollection)
    })
  }
}

module.exports = Template
