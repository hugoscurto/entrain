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

var _math = require('soundworks/utils/math');

var _Placer = require('./Placer');

var _Placer2 = _interopRequireDefault(_Placer);

var _colorConfig = require('../../../shared/color-config');

var _colorConfig2 = _interopRequireDefault(_colorConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = soundworks.client;
var audioContext = soundworks.audioContext;
var audioScheduler = soundworks.audio.getScheduler();
var playerColors = _colorConfig2.default.players;

function radToDegrees(radians) {
  return radians * 180 / Math.PI;
}

var Renderer = function (_soundworks$Canvas2dR) {
  (0, _inherits3.default)(Renderer, _soundworks$Canvas2dR);

  function Renderer(states, circleRadius, buttonRadius, color) {
    (0, _classCallCheck3.default)(this, Renderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Renderer.__proto__ || (0, _getPrototypeOf2.default)(Renderer)).call(this, 0));

    _this.states = states;
    _this.circleRadius = circleRadius;
    _this.buttonRadius = buttonRadius;
    _this.highlight = undefined;
    _this.color = color;
    return _this;
  }

  (0, _createClass3.default)(Renderer, [{
    key: 'init',
    value: function init() {
      var circleRadius = this.circleRadius;

      this.positionXArr = [];
      this.positionYArr = [];

      for (var i = 0; i < this.states.length; i++) {
        var x = circleRadius * Math.cos(Math.PI / 2 - i * (Math.PI / 8));
        var y = circleRadius * Math.sin(Math.PI / 2 - i * (Math.PI / 8));
        this.positionXArr.push(x);
        this.positionYArr.push(y);
      }
    }
  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.save();

      var buttonRadius = this.buttonRadius;
      var states = this.states;
      var numSteps = states.length;
      var x0 = this.canvasWidth / 2;
      var y0 = this.canvasHeight / 2;

      for (var i = 0; i < numSteps; i++) {
        var state = states[i];
        var internalCircle = buttonRadius;

        switch (state) {
          case 0:
            if (i === this.highlight) {
              ctx.fillStyle = '#606060';
            } else {
              ctx.fillStyle = '#000000';
            }
            break;

          case 1:
            if (i === this.highlight) {
              ctx.fillStyle = '#FFFFFF';
            } else {
              ctx.fillStyle = this.color;
              internalCircle = buttonRadius / 2;
            }
            break;

          case 2:
            if (i === this.highlight) {
              ctx.fillStyle = '#FFFFFF';
            } else {
              ctx.fillStyle = this.color;
            }
            break;
        }

        ctx.beginPath();
        ctx.ellipse(x0 + this.positionXArr[i], y0 - this.positionYArr[i], internalCircle, internalCircle, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#ffffff";

        ctx.beginPath();
        ctx.ellipse(x0 + this.positionXArr[i], y0 - this.positionYArr[i], buttonRadius, buttonRadius, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.restore();
    }
  }, {
    key: 'setHighlight',
    value: function setHighlight(index) {
      this.highlight = index;
    }
  }]);
  return Renderer;
}(soundworks.Canvas2dRenderer);

var template = '\n  <canvas class="background flex-middle"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-middle">\n    <p class="instrument-name"><%= instrumentName %></p>\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var SceneCo909 = function () {
  function SceneCo909(experience, config) {
    (0, _classCallCheck3.default)(this, SceneCo909);


    this.experience = experience;
    this.config = config;

    this.placer = new _Placer2.default(experience);

    this.$viewElem = null;
    this.instrument = null;

    var clientIndex = soundworks.client.index;
    this.clientIndex = clientIndex;
    this.numSteps = config.numSteps;
    this.sequence = new Array(this.numSteps);
    this.clear();

    var canvasMin = Math.min(window.innerWidth, window.innerHeight);
    this.buttonRadius = canvasMin / 15;
    this.circleRadius = canvasMin / 2 - this.buttonRadius - 10;
    this.renderer = new Renderer(this.sequence, this.circleRadius, this.buttonRadius, '#' + playerColors[clientIndex]);
    this.audioOutput = experience.audioOutput;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMetroBeat = this.onMetroBeat.bind(this);
  }

  (0, _createClass3.default)(SceneCo909, [{
    key: 'startPlacer',
    value: function startPlacer() {
      var _this2 = this;

      this.placer.start(function () {
        return _this2.startScene();
      });
    }
  }, {
    key: 'startScene',
    value: function startScene() {
      var experience = this.experience;

      this.$viewElem = experience.view.$el;

      experience.view.model = { instrumentName: this.instrument.name.toUpperCase() };
      experience.view.template = template;
      experience.view.render();
      experience.view.addRenderer(this.renderer);
      experience.view.setPreRender(function (ctx, dt, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000000';
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        ctx.fill();
        ctx.restore();
      });

      experience.surface.addListener('touchstart', this.onTouchStart);
      experience.metricScheduler.addMetronome(this.onMetroBeat, this.numSteps, this.numSteps, 1, 0, true);
    }
  }, {
    key: 'enter',
    value: function enter() {
      var _this3 = this;

      if (this.instrument) {
        this.startPlacer();
      } else {
        var experience = this.experience;
        var instrumentConfig = this.config.instruments[soundworks.client.index];

        experience.audioBufferManager.loadFiles(instrumentConfig).then(function (instrument) {
          _this3.instrument = instrument;
          _this3.startPlacer();
        });
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.clear();
      this.placer.stop();

      if (this.$viewElem !== null) {
        this.$viewElem = null;

        var experience = this.experience;
        experience.view.removeRenderer(this.renderer);
        experience.metricScheduler.removeMetronome(this.onMetroBeat);
        experience.surface.removeListener('touchstart', this.onTouchStart);
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var i = 0; i < this.sequence.length; i++) {
        this.sequence[i] = 0;
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(id, x, y) {
      var experience = this.experience;
      var width = window.innerWidth;
      var height = window.innerHeight;
      var x0 = width / 2;
      var y0 = height / 2;
      var relX = x - x0;
      var relY = y - y0;
      var radius = Math.sqrt(relX * relX + relY * relY);
      var minRadius = this.circleRadius - 2 * this.buttonRadius;
      var maxRadius = this.circleRadius + 2 * this.buttonRadius;
      var angle = Math.floor(radToDegrees(Math.atan2(-relY, relX)));

      if (radius > minRadius && radius < maxRadius) {
        var beat = Math.floor(this.numSteps * (450 - angle) / 360 + 0.5) % this.numSteps;
        var state = (this.sequence[beat] + 1) % 3;
        this.sequence[beat] = state;
        experience.send('switchNote', this.clientIndex, beat, state);
      }
    }
  }, {
    key: 'onMetroBeat',
    value: function onMetroBeat(measure, beat) {
      var state = this.sequence[beat];

      if (state > 0) {
        var time = audioScheduler.currentTime;
        var layer = this.instrument.layers[state - 1];

        var gain = audioContext.createGain();
        gain.connect(this.audioOutput);
        gain.gain.value = (0, _math.decibelToLinear)(layer.gain);

        var src = audioContext.createBufferSource();
        src.connect(gain);
        src.buffer = layer.buffer;
        src.start(time);
      }

      this.renderer.setHighlight(beat);
    }
  }]);
  return SceneCo909;
}();

exports.default = SceneCo909;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvLTkwOS5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiY2xpZW50IiwiYXVkaW9Db250ZXh0IiwiYXVkaW9TY2hlZHVsZXIiLCJhdWRpbyIsImdldFNjaGVkdWxlciIsInBsYXllckNvbG9ycyIsImNvbG9yQ29uZmlnIiwicGxheWVycyIsInJhZFRvRGVncmVlcyIsInJhZGlhbnMiLCJNYXRoIiwiUEkiLCJSZW5kZXJlciIsInN0YXRlcyIsImNpcmNsZVJhZGl1cyIsImJ1dHRvblJhZGl1cyIsImNvbG9yIiwiaGlnaGxpZ2h0IiwidW5kZWZpbmVkIiwicG9zaXRpb25YQXJyIiwicG9zaXRpb25ZQXJyIiwiaSIsImxlbmd0aCIsIngiLCJjb3MiLCJ5Iiwic2luIiwicHVzaCIsImR0IiwiY3R4Iiwic2F2ZSIsIm51bVN0ZXBzIiwieDAiLCJjYW52YXNXaWR0aCIsInkwIiwiY2FudmFzSGVpZ2h0Iiwic3RhdGUiLCJpbnRlcm5hbENpcmNsZSIsImZpbGxTdHlsZSIsImJlZ2luUGF0aCIsImVsbGlwc2UiLCJmaWxsIiwiZ2xvYmFsQWxwaGEiLCJzdHJva2VTdHlsZSIsInN0cm9rZSIsInJlc3RvcmUiLCJpbmRleCIsIkNhbnZhczJkUmVuZGVyZXIiLCJ0ZW1wbGF0ZSIsIlNjZW5lQ285MDkiLCJleHBlcmllbmNlIiwiY29uZmlnIiwicGxhY2VyIiwiUGxhY2VyIiwiJHZpZXdFbGVtIiwiaW5zdHJ1bWVudCIsImNsaWVudEluZGV4Iiwic2VxdWVuY2UiLCJBcnJheSIsImNsZWFyIiwiY2FudmFzTWluIiwibWluIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwicmVuZGVyZXIiLCJhdWRpb091dHB1dCIsIm9uVG91Y2hTdGFydCIsImJpbmQiLCJvbk1ldHJvQmVhdCIsInN0YXJ0Iiwic3RhcnRTY2VuZSIsInZpZXciLCIkZWwiLCJtb2RlbCIsImluc3RydW1lbnROYW1lIiwibmFtZSIsInRvVXBwZXJDYXNlIiwicmVuZGVyIiwiYWRkUmVuZGVyZXIiLCJzZXRQcmVSZW5kZXIiLCJyZWN0Iiwic3VyZmFjZSIsImFkZExpc3RlbmVyIiwibWV0cmljU2NoZWR1bGVyIiwiYWRkTWV0cm9ub21lIiwic3RhcnRQbGFjZXIiLCJpbnN0cnVtZW50Q29uZmlnIiwiaW5zdHJ1bWVudHMiLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJsb2FkRmlsZXMiLCJ0aGVuIiwic3RvcCIsInJlbW92ZVJlbmRlcmVyIiwicmVtb3ZlTWV0cm9ub21lIiwicmVtb3ZlTGlzdGVuZXIiLCJpZCIsIndpZHRoIiwiaGVpZ2h0IiwicmVsWCIsInJlbFkiLCJyYWRpdXMiLCJzcXJ0IiwibWluUmFkaXVzIiwibWF4UmFkaXVzIiwiYW5nbGUiLCJmbG9vciIsImF0YW4yIiwiYmVhdCIsInNlbmQiLCJtZWFzdXJlIiwidGltZSIsImN1cnJlbnRUaW1lIiwibGF5ZXIiLCJsYXllcnMiLCJnYWluIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJ2YWx1ZSIsInNyYyIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImJ1ZmZlciIsInNldEhpZ2hsaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsVTs7QUFDWjs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU1DLFNBQVNELFdBQVdDLE1BQTFCO0FBQ0EsSUFBTUMsZUFBZUYsV0FBV0UsWUFBaEM7QUFDQSxJQUFNQyxpQkFBaUJILFdBQVdJLEtBQVgsQ0FBaUJDLFlBQWpCLEVBQXZCO0FBQ0EsSUFBTUMsZUFBZUMsc0JBQVlDLE9BQWpDOztBQUVBLFNBQVNDLFlBQVQsQ0FBc0JDLE9BQXRCLEVBQStCO0FBQzdCLFNBQU9BLFVBQVUsR0FBVixHQUFnQkMsS0FBS0MsRUFBNUI7QUFDRDs7SUFFS0MsUTs7O0FBQ0osb0JBQVlDLE1BQVosRUFBb0JDLFlBQXBCLEVBQWtDQyxZQUFsQyxFQUFnREMsS0FBaEQsRUFBdUQ7QUFBQTs7QUFBQSwwSUFDL0MsQ0FEK0M7O0FBR3JELFVBQUtILE1BQUwsR0FB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QUNBYyxtQkFBVzJELElBQVgsQ0FBZ0IsWUFBaEIsRUFBOEIsS0FBS3JELFdBQW5DLEVBQWdEb0QsSUFBaEQsRUFBc0R4RSxLQUF0RDtBQUNEO0FBQ0Y7OztnQ0FFVzBFLE8sRUFBU0YsSSxFQUFNO0FBQ3pCLFVBQU14RSxRQUFRLEtBQUtxQixRQUFMLENBQWNtRCxJQUFkLENBQWQ7O0FBRUEsVUFBSXhFLFFBQVEsQ0FBWixFQUFlO0FBQ2IsWUFBTTJFLE9BQU83RyxlQUFlOEcsV0FBNUI7QUFDQSxZQUFNQyxRQUFRLEtBQUsxRCxVQUFMLENBQWdCMkQsTUFBaEIsQ0FBdUI5RSxRQUFRLENBQS9CLENBQWQ7O0FBRUEsWUFBTStFLE9BQU9sSCxhQUFhbUgsVUFBYixFQUFiO0FBQ0FELGFBQUtFLE9BQUwsQ0FBYSxLQUFLbkQsV0FBbEI7QUFDQWlELGFBQUtBLElBQUwsQ0FBVUcsS0FBVixHQUFrQiwyQkFBZ0JMLE1BQU1FLElBQXRCLENBQWxCOztBQUVBLFlBQU1JLE1BQU10SCxhQUFhdUgsa0JBQWIsRUFBWjtBQUNBRCxZQUFJRixPQUFKLENBQVlGLElBQVo7QUFDQUksWUFBSUUsTUFBSixHQUFhUixNQUFNUSxNQUFuQjtBQUNBRixZQUFJakQsS0FBSixDQUFVeUMsSUFBVjtBQUNEOztBQUVELFdBQUs5QyxRQUFMLENBQWN5RCxZQUFkLENBQTJCZCxJQUEzQjtBQUNEOzs7OztrQkE3SGtCM0QsVSIsImZpbGUiOiJjby05MDkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCB7IGRlY2liZWxUb0xpbmVhciB9IGZyb20gJ3NvdW5kd29ya3MvdXRpbHMvbWF0aCc7XG5pbXBvcnQgUGxhY2VyIGZyb20gJy4vUGxhY2VyJztcbmltcG9ydCBjb2xvckNvbmZpZyBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29sb3ItY29uZmlnJztcbmNvbnN0IGNsaWVudCA9IHNvdW5kd29ya3MuY2xpZW50O1xuY29uc3QgYXVkaW9Db250ZXh0ID0gc291bmR3b3Jrcy5hdWRpb0NvbnRleHQ7XG5jb25zdCBhdWRpb1NjaGVkdWxlciA9IHNvdW5kd29ya3MuYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG5jb25zdCBwbGF5ZXJDb2xvcnMgPSBjb2xvckNvbmZpZy5wbGF5ZXJzO1xuXG5mdW5jdGlvbiByYWRUb0RlZ3JlZXMocmFkaWFucykge1xuICByZXR1cm4gcmFkaWFucyAqIDE4MCAvIE1hdGguUEk7XG59XG5cbmNsYXNzIFJlbmRlcmVyIGV4dGVuZHMgc291bmR3b3Jrcy5DYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3RhdGVzLCBjaXJjbGVSYWRpdXMsIGJ1dHRvblJhZGl1cywgY29sb3IpIHtcbiAgICBzdXBlcigwKTtcblxuICAgIHRoaXMuc3RhdGVzID0gc3RhdGVzO1xuICAgIHRoaXMuY2lyY2xlUmFkaXVzID0gY2lyY2xlUmFkaXVzO1xuICAgIHRoaXMuYnV0dG9uUmFkaXVzID0gYnV0dG9uUmFkaXVzO1xuICAgIHRoaXMuaGlnaGxpZ2h0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgY2lyY2xlUmFkaXVzID0gdGhpcy5jaXJjbGVSYWRpdXM7XG5cbiAgICB0aGlzLnBvc2l0aW9uWEFyciA9IFtdO1xuICAgIHRoaXMucG9zaXRpb25ZQXJyID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gY2lyY2xlUmFkaXVzICogTWF0aC5jb3MoTWF0aC5QSSAvIDIgLSAoaSAqIChNYXRoLlBJIC8gOCkpKTtcbiAgICAgIGNvbnN0IHkgPSBjaXJjbGVSYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJIC8gMiAtIChpICogKE1hdGguUEkgLyA4KSkpO1xuICAgICAgdGhpcy5wb3NpdGlvblhBcnIucHVzaCh4KTtcbiAgICAgIHRoaXMucG9zaXRpb25ZQXJyLnB1c2goeSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG5cbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgYnV0dG9uUmFkaXVzID0gdGhpcy5idXR0b25SYWRpdXM7XG4gICAgY29uc3Qgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XG4gICAgY29uc3QgbnVtU3RlcHMgPSBzdGF0ZXMubGVuZ3RoO1xuICAgIGNvbnN0IHgwID0gdGhpcy5jYW52YXNXaWR0aCAvIDI7XG4gICAgY29uc3QgeTAgPSB0aGlzLmNhbnZhc0hlaWdodCAvIDI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVN0ZXBzOyBpKyspIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gc3RhdGVzW2ldO1xuICAgICAgbGV0IGludGVybmFsQ2lyY2xlID0gYnV0dG9uUmFkaXVzO1xuXG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5oaWdobGlnaHQpIHtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzYwNjA2MCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5oaWdobGlnaHQpIHtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICAgICAgaW50ZXJuYWxDaXJjbGUgPSBidXR0b25SYWRpdXMgLyAyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgaWYgKGkgPT09IHRoaXMuaGlnaGxpZ2h0KSB7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5lbGxpcHNlKHgwICsgdGhpcy5wb3NpdGlvblhBcnJbaV0sIHkwIC0gdGhpcy5wb3NpdGlvbllBcnJbaV0sIGludGVybmFsQ2lyY2xlLCBpbnRlcm5hbENpcmNsZSwgMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgY3R4LmZpbGwoKTtcblxuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiI2ZmZmZmZlwiO1xuXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguZWxsaXBzZSh4MCArIHRoaXMucG9zaXRpb25YQXJyW2ldLCB5MCAtIHRoaXMucG9zaXRpb25ZQXJyW2ldLCBidXR0b25SYWRpdXMsIGJ1dHRvblJhZGl1cywgMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBzZXRIaWdobGlnaHQoaW5kZXgpIHtcbiAgICB0aGlzLmhpZ2hsaWdodCA9IGluZGV4O1xuICB9XG59XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZCBmbGV4LW1pZGRsZVwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LW1pZGRsZVwiPlxuICAgIDxwIGNsYXNzPVwiaW5zdHJ1bWVudC1uYW1lXCI+PCU9IGluc3RydW1lbnROYW1lICU+PC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lQ285MDkge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBjb25maWcpIHtcblxuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLnBsYWNlciA9IG5ldyBQbGFjZXIoZXhwZXJpZW5jZSk7XG5cbiAgICB0aGlzLiR2aWV3RWxlbSA9IG51bGw7XG4gICAgdGhpcy5pbnN0cnVtZW50ID0gbnVsbDtcblxuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gc291bmR3b3Jrcy5jbGllbnQuaW5kZXg7XG4gICAgdGhpcy5jbGllbnRJbmRleCA9IGNsaWVudEluZGV4O1xuICAgIHRoaXMubnVtU3RlcHMgPSBjb25maWcubnVtU3RlcHM7XG4gICAgdGhpcy5zZXF1ZW5jZSA9IG5ldyBBcnJheSh0aGlzLm51bVN0ZXBzKTtcbiAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICBjb25zdCBjYW52YXNNaW4gPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICB0aGlzLmJ1dHRvblJhZGl1cyA9IGNhbnZhc01pbiAvIDE1O1xuICAgIHRoaXMuY2lyY2xlUmFkaXVzID0gY2FudmFzTWluIC8gMiAtIHRoaXMuYnV0dG9uUmFkaXVzIC0gMTA7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih0aGlzLnNlcXVlbmNlLCB0aGlzLmNpcmNsZVJhZGl1cywgdGhpcy5idXR0b25SYWRpdXMsICcjJyArIHBsYXllckNvbG9yc1tjbGllbnRJbmRleF0pO1xuICAgIHRoaXMuYXVkaW9PdXRwdXQgPSBleHBlcmllbmNlLmF1ZGlvT3V0cHV0O1xuXG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25NZXRyb0JlYXQgPSB0aGlzLm9uTWV0cm9CZWF0LmJpbmQodGhpcyk7XG4gIH1cblxuICBzdGFydFBsYWNlcigpIHtcbiAgICB0aGlzLnBsYWNlci5zdGFydCgoKSA9PiB0aGlzLnN0YXJ0U2NlbmUoKSk7XG4gIH1cblxuICBzdGFydFNjZW5lKCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG5cbiAgICB0aGlzLiR2aWV3RWxlbSA9IGV4cGVyaWVuY2Uudmlldy4kZWw7XG5cbiAgICBleHBlcmllbmNlLnZpZXcubW9kZWwgPSB7IGluc3RydW1lbnROYW1lOiB0aGlzLmluc3RydW1lbnQubmFtZS50b1VwcGVyQ2FzZSgpIH07XG4gICAgZXhwZXJpZW5jZS52aWV3LnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgZXhwZXJpZW5jZS52aWV3LnJlbmRlcigpO1xuICAgIGV4cGVyaWVuY2Uudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICBleHBlcmllbmNlLnZpZXcuc2V0UHJlUmVuZGVyKGZ1bmN0aW9uIChjdHgsIGR0LCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgICBjdHgucmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0pO1xuXG4gICAgZXhwZXJpZW5jZS5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIGV4cGVyaWVuY2UubWV0cmljU2NoZWR1bGVyLmFkZE1ldHJvbm9tZSh0aGlzLm9uTWV0cm9CZWF0LCB0aGlzLm51bVN0ZXBzLCB0aGlzLm51bVN0ZXBzLCAxLCAwLCB0cnVlKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIGlmICh0aGlzLmluc3RydW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhcnRQbGFjZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICAgIGNvbnN0IGluc3RydW1lbnRDb25maWcgPSB0aGlzLmNvbmZpZy5pbnN0cnVtZW50c1tzb3VuZHdvcmtzLmNsaWVudC5pbmRleF07XG4gICAgICBcbiAgICAgIGV4cGVyaWVuY2UuYXVkaW9CdWZmZXJNYW5hZ2VyLmxvYWRGaWxlcyhpbnN0cnVtZW50Q29uZmlnKS50aGVuKChpbnN0cnVtZW50KSA9PiB7XG4gICAgICAgIHRoaXMuaW5zdHJ1bWVudCA9IGluc3RydW1lbnQ7XG4gICAgICAgIHRoaXMuc3RhcnRQbGFjZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMucGxhY2VyLnN0b3AoKTtcblxuICAgIGlmKHRoaXMuJHZpZXdFbGVtICE9PSBudWxsKSB7XG4gICAgICB0aGlzLiR2aWV3RWxlbSA9IG51bGw7XG5cbiAgICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgICBleHBlcmllbmNlLnZpZXcucmVtb3ZlUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG4gICAgICBleHBlcmllbmNlLm1ldHJpY1NjaGVkdWxlci5yZW1vdmVNZXRyb25vbWUodGhpcy5vbk1ldHJvQmVhdCk7XG4gICAgICBleHBlcmllbmNlLnN1cmZhY2UucmVtb3ZlTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlcXVlbmNlLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5zZXF1ZW5jZVtpXSA9IDA7XG4gIH1cblxuICBvblRvdWNoU3RhcnQoaWQsIHgsIHkpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHgwID0gd2lkdGggLyAyO1xuICAgIGNvbnN0IHkwID0gaGVpZ2h0IC8gMjtcbiAgICBjb25zdCByZWxYID0geCAtIHgwO1xuICAgIGNvbnN0IHJlbFkgPSB5IC0geTA7XG4gICAgY29uc3QgcmFkaXVzID0gTWF0aC5zcXJ0KHJlbFggKiByZWxYICsgcmVsWSAqIHJlbFkpO1xuICAgIGNvbnN0IG1pblJhZGl1cyA9IHRoaXMuY2lyY2xlUmFkaXVzIC0gMiAqIHRoaXMuYnV0dG9uUmFkaXVzO1xuICAgIGNvbnN0IG1heFJhZGl1cyA9IHRoaXMuY2lyY2xlUmFkaXVzICsgMiAqIHRoaXMuYnV0dG9uUmFkaXVzO1xuICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5mbG9vcihyYWRUb0RlZ3JlZXMoTWF0aC5hdGFuMigtcmVsWSwgcmVsWCkpKTtcblxuICAgIGlmIChyYWRpdXMgPiBtaW5SYWRpdXMgJiYgcmFkaXVzIDwgbWF4UmFkaXVzKSB7XG4gICAgICBjb25zdCBiZWF0ID0gTWF0aC5mbG9vcigodGhpcy5udW1TdGVwcyAqICg0NTAgLSBhbmdsZSkgLyAzNjApICsgMC41KSAlIHRoaXMubnVtU3RlcHM7XG4gICAgICBsZXQgc3RhdGUgPSAodGhpcy5zZXF1ZW5jZVtiZWF0XSArIDEpICUgMztcbiAgICAgIHRoaXMuc2VxdWVuY2VbYmVhdF0gPSBzdGF0ZTtcbiAgICAgIGV4cGVyaWVuY2Uuc2VuZCgnc3dpdGNoTm90ZScsIHRoaXMuY2xpZW50SW5kZXgsIGJlYXQsIHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBvbk1ldHJvQmVhdChtZWFzdXJlLCBiZWF0KSB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnNlcXVlbmNlW2JlYXRdO1xuXG4gICAgaWYgKHN0YXRlID4gMCkge1xuICAgICAgY29uc3QgdGltZSA9IGF1ZGlvU2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmluc3RydW1lbnQubGF5ZXJzW3N0YXRlIC0gMV07XG5cbiAgICAgIGNvbnN0IGdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpOyBcbiAgICAgIGdhaW4uY29ubmVjdCh0aGlzLmF1ZGlvT3V0cHV0KTtcbiAgICAgIGdhaW4uZ2Fpbi52YWx1ZSA9IGRlY2liZWxUb0xpbmVhcihsYXllci5nYWluKTtcblxuICAgICAgY29uc3Qgc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgc3JjLmNvbm5lY3QoZ2Fpbik7XG4gICAgICBzcmMuYnVmZmVyID0gbGF5ZXIuYnVmZmVyO1xuICAgICAgc3JjLnN0YXJ0KHRpbWUpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIuc2V0SGlnaGxpZ2h0KGJlYXQpO1xuICB9XG59XG4iXX0=