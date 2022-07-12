# base16-builder-node <img alt="Color wheel" src="./color_wheel.png" width="100" align="right" style="padding-top:0.6rem;">

[![latest version](https://badgen.net/npm/v/base16-builder-node?label=latest)](https://www.npmjs.com/package/base16-builder-node)
[![license](https://badgen.net/badge/license/MIT/cyan)](https://github.com/joshgoebel/base16-builder-node/blob/main/LICENSE)
[![open issues](https://badgen.net/github/open-issues/joshgoebel/base16-builder-node)](https://github.com/base16-project/base16-builder-node/issues)
[![vulnerabilities](https://badgen.net/snyk/base16-project/base16-builder-node)](https://snyk.io/test/github/base16-project/base16-builder-node?targetFile=package.json)
<!-- ![build and CI status](https://badgen.net/github/checks/joshgoebel/base16-builder-node/main?label=build) -->
<!-- [![code quality](https://badgen.net/lgtm/grade/g/joshgoebel/base16-builder-node/js?label=code+quality)](https://lgtm.com/projects/g/joshgoebel/base16-builder-node/?mode=list) -->

A builder for schemes and templates based on clear, universal [style specifications](#what-is-a-style-specification).  The output is app specific theming configurations.  _Build a color scheme once, use it everywhere._

**Features**

- Supports both `base16` and `base24` style specs (with more to come)
   - Chris's original [Base16 v0.2 styling spec](https://github.com/chriskempson/base16)
   - Base24 ([5625d94](https://github.com/Base24/base24/commit/5625d94c0720c38cc7a0703766d61131a6bda5a6)) styling spec
- Conforms to the [Builder v0.10.1 spec](https://github.com/base16-project/home/blob/main/builder.md)
- Builds all installed templates/schemes in one quick pass


## What is a style specification?

A specification details palette architecture and how it should be used for rendering application UI or syntax highlighting.  Real life implementations of a style specification typically include a color scheme and app templates.

**Supported specifications**

- [Base16](https://github.com/base16-project/home) - an architecture of carefully chosen syntax highlighting using a base of just sixteen colors.
- [Base24](https://github.com/Base24/base24) - Base16 plus an additional 8 colors to allow using all 16 ANSI colors in the terminal.

## Install

```sh
npm install -g base16-builder-node
```

This package provides a `base16` console command.  Invoke it from any directory you want to build your themes, templates, and schemes in.

## Basic Usage - Base16 example

Your working directory will need the following substructure:

- `base16/schemes`
- `base16/templates`

```sh
cd working_dir
mkdir -p base16/templates && cd base16
git clone https://github.com/base16-project/base16-schemes.git schemes
cd templates
git clone [your template of choice]
git clone [another template of choice]
cd ../..
base16 build base16 --prefix base16-
```

Builds all templates found in `base16/templates` using all scheme files from `base16/schemes` applying the `base16-` prefix to each.


### Build Assets

The theme files will be generated inside every template directory in the
subdirectory specified by that template's configuration.

For example: `textmate`. The built files would be found at:

 `./templates/textmate/Themes`,


### If you are a template maintainer

The easiest thing is to simply maintain your template repository inside your base16-build working folder (or symlink it).

You could facilitate this easily (from inside your template dir) with a tiny build script, etc:

```bash
#!/bin/bash
cd ../../..
base16 build
```

### Credit where it's due

Color wheel icon thanks to [Color icons created by Nikita Golubev - Flaticon](https://www.flaticon.com/free-icons/color).

