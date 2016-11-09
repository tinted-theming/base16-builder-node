const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const sh = require('shelljs')

const Reporter = require('./reporter.class.js')
const ROOTPATH = process.cwd()

const execOptions = {
  async: true,
  silent: true
}

/**
 * Returns the contents of a file.
 */
function loadFile (filePath) {
  if (!fs.existsSync(filePath)) {
    sh.echo(`ERROR: ${filePath} not found.`)
    process.exit(1)
  }

  return yaml.safeLoad(fs.readFileSync(filePath))
}

/**
 * Represents a manifest file that can
 * update and populate resource files in the working directory.
 */
class Manifest extends Reporter {
  /**
   * Creates a manifest.
   * @param {string} name - The name of this manifest.
   * @param {string} manifestPath - The path to the actual manifest file, relative to the working directory
   */
  constructor (name, manifestPath) {
    super(`Refreshing ${name} lists...`)

    this.name = name
    this.file = path.join(ROOTPATH, manifestPath)

    this.report('waiting')
  }

  /**
   * Updates the resource files in the specified path.
   * Pulls if the path already exists,
   * and initializes otherwise.
   *
   * @param {string} targetPath - The path wherein the resource files will be populated / updated, relative to the working directory
   * @returns {Promise}
   */
  update (targetPath) {
    this.report('parsing manifest')
    const manifest = loadFile(this.file)

    this.report('updating resources')
    const tasks = Object.keys(manifest).map(dir => this.refreshResources(path.join(targetPath, dir), manifest[dir]))

    return Promise.all(tasks)
      .then(_ => { this.reporter.done('Completed') })
      .catch(_ => { this.reporter.fail('Failed') })
  }

  /**
   * Refreshes the resource files located in the path provided.
   * Assumes resources are managed by git. Pulls the latest resource copies if the path already exists,
   * and clones the resource repository otherwise.
   *
   * @param {string} dir - The directory where the resource files are saved.
   * @param {string} gitURL - The URL to the git repository where the resource files are managed.
   */
  refreshResources (dir, gitURL) {
    const targetDirectory = path.join(ROOTPATH, dir)
    const resourcesExist = fs.existsSync(targetDirectory)
    const reportChannel = Manifest.createChannel(`${resourcesExist ? 'Updating' : 'Fetching'} resource for ${dir}...`)

    return new Promise((resolve, reject) => {
      const cb = (code, stdout, stderr) => {
        if (code === 0) {
          reportChannel.done('Completed')
          resolve(stdout)
        } else {
          reportChannel.fail('Failed')
          reject(stderr)
        }
      }

      if (resourcesExist) {
        reportChannel.status('pulling repo')
        sh.exec(`git -C ${targetDirectory} pull`, execOptions, cb)
      } else {
        reportChannel.status('cloning repo')
        sh.exec(`git clone ${gitURL} ${targetDirectory}`, execOptions, cb)
      }
    })
  }
}

module.exports = Manifest
