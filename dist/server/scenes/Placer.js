'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _timeEngine = require('../waves-audio/time-engine');

var _timeEngine2 = _interopRequireDefault(_timeEngine);

var _colorConfig = require('../../shared/color-config');

var _colorConfig2 = _interopRequireDefault(_colorConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playerColors = _colorConfig2.default.players;

var minBlinkPeriod = 0.4;
var maxBlinkPeriod = 1;

var Placer = function () {
  function Placer(experience) {
    (0, _classCallCheck3.default)(this, Placer);

    this.experience = experience;

    this.blinkStates = [];
    this.callbacks = [];
    this.onPlacerReadys = [];
  }

  (0, _createClass3.default)(Placer, [{
    key: 'start',
    value: function start(client) {
      var _this = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      var experience = this.experience;
      var clientIndex = client.index;

      this.callbacks[clientIndex] = callback;
      this.onPlacerReadys[clientIndex] = function () {
        return _this.onPlacerReady(client);
      };

      experience.receive(client, 'placerReady', this.onPlacerReadys[clientIndex]);
    }
  }, {
    key: 'stop',
    value: function stop(client) {
      var experience = this.experience;
      var clientIndex = client.index;
      var callback = this.callbacks[clientIndex];

      if (callback) {
        delete this.callbacks[clientIndex];
        experience.stopReceiving(client, 'placerReady', this.onPlacerReadys[clientIndex]);
      }
    }
  }, {
    key: 'setBlinkState',
    value: function setBlinkState(index, state) {
      if (this.blinkStates[index] !== state) {
        this.blinkStates[index] = state;

        // control LEDs
        console.log('blinking at place ' + (index + 1) + ' (' + state + ')');
      }
    }
  }, {
    key: 'onPlacerReady',
    value: function onPlacerReady(client) {
      var experience = this.experience;
      var clientIndex = client.index;
      var callback = this.callbacks[clientIndex];

      if (callback) {
        this.stop(client);
        experience.broadcast('barrel', null, 'placerDone', clientIndex);
        callback();
      }
    }
  }]);
  return Placer;
}();

exports.default = Placer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6WyJwbGF5ZXJDb2xvcnMiLCJjb2xvckNvbmZpZyIsInBsYXllcnMiLCJtaW5CbGlua1BlcmlvZCIsIm1heEJsaW5rUGVyaW9kIiwiUGxhY2VyIiwiZXhwZXJpZW5jZSIsImJsaW5rU3RhdGVzIiwiY2FsbGJhY2tzIiwib25QbGFjZXJSZWFkeXMiLCJjbGllbnQiLCJjYWxsYmFjayIsImNsaWVudEluZGV4IiwiaW5kZXgiLCJvblBsYWNlclJlYWR5IiwicmVjZWl2ZSIsInN0b3BSZWNlaXZpbmciLCJzdGF0ZSIsImNvbnNvbGUiLCJsb2ciLCJzdG9wIiwiYnJvYWRjYXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUNBLElBQU1BLGVBQWVDLHNCQUFZQyxPQUFqQzs7QUFFQSxJQUFNQyxpQkFBaUIsR0FBdkI7QUFDQSxJQUFNQyxpQkFBaUIsQ0FBdkI7O0lBRXFCQyxNO0FBQ25CLGtCQUFZQyxVQUFaLEVBQXdCO0FBQUE7O0FBQ3RCLFNBQUtBLFVBQUwsR0FBa0JBLFVBQWxCOztBQUVBLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixFQUF0QjtBQUNEOzs7OzBCQUVLQyxNLEVBQWtDO0FBQUE7O0FBQUEsVUFBMUJDLFFBQTBCLHVFQUFmLFlBQVcsQ0FBRSxDQUFFOztBQUN0QyxVQUFNTCxhQUFhLEtBQUtBLFVBQXhCO0FBQ0EsVUFBTU0sY0FBY0YsT0FBT0csS0FBM0I7O0FBRUEsV0FBS0wsU0FBTCxDQUFlSSxXQUFmLElBQThCRCxRQUE5QjtBQUNBLFdBQUtGLGNBQUwsQ0FBb0JHLFdBQXBCLElBQW1DO0FBQUEsZUFBTSxNQUFLRSxhQUFMLENBQW1CSixNQUFuQixDQUFOO0FBQUEsT0FBbkM7O0FBRUFKLGlCQUFXUyxPQUFYLENBQW1CTCxNQUFuQixFQUEyQixhQUEzQixFQUEwQyxLQUFLRCxjQUFMLENBQW9CRyxXQUFwQixDQUExQztBQUNEOzs7eUJBRUlGLE0sRUFBUTtBQUNYLFVBQU1KLGFBQWEsS0FBS0EsVUFBeEI7QUFDQSxVQUFNTSxjQUFjRixPQUFPRyxLQUEzQjtBQUNBLFVBQU1GLFdBQVcsS0FBS0gsU0FBTCxDQUFlSSxXQUFmLENBQWpCOztBQUVBLFVBQUlELFFBQUosRUFBYztBQUNaLGVBQU8sS0FBS0gsU0FBTCxDQUFlSSxXQUFmLENBQVA7QUFDQU4sbUJBQVdVLGFBQVgsQ0FBeUJOLE1BQXpCLEVBQWlDLGFBQWpDLEVBQWdELEtBQUtELGNBQUwsQ0FBb0JHLFdBQXBCLENBQWhEO0FBQ0Q7QUFDRjs7O2tDQUVhQyxLLEVBQU9JLEssRUFBTztBQUMxQixVQUFHLEtBQUtWLFdBQUwsQ0FBaUJNLEtBQWpCLE1BQTRCSSxLQUEvQixFQUFzQztBQUNwQyxhQUFLVixXQUFMLENBQWlCTSxLQUFqQixJQUEwQkksS0FBMUI7O0FBRUE7QUFDQUMsZ0JBQVFDLEdBQVIseUJBQWlDTixRQUFRLENBQXpDLFdBQStDSSxLQUEvQztBQUNEO0FBQ0Y7OztrQ0FFYVAsTSxFQUFRO0FBQ3BCLFVBQU1KLGFBQWEsS0FBS0EsVUFBeEI7QUFDQSxVQUFNTSxjQUFjRixPQUFPRyxLQUEzQjtBQUNBLFVBQU1GLFdBQVcsS0FBS0gsU0FBTCxDQUFlSSxXQUFmLENBQWpCOztBQUVBLFVBQUdELFFBQUgsRUFBYTtBQUNYLGFBQUtTLElBQUwsQ0FBVVYsTUFBVjtBQUNBSixtQkFBV2UsU0FBWCxDQUFxQixRQUFyQixFQUErQixJQUEvQixFQUFxQyxZQUFyQyxFQUFtRFQsV0FBbkQ7QUFDQUQ7QUFDRDtBQUNGOzs7OztrQkFqRGtCTixNIiwiZmlsZSI6IlBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaW1lRW5naW5lIGZyb20gJy4uL3dhdmVzLWF1ZGlvL3RpbWUtZW5naW5lJztcbmltcG9ydCBjb2xvckNvbmZpZyBmcm9tICcuLi8uLi9zaGFyZWQvY29sb3ItY29uZmlnJztcbmNvbnN0IHBsYXllckNvbG9ycyA9IGNvbG9yQ29uZmlnLnBsYXllcnM7XG5cbmNvbnN0IG1pbkJsaW5rUGVyaW9kID0gMC40O1xuY29uc3QgbWF4QmxpbmtQZXJpb2QgPSAxO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGFjZXIge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcblxuICAgIHRoaXMuYmxpbmtTdGF0ZXMgPSBbXTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMub25QbGFjZXJSZWFkeXMgPSBbXTtcbiAgfVxuXG4gIHN0YXJ0KGNsaWVudCwgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9KSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBjbGllbnRJbmRleCA9IGNsaWVudC5pbmRleDtcblxuICAgIHRoaXMuY2FsbGJhY2tzW2NsaWVudEluZGV4XSA9IGNhbGxiYWNrO1xuICAgIHRoaXMub25QbGFjZXJSZWFkeXNbY2xpZW50SW5kZXhdID0gKCkgPT4gdGhpcy5vblBsYWNlclJlYWR5KGNsaWVudCk7XG5cbiAgICBleHBlcmllbmNlLnJlY2VpdmUoY2xpZW50LCAncGxhY2VyUmVhZHknLCB0aGlzLm9uUGxhY2VyUmVhZHlzW2NsaWVudEluZGV4XSk7XG4gIH1cblxuICBzdG9wKGNsaWVudCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgY29uc3QgY2xpZW50SW5kZXggPSBjbGllbnQuaW5kZXg7XG4gICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1tjbGllbnRJbmRleF07XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmNhbGxiYWNrc1tjbGllbnRJbmRleF07XG4gICAgICBleHBlcmllbmNlLnN0b3BSZWNlaXZpbmcoY2xpZW50LCAncGxhY2VyUmVhZHknLCB0aGlzLm9uUGxhY2VyUmVhZHlzW2NsaWVudEluZGV4XSk7XG4gICAgfVxuICB9XG5cbiAgc2V0QmxpbmtTdGF0ZShpbmRleCwgc3RhdGUpIHtcbiAgICBpZih0aGlzLmJsaW5rU3RhdGVzW2luZGV4XSAhPT0gc3RhdGUpIHtcbiAgICAgIHRoaXMuYmxpbmtTdGF0ZXNbaW5kZXhdID0gc3RhdGU7XG5cbiAgICAgIC8vIGNvbnRyb2wgTEVEc1xuICAgICAgY29uc29sZS5sb2coYGJsaW5raW5nIGF0IHBsYWNlICR7aW5kZXggKyAxfSAoJHtzdGF0ZX0pYCk7XG4gICAgfVxuICB9XG5cbiAgb25QbGFjZXJSZWFkeShjbGllbnQpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gY2xpZW50LmluZGV4O1xuICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5jYWxsYmFja3NbY2xpZW50SW5kZXhdO1xuXG4gICAgaWYoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuc3RvcChjbGllbnQpO1xuICAgICAgZXhwZXJpZW5jZS5icm9hZGNhc3QoJ2JhcnJlbCcsIG51bGwsICdwbGFjZXJEb25lJywgY2xpZW50SW5kZXgpO1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==