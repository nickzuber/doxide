/** 
 * Parses the tree structure into a container that
 * we can use to organize the data we need and will compile.
 * 
 * Pass this container to the compiler.
 */
 
'use strict';

const Needle = require('node-needle');
const Token = require('./token');
const _ = require('./constants');


/**
 */
const Parser = function(tokenList){
  this.tokenList = tokenList;
  this.tokenTree = new Needle.KaryTree();
}


/**
 */
Parser.prototype.generateTokenTree = function(){
  var node = this.tokenList.head,
      token;
  while(node !== null){
    switch(node.data.label){
      case _.ENUM.COMMENT:
        this.parseCommentToken(node);
        break;
      case _.ENUM.DATA_TYPE:
      case _.ENUM.PROTO:
      default:
    }
    node = node.next;
  }
}


/**
 */
Parser.prototype.parseCommentToken = function(token){
  var tokens = [];
  var data = token.data.content;
  var tokenizer;
  do{
    tokenizer = _.TAGFORMAT.exec(data);
    if(tokenizer){
      tokens.push(new Token(tokenizer[1], tokenizer[2]));
    }
  }while(tokenizer);
  console.log(tokens);
  // TODO: clean the content 
}

module.exports = Parser;