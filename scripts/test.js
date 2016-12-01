/** @header
 * Needle.Queue
 * @property {Node} front The first element in the queue
 * @property {Node} back The last element in the queue
 * @property {number} size The number of nodes in the queue
 * @notes
 * Asymptotic time complexities
 * +-------------------+
 * | enqueue  |  O(1)  |
 * | dequeue  |  O(1)  |
 * +-------------------+
 *
 */

/**
 * Removes the `node` at the front of the queue
 * @param {string} str A description.
 * @param {number} num A description.
 * @return {void}
 */
Queue.prototype.dequeue = function(){
  if(this.size === 0){
    throw new Error("Attempted to dequeue from empty queue in Queue.enqueue");
  }
  // Remove from the front
  var newHead = this.front.next;
  this.front = newHead;
  --this.size;
}

module.exports = Queue;
