/** 
 * A simple format for the tokens we want to store our
 * data as.
 */

/** @constructor
 * Creates an instance of a simple token.
 */
const Token = function(label, contents){
  this.label = label;
  this.contents = contents;
}

module.exports = Token;