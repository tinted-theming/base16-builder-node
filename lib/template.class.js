import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import mustache from "mustache"
import { file } from "./file.js"

const ROOTPATH = process.cwd()
const DEFAULT_PREFIX = "base16-"

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
   * @param {string} prefix - prefix for the generated filenames
   */
  constructor (templatePath, extension, outputPath, group, prefix) {
    this.template = file.loadFile(templatePath)
    this.extension = extension
    this.outputPath = outputPath
    this.group = group
    this.prefix = prefix
  }

  render (scheme) {
    const view = mustache.render(this.template, scheme.definition)

    const targetPath = path.join(
      this.outputPath,
      `${this.prefix}${scheme.definition['scheme-slug']}${this.extension}`
    )

    if (fs.existsSync(targetPath)) {
      console.warn(`Overwriting ${targetPath}\nYou have two schemes using the same slug name.`);
    }
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
    console.log('Parsing template definitions...')

    const templateRoot = path.join(ROOTPATH, 'base16/templates')

    return new Promise((resolve, reject) => {
      if (!file.exists(templateRoot)) {
        console.error("ERROR: `base16/templates` folder does not exist here.")
        resolve([])
        return
      }
      const templateDirectories = file.getDirectories(templateRoot)

      const templatesCollection = templateDirectories.reduce((accumulator, dir, idx) => {
        // console.log(`${idx} / ${templateDirectories.length} directories`)

        // get the directory name at the tail of the path
        const templateSlug = dir.match(/[^/]*$/)[0]
        const templatesPath = path.join(dir, 'templates')

        const config = file.loadFile(path.join(templatesPath, 'config.yaml'), yaml.load)

        // get templates
        const templates = Object.keys(config).map(key => {
          const outputPath = path.join(dir, config[key].output)
          const templatePath = path.join(templatesPath, `${key}.mustache`)
          let prefix = config[key].prefix
          if (prefix === undefined) prefix = DEFAULT_PREFIX;

          return new Template(
            templatePath,
            config[key].extension,
            outputPath,
            templateSlug,
            prefix
          )
        })

        return accumulator.concat(templates)
      }, [])

      console.log(`${templatesCollection.length} templates found.`)
      resolve(templatesCollection)
    })
  }
}

export { Template }
