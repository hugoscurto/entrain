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

var SceneOff = function () {
  function SceneOff(experience, config) {
    (0, _classCallCheck3.default)(this, SceneOff);

    this.experience = experience;
    this.config = config;
  }

  (0, _createClass3.default)(SceneOff, [{
    key: 'clientEnter',
    value: function clientEnter(client) {}
  }, {
    key: 'clientExit',
    value: function clientExit(client) {}
  }, {
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }]);
  return SceneOff;
}();

exports.default = SceneOff;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9mZi5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiU2NlbmVPZmYiLCJleHBlcmllbmNlIiwiY29uZmlnIiwiY2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxVOzs7Ozs7SUFFU0MsUTtBQUNuQixvQkFBWUMsVUFBWixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFBQTs7QUFDOUIsU0FBS0QsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDRDs7OztnQ0FFV0MsTSxFQUFRLENBQUU7OzsrQkFFWEEsTSxFQUFRLENBQUU7Ozs0QkFFYixDQUFFOzs7MkJBRUgsQ0FBRTs7Ozs7a0JBWlVILFEiLCJmaWxlIjoib2ZmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lT2ZmIHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSwgY29uZmlnKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgfVxuXG4gIGNsaWVudEVudGVyKGNsaWVudCkge31cblxuICBjbGllbnRFeGl0KGNsaWVudCkge31cblxuICBlbnRlcigpIHt9XG5cbiAgZXhpdCgpIHt9XG59XG4iXX0=