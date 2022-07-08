import { Command } from "commander";
import { builder } from "./builder.js";
import { VERSION, SPEC_VERSION, BASE16_VERSION, BASE24_VERSION } from "./version.js"

// :: go!

const VERSION_STRING = `base16-builder v${VERSION}\n` +
   `  builder spec v${SPEC_VERSION}\n` +
   `  base16 style spec v${BASE16_VERSION}\n` +
   `  base24 style spec (${BASE24_VERSION})`

function main() {
  let program = new Command()
  program
    .name("base16")
    .description("A builder for schemes and templates based on various style systems.")
    .version(VERSION_STRING)

  program
    .command('build')
    .argument("<path>", "path to build")
    .option("--prefix <prefix>", "prefix for built files (default none)")
    .option("--verbose", "increase verbosity")
    .description('Builds templates and scheme files.')
    .action((path, options) => {
      builder["build"](path, options)
    })

 program.parse()
 let opts = program.opts()
}

export { main };
