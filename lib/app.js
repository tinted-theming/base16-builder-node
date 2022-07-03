import { program } from "commander";
import { builder } from "./builder.js";
import { VERSION, SPEC_VERSION } from "./version.js"

// :: go!

function main() {
 program
   .usage('<command>')
   .version(`base16-builder v${VERSION}\nBase16 spec v${SPEC_VERSION}`, "-v, --version")

 program
   .command('build')
   .description('Builds all templates using all your scheme files.')
   .action(_ => {
     builder["build"]()
   })

 program.parse()
}

export { main };
