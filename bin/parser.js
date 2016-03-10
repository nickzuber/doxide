/** 
 * Parses the tree structure into a container that
 * we can use to organize the data we need and will compile.
 * 
 * Pass this container to the compiler.
 */
 
'use strict';

const Needle = require('node-needle');
const tagFormat = /(@[\w]+)([A-Za-z1-9.,!#$%^&*(){}\[\]\'\";:<>\/? ]*)/gmi;

const Parser = function(tokenList){
  this.tokenList = tokenList;
  this.tokenTree = new Needle.KaryTree();
}

Parser.prototype.generateTree = function(){
  var tokens = [];
  // This PROBABLY WON'T work - check it see if it deletes actual list as well
  var tokenListCpy = this.tokenList;
  while(tokenListCpy.size()){
    var data = tokenListCpy.head.contents;
    var locateToken;
    do{
      matches = tagFormat.exec(data);
      if(matches){
        var tok = [];
        tok.label = matches[1];
        tok.contents = matches[2];
        tokens.push(tok);
      }
    }while(matches);
    tokenListCpy.removeHead();
  }
  console.log(tokens);
}