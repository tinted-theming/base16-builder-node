# base16-builder-node


A builder for theme files based off of the [base16 specification](http://chriskempson.com/projects/base16/) by [Chris Kempson](https://github.com/chriskempson).


## Installing

```
npm install -g base16-builder-node
```

This package makes a `base16` console command available.  Invoke it from any directory you want to build your themes, templates, and schemes in.


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
