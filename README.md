base16-builder-node
===

A builder for theme files based off of the [base16 specification](http://chriskempson.com/projects/base16/) by [Chris Kempson](https://github.com/chriskempson).


Installing
---

```
npm install -g base16-builder-node
```

This package makes a `base16` console command available.
Invoke it from any directory you want to build your themes, templates, and schemes in.


Usage
---

```
$ base16 builder

- or -

$ base16 builder build
```

Builds all templates using all your scheme files.

When you run this for the first time (or when the script detects that there are no scheme and templates files in the working directory),
this will attempt a `base16 builder update`.

```
$ base16 builder update
```

Updates all your scheme and template definition files.


Other stuff
---

Theme files will be saved in `/templates/<group directory>`,
under subdirectories defined by the template's configuration.
