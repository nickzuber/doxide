/** @description
 * The description of some function a.
 * @param {number} a number parameter
 * @param {string} a string parameter
 * @return {void} 
 */
function normalFunction(param){
  var something = 0;
  something = param + 10;
  return something;
}

/** @description
 * The description of some prototype.
 * @param {number} a number parameter
 * @return {void} 
 */
Obj.prototype.protoFunction = function(param){
  var something = 0;
  something = param + 10;
  return something;
}