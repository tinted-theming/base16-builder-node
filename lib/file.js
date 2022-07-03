import fs from "fs"
import mkdirp from "mkdirp"
import path from "path"

const file = {}

file.loadFile = function (filePath, cb = f => f.toString('utf8')) {
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: ${filePath} not found.`)
    process.exit(1)
  }

  return cb(fs.readFileSync(filePath))
}

file.exists = file => fs.existsSync(file)

file.writeFile = function (filePath, data) {
  mkdirp(path.dirname(filePath)).then(_ => {
    fs.writeFileSync(filePath, data)
  })
}

file.getDirectories = function (basePath) {
  return fs.readdirSync(basePath)
    .map(f => path.join(basePath, f))
    .filter(f => fs.statSync(f).isDirectory())
}

// we really only need to check the extension
// in a singular fashion for this engine,
// so there's no need to account for searching
// for multiple extensions at the same time.
file.getFiles = function (basePath, ext) {
  // :: normalize the extension
  const extension = /^\./.test(ext) ? ext : `.${ext}`

  return fs.readdirSync(basePath)
    .filter(f => path.extname(f) === extension)
    .map(f => path.join(basePath, f))
}

export { file }
