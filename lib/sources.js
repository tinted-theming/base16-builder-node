const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const observatory = require('observatory')
const sh = require('shelljs')

const sourceManifestFilename = 'sources.yaml'
const sourceManifest = path.join(process.cwd(), sourceManifestFilename)

// :: ---

const app = {}

app.updateSources = function () {
  const task = observatory.add('Refreshing source lists...').status('parsing sources manifest')

  const manifest = loadManifest()

  task.status('updating sources')
  const sourceTasks = Object.keys(manifest).map(dir => refreshSource(dir, manifest[dir]))

  return Promise.all(sourceTasks)
    .then(_ => { task.done('Completed') })
    .catch(_ => { task.fail('Failed') })
}

function loadManifest () {
  checkManifest()
  return yaml.safeLoad(fs.readFileSync(sourceManifest))
}

function checkManifest () {
  if (!fs.existsSync(sourceManifest)) {
    sh.echo(`ERROR: ${sourceManifestFilename} not found.`)
    process.exit(1)
  }
}

function refreshSource (dir, gitURL) {
  const options = {
    async: true,
    silent: true
  }

  const sourceDirectory = path.join(process.cwd(), dir)
  const sourceExists = fs.existsSync(dir)

  return new Promise((resolve, reject) => {
    const task = observatory.add(`${sourceExists ? 'Updating' : 'Fetching'} source /${dir}...`)
    const cb = (code, stdout, stderr) => {
      if (code !== 0) {
        // an error occurred
        task.fail('Failed')
        reject(stderr)
      } else {
        task.done('Completed')
        resolve(stdout)
      }
    }

    if (sourceExists) {
      task.status('pulling repo')
      sh.exec(`git -C ${sourceDirectory} pull`, options, cb)
    } else {
      task.status('cloning repo')
      sh.exec(`git clone ${gitURL} ${sourceDirectory}`, options, cb)
    }
  })
}

module.exports = app
