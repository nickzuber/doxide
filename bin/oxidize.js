#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

// Set env var for ORIGINAL cwd
process.env.INIT_CWD = process.cwd();

// Set tasks
var tasks = argv._;

// TODO: custom flag for extra extensions
function validFilePath(file){
  var minimalSyntax = /(^[0-9a-zA-Z])(\w*)(.js)$/ig;
  return file.match(minimalSyntax);
}

function resolveFlag(flag){
  console.log(chalk.bold.white('\nUsage: oxidize <command>\n'));
  console.log(chalk.bold.white('  Possible <commands> could be:\n'));
  switch(flag){
    case 'h':
    case 'help':
      console.log(chalk.bold.white('  oxidize --h                     Prompts the help screen'));
      console.log(chalk.bold.white('  oxidize --help                  Prompts the help screen'));
      console.log(chalk.bold.white('  oxidize <file>                  Compiles Oxidize markdown based on <file> contents'));
      console.log(chalk.bold.white('  oxidize <directory>             Compiles Oxidize markdown based on all .js files in <directory> contents'));
      console.log(chalk.bold.white('  oxidize <file1> > <file2>       Compiles Oxidize markdown based on <file1> contents and stores it in <file2>'));
      console.log(chalk.bold.white('  oxidize <directory> > <file2>   Compiles Oxidize markdown based on all .js files in <directory> contents and stores it in <file2>'));
      break;
    default:
      console.log(chalk.bold.white('Unrecognized command: ') + chalk.bold.red(flag));
      console.log(chalk.bold.white('Here is a list of possible <commands>:'));
      console.log(chalk.bold.white('  --h\n  --help\n  '));
  }
}

function reportError(err){
  console.log(chalk.bold.red(err));
}

// Handle failure
process.once('exit', function(code){
  switch(code){
    case 1:
      reportError('Program failure at runtime:');
    break;
    case 2:
      reportError('No target files were given. For help use the --h or --help command.');
      process.exit(1);
    break;
    case 3:
      var errString = "";
      errString += 'Failure to locate target file(s)';
      reportError(errString);
      process.exit(1);
    break;
    case 4:
      reportError('some error 3');
      process.exit(1);
    break;
    case 5:
      reportError('some error 4');
      process.exit(1);
    break;
    default:
      process.exit(0);
  }
});

// Check argv for flags
if(Object.getOwnPropertyNames(argv).length > 1){
  Object.getOwnPropertyNames(argv).filter(function(flag){
    if(flag === '_') return false;
    resolveFlag(flag);
  });
}else{
  continueProcess();
}

function continueProcess(){
  // Locate target files
  console.log(chalk.magenta.bold('\nAttempting to fetch file(s)...'));
  if(!argv._.length){
    console.log(argv._.length);
    process.exit(2);
  }
  argv._.map(function(path){
    if(fs.lstatSync(path).isDirectory()){
      console.log('this is a directory: '+path);
      var files = fs.readdirSync(path);
      files.map(function(file){
        if(validFilePath(file)){
          console.log('  found a file: '+file);
        }
      });
    }else if(fs.lstatSync(path).isFile()){
      if(validFilePath(file)){
        console.log('this is a file: '+path);
      }
    }
  });

}












//console.log(chalk.bold.green('Markdown successfully compiled'));