/**
 * The description of some function c.
 * @param {string} str The argument for this function.
 * @param {number} count The count.
 * @return {boolean} A description about what this funtion returns.
 */
function isEmpty(arg, count){
  var myCar = arg ? false : true;
  return myCar;
}

/**
 * Empties the entire tree.
 * @param {void}
 * @return {void}
 */
KaryTree.prototype.emptyTree = function(){
  if(this.root === null){
    throw new Error("Attempted to empty a nulled tree in KaryTree.emptyTree");
  }
  this.emptySubtree(this.root);
  this.root = null;
}


/**
 * Search for a node in the tree.
 * @param {*} the data of the node being searched for
 * @param {Node} [node] the node where to begin the insertion. This should be left blank when called
 *                      because the function default to inserting at the root.
 * @return {Node || false} returns the node if found, and false if not found
 */
KaryTree.prototype.search = function(data, node){
  if(node === null){
    return false;
  }

  // If node isn't defined, default to the root
  if(typeof node === 'undefined'){
    node = this.root;
  }

  // Check if current node is the one we're looking for
  if(JSON.stringify(data) ===  JSON.stringify(node.data)){
    return node;
  }

  // Traverse through each child
  node.children.map(function(child){
    search(data, child);
  });
}
