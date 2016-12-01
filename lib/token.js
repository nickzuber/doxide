/**
 * A simple format for the tokens we want to store our
 * data as.
 */

'use strict';

/** @constructor
 * @description
 * Creates an instance of a simple token.
 */
const Token = function(label, content){
  this.label = label;
  this.content = content;
}

module.exports = Token;
