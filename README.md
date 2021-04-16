# base16-builder <img alt="Base16" src="./base16.png" xwidth="300" align="right" style="padding-top:0.6rem;">

[![latest version](https://badgen.net/npm/v/base16-builder-node?label=latest)](https://www.npmjs.com/package/base16-builder-node)
[![license](https://badgen.net/badge/license/MIT/cyan)](https://github.com/joshgoebel/base16-builder-node/blob/main/LICENSE)
[![open issues](https://badgen.net/github/open-issues/joshgoebel/base16-builder-node)](https://github.com/joshgoebel/base16-builder-node/issues)
[![vulnerabilities](https://badgen.net/snyk/joshgoebel/base16-builder-node)](https://snyk.io/test/github/joshgoebel/base16-builder-node?targetFile=package.json)
![dependencies](https://badgen.net/david/dep/joshgoebel/base16-builder-node?label=deps)
<!-- ![build and CI status](https://badgen.net/github/checks/joshgoebel/base16-builder-node/main?label=build) -->
<!-- [![code quality](https://badgen.net/lgtm/grade/g/joshgoebel/base16-builder-node/js?label=code+quality)](https://lgtm.com/projects/g/joshgoebel/base16-builder-node/?mode=list) -->


[![discord](https://badgen.net/badge/icon/join%20discord?icon=discord&color=7289DA&label)](https://discord.gg/nVRVKxFzJh)



A builder for theme files based off of the [base16 specification](http://chriskempson.com/projects/base16/) by [Chris Kempson](https://github.com/chriskempson).


## Install

```
npm install -g base16-builder-node
```

This package provides a `base16` console command.  Invoke it from any directory you want to build your themes, templates, and schemes in.


## Usage

```sh
$ base16 build
```

Builds all templates using all configured scheme files.

When you run build the first time (or when the script detects no scheme and templates files in the working directory),
an `update` will be performed before building.

```sh
$ base16 update
```

Updates all scheme and template definition files from Git sources.


### Build Assets

The theme files will be generated inside every template directory in the
subdirectory specified by that template's configuration.

For example: `textmate`. The built files would be found at:

 `./templates/textmate/Themes`,


### If you are a template maintainer

The easiest thing to do after running `update` initially is likely just to
disable all other templates (than your own) and then simply maintain your
template repository inside your base16 build folder (or symlink it).

You could facilitate this with a tiny build script, etc:

```shell
#!/bin/bash
cd ../..
base16 build
```
