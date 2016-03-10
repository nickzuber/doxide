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

const COMMENT_START = '/**';
const COMMENT_END = '*/';
const DATA_TYPES = [
  'var ',
  'function ',
  'const ',
  'let '
];

/** @private @description
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

/** @constructor @description
 * Creates an instance of a lexer to tokenize data.
 * @param {string} raw file contents in string form
 * @return {void}
 */
const Lexer = function(fileName, data){
  this.file = fileName;
  this.data = data.replace(/(\r\n|\n|\r)/gm,'');
  this.tokenList = new Needle.SinglyLinkedList();
}

Lexer.prototype.generateTokens = function(){
  var lclData = this.data;
  var errorHandler = 0;

  do{
    // Collect the indexes of all the things we're looking for
    var nextItems = [],
        nextType = [],
        indexOfClosestToken,
        distanceToSlice;

    // Look for any data types
    DATA_TYPES.map(function(type){
      if(lclData.indexOf(type) > -1){
        nextType.push(lclData.indexOf(type));
        nextItems.push({'label': 'dataType', 'content': type});
      }
    });

    // Look for any comment starts
    if(lclData.indexOf(COMMENT_START) > -1){
      if(lclData.indexOf(COMMENT_END) === -1){
        throw new Error('Error while lexing file:\nComment started but never ended in '+this.file);
      }
      nextType.push(lclData.indexOf(COMMENT_START));
      nextItems.push({'label': 'comment', 'content': lclData.substring(lclData.indexOf(COMMENT_START), lclData.indexOf(COMMENT_END)+2)});
    }

    // Slice file and tokenize partition
    indexOfClosestToken = min(nextType);
    if(indexOfClosestToken === null){
      break;
    }

    distanceToSlice = nextType[indexOfClosestToken] + nextItems[indexOfClosestToken].content.length;

    if(++errorHandler >= 10000){
      throw new Error('Infinate loop detected in lexer while reading file '+this.file);
    };

    this.tokenList.insertBack(nextItems[indexOfClosestToken]);
    lclData = lclData.slice(distanceToSlice);

  }while(min(nextItems) !== null);

  var node = this.tokenList.head;
  while(node !== null){
    console.log(node.data);
    node = node.next;
  }

}

module.exports = Lexer;