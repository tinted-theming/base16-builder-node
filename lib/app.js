const sh = require('shelljs')
const program = require('commander')
const builder = require('./builder')

// this script requires git to do its magic
if (!sh.which('git')) {
  sh.echo('This script requires git to run.')
  process.exit(1)
}

// :: go!

// FIXME
// There has to be a way for commander to run a subroutine
// when it didn't match any command
let runFlag = false

program
  .usage('<command> [subcommand]')
  .version(require('../package.json').version)

program
  .command('builder [subcommand]')
  .description('test')
  .action(cmd => {
    // :: set a default command
    cmd = cmd || 'build'
    if (!builder[cmd]) {
      sh.echo(`Unknown command: ${cmd}.`)
      process.exit(1)
    }

    runFlag = builder[cmd]()
  })

program
  .command('*', null, { noHelp: true })
  .action(_ => {
    runFlag = program.help()
  })

program.parse(process.argv)

// FIXME
// Checks if any of our subroutines were successfully called,
// and runs help otherwise
if (!runFlag) {
  program.help()
}
