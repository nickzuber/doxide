# Doxide

> A tool for transforming jsDoc style documentation in JavaScript files into API documentation in markdown.

## Installation

```
$ npm install --save-dev node-doxide -g
```

## Usage

<img src="./.github/example.png" />

There are a few different approaches for using Doxide for your application. You can either create a `doxyfile.json` to define a set of files to scan and where to write the output to, or you can manually define these arguments in the command line.

```
$ doxide --help

Usage: doxide <command>

  Possible <commands> could be:

  doxide                             Compiles based on your doxyfile.json
  doxide --h                         Prompts the help screen
  doxide --help                      Prompts the help screen
  doxide <file>                      Compiles <file>
  doxide <directory>                 Compiles all valid files in <directory>
  doxide <file1> -o <file2>          Compiles <file1> and stores output in <file2>
  doxide <directory> -o <file>       Compiles all valid files in <directory> and stores output in <file>
```


### Using CLI arguments

```
$ doxide path/to/file -o path/to/output
```

### Using doxyfile.json

A `doxyfile.json` consists of a few main fields:

 - targets
 - output

The `targets` field consist of an array of files that are to be parsed by Doxide. Being an array, it can consist of a single file or multiple files. You can also include a path to a directory here, and it's important to note that the directory will include all subdirectories within.

The `output` field is a single string of the name of the file to write the output to. If no output destination is specified, the compiler will default to writing the output to the console.

Example of the `doxyfile.json` being used for [Needle](https://github.com/nickzuber/needle) which parses every source file and then stores the results into a single markdown file:

```json
{
  "targets" : [
    "./src"
  ],
  "output" : "./docs/doxide_output.md"
}

```

## API Reference

...

## Examples

Using a `doxyfile.json`

```
$ cd root/director/with/doxyfile
$ doxide
```

Using the cli arguments

```
$ doxide main.js component.jsx router.js -o docs/output.md

[02:03:28] Attempting to fetch files
[02:03:28] Working on 3 files
[02:03:28] Cleared docs/output.md prepping for output
[02:03:28] Successfully wrote all of main.js documention from to output.md
[02:03:28] Successfully wrote all of component.jsx documention from to output.md
[02:03:28] Successfully wrote all of router.js documention from to output.md
```

## License
[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2015-Present Nick Zuber
