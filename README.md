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

...

### Using doxyfile.json

...

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
$ doxide path/to/file -o path/to/output
```

## License
[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2015-Present Nick Zuber
