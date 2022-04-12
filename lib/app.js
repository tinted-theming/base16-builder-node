const sh = require('shelljs')
const program = require('commander')
const builder = require('./builder')

// this script requires git to do its magic
if (!sh.which('git')) {
  sh.echo('This script requires git to run.')
  process.exit(1)
}

// :: go!

program
  .usage('<command>')
  .version(require('../package.json').version, "-v, --version")

program
  .command('update')
  .description('Updates scheme and template definition files.')
  .action(_ => {
    builder["update"]()
  })

program
  .command('build')
  .description('Builds all templates using all your scheme files.')
  .action(_ => {
    builder["build"]()
  })



program.parse()

