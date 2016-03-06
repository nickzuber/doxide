/** 
 * I think we gotta find all the bits from the file we need,
 * label them, and store them linearly in a list. Let the parser
 * worry about if its correct grammar wise, we just want to tokenize them
 * here.
 *
 * Pass this list to the parser.
 */

const Needle = require('node-needle');
const Token = require('./token');

/** @constructor
 * Creates an instance of a lexer to tokenize data.
 * @param {string} raw file contents in string form
 * @return {void}
 */
const Lexer = function(data){
  this.data = data;
  this.tokenList = new Needle.LinkedList();
}