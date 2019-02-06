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

var template = '\n  <canvas class="background flex-middle"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-middle">\n      <p class="big"><b>CoLoop</b> Ready</p>\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var SceneOff = function () {
  function SceneOff(experience, config) {
    (0, _classCallCheck3.default)(this, SceneOff);

    this.experience = experience;
    this.config = config;
  }

  (0, _createClass3.default)(SceneOff, [{
    key: 'enter',
    value: function enter() {
      var experience = this.experience;
      experience.view.model = {};
      experience.view.template = template;
      experience.view.render();
    }
  }, {
    key: 'exit',
    value: function exit() {}
  }]);
  return SceneOff;
}();

exports.default = SceneOff;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9mZi5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwidGVtcGxhdGUiLCJTY2VuZU9mZiIsImV4cGVyaWVuY2UiLCJjb25maWciLCJ2aWV3IiwibW9kZWwiLCJyZW5kZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLFU7Ozs7OztBQUVaLElBQU1DLHNUQUFOOztJQVdxQkMsUTtBQUNuQixvQkFBWUMsVUFBWixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFBQTs7QUFDOUIsU0FBS0QsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDRDs7Ozs0QkFFTztBQUNOLFVBQU1ELGFBQWEsS0FBS0EsVUFBeEI7QUFDQUEsaUJBQVdFLElBQVgsQ0FBZ0JDLEtBQWhCLEdBQXdCLEVBQXhCO0FBQ0FILGlCQUFXRSxJQUFYLENBQWdCSixRQUFoQixHQUEyQkEsUUFBM0I7QUFDQUUsaUJBQVdFLElBQVgsQ0FBZ0JFLE1BQWhCO0FBQ0Q7OzsyQkFFTSxDQUVOOzs7OztrQkFma0JMLFEiLCJmaWxlIjoib2ZmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZCBmbGV4LW1pZGRsZVwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LW1pZGRsZVwiPlxuICAgICAgPHAgY2xhc3M9XCJiaWdcIj48Yj5Db0xvb3A8L2I+IFJlYWR5PC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lT2ZmIHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSwgY29uZmlnKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS52aWV3Lm1vZGVsID0geyB9O1xuICAgIGV4cGVyaWVuY2Uudmlldy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIGV4cGVyaWVuY2Uudmlldy5yZW5kZXIoKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG5cbiAgfVxufVxuIl19