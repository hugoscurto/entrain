'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _schedulingQueue = require('./waves-audio/scheduling-queue');

var _schedulingQueue2 = _interopRequireDefault(_schedulingQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Scheduler = function (_SchedulingQueue) {
  (0, _inherits3.default)(Scheduler, _SchedulingQueue);

  function Scheduler(sync) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Scheduler);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Scheduler.__proto__ || (0, _getPrototypeOf2.default)(Scheduler)).call(this));

    _this.sync = sync;

    _this.__currentTime = null;
    _this.__nextTime = Infinity;
    _this.__timeout = null;

    /**
     * scheduler (setTimeout) period
     * @type {Number}
     */
    _this.period = options.period || 0.025;
    return _this;
  }

  // setTimeout scheduling loop


  (0, _createClass3.default)(Scheduler, [{
    key: '__tick',
    value: function __tick() {
      var sync = this.sync;
      var currentTime = sync.getSyncTime();
      var time = this.__nextTime;

      this.__timeout = null;

      while (time <= currentTime) {
        this.__currentTime = time;
        time = this.advanceTime(time);
      }

      this.__currentTime = null;
      this.resetTime(time);
    }
  }, {
    key: 'resetTime',
    value: function resetTime() {
      var _this2 = this;

      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentTime;

      if (this.__timeout) {
        clearTimeout(this.__timeout);
        this.__timeout = null;
      }

      if (time !== Infinity) {
        var timeOutDelay = Math.max(time - this.sync.getSyncTime(), this.period);

        this.__timeout = setTimeout(function () {
          _this2.__tick();
        }, timeOutDelay * 1000);
      }

      this.__nextTime = time;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__currentTime || this.sync.getSyncTime();
    }
  }]);
  return Scheduler;
}(_schedulingQueue2.default);

exports.default = Scheduler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjaGVkdWxlci5qcyJdLCJuYW1lcyI6WyJTY2hlZHVsZXIiLCJzeW5jIiwib3B0aW9ucyIsIl9fY3VycmVudFRpbWUiLCJfX25leHRUaW1lIiwiSW5maW5pdHkiLCJfX3RpbWVvdXQiLCJwZXJpb2QiLCJjdXJyZW50VGltZSIsImdldFN5bmNUaW1lIiwidGltZSIsImFkdmFuY2VUaW1lIiwicmVzZXRUaW1lIiwiY2xlYXJUaW1lb3V0IiwidGltZU91dERlbGF5IiwiTWF0aCIsIm1heCIsInNldFRpbWVvdXQiLCJfX3RpY2siLCJTY2hlZHVsaW5nUXVldWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztJQUVxQkEsUzs7O0FBQ25CLHFCQUFZQyxJQUFaLEVBQWdDO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUE7O0FBRzlCLFVBQUtELElBQUwsR0FBWUEsSUFBWjs7QUFFQSxVQUFLRSxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsVUFBS0MsVUFBTCxHQUFrQkMsUUFBbEI7QUFDQSxVQUFLQyxTQUFMLEdBQWlCLElBQWpCOztBQUVBOzs7O0FBSUEsVUFBS0MsTUFBTCxHQUFjTCxRQUFRSyxNQUFSLElBQW1CLEtBQWpDO0FBYjhCO0FBYy9COztBQUVEOzs7Ozs2QkFDUztBQUNQLFVBQU1OLE9BQU8sS0FBS0EsSUFBbEI7QUFDQSxVQUFNTyxjQUFjUCxLQUFLUSxXQUFMLEVBQXBCO0FBQ0EsVUFBSUMsT0FBTyxLQUFLTixVQUFoQjs7QUFFQSxXQUFLRSxTQUFMLEdBQWlCLElBQWpCOztBQUVBLGFBQU9JLFFBQVFGLFdBQWYsRUFBNEI7QUFDMUIsYUFBS0wsYUFBTCxHQUFxQk8sSUFBckI7QUFDQUEsZUFBTyxLQUFLQyxXQUFMLENBQWlCRCxJQUFqQixDQUFQO0FBQ0Q7O0FBRUQsV0FBS1AsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFdBQUtTLFNBQUwsQ0FBZUYsSUFBZjtBQUNEOzs7Z0NBRWtDO0FBQUE7O0FBQUEsVUFBekJBLElBQXlCLHVFQUFsQixLQUFLRixXQUFhOztBQUNqQyxVQUFJLEtBQUtGLFNBQVQsRUFBb0I7QUFDbEJPLHFCQUFhLEtBQUtQLFNBQWxCO0FBQ0EsYUFBS0EsU0FBTCxHQUFpQixJQUFqQjtBQUNEOztBQUVELFVBQUlJLFNBQVNMLFFBQWIsRUFBdUI7QUFDckIsWUFBTVMsZUFBZUMsS0FBS0MsR0FBTCxDQUFVTixPQUFPLEtBQUtULElBQUwsQ0FBVVEsV0FBVixFQUFqQixFQUEyQyxLQUFLRixNQUFoRCxDQUFyQjs7QUFFQSxhQUFLRCxTQUFMLEdBQWlCVyxXQUFXLFlBQU07QUFDaEMsaUJBQUtDLE1BQUw7QUFDRCxTQUZnQixFQUVkSixlQUFlLElBRkQsQ0FBakI7QUFHRDs7QUFFRCxXQUFLVixVQUFMLEdBQWtCTSxJQUFsQjtBQUNEOzs7d0JBRWlCO0FBQ2hCLGFBQU8sS0FBS1AsYUFBTCxJQUFzQixLQUFLRixJQUFMLENBQVVRLFdBQVYsRUFBN0I7QUFDRDs7O0VBckRvQ1UseUI7O2tCQUFsQm5CLFMiLCJmaWxlIjoiU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjaGVkdWxpbmdRdWV1ZSBmcm9tICcuL3dhdmVzLWF1ZGlvL3NjaGVkdWxpbmctcXVldWUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlZHVsZXIgZXh0ZW5kcyBTY2hlZHVsaW5nUXVldWUge1xuICBjb25zdHJ1Y3RvcihzeW5jLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zeW5jID0gc3luYztcblxuICAgIHRoaXMuX19jdXJyZW50VGltZSA9IG51bGw7XG4gICAgdGhpcy5fX25leHRUaW1lID0gSW5maW5pdHk7XG4gICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGVyIChzZXRUaW1lb3V0KSBwZXJpb2RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kID0gb3B0aW9ucy5wZXJpb2QgfHwgwqAwLjAyNTtcbiAgfVxuXG4gIC8vIHNldFRpbWVvdXQgc2NoZWR1bGluZyBsb29wXG4gIF9fdGljaygpIHtcbiAgICBjb25zdCBzeW5jID0gdGhpcy5zeW5jO1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gc3luYy5nZXRTeW5jVGltZSgpO1xuICAgIGxldCB0aW1lID0gdGhpcy5fX25leHRUaW1lO1xuXG4gICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuXG4gICAgd2hpbGUgKHRpbWUgPD0gY3VycmVudFRpbWUpIHtcbiAgICAgIHRoaXMuX19jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICB0aW1lID0gdGhpcy5hZHZhbmNlVGltZSh0aW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHRoaXMucmVzZXRUaW1lKHRpbWUpO1xuICB9XG5cbiAgcmVzZXRUaW1lKHRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lKSB7XG4gICAgaWYgKHRoaXMuX190aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fX3RpbWVvdXQpO1xuICAgICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgY29uc3QgdGltZU91dERlbGF5ID0gTWF0aC5tYXgoKHRpbWUgLSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKSksIHRoaXMucGVyaW9kKTtcblxuICAgICAgdGhpcy5fX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fX3RpY2soKTtcbiAgICAgIH0sIHRpbWVPdXREZWxheSAqIDEwMDApO1xuICAgIH1cblxuICAgIHRoaXMuX19uZXh0VGltZSA9IHRpbWU7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19jdXJyZW50VGltZSB8fCB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxufVxuIl19