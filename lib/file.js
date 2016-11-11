const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const sh = require('shelljs')

const app = {}

app.loadFile = function (filePath, cb = f => f.toString('utf8')) {
  if (!fs.existsSync(filePath)) {
    sh.echo(`ERROR: ${filePath} not found.`)
    process.exit(1)
  }

  return cb(fs.readFileSync(filePath))
}

app.writeFile = function (filePath, data) {
  mkdirp(path.dirname(filePath), _ => {
    fs.writeFileSync(filePath, data)
  })
}

app.getDirectories = function (basePath) {
  return fs.readdirSync(basePath)
    .map(f => path.join(basePath, f))
    .filter(f => fs.statSync(f).isDirectory())
}

// we really only need to check the extension
// in a singular fashion for this engine,
// so there's no need to account for searching
// for multiple extensions at the same time.
app.getFiles = function (basePath, ext) {
  // :: normalize the extension
  const extension = /^\./.test(ext) ? ext : `.${ext}`

  return fs.readdirSync(basePath)
    .filter(f => path.extname(f) === extension)
    .map(f => path.join(basePath, f))
}

module.exports = app
