/** 
 * Compile the container given by the parser into string? markdown code.
 * 
 * Write this out to a destination file denoted by -o flag or write to command line.
 */

'use strict';

const _ = require('./constants');

/**
*/
const Compiler = function(nodeTree){
  this.nodeTree = nodeTree;
}

/**
*/
Compiler.prototype.compile = function(){
  var nodeTree = this.nodeTree;
  console.log('TOKEN TREE HAS ' + nodeTree.root.children.length + ' CHILDREN');
    nodeTree.root.children.map(function(node){
      node.children.map(function(innerNode){
        console.log(innerNode.data.label + ': content:');
        console.log(innerNode.data);
      });
      console.log('');
    });
};

module.exports = Compiler;