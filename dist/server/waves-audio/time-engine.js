"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class TimeEngine
 */
var TimeEngine = function () {
  function TimeEngine() {
    (0, _classCallCheck3.default)(this, TimeEngine);

    this.master = null;
    this.outputNode = null;
  }

  (0, _createClass3.default)(TimeEngine, [{
    key: "resetTime",
    value: function resetTime() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (this.master) this.master.resetEngineTime(this, time);
    }

    /**
     * Transported interface
     *   - syncPosition(time, position, speed), called to reposition TimeEngine, returns next position
     *   - advancePosition(time, position, speed), called to generate next event at given time and position, returns next position
     */

  }, {
    key: "resetPosition",
    value: function resetPosition() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (this.master) this.master.resetEnginePosition(this, position);
    }

    /**
     * Speed-controlled interface
     *   - syncSpeed(time, position, speed, ), called to
     */

  }, {
    key: "currentTime",
    get: function get() {
      if (this.master) return this.master.currentTime;

      return undefined;
    }
  }, {
    key: "currentPosition",
    get: function get() {
      var master = this.master;

      if (master && master.currentPosition !== undefined) return master.currentPosition;

      return undefined;
    }

    /**
     * Scheduled interface
     *   - advanceTime(time), called to generate next event at given time, returns next time
     */

  }], [{
    key: "implementsScheduled",
    value: function implementsScheduled(engine) {
      return engine.advanceTime && engine.advanceTime instanceof Function;
    }
  }, {
    key: "implementsTransported",
    value: function implementsTransported(engine) {
      return engine.syncPosition && engine.syncPosition instanceof Function && engine.advancePosition && engine.advancePosition instanceof Function;
    }
  }, {
    key: "implementsSpeedControlled",
    value: function implementsSpeedControlled(engine) {
      return engine.syncSpeed && engine.syncSpeed instanceof Function;
    }
  }]);
  return TimeEngine;
}();

exports.default = TimeEngine;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWUtZW5naW5lLmpzIl0sIm5hbWVzIjpbIlRpbWVFbmdpbmUiLCJtYXN0ZXIiLCJvdXRwdXROb2RlIiwidGltZSIsInVuZGVmaW5lZCIsInJlc2V0RW5naW5lVGltZSIsInBvc2l0aW9uIiwicmVzZXRFbmdpbmVQb3NpdGlvbiIsImN1cnJlbnRUaW1lIiwiY3VycmVudFBvc2l0aW9uIiwiZW5naW5lIiwiYWR2YW5jZVRpbWUiLCJGdW5jdGlvbiIsInN5bmNQb3NpdGlvbiIsImFkdmFuY2VQb3NpdGlvbiIsInN5bmNTcGVlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7SUFHcUJBLFU7QUFDbkIsd0JBQWM7QUFBQTs7QUFDWixTQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDRDs7OztnQ0EwQjJCO0FBQUEsVUFBbEJDLElBQWtCLHVFQUFYQyxTQUFXOztBQUMxQixVQUFJLEtBQUtILE1BQVQsRUFDRSxLQUFLQSxNQUFMLENBQVlJLGVBQVosQ0FBNEIsSUFBNUIsRUFBa0NGLElBQWxDO0FBQ0g7O0FBRUQ7Ozs7Ozs7O29DQVlvQztBQUFBLFVBQXRCRyxRQUFzQix1RUFBWEYsU0FBVzs7QUFDbEMsVUFBSSxLQUFLSCxNQUFULEVBQ0UsS0FBS0EsTUFBTCxDQUFZTSxtQkFBWixDQUFnQyxJQUFoQyxFQUFzQ0QsUUFBdEM7QUFDSDs7QUFFRDs7Ozs7Ozt3QkE5Q2tCO0FBQ2hCLFVBQUksS0FBS0wsTUFBVCxFQUNFLE9BQU8sS0FBS0EsTUFBTCxDQUFZTyxXQUFuQjs7QUFFRixhQUFPSixTQUFQO0FBQ0Q7Ozt3QkFFcUI7QUFDcEIsVUFBSUgsU0FBUyxLQUFLQSxNQUFsQjs7QUFFQSxVQUFJQSxVQUFVQSxPQUFPUSxlQUFQLEtBQTJCTCxTQUF6QyxFQUNFLE9BQU9ILE9BQU9RLGVBQWQ7O0FBRUYsYUFBT0wsU0FBUDtBQUNEOztBQUVEOzs7Ozs7O3dDQUkyQk0sTSxFQUFRO0FBQ2pDLGFBQVFBLE9BQU9DLFdBQVAsSUFBc0JELE9BQU9DLFdBQVAsWUFBOEJDLFFBQTVEO0FBQ0Q7OzswQ0FZNEJGLE0sRUFBUTtBQUNuQyxhQUNFQSxPQUFPRyxZQUFQLElBQXVCSCxPQUFPRyxZQUFQLFlBQStCRCxRQUF0RCxJQUNBRixPQUFPSSxlQURQLElBQzBCSixPQUFPSSxlQUFQLFlBQWtDRixRQUY5RDtBQUlEOzs7OENBV2dDRixNLEVBQVE7QUFDdkMsYUFBUUEsT0FBT0ssU0FBUCxJQUFvQkwsT0FBT0ssU0FBUCxZQUE0QkgsUUFBeEQ7QUFDRDs7Ozs7a0JBMURrQlosVSIsImZpbGUiOiJ0aW1lLWVuZ2luZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGNsYXNzIFRpbWVFbmdpbmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubWFzdGVyID0gbnVsbDtcbiAgICB0aGlzLm91dHB1dE5vZGUgPSBudWxsO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIGlmICh0aGlzLm1hc3RlcilcbiAgICAgIHJldHVybiB0aGlzLm1hc3Rlci5jdXJyZW50VGltZTtcblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXQgY3VycmVudFBvc2l0aW9uKCkge1xuICAgIHZhciBtYXN0ZXIgPSB0aGlzLm1hc3RlcjtcblxuICAgIGlmIChtYXN0ZXIgJiYgbWFzdGVyLmN1cnJlbnRQb3NpdGlvbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIG1hc3Rlci5jdXJyZW50UG9zaXRpb247XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjaGVkdWxlZCBpbnRlcmZhY2VcbiAgICogICAtIGFkdmFuY2VUaW1lKHRpbWUpLCBjYWxsZWQgdG8gZ2VuZXJhdGUgbmV4dCBldmVudCBhdCBnaXZlbiB0aW1lLCByZXR1cm5zIG5leHQgdGltZVxuICAgKi9cbiAgc3RhdGljIGltcGxlbWVudHNTY2hlZHVsZWQoZW5naW5lKSB7XG4gICAgcmV0dXJuIChlbmdpbmUuYWR2YW5jZVRpbWUgJiYgZW5naW5lLmFkdmFuY2VUaW1lIGluc3RhbmNlb2YgRnVuY3Rpb24pO1xuICB9XG5cbiAgcmVzZXRUaW1lKHRpbWUgPSB1bmRlZmluZWQpIHtcbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgdGltZSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNwb3J0ZWQgaW50ZXJmYWNlXG4gICAqICAgLSBzeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSwgY2FsbGVkIHRvIHJlcG9zaXRpb24gVGltZUVuZ2luZSwgcmV0dXJucyBuZXh0IHBvc2l0aW9uXG4gICAqICAgLSBhZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSwgY2FsbGVkIHRvIGdlbmVyYXRlIG5leHQgZXZlbnQgYXQgZ2l2ZW4gdGltZSBhbmQgcG9zaXRpb24sIHJldHVybnMgbmV4dCBwb3NpdGlvblxuICAgKi9cbiAgc3RhdGljIGltcGxlbWVudHNUcmFuc3BvcnRlZChlbmdpbmUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZW5naW5lLnN5bmNQb3NpdGlvbiAmJiBlbmdpbmUuc3luY1Bvc2l0aW9uIGluc3RhbmNlb2YgRnVuY3Rpb24gJiZcbiAgICAgIGVuZ2luZS5hZHZhbmNlUG9zaXRpb24gJiYgZW5naW5lLmFkdmFuY2VQb3NpdGlvbiBpbnN0YW5jZW9mIEZ1bmN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHJlc2V0UG9zaXRpb24ocG9zaXRpb24gPSB1bmRlZmluZWQpIHtcbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGVlZC1jb250cm9sbGVkIGludGVyZmFjZVxuICAgKiAgIC0gc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCwgKSwgY2FsbGVkIHRvXG4gICAqL1xuICBzdGF0aWMgaW1wbGVtZW50c1NwZWVkQ29udHJvbGxlZChlbmdpbmUpIHtcbiAgICByZXR1cm4gKGVuZ2luZS5zeW5jU3BlZWQgJiYgZW5naW5lLnN5bmNTcGVlZCBpbnN0YW5jZW9mIEZ1bmN0aW9uKTtcbiAgfVxufVxuIl19