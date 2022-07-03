import { program } from "commander";
import { builder } from "./builder.js";
import { VERSION } from "./version.js"

// :: go!

function main() {
 program
   .usage('<command>')
   .version(VERSION, "-v, --version")

 program
   .command('build')
   .description('Builds all templates using all your scheme files.')
   .action(_ => {
     builder["build"]()
   })

 program.parse()
}

export { main };
