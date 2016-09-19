#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const Lexer = require('./lexer');
const Parser = require('./parser');
const Compiler = require('./compiler');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

//       Search current directory for doxyfile.json - if not found, shouldn't matter; fall back on command line args

// Set env to original cwd
process.env.INIT_CWD = process.cwd();

// All files to process
var allFiles = [];
var localDoxy = false;
var currentTimeReference = new Date();
var timeStamp = '['+chalk.dim.cyan(('0'+currentTimeReference.getHours()).slice(-2)+':'+('0'+currentTimeReference.getMinutes()).slice(-2)+':'+('0'+currentTimeReference.getSeconds()).slice(-2))+'] ';

// List of directories we will never want to search that possibly can
// be harmful to this program if they're attempted to be searched.
var blackListedDirectories = [
  '.git',
  'node_modules'
];

// Check argv for flags
if(Object.getOwnPropertyNames(argv).length > 1){
  Object.getOwnPropertyNames(argv).filter(function(flag){
    if(flag === '_') return false;
    resolveFlag(flag);
  });
}else{
  continueProcess();
}

// Begin to parse and tokenize command line arguments
function continueProcess(){
  if(!argv._.length){
    if(!checkForDoxyFile()){
      resolveFlag('h');
      process.exit(0);
    }else{
      localDoxy = true;
    }
  }
  console.log('\n'+timeStamp+'Attempting to fetch files');
  if(!localDoxy){
    argv._.map(function(path){
      // this returns tokenizes all directories and the file if given
      // this regex accepts all extensions on files, since we want to
      // handle the file validity somewhere else.
      // NOTE: this regex is only used to resolve files within a directory,
      // not actual directories themselves.
      var tokenize = /(\.{1,2}|[0-9a-zA-Z]+)(?:(\/))|([0-9a-zA-Z.]+\.\w+$)/ig;
      var pathTokens = [];
      var lex = null;
      while(lex = tokenize.exec(path)){
        pathTokens.push(lex[1]||lex[3]);
      }
      // @TEST
      // just prints all resolved tokens
      // pathTokens.map(function(tok){
      //   console.log(timeStamp+'token resolved: '+chalk.yellow(tok));
      // });
      var isDirectory = false;
      try{
        isDirectory = !!fs.lstatSync(path).isDirectory();
      }catch(err){
        reportError('Given path does not exist or was unable to be located: \n'+err);
        if(path.indexOf('*')>-1){
          reportError('  If you\'re trying to use a wildcard (*) to relay every type of file within a directory, do not use it.');
          reportError('  Simply pass in the path to the directory and all the valid files will be compiled automatically.');
        }
        process.exit(1);
      }
      if(isDirectory){
        recurseAllFilesInDirectory(path, allFiles);
      }
      var isFile = false;
      try{
        isFile = !!fs.lstatSync(path).isFile();
      }catch(err){
        reportError('Given path does not resolve to a file or was unable to be located: \n'+err);
        process.exit(1);
      }
      if(isFile){
        if(validFilePath(pathTokens)){
          allFiles.push(path);
        }else{
          console.log('Invalid file type:');
          reportError('  '+pathTokens[pathTokens.length-1]);
          console.log('For help use the --h or --help command.');
          process.exit(0);
        }
      }
    });
    workOnFileTree();
  }else{
    fs.readFile('./doxyfile.json', 'utf8', function(err, data){
      if(err){
        reportError("Error occured when attempting to read file: doxyfile.json\n\n"+err.message);
      }
      var revivedData = JSON.parse(data);
      if(typeof revivedData.targets === 'string'){
        allFiles.push(revivedData.targets);
      }else{
        revivedData.targets.map(function(target){
          // Target may be directory or a filepath
          var tokenize = /(\.{1,2}|[0-9a-zA-Z]+)(?:(\/))|([0-9a-zA-Z.]+\.\w+$)/ig;
          var pathTokens = [];
          var lex = null;
          while(lex = tokenize.exec(target)){
            pathTokens.push(lex[1]||lex[3]);
          }
          // @TEST
          // just prints all resolved tokens
          // pathTokens.map(function(tok){
          //   console.log(timeStamp+'token resolved: '+chalk.yellow(tok));
          // });
          var isDirectory = false;
          try{
            isDirectory = !!fs.lstatSync(target).isDirectory();
          }catch(err){
            reportError('Given path does not exist or was unable to be located: \n'+err);
            if(target.indexOf('*')>-1){
              reportError('  If you\'re trying to use a wildcard (*) to relay every type of file within a directory, do not use it.');
              reportError('  Simply pass in the path to the directory and all the valid files will be compiled automatically.');
            }
            process.exit(1);
          }
          if(isDirectory){
            recurseAllFilesInDirectory(target, allFiles);
          }
          var isFile = false;
          try{
            isFile = !!fs.lstatSync(target).isFile();
          }catch(err){
            reportError('Given path does not resolve to a file or was unable to be located: \n'+err);
            process.exit(1);
          }
          if(isFile){
            if(validFilePath(pathTokens)){
              allFiles.push(target);
            }else{
              console.log('Invalid file type:');
              reportError('  '+pathTokens[pathTokens.length-1]);
              console.log('For help use the --h or --help command.');
              process.exit(0);
            }
          }
        });
      }
      workOnFileTree();
    });
  }
}

function workOnFileTree(){
  // Task files resolved - let's start lexing and parsing
  console.log(timeStamp+'Working on '+chalk.dim.cyan(allFiles.length)+' file'+(allFiles.length > 1 ? 's' : ''));
  allFiles.map(function(taskFile){
    fs.readFile(taskFile, 'utf8', function(err, data){
      if(err){
        reportError("Error occured when attempting to read file: "+taskFile+'\n\n'+err.message);
      }
      var tokenizer = new Lexer(taskFile, data);
      try{
        tokenizer.generateTokens();
      }catch(e){
        reportError(e);
      }
      var parser = new Parser(taskFile, tokenizer.tokenList);
      parser.generateTokenTree();
//console.log(JSON.stringify(parser.tokenTree, null, 4));
      var markdownGenerator = new Compiler(parser.tokenTree);
      markdownGenerator.compile();
    });
  });
}

function recurseAllFilesInDirectory(path, allFiles){
  var slashIfNeeded, actualPath;
  fs.readdirSync(path).map(function(derivedFile){
    // Ignore black listed directories
    // poisonious areas which can halt the script from running
    if(blackListedDirectories.indexOf(derivedFile) === -1){
      if(validFilePath(derivedFile)){
        slashIfNeeded = path[path.length-1] === '/' ? '' : '/';
        actualPath = path + slashIfNeeded + derivedFile;
        allFiles.push(actualPath);
      }else{
        slashIfNeeded = path[path.length-1] === '/' ? '' : '/';
        actualPath = path + slashIfNeeded + derivedFile;
        if(fs.lstatSync(actualPath).isDirectory()){
          recurseAllFilesInDirectory(actualPath, allFiles);
        }
      }
    }else{
      console.log(timeStamp+'Ignoring '+chalk.dim.yellow(derivedFile)+' directory');
    }
  });
}

function resolveFlag(flag){
  console.log(chalk.bold.white('\nUsage: doxide <command>\n'));
  console.log(chalk.bold.white('  Possible <commands> could be:\n'));
  switch(flag){
    case 'h':
    case 'help':
      console.log(chalk.bold.white('  doxide                             Compiles based on your doxyfile.json'));
      console.log(chalk.bold.white('  doxide --h                         Prompts the help screen'));
      console.log(chalk.bold.white('  doxide --help                      Prompts the help screen'));
      console.log(chalk.bold.white('  doxide <file>                      Compiles <file>'));
      console.log(chalk.bold.white('  doxide <directory>                 Compiles all valid files in <directory>'));
      console.log(chalk.bold.white('  doxide <file1> -o <file2>          Compiles <file1> and stores output in <file2>'));
      console.log(chalk.bold.white('  doxide <directory> -o <file>       Compiles all valid files in <directory> and stores output in <file>'));
      break;
    default:
      console.log(chalk.bold.white('Unrecognized command: ') + chalk.bold.red(flag));
      console.log(chalk.bold.white('Here is a list of possible <commands>:'));
      console.log(chalk.bold.white('  --h\n  --help\n  -c\n  -o\n  '));
  }
}

// Check to see if there's a doxyfile.json
function checkForDoxyFile(){
  var localFiles = fs.readdirSync('./');
  return (localFiles.indexOf('doxyfile.json') > -1);
}

// TODO: custom flag for extra extensions
function validFilePath(file){
  if(typeof file === 'string'){
    var minimalSyntax = /(([0-9a-zA-Z])+(:?\.)?)+(.js)$/ig;
    return file.match(minimalSyntax);
  }else if(file instanceof Array){
    if(!file.length){
      reportError('Error while validating file path: too few tokens');
      process.exit(1);
    }
    var _file = file[file.length-1];
    var _extension = _file.split(".").pop();
    return _extension === 'js';
  }
}

function reportError(err){
  console.log(chalk.bold.red(err));
}
