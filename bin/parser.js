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
  this.tokenTree = new Needle.KaryTree(null);
  this.state = _.STARTING;
}


/**
 */
Parser.prototype.generateTokenTree = function(){
  var node = this.tokenList.head,
      token;
  while(node !== null){
    switch(node.data.label){
      case _.ENUM.COMMENT:
        if(this.state === _.STARTING || this.state === _.LOOKING_FOR_COMMENT || this.state === _.FOUND_A_COMMENT){
          this.parseCommentToken(node);
        }
        break;
      case _.ENUM.DATA_TYPE:
        if(this.state === _.FOUND_A_COMMENT){
          this.parseDataTypeToken(node);
        }
        break;
      case _.ENUM.PROTO:
        if(this.state === _.FOUND_A_COMMENT){
          this.parseProtoTypeToken(node);
        }
        break;
      default:
    }
    node = node.next;
  }
}


/**
 */
Parser.prototype.parseCommentToken = function(token){
  this.tokenTree.root.appendChild('NODE');
  var tokens = [];
  var data = token.data.content;
  var tokenizer;
  var lastChildIndex = this.tokenTree.root.children.length - 1;
  do{
    tokenizer = _.TAGFORMAT.exec(data);
    if(tokenizer){
      tokens.push(new Token(tokenizer[1], tokenizer[2]));
    }
  }while(tokenizer);
  // Clean the content
  tokens.map(function(tok, index){
    tokens[index].label = tok.label.split('@').join('');
    tokens[index].content = tok.content.split('/**').join('');
    tokens[index].content = tok.content.split('*/').join('');
    tokens[index].content = tok.content.split('*').join('');
    tokens[index].content = tok.content.replace(/ +(?= )/g,'').trim();
    this.tokenTree.root.children[lastChildIndex].appendChild(tok);
  }.bind(this));


  this.state = _.FOUND_A_COMMENT;
  //console.log(tokens);
}

/**
 */
Parser.prototype.parseDataTypeToken = function(token){
  var tokens = [];
  var data = token.data.content;
  var tokenizer;
  var lastChildIndex = this.tokenTree.root.children.length - 1;
  do{
    tokenizer = _.DATA_TYPES.exec(data);
    if(tokenizer){
      tokens.push(new Token(tokenizer[1], tokenizer[4]));
    }
  }while(tokenizer);
  tokens.map(function(tok){
    this.tokenTree.root.children[lastChildIndex].appendChild(tok);
  }.bind(this));
  
  //console.log(tokens);
  this.state = _.LOOKING_FOR_COMMENT;
}

/**
 */
Parser.prototype.parseProtoTypeToken = function(token){
  var tokens = [];
  var data = token.data.content;
  var tokenizer;
  var lastChildIndex = this.tokenTree.root.children.length - 1;
  do{
    tokenizer = _.PROTO_TYPE.exec(data);
    if(tokenizer){
      tokens.push(new Token(tokenizer[3], tokenizer[2]));
    }
  }while(tokenizer);
  tokens.map(function(tok){
    this.tokenTree.root.children[lastChildIndex].appendChild(tok);
  }.bind(this));
  
  //console.log(tokens);
  this.state = _.LOOKING_FOR_COMMENT;
}

module.exports = Parser;