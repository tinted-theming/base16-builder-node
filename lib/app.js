import { program } from "commander";
import { builder } from "./builder.js";
import { VERSION, SPEC_VERSION, BASE16_VERSION, BASE24_VERSION } from "./version.js"

// :: go!

function main() {
 program
   .usage('<command>')
   .option("-v, --version")
   .action(_ => {
      console.log(
        `base16-builder v${VERSION}\n` +
        `  builder spec v${SPEC_VERSION}\n` +
        `  base16 style spec v${BASE16_VERSION}\n` +
        `  base24 style spec (${BASE24_VERSION})`
        )
   })
   // .version(`base16-builder v${VERSION}\nBase16 spec v${SPEC_VERSION}`, "-v, --version")

 program
   .command('build')
   .argument("<path>", "path to build")
   .option("--prefix <prefix>", "prefix for built files (default none)")
   .option("--verbose", "increase verbosity")
   .description('Builds all templates using all your scheme files.')
   .action((path, options) => {
     builder["build"](path, options)
   })

 program.parse()
}

export { main };
