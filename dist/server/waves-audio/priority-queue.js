"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// works by reference
function swap(arr, i1, i2) {
  var tmp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = tmp;
}

// https://jsperf.com/js-for-loop-vs-array-indexof/346
function indexOf(arr, el) {
  var l = arr.length;
  // ignore first element as it can't be a entry
  for (var i = 1; i < l; i++) {
    if (arr[i] === el) {
      return i;
    }
  }

  return -1;
}

/**
 * Define if `time1` should be lower in the topography than `time2`.
 * Is dynamically affected to the priority queue according to handle `min` and `max` heap.
 * @param {Number} time1
 * @param {Number} time2
 * @return {Boolean}
 */
var _isLowerMaxHeap = function _isLowerMaxHeap(time1, time2) {
  return time1 < time2;
};

var _isLowerMinHeap = function _isLowerMinHeap(time1, time2) {
  return time1 > time2;
};

/**
 * Define if `time1` should be higher in the topography than `time2`.
 * Is dynamically affected to the priority queue according to handle `min` and `max` heap.
 * @param {Number} time1
 * @param {Number} time2
 * @return {Boolean}
 */
var _isHigherMaxHeap = function _isHigherMaxHeap(time1, time2) {
  return time1 > time2;
};

var _isHigherMinHeap = function _isHigherMinHeap(time1, time2) {
  return time1 < time2;
};

var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

/**
 * Priority queue implementing a binary heap.
 * Acts as a min heap by default, can be dynamically changed to a max heap by setting `reverse` to true.
 */

var PriorityQueue = function () {
  /**
   * @param {String} [accessor='time'] - The attribute of the entries that should be used as the priority value. This attribute must be a number.
   * @param {Number} [heapLength=100] - The size of the array used to create the heap.
   */
  function PriorityQueue() {
    var heapLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    (0, _classCallCheck3.default)(this, PriorityQueue);

    /**
     * @type {Number}
     * A pointer to the first empty index of the heap.
     */
    this._currentLength = 1;

    /**
     * An array of the sorted indexes of the entries, the actual heap. Ignore the index 0.
     * @type {Array}
     */
    this._heap = new Array(heapLength + 1);

    /**
     * Define the type of the queue: `min` heap if `false`, `max` heap if `true`
     * @type {Boolean}
     */
    this._reverse = null;

    // initialize compare functions
    this.reverse = false;
  }

  /**
   * Return the time of the first element in the binary heap.
   * @returns {Number}
   */


  (0, _createClass3.default)(PriorityQueue, [{
    key: "_bubbleUp",


    /**
     * Fix the heap by moving an entry to a new upper position.
     * @param {Number} startIndex - The index of the entry to move.
     */
    value: function _bubbleUp(startIndex) {
      var entry = this._heap[startIndex];

      var index = startIndex;
      var parentIndex = Math.floor(index / 2);
      var parent = this._heap[parentIndex];

      while (parent && this._isHigher(entry.queueTime, parent.queueTime)) {
        swap(this._heap, index, parentIndex);

        index = parentIndex;
        parentIndex = Math.floor(index / 2);
        parent = this._heap[parentIndex];
      }
    }

    /**
     * Fix the heap by moving an entry to a new lower position.
     * @param {Number} startIndex - The index of the entry to move.
     */

  }, {
    key: "_bubbleDown",
    value: function _bubbleDown(startIndex) {
      var entry = this._heap[startIndex];

      var index = startIndex;
      var c1index = index * 2;
      var c2index = c1index + 1;
      var child1 = this._heap[c1index];
      var child2 = this._heap[c2index];

      while (child1 && this._isLower(entry.queueTime, child1.queueTime) || child2 && this._isLower(entry.queueTime, child2.queueTime)) {
        // swap with the minimum child
        var targetIndex = void 0;

        if (child2) targetIndex = this._isHigher(child1.queueTime, child2.queueTime) ? c1index : c2index;else targetIndex = c1index;

        swap(this._heap, index, targetIndex);

        // update to find next children
        index = targetIndex;
        c1index = index * 2;
        c2index = c1index + 1;
        child1 = this._heap[c1index];
        child2 = this._heap[c2index];
      }
    }

    /**
     * Build the heap from bottom up.
     */

  }, {
    key: "buildHeap",
    value: function buildHeap() {
      // find the index of the last internal node
      // @todo - make sure that's the right way to do.
      var maxIndex = Math.floor((this._currentLength - 1) / 2);

      for (var i = maxIndex; i > 0; i--) {
        this._bubbleDown(i);
      }
    }

    /**
     * Insert a new object in the binary heap, and sort it.
     * @param {Object} entry - Entry to insert.
     * @param {Number} time - Time at which the entry should be orderer.
     * @returns {Number} - Time of the first entry in the heap.
     */

  }, {
    key: "insert",
    value: function insert(entry, time) {
      if (Math.abs(time) !== POSITIVE_INFINITY) {
        entry.queueTime = time;
        // add the new entry at the end of the heap
        this._heap[this._currentLength] = entry;
        // bubble it up
        this._bubbleUp(this._currentLength);
        this._currentLength += 1;

        return this.time;
      }

      entry.queueTime = undefined;
      return this.remove(entry);
    }

    /**
     * Move an entry to a new position.
     * @param {Object} entry - Entry to move.
     * @param {Number} time - Time at which the entry should be orderer.
     * @return {Number} - Time of first entry in the heap.
     */

  }, {
    key: "move",
    value: function move(entry, time) {
      if (Math.abs(time) !== POSITIVE_INFINITY) {
        var index = indexOf(this._heap, entry);

        if (index !== -1) {
          entry.queueTime = time;
          // define if the entry should be bubbled up or down
          var parent = this._heap[Math.floor(index / 2)];

          if (parent && this._isHigher(time, parent.queueTime)) this._bubbleUp(index);else this._bubbleDown(index);
        }

        return this.time;
      }

      entry.queueTime = undefined;
      return this.remove(entry);
    }

    /**
     * This is broken, assuming bubbling down only is false
     * Remove an entry from the heap and fix the heap.
     * @param {Object} entry - Entry to remove.
     * @return {Number} - Time of first entry in the heap.
     */

  }, {
    key: "remove",
    value: function remove(entry) {
      // find the index of the entry
      var index = indexOf(this._heap, entry);

      if (index !== -1) {
        var lastIndex = this._currentLength - 1;

        // if the entry is the last one
        if (index === lastIndex) {
          // remove the element from heap
          this._heap[lastIndex] = undefined;
          // update current length
          this._currentLength = lastIndex;

          return this.time;
        } else {
          // swap with the last element of the heap
          swap(this._heap, index, lastIndex);
          // remove the element from heap
          this._heap[lastIndex] = undefined;

          if (index === 1) {
            this._bubbleDown(1);
          } else {
            // bubble the (ex last) element up or down according to its new context
            var _entry = this._heap[index];
            var parent = this._heap[Math.floor(index / 2)];

            if (parent && this._isHigher(_entry.queueTime, parent.queueTime)) this._bubbleUp(index);else this._bubbleDown(index);
          }
        }

        // update current length
        this._currentLength = lastIndex;
      }

      return this.time;
    }

    /**
     * Clear the queue.
     */

  }, {
    key: "clear",
    value: function clear() {
      this._currentLength = 1;
      this._heap = new Array(this._heap.length);
    }
  }, {
    key: "has",
    value: function has(entry) {
      return this._heap.indexOf(entry) !== -1;
    }
  }, {
    key: "time",
    get: function get() {
      if (this._currentLength > 1) return this._heap[1].queueTime;

      return Infinity;
    }

    /**
     * Returns the entry of the first element in the binary heap.
     * @returns {Number}
     */

  }, {
    key: "head",
    get: function get() {
      return this._heap[1];
    }

    /**
     * Change the order of the queue, rebuild the heap with the existing entries.
     * @type {Boolean}
     */

  }, {
    key: "reverse",
    set: function set(value) {
      if (value !== this._reverse) {
        this._reverse = value;

        if (this._reverse === true) {
          this._isLower = _isLowerMaxHeap;
          this._isHigher = _isHigherMaxHeap;
        } else {
          this._isLower = _isLowerMinHeap;
          this._isHigher = _isHigherMinHeap;
        }

        this.buildHeap();
      }
    },
    get: function get() {
      return this._reverse;
    }
  }]);
  return PriorityQueue;
}();

exports.default = PriorityQueue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW9yaXR5LXF1ZXVlLmpzIl0sIm5hbWVzIjpbInN3YXAiLCJhcnIiLCJpMSIsImkyIiwidG1wIiwiaW5kZXhPZiIsImVsIiwibCIsImxlbmd0aCIsImkiLCJfaXNMb3dlck1heEhlYXAiLCJ0aW1lMSIsInRpbWUyIiwiX2lzTG93ZXJNaW5IZWFwIiwiX2lzSGlnaGVyTWF4SGVhcCIsIl9pc0hpZ2hlck1pbkhlYXAiLCJQT1NJVElWRV9JTkZJTklUWSIsIk51bWJlciIsIlByaW9yaXR5UXVldWUiLCJoZWFwTGVuZ3RoIiwiX2N1cnJlbnRMZW5ndGgiLCJfaGVhcCIsIkFycmF5IiwiX3JldmVyc2UiLCJyZXZlcnNlIiwic3RhcnRJbmRleCIsImVudHJ5IiwiaW5kZXgiLCJwYXJlbnRJbmRleCIsIk1hdGgiLCJmbG9vciIsInBhcmVudCIsIl9pc0hpZ2hlciIsInF1ZXVlVGltZSIsImMxaW5kZXgiLCJjMmluZGV4IiwiY2hpbGQxIiwiY2hpbGQyIiwiX2lzTG93ZXIiLCJ0YXJnZXRJbmRleCIsIm1heEluZGV4IiwiX2J1YmJsZURvd24iLCJ0aW1lIiwiYWJzIiwiX2J1YmJsZVVwIiwidW5kZWZpbmVkIiwicmVtb3ZlIiwibGFzdEluZGV4IiwiSW5maW5pdHkiLCJ2YWx1ZSIsImJ1aWxkSGVhcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0EsU0FBU0EsSUFBVCxDQUFjQyxHQUFkLEVBQW1CQyxFQUFuQixFQUF1QkMsRUFBdkIsRUFBMkI7QUFDekIsTUFBTUMsTUFBTUgsSUFBSUMsRUFBSixDQUFaO0FBQ0FELE1BQUlDLEVBQUosSUFBVUQsSUFBSUUsRUFBSixDQUFWO0FBQ0FGLE1BQUlFLEVBQUosSUFBVUMsR0FBVjtBQUNEOztBQUVEO0FBQ0EsU0FBU0MsT0FBVCxDQUFpQkosR0FBakIsRUFBc0JLLEVBQXRCLEVBQTBCO0FBQ3hCLE1BQU1DLElBQUlOLElBQUlPLE1BQWQ7QUFDQTtBQUNBLE9BQUssSUFBSUMsSUFBSSxDQUFiLEVB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QjtBQUNBLGVBQUttQixTQUFMLEdBQWlCakIsZ0JBQWpCO0FBQ0Q7O0FBRUQsYUFBS21DLFNBQUw7QUFDRDtBQUNGLEs7d0JBRWE7QUFDWixhQUFPLEtBQUszQixRQUFaO0FBQ0Q7Ozs7O2tCQXJFa0JMLGEiLCJmaWxlIjoicHJpb3JpdHktcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB3b3JrcyBieSByZWZlcmVuY2VcbmZ1bmN0aW9uIHN3YXAoYXJyLCBpMSwgaTIpIHtcbiAgY29uc3QgdG1wID0gYXJyW2kxXTtcbiAgYXJyW2kxXSA9IGFycltpMl07XG4gIGFycltpMl0gPSB0bXA7XG59XG5cbi8vIGh0dHBzOi8vanNwZXJmLmNvbS9qcy1mb3ItbG9vcC12cy1hcnJheS1pbmRleG9mLzM0NlxuZnVuY3Rpb24gaW5kZXhPZihhcnIsIGVsKSB7XG4gIGNvbnN0IGwgPSBhcnIubGVuZ3RoO1xuICAvLyBpZ25vcmUgZmlyc3QgZWxlbWVudCBhcyBpdCBjYW4ndCBiZSBhIGVudHJ5XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGFycltpXSA9PT0gZWwpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgaWYgYHRpbWUxYCBzaG91bGQgYmUgbG93ZXIgaW4gdGhlIHRvcG9ncmFwaHkgdGhhbiBgdGltZTJgLlxuICogSXMgZHluYW1pY2FsbHkgYWZmZWN0ZWQgdG8gdGhlIHByaW9yaXR5IHF1ZXVlIGFjY29yZGluZyB0byBoYW5kbGUgYG1pbmAgYW5kIGBtYXhgIGhlYXAuXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZTFcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lMlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuY29uc3QgX2lzTG93ZXJNYXhIZWFwID0gZnVuY3Rpb24odGltZTEsIHRpbWUyKSB7XG4gIHJldHVybiB0aW1lMSA8IHRpbWUyO1xufTtcblxuY29uc3QgX2lzTG93ZXJNaW5IZWFwID0gZnVuY3Rpb24odGltZTEsIHRpbWUyKSB7XG4gIHJldHVybiB0aW1lMSA+IHRpbWUyO1xufTtcblxuLyoqXG4gKiBEZWZpbmUgaWYgYHRpbWUxYCBzaG91bGQgYmUgaGlnaGVyIGluIHRoZSB0b3BvZ3JhcGh5IHRoYW4gYHRpbWUyYC5cbiAqIElzIGR5bmFtaWNhbGx5IGFmZmVjdGVkIHRvIHRoZSBwcmlvcml0eSBxdWV1ZSBhY2NvcmRpbmcgdG8gaGFuZGxlIGBtaW5gIGFuZCBgbWF4YCBoZWFwLlxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUxXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZTJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmNvbnN0IF9pc0hpZ2hlck1heEhlYXAgPSBmdW5jdGlvbih0aW1lMSwgdGltZTIpIHtcbiAgcmV0dXJuIHRpbWUxID4gdGltZTI7XG59O1xuXG5jb25zdCBfaXNIaWdoZXJNaW5IZWFwID0gZnVuY3Rpb24odGltZTEsIHRpbWUyKSB7XG4gIHJldHVybiB0aW1lMSA8IHRpbWUyO1xufTtcblxuY29uc3QgUE9TSVRJVkVfSU5GSU5JVFkgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5cbi8qKlxuICogUHJpb3JpdHkgcXVldWUgaW1wbGVtZW50aW5nIGEgYmluYXJ5IGhlYXAuXG4gKiBBY3RzIGFzIGEgbWluIGhlYXAgYnkgZGVmYXVsdCwgY2FuIGJlIGR5bmFtaWNhbGx5IGNoYW5nZWQgdG8gYSBtYXggaGVhcCBieSBzZXR0aW5nIGByZXZlcnNlYCB0byB0cnVlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmlvcml0eVF1ZXVlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbYWNjZXNzb3I9J3RpbWUnXSAtIFRoZSBhdHRyaWJ1dGUgb2YgdGhlIGVudHJpZXMgdGhhdCBzaG91bGQgYmUgdXNlZCBhcyB0aGUgcHJpb3JpdHkgdmFsdWUuIFRoaXMgYXR0cmlidXRlIG11c3QgYmUgYSBudW1iZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbaGVhcExlbmd0aD0xMDBdIC0gVGhlIHNpemUgb2YgdGhlIGFycmF5IHVzZWQgdG8gY3JlYXRlIHRoZSBoZWFwLlxuICAgKi9cbiAgY29uc3RydWN0b3IoaGVhcExlbmd0aCA9IDEwMCkge1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQSBwb2ludGVyIHRvIHRoZSBmaXJzdCBlbXB0eSBpbmRleCBvZiB0aGUgaGVhcC5cbiAgICAgKi9cbiAgICB0aGlzLl9jdXJyZW50TGVuZ3RoID0gMTtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIHRoZSBzb3J0ZWQgaW5kZXhlcyBvZiB0aGUgZW50cmllcywgdGhlIGFjdHVhbCBoZWFwLiBJZ25vcmUgdGhlIGluZGV4IDAuXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuX2hlYXAgPSBuZXcgQXJyYXkoaGVhcExlbmd0aCArIDEpO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIHRoZSB0eXBlIG9mIHRoZSBxdWV1ZTogYG1pbmAgaGVhcCBpZiBgZmFsc2VgLCBgbWF4YCBoZWFwIGlmIGB0cnVlYFxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX3JldmVyc2UgPSBudWxsO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBjb21wYXJlIGZ1bmN0aW9uc1xuICAgIHRoaXMucmV2ZXJzZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBvZiB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgYmluYXJ5IGhlYXAuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICBpZiAodGhpcy5fY3VycmVudExlbmd0aCA+IDEpXG4gICAgICByZXR1cm4gdGhpcy5faGVhcFsxXS5xdWV1ZVRpbWU7XG5cbiAgICByZXR1cm4gSW5maW5pdHk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZW50cnkgb2YgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGJpbmFyeSBoZWFwLlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGhlYWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXBbMV07XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBvcmRlciBvZiB0aGUgcXVldWUsIHJlYnVpbGQgdGhlIGhlYXAgd2l0aCB0aGUgZXhpc3RpbmcgZW50cmllcy5cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgcmV2ZXJzZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fcmV2ZXJzZSkge1xuICAgICAgdGhpcy5fcmV2ZXJzZSA9IHZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5fcmV2ZXJzZSA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLl9pc0xvd2VyID0gX2lzTG93ZXJNYXhIZWFwO1xuICAgICAgICB0aGlzLl9pc0hpZ2hlciA9IF9pc0hpZ2hlck1heEhlYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pc0xvd2VyID0gX2lzTG93ZXJNaW5IZWFwO1xuICAgICAgICB0aGlzLl9pc0hpZ2hlciA9IF9pc0hpZ2hlck1pbkhlYXA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGRIZWFwKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHJldmVyc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JldmVyc2U7XG4gIH1cblxuICAvKipcbiAgICogRml4IHRoZSBoZWFwIGJ5IG1vdmluZyBhbiBlbnRyeSB0byBhIG5ldyB1cHBlciBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0SW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGVudHJ5IHRvIG1vdmUuXG4gICAqL1xuICBfYnViYmxlVXAoc3RhcnRJbmRleCkge1xuICAgIGxldCBlbnRyeSA9IHRoaXMuX2hlYXBbc3RhcnRJbmRleF07XG5cbiAgICBsZXQgaW5kZXggPSBzdGFydEluZGV4O1xuICAgIGxldCBwYXJlbnRJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyAyKTtcbiAgICBsZXQgcGFyZW50ID0gdGhpcy5faGVhcFtwYXJlbnRJbmRleF07XG5cbiAgICB3aGlsZSAocGFyZW50ICYmIHRoaXMuX2lzSGlnaGVyKGVudHJ5LnF1ZXVlVGltZSwgcGFyZW50LnF1ZXVlVGltZSkpIHtcbiAgICAgIHN3YXAodGhpcy5faGVhcCwgaW5kZXgsIHBhcmVudEluZGV4KTtcblxuICAgICAgaW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICAgIHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIDIpO1xuICAgICAgcGFyZW50ID0gdGhpcy5faGVhcFtwYXJlbnRJbmRleF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpeCB0aGUgaGVhcCBieSBtb3ZpbmcgYW4gZW50cnkgdG8gYSBuZXcgbG93ZXIgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydEluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBlbnRyeSB0byBtb3ZlLlxuICAgKi9cbiAgX2J1YmJsZURvd24oc3RhcnRJbmRleCkge1xuICAgIGxldCBlbnRyeSA9IHRoaXMuX2hlYXBbc3RhcnRJbmRleF07XG5cbiAgICBsZXQgaW5kZXggPSBzdGFydEluZGV4O1xuICAgIGxldCBjMWluZGV4ID0gaW5kZXggKiAyO1xuICAgIGxldCBjMmluZGV4ID0gYzFpbmRleCArIDE7XG4gICAgbGV0IGNoaWxkMSA9IHRoaXMuX2hlYXBbYzFpbmRleF07XG4gICAgbGV0IGNoaWxkMiA9IHRoaXMuX2hlYXBbYzJpbmRleF07XG5cbiAgICB3aGlsZSAoKGNoaWxkMSAmJiB0aGlzLl9pc0xvd2VyKGVudHJ5LnF1ZXVlVGltZSwgY2hpbGQxLnF1ZXVlVGltZSkpwqB8fFxuICAgICAgICAgICAoY2hpbGQyICYmIHRoaXMuX2lzTG93ZXIoZW50cnkucXVldWVUaW1lLCBjaGlsZDIucXVldWVUaW1lKSkpXG4gICAge1xuICAgICAgLy8gc3dhcCB3aXRoIHRoZSBtaW5pbXVtIGNoaWxkXG4gICAgICBsZXQgdGFyZ2V0SW5kZXg7XG5cbiAgICAgIGlmIChjaGlsZDIpXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy5faXNIaWdoZXIoY2hpbGQxLnF1ZXVlVGltZSwgY2hpbGQyLnF1ZXVlVGltZSkgPyBjMWluZGV4IDogYzJpbmRleDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGFyZ2V0SW5kZXggPSBjMWluZGV4O1xuXG4gICAgICBzd2FwKHRoaXMuX2hlYXAsIGluZGV4LCB0YXJnZXRJbmRleCk7XG5cbiAgICAgIC8vIHVwZGF0ZSB0byBmaW5kIG5leHQgY2hpbGRyZW5cbiAgICAgIGluZGV4ID0gdGFyZ2V0SW5kZXg7XG4gICAgICBjMWluZGV4ID0gaW5kZXggKiAyO1xuICAgICAgYzJpbmRleCA9IGMxaW5kZXggKyAxO1xuICAgICAgY2hpbGQxID0gdGhpcy5faGVhcFtjMWluZGV4XTtcbiAgICAgIGNoaWxkMiA9IHRoaXMuX2hlYXBbYzJpbmRleF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIHRoZSBoZWFwIGZyb20gYm90dG9tIHVwLlxuICAgKi9cbiAgYnVpbGRIZWFwKCkge1xuICAgIC8vIGZpbmQgdGhlIGluZGV4IG9mIHRoZSBsYXN0IGludGVybmFsIG5vZGVcbiAgICAvLyBAdG9kbyAtIG1ha2Ugc3VyZSB0aGF0J3MgdGhlIHJpZ2h0IHdheSB0byBkby5cbiAgICBsZXQgbWF4SW5kZXggPSBNYXRoLmZsb29yKCh0aGlzLl9jdXJyZW50TGVuZ3RoIC0gMSkgLyAyKTtcblxuICAgIGZvciAobGV0IGkgPSBtYXhJbmRleDsgaSA+IDA7IGktLSlcbiAgICAgIHRoaXMuX2J1YmJsZURvd24oaSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGEgbmV3IG9iamVjdCBpbiB0aGUgYmluYXJ5IGhlYXAsIGFuZCBzb3J0IGl0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgLSBFbnRyeSB0byBpbnNlcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGltZSBhdCB3aGljaCB0aGUgZW50cnkgc2hvdWxkIGJlIG9yZGVyZXIuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gVGltZSBvZiB0aGUgZmlyc3QgZW50cnkgaW4gdGhlIGhlYXAuXG4gICAqL1xuICBpbnNlcnQoZW50cnksIHRpbWUpIHtcbiAgICBpZiAoTWF0aC5hYnModGltZSkgIT09IFBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICBlbnRyeS5xdWV1ZVRpbWUgPSB0aW1lO1xuICAgICAgLy8gYWRkIHRoZSBuZXcgZW50cnkgYXQgdGhlIGVuZCBvZiB0aGUgaGVhcFxuICAgICAgdGhpcy5faGVhcFt0aGlzLl9jdXJyZW50TGVuZ3RoXSA9IGVudHJ5O1xuICAgICAgLy8gYnViYmxlIGl0IHVwXG4gICAgICB0aGlzLl9idWJibGVVcCh0aGlzLl9jdXJyZW50TGVuZ3RoKTtcbiAgICAgIHRoaXMuX2N1cnJlbnRMZW5ndGggKz0gMTtcblxuICAgICAgcmV0dXJuIHRoaXMudGltZTtcbiAgICB9XG5cbiAgICBlbnRyeS5xdWV1ZVRpbWUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlKGVudHJ5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIGFuIGVudHJ5IHRvIGEgbmV3IHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgLSBFbnRyeSB0byBtb3ZlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRpbWUgYXQgd2hpY2ggdGhlIGVudHJ5IHNob3VsZCBiZSBvcmRlcmVyLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gVGltZSBvZiBmaXJzdCBlbnRyeSBpbiB0aGUgaGVhcC5cbiAgICovXG4gIG1vdmUoZW50cnksIHRpbWUpIHtcbiAgICBpZiAoTWF0aC5hYnModGltZSkgIT09IFBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGluZGV4T2YodGhpcy5faGVhcCwgZW50cnkpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGVudHJ5LnF1ZXVlVGltZSA9IHRpbWU7XG4gICAgICAgIC8vIGRlZmluZSBpZiB0aGUgZW50cnkgc2hvdWxkIGJlIGJ1YmJsZWQgdXAgb3IgZG93blxuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9oZWFwW01hdGguZmxvb3IoaW5kZXggLyAyKV07XG5cbiAgICAgICAgaWYgKHBhcmVudCAmJiB0aGlzLl9pc0hpZ2hlcih0aW1lLCBwYXJlbnQucXVldWVUaW1lKSlcbiAgICAgICAgICB0aGlzLl9idWJibGVVcChpbmRleCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLl9idWJibGVEb3duKGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudGltZTtcbiAgICB9XG5cbiAgICBlbnRyeS5xdWV1ZVRpbWUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlKGVudHJ5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIGJyb2tlbiwgYXNzdW1pbmcgYnViYmxpbmcgZG93biBvbmx5IGlzIGZhbHNlXG4gICAqIFJlbW92ZSBhbiBlbnRyeSBmcm9tIHRoZSBoZWFwIGFuZCBmaXggdGhlIGhlYXAuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSAtIEVudHJ5IHRvIHJlbW92ZS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIFRpbWUgb2YgZmlyc3QgZW50cnkgaW4gdGhlIGhlYXAuXG4gICAqL1xuICByZW1vdmUoZW50cnkpIHtcbiAgICAvLyBmaW5kIHRoZSBpbmRleCBvZiB0aGUgZW50cnlcbiAgICBjb25zdCBpbmRleCA9IGluZGV4T2YodGhpcy5faGVhcCwgZW50cnkpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgY29uc3QgbGFzdEluZGV4ID0gdGhpcy5fY3VycmVudExlbmd0aCAtIDE7XG5cbiAgICAgIC8vIGlmIHRoZSBlbnRyeSBpcyB0aGUgbGFzdCBvbmVcbiAgICAgIGlmIChpbmRleCA9PT0gbGFzdEluZGV4KSB7XG4gICAgICAgIC8vIHJlbW92ZSB0aGUgZWxlbWVudCBmcm9tIGhlYXBcbiAgICAgICAgdGhpcy5faGVhcFtsYXN0SW5kZXhdID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyB1cGRhdGUgY3VycmVudCBsZW5ndGhcbiAgICAgICAgdGhpcy5fY3VycmVudExlbmd0aCA9IGxhc3RJbmRleDtcblxuICAgICAgICByZXR1cm4gdGhpcy50aW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3dhcCB3aXRoIHRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIGhlYXBcbiAgICAgICAgc3dhcCh0aGlzLl9oZWFwLCBpbmRleCwgbGFzdEluZGV4KTtcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBlbGVtZW50IGZyb20gaGVhcFxuICAgICAgICB0aGlzLl9oZWFwW2xhc3RJbmRleF0gPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgdGhpcy5fYnViYmxlRG93bigxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBidWJibGUgdGhlIChleCBsYXN0KSBlbGVtZW50IHVwIG9yIGRvd24gYWNjb3JkaW5nIHRvIGl0cyBuZXcgY29udGV4dFxuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5faGVhcFtpbmRleF07XG4gICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5faGVhcFtNYXRoLmZsb29yKGluZGV4IC8gMildO1xuXG4gICAgICAgICAgaWYgKHBhcmVudCAmJiB0aGlzLl9pc0hpZ2hlcihlbnRyeS5xdWV1ZVRpbWUsIHBhcmVudC5xdWV1ZVRpbWUpKVxuICAgICAgICAgICAgdGhpcy5fYnViYmxlVXAoaW5kZXgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuX2J1YmJsZURvd24oaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBjdXJyZW50IGxlbmd0aFxuICAgICAgdGhpcy5fY3VycmVudExlbmd0aCA9IGxhc3RJbmRleDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSBxdWV1ZS5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2N1cnJlbnRMZW5ndGggPSAxO1xuICAgIHRoaXMuX2hlYXAgPSBuZXcgQXJyYXkodGhpcy5faGVhcC5sZW5ndGgpO1xuICB9XG5cbiAgaGFzKGVudHJ5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5kZXhPZihlbnRyeSkgIT09IC0xO1xuICB9XG59XG4iXX0=