'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Placer = function () {
  function Placer(experience) {
    (0, _classCallCheck3.default)(this, Placer);

    this.experience = experience;
    this.callbacks = [];

    this.onDone = this.onDone.bind(this);
    experience.receive('placerDone', this.onDone);
  }

  (0, _createClass3.default)(Placer, [{
    key: 'start',
    value: function start(index) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      this.callbacks[index] = callback;
    }
  }, {
    key: 'stop',
    value: function stop(index) {
      delete this.callbacks[index];
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.callbacks = [];
    }
  }, {
    key: 'onDone',
    value: function onDone(index) {
      var callback = this.callbacks[index];

      if (callback) callback(index);
    }
  }]);
  return Placer;
}();

exports.default = Placer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiUGxhY2VyIiwiZXhwZXJpZW5jZSIsImNhbGxiYWNrcyIsIm9uRG9uZSIsImJpbmQiLCJyZWNlaXZlIiwiaW5kZXgiLCJjYWxsYmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsVTs7Ozs7O0lBRVNDLE07QUFDbkIsa0JBQVlDLFVBQVosRUFBd0I7QUFBQTs7QUFDdEIsU0FBS0EsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEVBQWpCOztBQUVBLFNBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFMLENBQVlDLElBQVosQ0FBaUIsSUFBakIsQ0FBZDtBQUNBSCxlQUFXSSxPQUFYLENBQW1CLFlBQW5CLEVBQWlDLEtBQUtGLE1BQXRDO0FBQ0Q7Ozs7MEJBRUtHLEssRUFBaUM7QUFBQSxVQUExQkMsUUFBMEIsdUVBQWYsWUFBVyxDQUFFLENBQUU7O0FBQ3JDLFdBQUtMLFNBQUwsQ0FBZUksS0FBZixJQUF3QkMsUUFBeEI7QUFDRDs7O3lCQUVJRCxLLEVBQU87QUFDVixhQUFPLEtBQUtKLFNBQUwsQ0FBZUksS0FBZixDQUFQO0FBQ0Q7Ozs0QkFFTztBQUNOLFdBQUtKLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7OzJCQUVNSSxLLEVBQU87QUFDWixVQUFNQyxXQUFXLEtBQUtMLFNBQUwsQ0FBZUksS0FBZixDQUFqQjs7QUFFQSxVQUFJQyxRQUFKLEVBQ0VBLFNBQVNELEtBQVQ7QUFDSDs7Ozs7a0JBMUJrQk4sTSIsImZpbGUiOiJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhY2VyIHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSkge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5jYWxsYmFja3MgPSBbXTtcblxuICAgIHRoaXMub25Eb25lID0gdGhpcy5vbkRvbmUuYmluZCh0aGlzKTtcbiAgICBleHBlcmllbmNlLnJlY2VpdmUoJ3BsYWNlckRvbmUnLCB0aGlzLm9uRG9uZSk7XG4gIH1cblxuICBzdGFydChpbmRleCwgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9KSB7XG4gICAgdGhpcy5jYWxsYmFja3NbaW5kZXhdID0gY2FsbGJhY2s7XG4gIH1cblxuICBzdG9wKGluZGV4KSB7XG4gICAgZGVsZXRlIHRoaXMuY2FsbGJhY2tzW2luZGV4XTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gIH1cblxuICBvbkRvbmUoaW5kZXgpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2luZGV4XTtcblxuICAgIGlmIChjYWxsYmFjaylcbiAgICAgIGNhbGxiYWNrKGluZGV4KTtcbiAgfVxufVxuIl19