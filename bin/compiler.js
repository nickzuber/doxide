/**
 * Compile the container given by the parser into string? markdown code.
 *
 * Write this out to a destination file denoted by -o flag or write to command line.
 */

'use strict';

const _ = require('./constants');

const Compiler = function(nodeTree){
  this.nodeTree = nodeTree;
  this.output = '';
}

Compiler.prototype.compile = function(){
  var nodeTree = this.nodeTree,
          self = this;
  // console.log('TOKEN TREE HAS ' + nodeTree.root.children.length + ' CHILDREN');
  nodeTree.root.children.map(function(node){
    var nodeLabels = [];
    for(var i=0; i<node.children.length; ++i){
      nodeLabels.push(node.children[i].data.label);
    }
    if(nodeLabels.indexOf('header') > -1){
      self.generateHeader(node.children);
    }
    else{
      self.generateFunction(node.children);
    }
  });
};

Compiler.prototype.generateHeader = function(node){
  var self = this;

  // console.log('GENERATING HEADER');

  node.map(function(innerNode){
    var dataRef = innerNode.data;
    // console.log(dataRef);
    var outputString = '';
    if(dataRef.label === 'header'){
      outputString = _.HEADER.split('{{link}}').join(dataRef.content.toLowerCase());
      outputString = outputString.split('{{header}}').join(dataRef.content);
    }
    else if(dataRef.label === 'property'){
      outputString = _.PROPERTY.split('{{name}}').join(dataRef.argName);
      outputString = outputString.split('{{type}}').join(dataRef.type);
      outputString = outputString.split('{{description}}').join(dataRef.content);
    }
    self.output += outputString;
  });
  this.output += '\n';
  // console.log(this.output)
};

Compiler.prototype.generateFunction = function(node){
  var self         = this,
      _constructor = false,
      paramSoFar   = '',
      lclStart     = _.FUNCTION_START,
      lclParam     = _.PARAMS,
      lclEnd       = _.FUNCTION_END;

// console.log('GENERATING FUNCTION');

  // constructor info will always appear after description info, so we can't check
  // if the function is a constructor before we replace the description. This reverse
  // is a cheap trick to make it so that
  node.reverse();

  node.map(function(innerNode){
    var dataRef = innerNode.data;
    // console.log(dataRef);
    // CONSTRUCTOR
    if(dataRef.label === 'constructor'){
      _constructor = true;
      lclEnd = lclEnd.split('{{description}}').join(dataRef.content);
    }
    // START
    if(dataRef.label === 'function' || dataRef.label === 'var' || dataRef.label === 'let' || dataRef.label === 'const'){
      if(_constructor){
        lclStart = lclStart.split('{{function}}').join('(constructor)');
      }else{
        lclStart = lclStart.split('{{function}}').join(dataRef.content);
      }
    }
    // PARAMS
    if(dataRef.label === 'param'){
      if (paramSoFar.length) {
        paramSoFar += ', '
      }
      paramSoFar += lclParam.split('{{type}}').join(dataRef.type);
      paramSoFar = paramSoFar.split('{{name}}').join(dataRef.argName);
    }
    // RETURN
    if(dataRef.label === 'return'){
      lclEnd = lclEnd.split('{{return}}').join(dataRef.type);
    }
    // END
    if(dataRef.label === _.DESCRIPTION){
      lclEnd = lclEnd.split('{{description}}').join(dataRef.content);
    }
  });
  self.output += lclStart + paramSoFar + lclEnd;
  this.output += '\n';
  //// console.log(`\nOUTPUT:\n${this.output}`)
};


module.exports = Compiler;
