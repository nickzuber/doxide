/** @fileOverview @description
 * I think we gotta find all the bits from the file we need,
 * label them, and store them linearly in a list. Let the parser
 * worry about if its correct grammar wise, we just want to tokenize them
 * here.
 *
 * Pass this list to the parser.
 */

'use strict';

const Needle = require('node-needle');
const Token = require('./token');
const _ = require('./constants');

/** @private
 * Finds the lowest value of an array.
 * @param {array} array to search
 * return {number} the index of the lowest element
 */
function min(arr){
  var minIndex = null;
  for(var i=0; i<arr.length; ++i){
    if(arr[i] === -1){
      continue;
    }
    if(minIndex === null){
      minIndex = i;
      continue;
    }
    arr[i] < arr[minIndex] ? minIndex = i : 0;
  };
  return minIndex;
}

/** @constructor
 * Creates an instance of a lexer to tokenize data.
 * @param {string} raw file contents in string form
 * @return {void}
 */
const Lexer = function(fileName, data){
  this.file = fileName;
  this.data = data.replace(/(\r\n|\n|\r)/gm, '');
  this.tokenList = new Needle.SinglyLinkedList();
}

Lexer.prototype.generateTokens = function(){
  var lclData = this.data;
  var errorHandler = 0;

  do{
    // Collect the indexes of all the things we're looking for
    var tokenContents = [],
        tokenIndexes = [],
        indexOfClosestToken,
        distanceToSlice;

    // Look for any data types
    if(lclData.search(_.DATA_TYPES) > -1){
      tokenIndexes.push(lclData.search(_.DATA_TYPES));
      tokenContents.push(new Token(_.ENUM.DATA_TYPE, lclData.match(_.DATA_TYPES)[0]));
    }

    // Look for any prototype definitions/declarations
    if(lclData.search(_.PROTO_TYPE) > -1){
      tokenIndexes.push(lclData.search(_.PROTO_TYPE));
      tokenContents.push(new Token(_.ENUM.PROTO, lclData.match(_.PROTO_TYPE)[0]));
    }

    // Look for any comments
    if(lclData.indexOf(_.COMMENT_START) > -1){
      if(lclData.indexOf(_.COMMENT_END) === -1){
        throw new Error('Error while lexing file:\nComment started but never ended in '+this.file);
      }
      tokenIndexes.push(lclData.indexOf(_.COMMENT_START));
      tokenContents.push(new Token(_.ENUM.COMMENT, lclData.substring(lclData.indexOf(_.COMMENT_START), lclData.indexOf(_.COMMENT_END)+2)));
    }

    // Slice file and tokenize partition
    indexOfClosestToken = min(tokenIndexes);
    if(indexOfClosestToken === null){
      break;
    }

    distanceToSlice = tokenIndexes[indexOfClosestToken] + tokenContents[indexOfClosestToken].content.length;

    if(++errorHandler >= 65536){
      throw new Error('Infinate loop detected in lexer while reading file '+this.file);
    };

    this.tokenList.insertBack(tokenContents[indexOfClosestToken]);
    lclData = lclData.slice(distanceToSlice);

  }while(min(tokenContents) !== null);


  //@TEST
  // var node = this.tokenList.head;
  // while(node !== null){
  //   console.log(node.data);
  //   node = node.next;
  // }
}

module.exports = Lexer;
