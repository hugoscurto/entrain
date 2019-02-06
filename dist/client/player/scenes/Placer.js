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

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

var _colorConfig = require('../../../shared/color-config');

var _colorConfig2 = _interopRequireDefault(_colorConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = soundworks.client;
var audioContext = soundworks.audioContext;
var TimeEngine = soundworks.audio.TimeEngine;

var Renderer = function (_soundworks$Canvas2dR) {
  (0, _inherits3.default)(Renderer, _soundworks$Canvas2dR);

  function Renderer() {
    (0, _classCallCheck3.default)(this, Renderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Renderer.__proto__ || (0, _getPrototypeOf2.default)(Renderer)).call(this, 0));

    _this.blinkState = false;
    _this.color = '#' + _colorConfig2.default.players[client.index];
    return _this;
  }

  (0, _createClass3.default)(Renderer, [{
    key: 'init',
    value: function init() {}
  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 1;
      ctx.fillStyle = this.blinkState ? this.color : '#000000';
      ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.fill();
      ctx.restore();
    }
  }, {
    key: 'setBlinkState',
    value: function setBlinkState(state) {
      this.blinkState = state;
    }
  }]);
  return Renderer;
}(soundworks.Canvas2dRenderer);

var template = '\n  <canvas class="background flex-middle"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-middle">\n    <p class="user-instruction">Please take your place and touch the screen to continue...</p>\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var Placer = function () {
  function Placer(experience) {
    (0, _classCallCheck3.default)(this, Placer);

    this.experience = experience;

    this.renderer = new Renderer();
    this.callback = null;
    this.audioOutput = experience.audioOutput;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMetroBeat = this.onMetroBeat.bind(this);
  }

  (0, _createClass3.default)(Placer, [{
    key: 'start',
    value: function start(callback) {
      this.callback = callback;

      var experience = this.experience;
      experience.view.model = {};
      experience.view.template = template;
      experience.view.render();

      experience.view.addRenderer(this.renderer);
      experience.surface.addListener('touchstart', this.onTouchStart);
      experience.metricScheduler.addMetronome(this.onMetroBeat, 2, 2, 1, 0, true);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.callback) {
        this.callback = null;

        var experience = this.experience;
        experience.view.removeRenderer(this.renderer);
        experience.surface.removeListener('touchstart', this.onTouchStart);
        experience.metricScheduler.removeMetronome(this.onMetroBeat);
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(id, normX, normY) {
      var callback = this.callback;
      this.stop();

      var experience = this.experience;
      experience.send('placerReady');

      callback();
    }
  }, {
    key: 'onMetroBeat',
    value: function onMetroBeat(measure, beat) {
      this.renderer.setBlinkState(beat === 0);
    }
  }]);
  return Placer;
}();

exports.default = Placer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiY2xpZW50IiwiYXVkaW9Db250ZXh0IiwiVGltZUVuZ2luZSIsImF1ZGlvIiwiUmVuZGVyZXIiLCJibGlua1N0YXRlIiwiY29sb3IiLCJjb2xvckNvbmZpZyIsInBsYXllcnMiLCJpbmRleCIsImR0IiwiY3R4Iiwic2F2ZSIsImJlZ2luUGF0aCIsImdsb2JhbEFscGhhIiwiZmlsbFN0eWxlIiwicmVjdCIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwiZmlsbCIsInJlc3RvcmUiLCJzdGF0ZSIsIkNhbnZhczJkUmVuZGVyZXIiLCJ0ZW1wbGF0ZSIsIlBsYWNlciIsImV4cGVyaWVuY2UiLCJyZW5kZXJlciIsImNhbGxiYWNrIiwiYXVkaW9PdXRwdXQiLCJvblRvdWNoU3RhcnQiLCJiaW5kIiwib25NZXRyb0JlYXQiLCJ2aWV3IiwibW9kZWwiLCJyZW5kZXIiLCJhZGRSZW5kZXJlciIsInN1cmZhY2UiLCJhZGRMaXN0ZW5lciIsIm1ldHJpY1NjaGVkdWxlciIsImFkZE1ldHJvbm9tZSIsInJlbW92ZVJlbmRlcmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVNZXRyb25vbWUiLCJpZCIsIm5vcm1YIiwibm9ybVkiLCJzdG9wIiwic2VuZCIsIm1lYXN1cmUiLCJiZWF0Iiwic2V0QmxpbmtTdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsVTs7QUFDWjs7Ozs7Ozs7QUFDQSxJQUFNQyxTQUFTRCxXQUFXQyxNQUExQjtBQUNBLElBQU1DLGVBQWVGLFdBQVdFLFlBQWhDO0FBQ0EsSUFBTUMsYUFBYUgsV0FBV0ksS0FBWCxDQUFpQkQsVUFBcEM7O0lBRU1FLFE7OztBQUNKLHNCQUFjO0FBQUE7O0FBQUEsMElBQ04sQ0FETTs7QUFHWixVQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0EsVUFBS0MsS0FBTCxHQUFhLE1BQU1DLHNCQUFZQyxPQUFaLENBQW9CUixPQUFPUyxLQUEzQixDQUFuQjtBQUpZO0FBS2I7Ozs7MkJBRU0sQ0FBRTs7OzJCQUVGQyxFLEVBQUksQ0FBRTs7OzJCQUVOQyxHLEVBQUs7QUFDVkEsVUFBSUMsSUFBSjtBQUNBRCxVQUFJRSxTQUFKO0FBQ0FGLFVBQUlHLFdBQUosR0FBa0IsQ0FBbEI7QUFDQUgsVUFBSUksU0FBSixHQUFnQixLQUFLVixVQUFMLEdBQWtCLEtBQUtDLEtBQXZCLEdBQStCLFNBQS9DO0FBQ0FLLFVBQUlLLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLEtBQUtDLFdBQXBCLEVBQWlDLEtBQUtDLFlBQXRDO0FBQ0FQLFVBQUlRLElBQUo7QUFDQVIsVUFBSVMsT0FBSjtBQUNEOzs7a0NBRWFDLEssRUFBTztBQUNuQixXQUFLaEIsVUFBTCxHQUFrQmdCLEtBQWxCO0FBQ0Q7OztFQXhCb0J0QixXQUFXdUIsZ0I7O0FBMkJsQyxJQUFNQyx3V0FBTjs7SUFXcUJDLE07QUFDbkIsa0JBQVlDLFVBQVosRUFBd0I7QUFBQTs7QUFDdEIsU0FBS0EsVUFBTCxHQUFrQkEsVUFBbEI7O0FBRUEsU0FBS0MsUUFBTCxHQUFnQixJQUFJdEIsUUFBSixFQUFoQjtBQUNBLFNBQUt1QixRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQkgsV0FBV0csV0FBOUI7O0FBRUEsU0FBS0MsWUFBTCxHQUFvQixLQUFLQSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsS0FBS0EsV0FBTCxDQUFpQkQsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDRDs7OzswQkFFS0gsUSxFQUFVO0FBQ2QsV0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7O0FBRUEsVUFBTUYsYUFBYSxLQUFLQSxVQUF4QjtBQUNBQSxpQkFBV08sSUFBWCxDQUFnQkMsS0FBaEIsR0FBd0IsRUFBeEI7QUFDQVIsaUJBQVdPLElBQVgsQ0FBZ0JULFFBQWhCLEdBQTJCQSxRQUEzQjtBQUNBRSxpQkFBV08sSUFBWCxDQUFnQkUsTUFBaEI7O0FBRUFULGlCQUFXTyxJQUFYLENBQWdCRyxXQUFoQixDQUE0QixLQUFLVCxRQUFqQztBQUNBRCxpQkFBV1csT0FBWCxDQUFtQkMsV0FBbkIsQ0FBK0IsWUFBL0IsRUFBNkMsS0FBS1IsWUFBbEQ7QUFDQUosaUJBQVdhLGVBQVgsQ0FBMkJDLFlBQTNCLENBQXdDLEtBQUtSLFdBQTdDLEVBQTBELENBQTFELEVBQTZELENBQTdELEVBQWdFLENBQWhFLEVBQW1FLENBQW5FLEVBQXNFLElBQXRFO0FBQ0Q7OzsyQkFFTTtBQUNMLFVBQUksS0FBS0osUUFBVCxFQUFtQjtBQUNqQixhQUFLQSxRQUFMLEdBQWdCLElBQWhCOztBQUVBLFlBQU1GLGFBQWEsS0FBS0EsVUFBeEI7QUFDQUEsbUJBQVdPLElBQVgsQ0FBZ0JRLGNBQWhCLENBQStCLEtBQUtkLFFBQXBDO0FBQ0FELG1CQUFXVyxPQUFYLENBQW1CSyxjQUFuQixDQUFrQyxZQUFsQyxFQUFnRCxLQUFLWixZQUFyRDtBQUNBSixtQkFBV2EsZUFBWCxDQUEyQkksZUFBM0IsQ0FBMkMsS0FBS1gsV0FBaEQ7QUFDRDtBQUNGOzs7aUNBRVlZLEUsRUFBSUMsSyxFQUFPQyxLLEVBQU87QUFDN0IsVUFBTWxCLFdBQVcsS0FBS0EsUUFBdEI7QUFDQSxXQUFLbUIsSUFBTDs7QUFFQSxVQUFNckIsYUFBYSxLQUFLQSxVQUF4QjtBQUNBQSxpQkFBV3NCLElBQVgsQ0FBZ0IsYUFBaEI7O0FBRUFwQjtBQUNEOzs7Z0NBRVdxQixPLEVBQVNDLEksRUFBTTtBQUN6QixXQUFLdkIsUUFBTCxDQUFjd0IsYUFBZCxDQUE0QkQsU0FBUyxDQUFyQztBQUNEOzs7OztrQkFoRGtCekIsTSIsImZpbGUiOiJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBjb2xvckNvbmZpZyBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29sb3ItY29uZmlnJztcbmNvbnN0IGNsaWVudCA9IHNvdW5kd29ya3MuY2xpZW50O1xuY29uc3QgYXVkaW9Db250ZXh0ID0gc291bmR3b3Jrcy5hdWRpb0NvbnRleHQ7XG5jb25zdCBUaW1lRW5naW5lID0gc291bmR3b3Jrcy5hdWRpby5UaW1lRW5naW5lO1xuXG5jbGFzcyBSZW5kZXJlciBleHRlbmRzIHNvdW5kd29ya3MuQ2FudmFzMmRSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKDApO1xuXG4gICAgdGhpcy5ibGlua1N0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5jb2xvciA9ICcjJyArIGNvbG9yQ29uZmlnLnBsYXllcnNbY2xpZW50LmluZGV4XTtcbiAgfVxuXG4gIGluaXQoKSB7fVxuXG4gIHVwZGF0ZShkdCkge31cblxuICByZW5kZXIoY3R4KSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5ibGlua1N0YXRlID8gdGhpcy5jb2xvciA6ICcjMDAwMDAwJztcbiAgICBjdHgucmVjdCgwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgc2V0QmxpbmtTdGF0ZShzdGF0ZSkge1xuICAgIHRoaXMuYmxpbmtTdGF0ZSA9IHN0YXRlO1xuICB9XG59XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZCBmbGV4LW1pZGRsZVwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LW1pZGRsZVwiPlxuICAgIDxwIGNsYXNzPVwidXNlci1pbnN0cnVjdGlvblwiPlBsZWFzZSB0YWtlIHlvdXIgcGxhY2UgYW5kIHRvdWNoIHRoZSBzY3JlZW4gdG8gY29udGludWUuLi48L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhY2VyIHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSkge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKCk7XG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5hdWRpb091dHB1dCA9IGV4cGVyaWVuY2UuYXVkaW9PdXRwdXQ7XG5cbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbk1ldHJvQmVhdCA9IHRoaXMub25NZXRyb0JlYXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHN0YXJ0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBleHBlcmllbmNlLnZpZXcubW9kZWwgPSB7fTtcbiAgICBleHBlcmllbmNlLnZpZXcudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICBleHBlcmllbmNlLnZpZXcucmVuZGVyKCk7XG5cbiAgICBleHBlcmllbmNlLnZpZXcuYWRkUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG4gICAgZXhwZXJpZW5jZS5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIGV4cGVyaWVuY2UubWV0cmljU2NoZWR1bGVyLmFkZE1ldHJvbm9tZSh0aGlzLm9uTWV0cm9CZWF0LCAyLCAyLCAxLCAwLCB0cnVlKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuXG4gICAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgICAgZXhwZXJpZW5jZS52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgICAgZXhwZXJpZW5jZS5zdXJmYWNlLnJlbW92ZUxpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgICAgZXhwZXJpZW5jZS5tZXRyaWNTY2hlZHVsZXIucmVtb3ZlTWV0cm9ub21lKHRoaXMub25NZXRyb0JlYXQpO1xuICAgIH1cbiAgfVxuXG4gIG9uVG91Y2hTdGFydChpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrO1xuICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBleHBlcmllbmNlLnNlbmQoJ3BsYWNlclJlYWR5Jyk7XG5cbiAgICBjYWxsYmFjaygpO1xuICB9XG5cbiAgb25NZXRyb0JlYXQobWVhc3VyZSwgYmVhdCkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QmxpbmtTdGF0ZShiZWF0ID09PSAwKTtcbiAgfVxufVxuIl19