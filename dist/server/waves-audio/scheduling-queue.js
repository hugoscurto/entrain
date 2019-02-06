'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _priorityQueue = require('./priority-queue');

var _priorityQueue2 = _interopRequireDefault(_priorityQueue);

var _timeEngine = require('./time-engine');

var _timeEngine2 = _interopRequireDefault(_timeEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class SchedulingQueue
 */
/**
 * SchedulingQueue base class
 * http://wavesjs.github.io/audio/#audio-scheduling-queue
 *
 * Norbert.Schnell@ircam.fr
 * Copyright 2014, 2015 IRCAM – Centre Pompidou
 */

var SchedulingQueue = function (_TimeEngine) {
  (0, _inherits3.default)(SchedulingQueue, _TimeEngine);

  function SchedulingQueue() {
    (0, _classCallCheck3.default)(this, SchedulingQueue);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SchedulingQueue.__proto__ || (0, _getPrototypeOf2.default)(SchedulingQueue)).call(this));

    _this.__queue = new _priorityQueue2.default();
    _this.__engines = new _set2.default();
    return _this;
  }

  // TimeEngine 'scheduled' interface


  (0, _createClass3.default)(SchedulingQueue, [{
    key: 'advanceTime',
    value: function advanceTime(time) {
      var engine = this.__queue.head;
      var nextEngineTime = engine.advanceTime(time);

      if (!nextEngineTime) {
        engine.master = null;
        this.__engines.delete(engine);
        this.__queue.remove(engine);
      } else {
        this.__queue.move(engine, nextEngineTime);
      }

      return this.__queue.time;
    }

    // TimeEngine master method to be implemented by derived class

  }, {
    key: 'defer',


    // call a function at a given time
    value: function defer(fun) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      if (!(fun instanceof Function)) throw new Error("object cannot be defered by scheduler");

      this.add({
        advanceTime: function advanceTime(time) {
          fun(time);
        } // make sur that the advanceTime method does not returm anything
      }, time);
    }

    // add a time engine to the scheduler

  }, {
    key: 'add',
    value: function add(engine) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      if (!_timeEngine2.default.implementsScheduled(engine)) throw new Error("object cannot be added to scheduler");

      if (engine.master) throw new Error("object has already been added to a master");

      engine.master = this;

      // add to engines and queue
      this.__engines.add(engine);
      var nextTime = this.__queue.insert(engine, time);

      // reschedule queue
      this.resetTime(nextTime);
    }

    // remove a time engine from the queue

  }, {
    key: 'remove',
    value: function remove(engine) {
      if (engine.master !== this) throw new Error("object has not been added to this scheduler");

      engine.master = null;

      // remove from array and queue
      this.__engines.delete(engine);
      var nextTime = this.__queue.remove(engine);

      // reschedule queue
      this.resetTime(nextTime);
    }

    // reset next engine time

  }, {
    key: 'resetEngineTime',
    value: function resetEngineTime(engine) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      if (engine.master !== this) throw new Error("object has not been added to this scheduler");

      var nextTime = void 0;

      if (this.__queue.has(engine)) nextTime = this.__queue.move(engine, time);else nextTime = this.__queue.insert(engine, time);

      this.resetTime(nextTime);
    }

    // check whether a given engine is scheduled

  }, {
    key: 'has',
    value: function has(engine) {
      return this.__engines.has(engine);
    }

    // clear queue

  }, {
    key: 'clear',
    value: function clear() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.__engines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var engine = _step.value;

          engine.master = null;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.__queue.clear();
      this.__engines.clear();
      this.resetTime(Infinity);
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return 0;
    }
  }]);
  return SchedulingQueue;
}(_timeEngine2.default);

exports.default = SchedulingQueue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVkdWxpbmctcXVldWUuanMiXSwibmFtZXMiOlsiU2NoZWR1bGluZ1F1ZXVlIiwiX19xdWV1ZSIsIlByaW9yaXR5UXVldWUiLCJfX2VuZ2luZXMiLCJ0aW1lIiwiZW5naW5lIiwiaGVhZCIsIm5leHRFbmdpbmVUaW1lIiwiYWR2YW5jZVRpbWUiLCJtYXN0ZXIiLCJkZWxldGUiLCJyZW1vdmUiLCJtb3ZlIiwiZnVuIiwiY3VycmVudFRpbWUiLCJGdW5jdGlvbiIsIkVycm9yIiwiYWRkIiwiVGltZUVuZ2luZSIsImltcGxlbWVudHNTY2hlZHVsZWQiLCJuZXh0VGltZSIsImluc2VydCIsInJlc2V0VGltZSIsImhhcyIsImNsZWFyIiwiSW5maW5pdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQTs7OztBQUNBOzs7Ozs7QUFFQTs7O0FBWEE7Ozs7Ozs7O0lBY3FCQSxlOzs7QUFDbkIsNkJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLQyxPQUFMLEdBQWUsSUFBSUMsdUJBQUosRUFBZjtBQUNBLFVBQUtDLFNBQUwsR0FBaUIsbUJBQWpCO0FBSlk7QUFLYjs7QUFFRDs7Ozs7Z0NBQ1lDLEksRUFBTTtBQUNoQixVQUFNQyxTQUFTLEtBQUtKLE9BQUwsQ0FBYUssSUFBNUI7QUFDQSxVQUFNQyxpQkFBaUJGLE9BQU9HLFdBQVAsQ0FBbUJKLElBQW5CLENBQXZCOztBQUVBLFVBQUksQ0FBQ0csY0FBTCxFQUFxQjtBQUNuQkYsZUFBT0ksTUFBUCxHQUFnQixJQUFoQjtBQUNBLGFBQUtOLFNBQUwsQ0FBZU8sTUFBZixDQUFzQkwsTUFBdEI7QUFDQSxhQUFLSixPQUFMLENBQWFVLE1BQWIsQ0FBb0JOLE1BQXBCO0FBQ0QsT0FKRCxNQUlPO0FBQ0wsYUFBS0osT0FBTCxDQUFhVyxJQUFiLENBQWtCUCxNQUFsQixFQUEwQkUsY0FBMUI7QUFDRDs7QUFFRCxhQUFPLEtBQUtOLE9BQUwsQ0FBYUcsSUFBcEI7QUFDRDs7QUFFRDs7Ozs7O0FBS0E7MEJBQ01TLEcsRUFBOEI7QUFBQSxVQUF6QlQsSUFBeUIsdUVBQWxCLEtBQUtVLFdBQWE7O0FBQ2xDLFVBQUksRUFBRUQsZUFBZUUsUUFBakIsQ0FBSixFQUNFLE1BQU0sSUFBSUMsS0FBSixDQUFVLHVDQUFWLENBQU47O0FBRUYsV0FBS0MsR0FBTCxDQUFTO0FBQ1BULHFCQUFhLHFCQUFTSixJQUFULEVBQWU7QUFBRVMsY0FBSVQsSUFBSjtBQUFZLFNBRG5DLENBQ3FDO0FBRHJDLE9BQVQsRUFFR0EsSUFGSDtBQUdEOztBQUVEOzs7O3dCQUNJQyxNLEVBQWlDO0FBQUEsVUFBekJELElBQXlCLHVFQUFsQixLQUFLVSxXQUFhOztBQUNuQyxVQUFJLENBQUNJLHFCQUFXQyxtQkFBWCxDQUErQmQsTUFBL0IsQ0FBTCxFQUNFLE1BQU0sSUFBSVcsS0FBSixDQUFVLHFDQUFWLENBQU47O0FBRUYsVUFBSVgsT0FBT0ksTUFBWCxFQUNFLE1BQU0sSUFBSU8sS0FBSixDQUFVLDJDQUFWLENBQU47O0FBRUZYLGFBQU9JLE1BQVAsR0FBZ0IsSUFBaEI7O0FBRUE7QUFDQSxXQUFLTixTQUFMLENBQWVjLEdBQWYsQ0FBbUJaLE1BQW5CO0FBQ0EsVUFBTWUsV0FBVyxLQUFLbkIsT0FBTCxDQUFhb0IsTUFBYixDQUFvQmhCLE1BQXBCLEVBQTRCRCxJQUE1QixDQUFqQjs7QUFFQTtBQUNBLFdBQUtrQixTQUFMLENBQWVGLFFBQWY7QUFDRDs7QUFFRDs7OzsyQkFDT2YsTSxFQUFRO0FBQ2IsVUFBSUEsT0FBT0ksTUFBUCxLQUFrQixJQUF0QixFQUNFLE1BQU0sSUFBSU8sS0FBSixDQUFVLDZDQUFWLENBQU47O0FBRUZYLGFBQU9JLE1BQVAsR0FBZ0IsSUFBaEI7O0FBRUE7QUFDQSxXQUFLTixTQUFMLENBQWVPLE1BQWYsQ0FBc0JMLE1BQXRCO0FBQ0EsVUFBTWUsV0FBVyxLQUFLbkIsT0FBTCxDQUFhVSxNQUFiLENBQW9CTixNQUFwQixDQUFqQjs7QUFFQTtBQUNBLFdBQUtpQixTQUFMLENBQWVGLFFBQWY7QUFDRDs7QUFFRDs7OztvQ0FDZ0JmLE0sRUFBaUM7QUFBQSxVQUF6QkQsSUFBeUIsdUVBQWxCLEtBQUtVLFdBQWE7O0FBQy9DLFVBQUlULE9BQU9JLE1BQVAsS0FBa0IsSUFBdEIsRUFDRSxNQUFNLElBQUlPLEtBQUosQ0FBVSw2Q0FBVixDQUFOOztBQUVGLFVBQUlJLGlCQUFKOztBQUVBLFVBQUksS0FBS25CLE9BQUwsQ0FBYXNCLEdBQWIsQ0FBaUJsQixNQUFqQixDQUFKLEVBQ0VlLFdBQVcsS0FBS25CLE9BQUwsQ0FBYVcsSUFBYixDQUFrQlAsTUFBbEIsRUFBMEJELElBQTFCLENBQVgsQ0FERixLQUdFZ0IsV0FBVyxLQUFLbkIsT0FBTCxDQUFhb0IsTUFBYixDQUFvQmhCLE1BQXBCLEVBQTRCRCxJQUE1QixDQUFYOztBQUVGLFdBQUtrQixTQUFMLENBQWVGLFFBQWY7QUFDRDs7QUFFRDs7Ozt3QkFDSWYsTSxFQUFRO0FBQ1YsYUFBTyxLQUFLRixTQUFMLENBQWVvQixHQUFmLENBQW1CbEIsTUFBbkIsQ0FBUDtBQUNEOztBQUVEOzs7OzRCQUNRO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ04sd0RBQWtCLEtBQUtGLFNBQXZCO0FBQUEsY0FBUUUsTUFBUjs7QUFDRUEsaUJBQU9JLE1BQVAsR0FBZ0IsSUFBaEI7QUFERjtBQURNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBSU4sV0FBS1IsT0FBTCxDQUFhdUIsS0FBYjtBQUNBLFdBQUtyQixTQUFMLENBQWVxQixLQUFmO0FBQ0EsV0FBS0YsU0FBTCxDQUFlRyxRQUFmO0FBQ0Q7Ozt3QkEzRWlCO0FBQ2hCLGFBQU8sQ0FBUDtBQUNEOzs7RUEzQjBDUCxvQjs7a0JBQXhCbEIsZSIsImZpbGUiOiJzY2hlZHVsaW5nLXF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTY2hlZHVsaW5nUXVldWUgYmFzZSBjbGFzc1xuICogaHR0cDovL3dhdmVzanMuZ2l0aHViLmlvL2F1ZGlvLyNhdWRpby1zY2hlZHVsaW5nLXF1ZXVlXG4gKlxuICogTm9yYmVydC5TY2huZWxsQGlyY2FtLmZyXG4gKiBDb3B5cmlnaHQgMjAxNCwgMjAxNSBJUkNBTSDigJPCoENlbnRyZSBQb21waWRvdVxuICovXG5cbmltcG9ydCBQcmlvcml0eVF1ZXVlIGZyb20gJy4vcHJpb3JpdHktcXVldWUnO1xuaW1wb3J0IFRpbWVFbmdpbmUgZnJvbSAnLi90aW1lLWVuZ2luZSc7XG5cbi8qKlxuICogQGNsYXNzIFNjaGVkdWxpbmdRdWV1ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlZHVsaW5nUXVldWUgZXh0ZW5kcyBUaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX19xdWV1ZSA9IG5ldyBQcmlvcml0eVF1ZXVlKCk7XG4gICAgdGhpcy5fX2VuZ2luZXMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICAvLyBUaW1lRW5naW5lICdzY2hlZHVsZWQnIGludGVyZmFjZVxuICBhZHZhbmNlVGltZSh0aW1lKSB7XG4gICAgY29uc3QgZW5naW5lID0gdGhpcy5fX3F1ZXVlLmhlYWQ7XG4gICAgY29uc3QgbmV4dEVuZ2luZVRpbWUgPSBlbmdpbmUuYWR2YW5jZVRpbWUodGltZSk7XG5cbiAgICBpZiAoIW5leHRFbmdpbmVUaW1lKSB7XG4gICAgICBlbmdpbmUubWFzdGVyID0gbnVsbDtcbiAgICAgIHRoaXMuX19lbmdpbmVzLmRlbGV0ZShlbmdpbmUpO1xuICAgICAgdGhpcy5fX3F1ZXVlLnJlbW92ZShlbmdpbmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fcXVldWUubW92ZShlbmdpbmUsIG5leHRFbmdpbmVUaW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fX3F1ZXVlLnRpbWU7XG4gIH1cblxuICAvLyBUaW1lRW5naW5lIG1hc3RlciBtZXRob2QgdG8gYmUgaW1wbGVtZW50ZWQgYnkgZGVyaXZlZCBjbGFzc1xuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvLyBjYWxsIGEgZnVuY3Rpb24gYXQgYSBnaXZlbiB0aW1lXG4gIGRlZmVyKGZ1biwgdGltZSA9IHRoaXMuY3VycmVudFRpbWUpIHtcbiAgICBpZiAoIShmdW4gaW5zdGFuY2VvZiBGdW5jdGlvbikpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgY2Fubm90IGJlIGRlZmVyZWQgYnkgc2NoZWR1bGVyXCIpO1xuXG4gICAgdGhpcy5hZGQoe1xuICAgICAgYWR2YW5jZVRpbWU6IGZ1bmN0aW9uKHRpbWUpIHsgZnVuKHRpbWUpOyB9LCAvLyBtYWtlIHN1ciB0aGF0IHRoZSBhZHZhbmNlVGltZSBtZXRob2QgZG9lcyBub3QgcmV0dXJtIGFueXRoaW5nXG4gICAgfSwgdGltZSk7XG4gIH1cblxuICAvLyBhZGQgYSB0aW1lIGVuZ2luZSB0byB0aGUgc2NoZWR1bGVyXG4gIGFkZChlbmdpbmUsIHRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lKSB7XG4gICAgaWYgKCFUaW1lRW5naW5lLmltcGxlbWVudHNTY2hlZHVsZWQoZW5naW5lKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBjYW5ub3QgYmUgYWRkZWQgdG8gc2NoZWR1bGVyXCIpO1xuXG4gICAgaWYgKGVuZ2luZS5tYXN0ZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCB0byBhIG1hc3RlclwiKTtcblxuICAgIGVuZ2luZS5tYXN0ZXIgPSB0aGlzO1xuXG4gICAgLy8gYWRkIHRvIGVuZ2luZXMgYW5kIHF1ZXVlXG4gICAgdGhpcy5fX2VuZ2luZXMuYWRkKGVuZ2luZSk7XG4gICAgY29uc3QgbmV4dFRpbWUgPSB0aGlzLl9fcXVldWUuaW5zZXJ0KGVuZ2luZSwgdGltZSk7XG5cbiAgICAvLyByZXNjaGVkdWxlIHF1ZXVlXG4gICAgdGhpcy5yZXNldFRpbWUobmV4dFRpbWUpO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdGltZSBlbmdpbmUgZnJvbSB0aGUgcXVldWVcbiAgcmVtb3ZlKGVuZ2luZSkge1xuICAgIGlmIChlbmdpbmUubWFzdGVyICE9PSB0aGlzKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIHNjaGVkdWxlclwiKTtcblxuICAgIGVuZ2luZS5tYXN0ZXIgPSBudWxsO1xuXG4gICAgLy8gcmVtb3ZlIGZyb20gYXJyYXkgYW5kIHF1ZXVlXG4gICAgdGhpcy5fX2VuZ2luZXMuZGVsZXRlKGVuZ2luZSk7XG4gICAgY29uc3QgbmV4dFRpbWUgPSB0aGlzLl9fcXVldWUucmVtb3ZlKGVuZ2luZSk7XG5cbiAgICAvLyByZXNjaGVkdWxlIHF1ZXVlXG4gICAgdGhpcy5yZXNldFRpbWUobmV4dFRpbWUpO1xuICB9XG5cbiAgLy8gcmVzZXQgbmV4dCBlbmdpbmUgdGltZVxuICByZXNldEVuZ2luZVRpbWUoZW5naW5lLCB0aW1lID0gdGhpcy5jdXJyZW50VGltZSkge1xuICAgIGlmIChlbmdpbmUubWFzdGVyICE9PSB0aGlzKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIHNjaGVkdWxlclwiKTtcblxuICAgIGxldCBuZXh0VGltZTtcblxuICAgIGlmICh0aGlzLl9fcXVldWUuaGFzKGVuZ2luZSkpXG4gICAgICBuZXh0VGltZSA9IHRoaXMuX19xdWV1ZS5tb3ZlKGVuZ2luZSwgdGltZSk7XG4gICAgZWxzZVxuICAgICAgbmV4dFRpbWUgPSB0aGlzLl9fcXVldWUuaW5zZXJ0KGVuZ2luZSwgdGltZSk7XG5cbiAgICB0aGlzLnJlc2V0VGltZShuZXh0VGltZSk7XG4gIH1cblxuICAvLyBjaGVjayB3aGV0aGVyIGEgZ2l2ZW4gZW5naW5lIGlzIHNjaGVkdWxlZFxuICBoYXMoZW5naW5lKSB7XG4gICAgcmV0dXJuIHRoaXMuX19lbmdpbmVzLmhhcyhlbmdpbmUpO1xuICB9XG5cbiAgLy8gY2xlYXIgcXVldWVcbiAgY2xlYXIoKSB7XG4gICAgZm9yKGxldCBlbmdpbmUgb2YgdGhpcy5fX2VuZ2luZXMpXG4gICAgICBlbmdpbmUubWFzdGVyID0gbnVsbDtcblxuICAgIHRoaXMuX19xdWV1ZS5jbGVhcigpO1xuICAgIHRoaXMuX19lbmdpbmVzLmNsZWFyKCk7XG4gICAgdGhpcy5yZXNldFRpbWUoSW5maW5pdHkpO1xuICB9XG59XG4iXX0=