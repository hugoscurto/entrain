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

var maxActives = {
  'perc': 3,
  'bass': 1,
  'melody': 3
};

var Renderer = function (_soundworks$Canvas2dR) {
  (0, _inherits3.default)(Renderer, _soundworks$Canvas2dR);

  function Renderer(states, notes, index) {
    (0, _classCallCheck3.default)(this, Renderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Renderer.__proto__ || (0, _getPrototypeOf2.default)(Renderer)).call(this, 0));

    _this.states = states;
    _this.notes = notes;
    _this.myindex = index;

    _this.blinkState = false;
    _this.blinkDuration = 30 / 120; // duration of 8th beat
    return _this;
  }

  (0, _createClass3.default)(Renderer, [{
    key: 'init',
    value: function init() {}
  }, {
    key: 'hexToRgbA',
    value: function hexToRgbA(hex, alpha) {
      var c = void 0;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [c >> 16 & 255, c >> 8 & 255, c & 255].join(',') + ',' + alpha + ')';
      }
      throw new Error('Bad Hex');
    }
  }, {
    key: 'triggerBlink',
    value: function triggerBlink() {
      this.blinkTime = undefined;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      if (this.blinkTime !== undefined) this.blinkTime += dt;else this.blinkTime = 0;
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.save();

      var notes = this.notes;
      var states = this.states;
      var numStates = states.length;
      var stepHeight = this.canvasHeight / numStates;
      var xStart = 10;
      var xEnd = this.canvasWidth - 10;
      var y = this.canvasHeight - stepHeight / 2;

      for (var i = 0; i < numStates; i++) {
        var state = states[i];
        var note = notes[i];

        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#' + playerColors[this.myindex];

        switch (note.class) {
          case 'perc':
            ctx.setLineDash([15, 5]);
            break;

          case 'bass':
            ctx.setLineDash([]);

            break;

          case 'melody':
            ctx.setLineDash([5, 5]);
            break;
        }

        switch (state) {
          case 0:
            ctx.lineWidth = 2;
            break;

          case 1:
            if (this.blinkTime < this.blinkDuration) ctx.lineWidth = 15;else ctx.lineWidth = 7;
            break;
        }

        ctx.moveTo(xStart, y);
        ctx.lineTo(xEnd, y);
        ctx.stroke();

        y -= stepHeight;
      }

      ctx.restore();
    }
  }]);
  return Renderer;
}(soundworks.Canvas2dRenderer);

var template = '\n  <canvas class="background flex-middle"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-middle">\n    \n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';
//<p class="player-index"><%= stepIndex %></p>

var SceneCollectiveLoops = function () {
  function SceneCollectiveLoops(experience, config) {
    (0, _classCallCheck3.default)(this, SceneCollectiveLoops);

    this.experience = experience;
    this.config = config;

    this.placer = new _Placer2.default(experience);

    this.clientIndex = soundworks.client.index;
    this.notes = null;
    this.$viewElem = null;

    var numSteps = config.numSteps;
    var numStates = config.notes.length;

    this.states = new Array(numStates);
    this.clear();

    this.actives = {
      'perc': [],
      'bass': [],
      'melody': []
    };

    this.renderer = new Renderer(this.states, config.notes, this.clientIndex);
    this.audioOutput = experience.audioOutput;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMetroBeat = this.onMetroBeat.bind(this);
  }

  (0, _createClass3.default)(SceneCollectiveLoops, [{
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
      var numSteps = this.config.numSteps;

      this.$viewElem = experience.view.$el;

      experience.view.model = { stepIndex: this.clientIndex + 1 };
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
      experience.metricScheduler.addMetronome(this.onMetroBeat, 1, 1, 1, this.clientIndex / numSteps, true);
    }
  }, {
    key: 'enter',
    value: function enter() {
      var _this3 = this;

      if (this.notes) {
        this.startPlacer();
      } else {
        var experience = this.experience;
        var noteConfig = this.config.notes;

        experience.audioBufferManager.loadFiles(noteConfig).then(function (notes) {
          _this3.notes = notes;
          _this3.startPlacer();
        });
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.clear();
      this.placer.stop();

      if (this.$viewElem) {
        this.$viewElem = null;

        var experience = this.experience;
        experience.view.removeRenderer(this.renderer);
        experience.surface.removeListener('touchstart', this.onTouchStart);
        experience.metricScheduler.removeMetronome(this.onMetroBeat);
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var i = 0; i < this.states.length; i++) {
        this.states[i] = 0;
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(id, x, y) {
      var experience = this.experience;
      var numStates = this.states.length;
      var normX = x / window.innerWidth;
      var normY = y / window.innerHeight;
      var note = numStates - 1 - Math.floor(normY * numStates);
      var noteClass = this.notes[note].class;
      var state = (this.states[note] + 1) % 2;
      var actives = this.actives[noteClass];

      if (state > 0) {
        actives.push(note);

        if (actives.length > maxActives[noteClass]) {
          var offNote = actives.shift();
          this.states[offNote] = 0;
          experience.send('switchNote', this.clientIndex, offNote, 0);
        }
      } else {
        var idx = actives.indexOf(note);
        actives.splice(idx, 1);
      }

      this.states[note] = state;
      experience.send('switchNote', this.clientIndex, note, state);
    }
  }, {
    key: 'onMetroBeat',
    value: function onMetroBeat(measure, beat) {
      var time = audioScheduler.currentTime;
      var states = this.states;
      var notes = this.notes;

      this.renderer.triggerBlink(this.beatDuration);

      for (var i = 0; i < this.states.length; i++) {
        var state = states[i];
        var note = notes[i];

        if (state > 0) {
          var gain = audioContext.createGain();
          gain.connect(this.audioOutput);
          gain.gain.value = (0, _math.decibelToLinear)(note.gain);

          var src = audioContext.createBufferSource();
          src.connect(gain);
          src.buffer = note.buffer;
          src.start(time);
        }
      }
    }
  }]);
  return SceneCollectiveLoops;
}();

exports.default = SceneCollectiveLoops;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbGxlY3RpdmUtbG9vcHMuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImNsaWVudCIsImF1ZGlvQ29udGV4dCIsImF1ZGlvU2NoZWR1bGVyIiwiYXVkaW8iLCJnZXRTY2hlZHVsZXIiLCJwbGF5ZXJDb2xvcnMiLCJjb2xvckNvbmZpZyIsInBsYXllcnMiLCJyYWRUb0RlZ3JlZXMiLCJyYWRpYW5zIiwiTWF0aCIsIlBJIiwibWF4QWN0aXZlcyIsIlJlbmRlcmVyIiwic3RhdGVzIiwibm90ZXMiLCJpbmRleCIsIm15aW5kZXgiLCJibGlua1N0YXRlIiwiYmxpbmtEdXJhdGlvbiIsImhleCIsImFscGhhIiwiYyIsInRlc3QiLCJzdWJzdHJpbmciLCJzcGxpdCIsImxlbmd0aCIsImpvaW4iLCJFcnJvciIsImJsaW5rVGltZSIsInVuZGVmaW5lZCIsImR0IiwiY3R4Iiwic2F2ZSIsIm51bVN0YXRlcyIsInN0ZXBIZWlnaHQiLCJjYW52YXNIZWlnaHQiLCJ4U3RhcnQiLCJ4RW5kIiwiY2FudmFzV2lkdGgiLCJ5IiwiaSIsInN0YXRlIiwibm90ZSIsImJlZ2luUGF0aCIsImdsb2JhbEFscGhhIiwic3Ryb2tlU3R5bGUiLCJjbGFzcyIsInNldExpbmVEYXNoIiwibGluZVdpZHRoIiwibW92ZVRvIiwibGluZVRvIiwic3Ryb2tlIiwicmVzdG9yZSIsIkNhbnZhczJkUmVuZGVyZXIiLCJ0ZW1wbGF0ZSIsIlNjZW5lQ29sbGVjdGl2ZUxvb3BzIiwiZXhwZXJpZW5jZSIsImNvbmZpZyIsInBsYWNlciIsIlBsYWNlciIsImNsaWVudEluZGV4IiwiJHZpZXdFbGVtIiwibnVtU3RlcHMiLCJBcnJheSIsImNsZWFyIiwiYWN0aXZlcyIsInJlbmRlcmVyIiwiYXVkaW9PdXRwdXQiLCJvblRvdWNoU3RhcnQiLCJiaW5kIiwib25NZXRyb0JlYXQiLCJzdGFydCIsInN0YXJ0U2NlbmUiLCJ2aWV3IiwiJGVsIiwibW9kZWwiLCJzdGVwSW5kZXgiLCJyZW5kZXIiLCJhZGRSZW5kZXJlciIsInNldFByZVJlbmRlciIsImZpbGxTdHlsZSIsInJlY3QiLCJmaWxsIiwic3VyZmFjZSIsImFkZExpc3RlbmVyIiwibWV0cmljU2NoZWR1bGVyIiwiYWRkTWV0cm9ub21lIiwic3RhcnRQbGFjZXIiLCJub3RlQ29uZmlnIiwiYXVkaW9CdWZmZXJNYW5hZ2VyIiwibG9hZEZpbGVzIiwidGhlbiIsInN0b3AiLCJyZW1vdmVSZW5kZXJlciIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlTWV0cm9ub21lIiwiaWQiLCJ4Iiwibm9ybVgiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwibm9ybVkiLCJpbm5lckhlaWdodCIsImZsb29yIiwibm90ZUNsYXNzIiwicHVzaCIsIm9mZk5vdGUiLCJzaGlmdCIsInNlbmQiLCJpZHgiLCJpbmRleE9mIiwic3BsaWNlIiwibWVhc3VyZSIsImJlYXQiLCJ0aW1lIiwiY3VycmVudFRpbWUiLCJ0cmlnZ2VyQmxpbmsiLCJiZWF0RHVyYXRpb24iLCJnYWluIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJ2YWx1ZSIsInNyYyIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImJ1ZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsVTs7QUFDWjs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU1DLFNBQVNELFdBQVdDLE1BQTFCO0FBQ0EsSUFBTUMsZUFBZUYsV0FBV0UsWUFBaEM7QUFDQSxJQUFNQyxpQkFBaUJILFdBQVdJLEtBQVgsQ0FBaUJDLFlBQWpCLEVBQXZCO0FBQ0EsSUFBTUMsZUFBZUMsc0JBQVlDLE9BQWpDOztBQUVBLFNBQVNDLFlBQVQsQ0FBc0JDLE9BQXRCLEVBQStCO0FBQzdCLFNBQU9BLFVBQVUsR0FBVixHQUFnQkMsS0FBS0MsRUFBNUI7QUFDRDs7QUFFRCxJQUFNQyxhQUFhO0FBQ2pCLFVBQVEsQ0FEUztBQUVqQixVQUFRLENBRlM7QUFHakIsWUFBVTtBQUhPLENBQW5COztJQU1NQyxROzs7QUFDSixvQkFBWUMsTUFBWixFQUFvQkMsS0FBcEIsRUFBMkJDLEtBQTNCLEVBQWtDO0FBQUE7O0FBQUEsMElBQzFCLENBRDBCOztBQUdoQyxVQUFLRixNQUFMLEdBQWNBLE1BQWQ7QUFDQSxVQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxVQUFLRSxPQUFMLEdBQWVELEtBQWY7O0FBRUEsVUFBS0UsVUFBTCxHQUFrQixLQUFsQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsS0FBSyxHQUExQixDQVJnQyxDQVFEO0FBUkM7QUFTakM7Ozs7MkJBRU0sQ0FBRzs7OzhCQUVBQyxHLEVBQUtDLEssRUFBTztBQUNwQixVQUFJQyxVQUFKO0FBQ0EsVUFBSSwyQkFBMkJDLElBQTNCLENBQWdDSCxHQUFoQyxDQUFKLEVBQTBDO0FBQ3hDRSxZQUFJRixJQUFJSSxTQUFKLENBQWMsQ0FBZCxFQUFpQkMsS0FBakIsQ0FBdUIsRUFBdkIsQ0FBSjtBQUNBLFlBQUlILEVBQUVJLE1BQUYsSUFBWSxDQUFoQixFQUFtQjtBQUNqQkosY0FBSSxDQUFDQSxFQUFFLENBQUYsQ0FBRCxFQUFPQSxFQUFFLENBQUYsQ0FBUCxFQUFhQSxFQUFFLENBQUYsQ0FBYixFQUFtQkEsRUFBRSxDQUFGLENBQW5CLEVBQXlCQSxFQUFFLENBQUYsQ0FBekIsRUFBK0JBLEVBQUUsQ0FBRixDQUEvQixDQUFKO0FBQ0Q7QUFDREEsWUFBSSxPQUFPQSxFQUFFSyxJQUFGLENBQU8sRUFBUCxDQUFYO0FBQ0EsZUFBTyxVQUFVLENBQUVMLEtBQUssRUFBTixHQUFZLEdBQWIsRUFBbUJBLEtBQUssQ0FBTixHQUFXLEdBQTdCLEVBQWtDQSxJQUFJLEdBQXRDLEVBQTJDSyxJQUEzQyxDQUFnRCxHQUFoRCxDQUFWLEdBQWlFLEdBQWpFLEdBQXVFTixLQUF2RSxHQUErRSxHQUF0RjtBQUNEO0FBQ0QsWUFBTSxJQUFJTyxLQUFKLENBQVUsU0FBVixDQUFOO0FBQ0Q7OzttQ0FFYztBQUNiLFdBQUtDLFNBQUwsR0FBaUJDLFNBQWpCO0FBQ0Q7OzsyQkFFTUMsRSxFQUFJO0FBQ1QsVUFBRyxLQUFLRixTQUFMLEtBQW1CQyxTQUF0QixFQUNFLEtBQUtELFNBQUwsSUFBa0JFLEVBQWxCLENBREYsS0FHRSxLQUFLRixTQUFMLEdBQWlCLENBQWpCO0FBQ0g7OzsyQkFFTUcsRyxFQUFLO0FBQ1ZBLFVBQUlDLElBQUo7O0FBRUEsVUFBTWxCLFFBQVEsS0FBS0EsS0FBbkI7QUFDQSxVQUFNRCxTQUFTLEtBQUtBLE1BQXBCO0FBQ0EsVUFBTW9CLFlBQVlwQixPQUFPWSxNQUF6QjtBQUNBLFVBQU1TLGFBQWEsS0FBS0MsWUFBTCxHQUFvQkYsU0FBdkM7QUFDQSxVQUFNRyxTQUFTLEVBQWY7QUFDQSxVQUFNQyxPQUFPLEtBQUtDLFdBQUwsR0FBbUIsRUFBaEM7QUFDQSxVQUFJQyxJQUFJLEtBQUtKLFlBQUwsR0FBb0JELGFBQWEsQ0FBekM7O0FBRUEsV0FBSyxJQUFJTSxJQUFJLENBQWIsRUFBZ0JBLElBQUlQLFNBQXBCLEVBQStCTyxHQUEvQixFQUFvQztBQUNsQyxZQUFNQyxRQUFRNUIsT0FBTzJCLENBQVAsQ0FBZDtBQUNBLFlBQU1FLE9BQU81QixNQUFNMEIsQ0FBTixDQUFiOztBQUVBVCxZQUFJWSxTQUFKO0FBQ0FaLFlBQUlhLFdBQUosR0FBa0IsQ0FBbEI7QUFDQWIsWUFBSWMsV0FBSixHQUFrQixNQUFNekMsYUFBYSxLQUFLWSxPQUFsQixDQUF4Qjs7QUFFQSxnQkFBUTBCLEtBQUtJLEtBQWI7QUFDRSxlQUFLLE1BQUw7QUFDRWYsZ0JBQUlnQixXQUFKLENBQWdCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBaEI7QUFDQTs7QUFFRixlQUFLLE1BQUw7QUFDRWhCLGdCQUFJZ0IsV0FBSixDQUFnQixFQUFoQjs7QUFFQTs7QUFFRixlQUFLLFFBQUw7QUFDRWhCLGdCQUFJZ0IsV0FBSixDQUFnQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWhCO0FBQ0E7QUFaSjs7QUFlQSxnQkFBUU4sS0FBUjtBQUNFLGVBQUssQ0FBTDtBQUNFVixnQkFBSWlCLFNBQUosR0FBZ0IsQ0FBaEI7QUFDQTs7QUFFRixlQUFLLENBQUw7QUFDRSxnQkFBSSxLQUFLcEIsU0FBTCxHQUFpQixLQUFLVixhQUExQixFQUNFYSxJQUFJaUIsU0FBSixHQUFnQixFQUFoQixDQURGLEtBR0VqQixJQUFJaUIsU0FBSixHQUFnQixDQUFoQjtBQUNGO0FBVko7O0FBYUFqQixZQUFJa0IsTUFBSixDQUFXYixNQUFYLEVBQW1CRyxDQUFuQjtBQUNBUixZQUFJbUIsTUFBSixDQUFXYixJQUFYLEVBQWlCRSxDQUFqQjtBQUNBUixZQUFJb0IsTUFBSjs7QUFFQVosYUFBS0wsVUFBTDtBQUNEOztBQUVESCxVQUFJcUIsT0FBSjtBQUVEOzs7RUE5Rm9CdEQsV0FBV3VELGdCOztBQWlHbEMsSUFBTUMsOFFBQU47QUFVQTs7SUFDcUJDLG9CO0FBQ25CLGdDQUFZQyxVQUFaLEVBQXdCQyxNQUF4QixFQUFnQztBQUFBOztBQUM5QixTQUFLRCxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDs7QUFFQSxTQUFLQyxNQUFMLEdBQWMsSUFBSUMsZ0JBQUosQ0FBV0gsVUFBWCxDQUFkOztBQUVBLFNBQUtJLFdBQUwsR0FBbUI5RCxXQUFXQyxNQUFYLENBQWtCZ0IsS0FBckM7QUFDQSxTQUFLRCxLQUFMLEdBQWEsSUFBYjtBQUNBLFNBQUsrQyxTQUFMLEdBQWlCLElBQWpCOztBQUVBLFFBQU1DLFdBQVdMLE9BQU9LLFFBQXhCO0FBQ0EsUUFBTTdCLFlBQVl3QixPQUFPM0MsS0FBUCxDQUFhVyxNQUEvQjs7QUFFQSxTQUFLWixNQUFMLEdBQWMsSUFBSWtELEtBQUosQ0FBVTlCLFNBQVYsQ0FBZDtBQUNBLFNBQUsrQixLQUFMOztBQUVBLFNBQUtDLE9BQUwsR0FBZTtBQUNiLGNBQVEsRUFESztBQUViLGNBQVEsRUFGSztBQUdiLGdCQUFVO0FBSEcsS0FBZjs7QUFNQSxTQUFLQyxRQUFMLEdBQWdCLElBQUl0RCxRQUFKLENBQWEsS0FBS0MsTUFBbEIsRUFBMEI0QyxPQUFPM0MsS0FBakMsRUFBd0MsS0FBSzhDLFdBQTdDLENBQWhCO0FBQ0EsU0FBS08sV0FBTCxHQUFtQlgsV0FBV1csV0FBOUI7O0FBRUEsU0FBS0MsWUFBTCxHQUFvQixLQUFLQSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsS0FBS0EsV0FBTCxDQUFpQkQsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDRDs7OztrQ0FFYTtBQUFBOztBQUNaLFdBQUtYLE1BQUwsQ0FBWWEsS0FBWixDQUFrQjtBQUFBLGVBQU0sT0FBS0MsVUFBTCxFQUFOO0FBQUEsT0FBbEI7QUFDRDs7O2lDQUVZO0FBQ1gsVUFBTWhCLGFBQWEsS0FBS0EsVUFBeEI7QUFDQSxVQUFNTSxXQUFXLEtBQUtMLE1BQUwsQ0FBWUssUUFBN0I7O0FBRUEsV0FBS0QsU0FBTCxHQUFpQkwsV0FBV2lCLElBQVgsQ0FBZ0JDLEdBQWpDOztBQUVBbEIsaUJBQVdpQixJQUFYLENBQWdCRSxLQUFoQixHQUF3QixFQUFFQyxXQUFXLEtBQUtoQixXQUFMLEdBQW1CLENBQWhDLEVBQXhCO0FBQ0FKLGlCQUFXaUIsSUFBWCxDQUFnQm5CLFFBQWhCLEdBQTJCQSxRQUEzQjtBQUNBRSxpQkFBV2lCLElBQVgsQ0FBZ0JJLE1BQWhCO0FBQ0FyQixpQkFBV2lCLElBQVgsQ0FBZ0JLLFdBQWhCLENBQTRCLEtBQUtaLFFBQWpDO0FBQ0FWLGlCQUFXaUIsSUFBWCxDQUFnQk0sWUFBaEIsQ0FBNkIsVUFBVWhELEdBQVYsRUFBZUQsRUFBZixFQUFtQlEsV0FBbkIsRUFBZ0NILFlBQWhDLEVBQThDO0FBQ3pFSixZQUFJQyxJQUFKO0FBQ0FELFlBQUlhLFdBQUosR0FBa0IsQ0FBbEI7QUFDQWIsWUFBSWlELFNBQUosR0FBZ0IsU0FBaEI7QUFDQWpELFlBQUlrRCxJQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZTNDLFdBQWYsRUFBNEJILFlBQTVCO0FBQ0FKLFlBQUltRCxJQUFKO0FBQ0FuRCxZQUFJcUIsT0FBSjtBQUNELE9BUEQ7O0FBU0FJLGlCQUFXMkIsT0FBWCxDQUFtQkMsV0FBbkIsQ0FBK0IsWUFBL0IsRUFBNkMsS0FBS2hCLFlBQWxEO0FBQ0FaLGlCQUFXNkIsZUFBWCxDQUEyQkMsWUFBM0IsQ0FBd0MsS0FBS2hCLFdBQTdDLEVBQTBELENBQTFELEVBQTZELENBQTdELEVBQWdFLENBQWhFLEVBQW1FLEtBQUtWLFdBQUwsR0FBbUJFLFFBQXRGLEVBQWdHLElBQWhHO0FBQ0Q7Ozs0QkFFTztBQUFBOztBQUNQLFVBQUksS0FBS2hELEtBQVQsRUFBZ0I7QUFDYixhQUFLeUUsV0FBTDtBQUNELE9BRkYsTUFFUTtBQUNMLFlBQU0vQixhQUFhLEtBQUtBLFVBQXhCO0FBQ0EsWUFBTWdDLGFBQWEsS0FBSy9CLE1BQUwsQ0FBWTNDLEtBQS9COztBQUVBMEMsbUJBQVdpQyxrQkFBWCxDQUE4QkMsU0FBOUIsQ0FBd0NGLFVBQXhDLEVBQW9ERyxJQUFwRCxDQUF5RCxVQUFDN0UsS0FBRCxFQUFXO0FBQ2xFLGlCQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQSxpQkFBS3lFLFdBQUw7QUFDRCxTQUhEO0FBSUQ7QUFDRjs7OzJCQUVNO0FBQ0wsV0FBS3ZCLEtBQUw7QUFDQSxXQUFLTixNQUFMLENBQVlrQyxJQUFaOztBQUVBLFVBQUksS0FBSy9CLFNBQVQsRUFBb0I7QUFDbEIsYUFBS0EsU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxZQUFNTCxhQUFhLEtBQUtBLFVBQXhCO0FBQ0FBLG1CQUFXaUIsSUFBWCxDQUFnQm9CLGNBQWhCLENBQStCLEtBQUszQixRQUFwQztBQUNBVixtQkFBVzJCLE9BQVgsQ0FBbUJXLGNBQW5CLENBQWtDLFlBQWxDLEVBQWdELEtBQUsxQixZQUFyRDtBQUNBWixtQkFBVzZCLGVBQVgsQ0FBMkJVLGVBQTNCLENBQTJDLEtBQUt6QixXQUFoRDtBQUNEO0FBQ0Y7Ozs0QkFFTztBQUNOLFdBQUssSUFBSTlCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLM0IsTUFBTCxDQUFZWSxNQUFoQyxFQUF3Q2UsR0FBeEM7QUFDRSxhQUFLM0IsTUFBTCxDQUFZMkIsQ0FBWixJQUFpQixDQUFqQjtBQURGO0FBRUQ7OztpQ0FFWXdELEUsRUFBSUMsQyxFQUFHMUQsQyxFQUFHO0FBQ3JCLFVBQU1pQixhQUFhLEtBQUtBLFVBQXhCO0FBQ0EsVUFBTXZCLFlBQVksS0FBS3BCLE1BQUwsQ0FBWVksTUFBOUI7QUFDQSxVQUFNeUUsUUFBUUQsSUFBSUUsT0FBT0MsVUFBekI7QUFDQSxVQUFNQyxRQUFROUQsSUFBSTRELE9BQU9HLFdBQXpCO0FBQ0EsVUFBTTVELE9BQU9ULFlBQVksQ0FBWixHQUFnQnhCLEtBQUs4RixLQUFMLENBQVdGLFFBQVFwRSxTQUFuQixDQUE3QjtBQUNBLFVBQU11RSxZQUFZLEtBQUsxRixLQUFMLENBQVc0QixJQUFYLEVBQWlCSSxLQUFuQztBQUNBLFVBQU1MLFFBQVEsQ0FBQyxLQUFLNUIsTUFBTCxDQUFZNkIsSUFBWixJQUFvQixDQUFyQixJQUEwQixDQUF4QztBQUNBLFVBQU11QixVQUFVLEtBQUtBLE9BQUwsQ0FBYXVDLFNBQWIsQ0FBaEI7O0FBRUEsVUFBSS9ELFFBQVEsQ0FBWixFQUFlO0FBQ2J3QixnQkFBUXdDLElBQVIsQ0FBYS9ELElBQWI7O0FBRUEsWUFBSXVCLFFBQVF4QyxNQUFSLEdBQWlCZCxXQUFXNkYsU0FBWCxDQUFyQixFQUE0QztBQUMxQyxjQUFNRSxVQUFVekMsUUFBUTBDLEtBQVIsRUFBaEI7QUFDQSxlQUFLOUYsTUFBTCxDQUFZNkYsT0FBWixJQUF1QixDQUF2QjtBQUNBbEQscUJBQVdvRCxJQUFYLENBQWdCLFlBQWhCLEVBQThCLEtBQUtoRCxXQUFuQyxFQUFnRDhDLE9BQWhELEVBQXlELENBQXpEO0FBQ0Q7QUFDRixPQVJELE1BUU87QUFDTCxZQUFNRyxNQUFNNUMsUUFBUTZDLE9BQVIsQ0FBZ0JwRSxJQUFoQixDQUFaO0FBQ0F1QixnQkFBUThDLE1BQVIsQ0FBZUYsR0FBZixFQUFvQixDQUFwQjtBQUNEOztBQUVELFdBQUtoRyxNQUFMLENBQVk2QixJQUFaLElBQW9CRCxLQUFwQjtBQUNBZSxpQkFBV29ELElBQVgsQ0FBZ0IsWUFBaEIsRUFBOEIsS0FBS2hELFdBQW5DLEVBQWdEbEIsSUFBaEQsRUFBc0RELEtBQXREO0FBQ0Q7OztnQ0FFV3VFLE8sRUFBU0MsSSxFQUFNO0FBQ3pCLFVBQU1DLE9BQU9qSCxlQUFla0gsV0FBNUI7QUFDQSxVQUFNdEcsU0FBUyxLQUFLQSxNQUFwQjtBQUNBLFVBQU1DLFFBQVEsS0FBS0EsS0FBbkI7O0FBRUEsV0FBS29ELFFBQUwsQ0FBY2tELFlBQWQsQ0FBMkIsS0FBS0MsWUFBaEM7O0FBRUEsV0FBSyxJQUFJN0UsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUszQixNQUFMLENBQVlZLE1BQWhDLEVBQXdDZSxHQUF4QyxFQUE2QztBQUMzQyxZQUFNQyxRQUFRNUIsT0FBTzJCLENBQVAsQ0FBZDtBQUNBLFlBQU1FLE9BQU81QixNQUFNMEIsQ0FBTixDQUFiOztBQUVBLFlBQUlDLFFBQVEsQ0FBWixFQUFlO0FBQ2IsY0FBTTZFLE9BQU90SCxhQUFhdUgsVUFBYixFQUFiO0FBQ0FELGVBQUtFLE9BQUwsQ0FBYSxLQUFLckQsV0FBbEI7QUFDQW1ELGVBQUtBLElBQUwsQ0FBVUcsS0FBVixHQUFrQiwyQkFBZ0IvRSxLQUFLNEUsSUFBckIsQ0FBbEI7O0FBRUEsY0FBTUksTUFBTTFILGFBQWEySCxrQkFBYixFQUFaO0FBQ0FELGNBQUlGLE9BQUosQ0FBWUYsSUFBWjtBQUNBSSxjQUFJRSxNQUFKLEdBQWFsRixLQUFLa0YsTUFBbEI7QUFDQUYsY0FBSW5ELEtBQUosQ0FBVTJDLElBQVY7QUFDRDtBQUNGO0FBQ0Y7Ozs7O2tCQTNJa0IzRCxvQiIsImZpbGUiOiJjb2xsZWN0aXZlLWxvb3BzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgeyBkZWNpYmVsVG9MaW5lYXIgfSBmcm9tICdzb3VuZHdvcmtzL3V0aWxzL21hdGgnO1xuaW1wb3J0IFBsYWNlciBmcm9tICcuL1BsYWNlcic7XG5pbXBvcnQgY29sb3JDb25maWcgZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbG9yLWNvbmZpZyc7XG5jb25zdCBjbGllbnQgPSBzb3VuZHdvcmtzLmNsaWVudDtcbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgYXVkaW9TY2hlZHVsZXIgPSBzb3VuZHdvcmtzLmF1ZGlvLmdldFNjaGVkdWxlcigpO1xuY29uc3QgcGxheWVyQ29sb3JzID0gY29sb3JDb25maWcucGxheWVycztcblxuZnVuY3Rpb24gcmFkVG9EZWdyZWVzKHJhZGlhbnMpIHtcbiAgcmV0dXJuIHJhZGlhbnMgKiAxODAgLyBNYXRoLlBJO1xufVxuXG5jb25zdCBtYXhBY3RpdmVzID0ge1xuICAncGVyYyc6IDMsXG4gICdiYXNzJzogMSxcbiAgJ21lbG9keSc6IDMsXG59O1xuXG5jbGFzcyBSZW5kZXJlciBleHRlbmRzIHNvdW5kd29ya3MuQ2FudmFzMmRSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlcywgbm90ZXMsIGluZGV4KSB7XG4gICAgc3VwZXIoMCk7XG5cbiAgICB0aGlzLnN0YXRlcyA9IHN0YXRlcztcbiAgICB0aGlzLm5vdGVzID0gbm90ZXM7XG4gICAgdGhpcy5teWluZGV4ID0gaW5kZXg7XG5cbiAgICB0aGlzLmJsaW5rU3RhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmJsaW5rRHVyYXRpb24gPSAzMCAvIDEyMDsgLy8gZHVyYXRpb24gb2YgOHRoIGJlYXRcbiAgfVxuXG4gIGluaXQoKSB7IH1cblxuICBoZXhUb1JnYkEoaGV4LCBhbHBoYSkge1xuICAgIGxldCBjO1xuICAgIGlmICgvXiMoW0EtRmEtZjAtOV17M30pezEsMn0kLy50ZXN0KGhleCkpIHtcbiAgICAgIGMgPSBoZXguc3Vic3RyaW5nKDEpLnNwbGl0KCcnKTtcbiAgICAgIGlmIChjLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgIGMgPSBbY1swXSwgY1swXSwgY1sxXSwgY1sxXSwgY1syXSwgY1syXV07XG4gICAgICB9XG4gICAgICBjID0gJzB4JyArIGMuam9pbignJyk7XG4gICAgICByZXR1cm4gJ3JnYmEoJyArIFsoYyA+PiAxNikgJiAyNTUsIChjID4+IDgpICYgMjU1LCBjICYgMjU1XS5qb2luKCcsJykgKyAnLCcgKyBhbHBoYSArICcpJztcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgSGV4Jyk7XG4gIH1cblxuICB0cmlnZ2VyQmxpbmsoKSB7XG4gICAgdGhpcy5ibGlua1RpbWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICB1cGRhdGUoZHQpIHsgXG4gICAgaWYodGhpcy5ibGlua1RpbWUgIT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuYmxpbmtUaW1lICs9IGR0O1xuICAgIGVsc2VcbiAgICAgIHRoaXMuYmxpbmtUaW1lID0gMDtcbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3Qgbm90ZXMgPSB0aGlzLm5vdGVzO1xuICAgIGNvbnN0IHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xuICAgIGNvbnN0IG51bVN0YXRlcyA9IHN0YXRlcy5sZW5ndGg7XG4gICAgY29uc3Qgc3RlcEhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0IC8gbnVtU3RhdGVzO1xuICAgIGNvbnN0IHhTdGFydCA9IDEwO1xuICAgIGNvbnN0IHhFbmQgPSB0aGlzLmNhbnZhc1dpZHRoIC0gMTA7XG4gICAgbGV0IHkgPSB0aGlzLmNhbnZhc0hlaWdodCAtIHN0ZXBIZWlnaHQgLyAyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TdGF0ZXM7IGkrKykge1xuICAgICAgY29uc3Qgc3RhdGUgPSBzdGF0ZXNbaV07XG4gICAgICBjb25zdCBub3RlID0gbm90ZXNbaV07XG5cbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIycgKyBwbGF5ZXJDb2xvcnNbdGhpcy5teWluZGV4XTtcblxuICAgICAgc3dpdGNoIChub3RlLmNsYXNzKSB7XG4gICAgICAgIGNhc2UgJ3BlcmMnOlxuICAgICAgICAgIGN0eC5zZXRMaW5lRGFzaChbMTUsIDVdKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdiYXNzJzpcbiAgICAgICAgICBjdHguc2V0TGluZURhc2goW10pO1xuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnbWVsb2R5JzpcbiAgICAgICAgICBjdHguc2V0TGluZURhc2goWzUsIDVdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmICh0aGlzLmJsaW5rVGltZSA8IHRoaXMuYmxpbmtEdXJhdGlvbilcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAxNTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gNztcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY3R4Lm1vdmVUbyh4U3RhcnQsIHkpO1xuICAgICAgY3R4LmxpbmVUbyh4RW5kLCB5KTtcbiAgICAgIGN0eC5zdHJva2UoKTtcblxuICAgICAgeSAtPSBzdGVwSGVpZ2h0O1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgfVxufVxuXG5jb25zdCB0ZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmQgZmxleC1taWRkbGVcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1taWRkbGVcIj5cbiAgICBcbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgPC9kaXY+XG5gO1xuLy88cCBjbGFzcz1cInBsYXllci1pbmRleFwiPjwlPSBzdGVwSW5kZXggJT48L3A+XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZUNvbGxlY3RpdmVMb29wcyB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGNvbmZpZykge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLnBsYWNlciA9IG5ldyBQbGFjZXIoZXhwZXJpZW5jZSk7XG5cbiAgICB0aGlzLmNsaWVudEluZGV4ID0gc291bmR3b3Jrcy5jbGllbnQuaW5kZXg7XG4gICAgdGhpcy5ub3RlcyA9IG51bGw7XG4gICAgdGhpcy4kdmlld0VsZW0gPSBudWxsO1xuXG4gICAgY29uc3QgbnVtU3RlcHMgPSBjb25maWcubnVtU3RlcHM7XG4gICAgY29uc3QgbnVtU3RhdGVzID0gY29uZmlnLm5vdGVzLmxlbmd0aDtcblxuICAgIHRoaXMuc3RhdGVzID0gbmV3IEFycmF5KG51bVN0YXRlcyk7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdGhpcy5hY3RpdmVzID0ge1xuICAgICAgJ3BlcmMnOiBbXSxcbiAgICAgICdiYXNzJzogW10sXG4gICAgICAnbWVsb2R5JzogW10sXG4gICAgfTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIodGhpcy5zdGF0ZXMsIGNvbmZpZy5ub3RlcywgdGhpcy5jbGllbnRJbmRleCk7XG4gICAgdGhpcy5hdWRpb091dHB1dCA9IGV4cGVyaWVuY2UuYXVkaW9PdXRwdXQ7XG5cbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbk1ldHJvQmVhdCA9IHRoaXMub25NZXRyb0JlYXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHN0YXJ0UGxhY2VyKCkge1xuICAgIHRoaXMucGxhY2VyLnN0YXJ0KCgpID0+IHRoaXMuc3RhcnRTY2VuZSgpKTtcbiAgfVxuXG4gIHN0YXJ0U2NlbmUoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBudW1TdGVwcyA9IHRoaXMuY29uZmlnLm51bVN0ZXBzO1xuXG4gICAgdGhpcy4kdmlld0VsZW0gPSBleHBlcmllbmNlLnZpZXcuJGVsO1xuXG4gICAgZXhwZXJpZW5jZS52aWV3Lm1vZGVsID0geyBzdGVwSW5kZXg6IHRoaXMuY2xpZW50SW5kZXggKyAxIH07XG4gICAgZXhwZXJpZW5jZS52aWV3LnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgZXhwZXJpZW5jZS52aWV3LnJlbmRlcigpO1xuICAgIGV4cGVyaWVuY2Uudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICBleHBlcmllbmNlLnZpZXcuc2V0UHJlUmVuZGVyKGZ1bmN0aW9uIChjdHgsIGR0LCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgICBjdHgucmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0pO1xuXG4gICAgZXhwZXJpZW5jZS5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIGV4cGVyaWVuY2UubWV0cmljU2NoZWR1bGVyLmFkZE1ldHJvbm9tZSh0aGlzLm9uTWV0cm9CZWF0LCAxLCAxLCAxLCB0aGlzLmNsaWVudEluZGV4IC8gbnVtU3RlcHMsIHRydWUpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICBpZiAodGhpcy5ub3Rlcykge1xuICAgICAgdGhpcy5zdGFydFBsYWNlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgICAgY29uc3Qgbm90ZUNvbmZpZyA9IHRoaXMuY29uZmlnLm5vdGVzO1xuICAgICAgXG4gICAgICBleHBlcmllbmNlLmF1ZGlvQnVmZmVyTWFuYWdlci5sb2FkRmlsZXMobm90ZUNvbmZpZykudGhlbigobm90ZXMpID0+IHtcbiAgICAgICAgdGhpcy5ub3RlcyA9IG5vdGVzO1xuICAgICAgICB0aGlzLnN0YXJ0UGxhY2VyKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLnBsYWNlci5zdG9wKCk7XG5cbiAgICBpZiAodGhpcy4kdmlld0VsZW0pIHtcbiAgICAgIHRoaXMuJHZpZXdFbGVtID0gbnVsbDtcblxuICAgICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICAgIGV4cGVyaWVuY2Uudmlldy5yZW1vdmVSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICAgIGV4cGVyaWVuY2Uuc3VyZmFjZS5yZW1vdmVMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICAgIGV4cGVyaWVuY2UubWV0cmljU2NoZWR1bGVyLnJlbW92ZU1ldHJvbm9tZSh0aGlzLm9uTWV0cm9CZWF0KTtcbiAgICB9XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVzLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5zdGF0ZXNbaV0gPSAwO1xuICB9XG5cbiAgb25Ub3VjaFN0YXJ0KGlkLCB4LCB5KSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBudW1TdGF0ZXMgPSB0aGlzLnN0YXRlcy5sZW5ndGg7XG4gICAgY29uc3Qgbm9ybVggPSB4IC8gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgbm9ybVkgPSB5IC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IG5vdGUgPSBudW1TdGF0ZXMgLSAxIC0gTWF0aC5mbG9vcihub3JtWSAqIG51bVN0YXRlcyk7XG4gICAgY29uc3Qgbm90ZUNsYXNzID0gdGhpcy5ub3Rlc1tub3RlXS5jbGFzcztcbiAgICBjb25zdCBzdGF0ZSA9ICh0aGlzLnN0YXRlc1tub3RlXSArIDEpICUgMjtcbiAgICBjb25zdCBhY3RpdmVzID0gdGhpcy5hY3RpdmVzW25vdGVDbGFzc107XG5cbiAgICBpZiAoc3RhdGUgPiAwKSB7XG4gICAgICBhY3RpdmVzLnB1c2gobm90ZSk7XG5cbiAgICAgIGlmIChhY3RpdmVzLmxlbmd0aCA+IG1heEFjdGl2ZXNbbm90ZUNsYXNzXSkge1xuICAgICAgICBjb25zdCBvZmZOb3RlID0gYWN0aXZlcy5zaGlmdCgpO1xuICAgICAgICB0aGlzLnN0YXRlc1tvZmZOb3RlXSA9IDA7XG4gICAgICAgIGV4cGVyaWVuY2Uuc2VuZCgnc3dpdGNoTm90ZScsIHRoaXMuY2xpZW50SW5kZXgsIG9mZk5vdGUsIDApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpZHggPSBhY3RpdmVzLmluZGV4T2Yobm90ZSk7XG4gICAgICBhY3RpdmVzLnNwbGljZShpZHgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdGVzW25vdGVdID0gc3RhdGU7XG4gICAgZXhwZXJpZW5jZS5zZW5kKCdzd2l0Y2hOb3RlJywgdGhpcy5jbGllbnRJbmRleCwgbm90ZSwgc3RhdGUpO1xuICB9XG5cbiAgb25NZXRyb0JlYXQobWVhc3VyZSwgYmVhdCkge1xuICAgIGNvbnN0IHRpbWUgPSBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgICBjb25zdCBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcbiAgICBjb25zdCBub3RlcyA9IHRoaXMubm90ZXM7XG5cbiAgICB0aGlzLnJlbmRlcmVyLnRyaWdnZXJCbGluayh0aGlzLmJlYXREdXJhdGlvbik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHN0YXRlc1tpXTtcbiAgICAgIGNvbnN0IG5vdGUgPSBub3Rlc1tpXTtcblxuICAgICAgaWYgKHN0YXRlID4gMCkge1xuICAgICAgICBjb25zdCBnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgZ2Fpbi5jb25uZWN0KHRoaXMuYXVkaW9PdXRwdXQpO1xuICAgICAgICBnYWluLmdhaW4udmFsdWUgPSBkZWNpYmVsVG9MaW5lYXIobm90ZS5nYWluKTtcblxuICAgICAgICBjb25zdCBzcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHNyYy5jb25uZWN0KGdhaW4pO1xuICAgICAgICBzcmMuYnVmZmVyID0gbm90ZS5idWZmZXI7XG4gICAgICAgIHNyYy5zdGFydCh0aW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iXX0=