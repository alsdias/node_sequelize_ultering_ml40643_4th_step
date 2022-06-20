 /*
 * Provides sequential counting begining at 1 and incrementing by 1.
 * Example:
 * const Counter = require('./utils/Counter');
 * let counter = new Counter();
 * console.log(counter.add());
 * console.log(counter.add());
 * console.log(counter.add());
 * 
 */
class Counter {
  
  constructor(id) {
    this.id = id;
    this.buffer = new SharedArrayBuffer(25);
    this.arr = new Uint8Array(this.buffer);
    this.arr[this.id] = 1;
  }
  
  init() {
    this.arr[this.id] = 0;
  }

  // adds and return current value.
  add() {
    return Atomics.add(this.arr, this.id, 1);
  }

  get() {
    Atomics.load(arr, this.id);
  }
}

module.exports = Counter;