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
    tokens[index].content = tok.content.replace(/ +(?= )/g, '').trim();
    // If types are defined, we want to split this up
    do{
      tokenizer = _.EXTRACT_TYPE.exec(tok.content);
      if(tokenizer){
        if(typeof tok.type === 'undefined'){
          tok.type = [];
        }
        tok.type.push(tokenizer[1]);
      }
    }while(tokenizer);
    // If names are defined, we want to split this up
    do{
      tokenizer = _.EXTRACT_NAME.exec(tok.content);
      if(tokenizer){
        if(typeof tok.name === 'undefined'){
          tok.name = [];
        }
        tok.name.push(tokenizer[1].split(' ')[0]);
      }
    }while(tokenizer);
    // If descriptions are defined, we want to split this up
    do{
      tokenizer = _.EXTRACT_DESC.exec(tok.content);
      if(tokenizer){
        if(typeof tok.description === 'undefined'){
          tok.description = [];
        }
        tok.description.push(tokenizer[3].trim());
      }
    }while(tokenizer);

    this.tokenTree.root.children[lastChildIndex].appendChild(tok);
  }.bind(this));

  this.state = _.FOUND_A_COMMENT;
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
  
  this.state = _.LOOKING_FOR_COMMENT;
}

module.exports = Parser;