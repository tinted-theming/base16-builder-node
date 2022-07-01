const program = require('commander')
const builder = require('./builder')

// :: go!

program
  .usage('<command>')
  .version(require('../package.json').version, "-v, --version")

program
  .command('build')
  .description('Builds all templates using all your scheme files.')
  .action(_ => {
    builder["build"]()
  })



program.parse()

