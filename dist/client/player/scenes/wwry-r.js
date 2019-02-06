'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

var _Placer = require('./Placer');

var _Placer2 = _interopRequireDefault(_Placer);

var _QueenPlayer = require('../../shared/QueenPlayer');

var _QueenPlayer2 = _interopRequireDefault(_QueenPlayer);

var _colorConfig = require('../../../shared/color-config');

var _colorConfig2 = _interopRequireDefault(_colorConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = soundworks.client;
var audioContext = soundworks.audioContext;
var audioScheduler = soundworks.audio.getScheduler();
var playerColors = _colorConfig2.default.players;

function getTime() {
  return 0.001 * (performance.now() || new Date().getTime());
}

var HitDetector = function () {
  function HitDetector() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, HitDetector);

    var thresholds = options.thresholds;

    this.thresholdAlpha = 400;
    this.thresholdBeta = 400;
    this.thresholdGamma = 400;
    this.thresholdDeltaTime = 0.1;

    this.lastTime = undefined;
    this.onRotationRate = this.onRotationRate.bind(this);
  }

  (0, _createClass3.default)(HitDetector, [{
    key: 'onRotationRate',
    value: function onRotationRate(data) {
      var alpha = data[0];
      var beta = data[1];
      var gamma = data[2];
      var hit = void 0;

      if (Math.abs(alpha) > this.thresholdAlpha || Math.abs(gamma) > this.thresholdGamma) {
        var time = getTime();
        var timeDifference = time - this.lastTime;

        if (timeDifference > this.thresholdDeltaTime) {

          if (alpha < -this.thresholdAlpha) hit = 'right';else if (alpha > this.thresholdAlpha) hit = 'left';else if (beta < -this.thresholdBeta) hit = 'out';else if (beta > this.thresholdBeta) hit = 'in';else if (gamma < -this.thresholdGamma) hit = 'up';else if (gamma > this.thresholdGamma) hit = 'down';

          this.lastTime = time;
        }
      }

      return hit;
    }
  }, {
    key: 'start',
    value: function start(experience) {
      this.lastTime = getTime();
      experience.motionInput.addListener('rotationRate', this.onRotationRate);
    }
  }, {
    key: 'stop',
    value: function stop(experience) {
      experience.motionInput.removeListener('rotationRate', this.onRotationRate);
    }
  }]);
  return HitDetector;
}();

var DrumsMotionHandler = function (_HitDetector) {
  (0, _inherits3.default)(DrumsMotionHandler, _HitDetector);

  function DrumsMotionHandler(callback) {
    (0, _classCallCheck3.default)(this, DrumsMotionHandler);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DrumsMotionHandler.__proto__ || (0, _getPrototypeOf2.default)(DrumsMotionHandler)).call(this));

    _this.thresholdAlpha = 400;
    _this.thresholdGamma = 400;
    _this.thresholdDeltaTime = 0.1;

    _this.callback = callback;
    return _this;
  }

  (0, _createClass3.default)(DrumsMotionHandler, [{
    key: 'onRotationRate',
    value: function onRotationRate(data) {
      var hit = (0, _get3.default)(DrumsMotionHandler.prototype.__proto__ || (0, _getPrototypeOf2.default)(DrumsMotionHandler.prototype), 'onRotationRate', this).call(this, data);

      if (hit === "left" || hit === "right") this.callback(2);else if (hit === "up" || hit === "down") this.callback(Math.random() < 0.5 ? 0 : 1);
    }
  }]);
  return DrumsMotionHandler;
}(HitDetector);

var VerseMotionHandler = function (_HitDetector2) {
  (0, _inherits3.default)(VerseMotionHandler, _HitDetector2);

  function VerseMotionHandler(callback) {
    (0, _classCallCheck3.default)(this, VerseMotionHandler);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (VerseMotionHandler.__proto__ || (0, _getPrototypeOf2.default)(VerseMotionHandler)).call(this));

    _this2.thresholdAlpha = 400;
    _this2.thresholdBeta = 400;
    _this2.thresholdGamma = 400;
    _this2.thresholdDeltaTime = 0.4;

    _this2.callback = callback;

    _this2.currentPositionInVerse = -1;
    _this2.verseIndex = 0;
    _this2.lastTime = 0;
    return _this2;
  }

  (0, _createClass3.default)(VerseMotionHandler, [{
    key: 'onRotationRate',
    value: function onRotationRate(data) {
      var hit = (0, _get3.default)(VerseMotionHandler.prototype.__proto__ || (0, _getPrototypeOf2.default)(VerseMotionHandler.prototype), 'onRotationRate', this).call(this, data);

      if (hit) {
        var time = getTime();
        var deltaTime = time - this.lastTime;

        if (deltaTime < 1) {
          this.currentPositionInVerse += 1;

          if (this.currentPositionInVerse === 16) this.verseIndex = Math.floor(this.verseIndex + (this.currentPositionInVerse + 1) / 16) % 3;

          this.currentPositionInVerse = this.currentPositionInVerse % 16;
        } else if (deltaTime >= 1 && deltaTime < 2 && this.currentPositionInVerse !== 0) {
          this.currentPositionInVerse -= 1;
        } else {
          this.currentPositionInVerse = 0;
        }

        var segmentIndex = this.verseIndex * (16 + 1) + this.currentPositionInVerse;
        this.callback(segmentIndex);

        this.lastTime = time;
      }
    }
  }]);
  return VerseMotionHandler;
}(HitDetector);

var ChorusMotionHandler = function (_HitDetector3) {
  (0, _inherits3.default)(ChorusMotionHandler, _HitDetector3);

  function ChorusMotionHandler(callback) {
    (0, _classCallCheck3.default)(this, ChorusMotionHandler);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (ChorusMotionHandler.__proto__ || (0, _getPrototypeOf2.default)(ChorusMotionHandler)).call(this));

    _this3.thresholdAlpha = 400;
    _this3.thresholdGamma = 500;
    _this3.thresholdDeltaTime = 0.1;

    _this3.markerWe = true;
    _this3.markerWill = true;

    _this3.callback = callback;
    return _this3;
  }

  (0, _createClass3.default)(ChorusMotionHandler, [{
    key: 'onRotationRate',
    value: function onRotationRate(data) {
      var hit = (0, _get3.default)(ChorusMotionHandler.prototype.__proto__ || (0, _getPrototypeOf2.default)(ChorusMotionHandler.prototype), 'onRotationRate', this).call(this, data);

      if (hit === "left") {
        if (this.markerWe) {
          this.callback(1);
          this.markerWill = true;
        } else {
          this.callback(3);
          this.markerWill = false;
        }
      } else if (hit === "right") {
        if (this.markerWill) {
          this.callback(2);
          this.markerWe = false;
        } else {
          this.callback(4);
          this.markerWe = true;
        }
      } else if (hit === "up") {
        this.callback(5);
        this.markerWill = true;
      } else if (hit === "down") {
        this.callback(6);
        this.markerWe = true;
        this.markerWill = true;
      }
    }
  }]);
  return ChorusMotionHandler;
}(HitDetector);

var FreddyMotionHandler = function (_HitDetector4) {
  (0, _inherits3.default)(FreddyMotionHandler, _HitDetector4);

  function FreddyMotionHandler(callback) {
    (0, _classCallCheck3.default)(this, FreddyMotionHandler);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (FreddyMotionHandler.__proto__ || (0, _getPrototypeOf2.default)(FreddyMotionHandler)).call(this));

    _this4.thresholdAlpha = 400;
    _this4.thresholdBeta = 400;
    _this4.thresholdGamma = 400;
    _this4.thresholdDeltaTime = 0.2;

    _this4.callback = callback;
    return _this4;
  }

  (0, _createClass3.default)(FreddyMotionHandler, [{
    key: 'onRotationRate',
    value: function onRotationRate(data) {
      var hit = (0, _get3.default)(FreddyMotionHandler.prototype.__proto__ || (0, _getPrototypeOf2.default)(FreddyMotionHandler.prototype), 'onRotationRate', this).call(this, data);

      if (hit) {
        var index = Math.floor(6 * Math.random());
        this.callback(index);
      }
    }
  }]);
  return FreddyMotionHandler;
}(HitDetector);

var PowerChordMotionHandler = function () {
  function PowerChordMotionHandler(callback) {
    (0, _classCallCheck3.default)(this, PowerChordMotionHandler);

    this.callback = callback;

    this.onAccelerationIncludingGravity = this.onAccelerationIncludingGravity.bind(this);
  }

  (0, _createClass3.default)(PowerChordMotionHandler, [{
    key: 'onAccelerationIncludingGravity',
    value: function onAccelerationIncludingGravity(data) {
      var accX = data[0];
      var accY = data[1];
      var accZ = data[2];
      var pitch = 2 * Math.atan(accY / Math.sqrt(accZ * accZ + accX * accX)) / Math.PI;
      var position = 0.5 * (1 - pitch);

      if (position < 0) position = 0;else if (position > 1) position = 1;

      this.callback(position, position);
    }
  }, {
    key: 'start',
    value: function start(experience) {
      experience.motionInput.addListener('accelerationIncludingGravity', this.onAccelerationIncludingGravity);
    }
  }, {
    key: 'stop',
    value: function stop(experience) {
      experience.motionInput.removeListener('accelerationIncludingGravity', this.onAccelerationIncludingGravity);
    }
  }]);
  return PowerChordMotionHandler;
}();

var GuitarRiffMotionHandler = function () {
  function GuitarRiffMotionHandler(callback) {
    (0, _classCallCheck3.default)(this, GuitarRiffMotionHandler);

    this.callback = callback;

    this.lastMag = 0.0;
    this.nextSegmentIndex = 15;
    this.currentSegmentIndex = 15;
    this.lastSegmentIndex = 15;
    this.lastOnsetTime = 0.0;

    this.onRotationRate = this.onRotationRate.bind(this);
  }

  (0, _createClass3.default)(GuitarRiffMotionHandler, [{
    key: 'onRotationRate',
    value: function onRotationRate(data) {
      var alpha = data[0];
      var beta = data[1];
      var gamma = data[2];
      var mag = Math.sqrt(alpha * alpha + gamma * gamma);
      var time = getTime();
      var deltaTime = time - this.lastOnsetTime;

      // fullfill anticipated beats
      if (this.nextSegmentIndex % 2 == 1 && deltaTime > 0.28125) this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 2) + 1) * 2;else if (this.nextSegmentIndex % 4 == 2 && deltaTime > 0.54375) this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 4) + 1) * 4;else if (this.nextSegmentIndex == 12 && deltaTime > 0.5) this.nextSegmentIndex = 16;else if (this.nextSegmentIndex == 14 && deltaTime > 0.1) this.nextSegmentIndex = 16;else if (this.nextSegmentIndex % 8 == 4 && deltaTime > 1.0875) this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 8) + 1) * 8;

      if (mag > this.lastMag && mag > 450 && deltaTime > 0.130) {
        if (deltaTime < 0.250) this.nextSegmentIndex++;else if (deltaTime < 0.750) this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 2) + 1) * 2;else if (deltaTime < 1.125) this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 4) + 1) * 4;else if (deltaTime < 2.250) this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 8) + 1) * 8;else this.nextSegmentIndex = 0;

        if (this.nextSegmentIndex > 15) this.nextSegmentIndex = 0;

        var segmentIndex = this.nextSegmentIndex;

        if (this.nextSegmentIndex === 4 && this.lastSegmentIndex === 0) this.currentSegmentIndex = 5;

        this.callback(segmentIndex);

        this.lastSegmentIndex = segmentIndex;
        this.lastOnsetTime = time;
      }

      this.lastMag = mag;
    }
  }, {
    key: 'start',
    value: function start(experience) {
      this.lastTime = 0;
      experience.motionInput.addListener('rotationRate', this.onRotationRate);
    }
  }, {
    key: 'stop',
    value: function stop(experience) {
      experience.motionInput.removeListener('rotationRate', this.onRotationRate);
    }
  }]);
  return GuitarRiffMotionHandler;
}();

var Renderer = function (_soundworks$Canvas2dR) {
  (0, _inherits3.default)(Renderer, _soundworks$Canvas2dR);

  function Renderer() {
    (0, _classCallCheck3.default)(this, Renderer);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (Renderer.__proto__ || (0, _getPrototypeOf2.default)(Renderer)).call(this, 0));

    _this5.color = '#' + playerColors[soundworks.client.index];
    _this5.intensity = 0;
    return _this5;
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
      var intensity = this.intensity;

      if (intensity > 0) {
        ctx.save();
        ctx.globalAlpha = intensity * intensity;
        ctx.fillStyle = this.color;
        ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.fill();
        ctx.restore();

        this.intensity = 0;
      }
    }
  }, {
    key: 'triggerBlink',
    value: function triggerBlink() {
      var intensity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.intensity = intensity;
    }
  }]);
  return Renderer;
}(soundworks.Canvas2dRenderer);

var template = '\n  <canvas class="background flex-middle"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-middle">\n    <p class="instrument-name"><%= instrumentName %></p>\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var SceneWwryR = function () {
  function SceneWwryR(experience, config) {
    (0, _classCallCheck3.default)(this, SceneWwryR);

    this.experience = experience;
    this.config = config;

    this.placer = new _Placer2.default(experience);
    this.motionHandler = null;
    this.queenPlayer = null;

    this.$viewElem = null;
    this.clientIndex = soundworks.client.index;
    this.track = null;

    var tempo = config.tempo;
    var tempoUnit = config.tempoUnit;
    this.measureDuration = 60 / (tempo * tempoUnit);

    var trackConfig = config.tracks[this.clientIndex];
    this.renderer = new Renderer();

    this.audioOutput = experience.audioOutput;

    this.onMotionEvent = this.onMotionEvent.bind(this);
  }

  (0, _createClass3.default)(SceneWwryR, [{
    key: 'startMotion',
    value: function startMotion(trackName) {
      var experience = this.experience;

      switch (trackName) {
        case 'drums':
          this.motionHandler = new DrumsMotionHandler(this.onMotionEvent);
          break;

        case 'verse':
          this.motionHandler = new VerseMotionHandler(this.onMotionEvent);
          break;

        case 'chorus':
          this.motionHandler = new ChorusMotionHandler(this.onMotionEvent);
          break;

        case 'freddy':
          this.motionHandler = new FreddyMotionHandler(this.onMotionEvent);
          break;

        case 'power chord':
          this.motionHandler = new PowerChordMotionHandler(this.onMotionEvent);
          break;

        case 'guitar riff':
          this.motionHandler = new GuitarRiffMotionHandler(this.onMotionEvent);
          break;

      }

      this.motionHandler.start(this.experience);
    }
  }, {
    key: 'stopMotion',
    value: function stopMotion(trackName) {
      if (this.motionHandler) {
        this.motionHandler.stop(this.experience);
        this.motionHandler = null;
      }
    }
  }, {
    key: 'startPlacer',
    value: function startPlacer() {
      var _this6 = this;

      this.placer.start(function () {
        return _this6.startScene();
      });
    }
  }, {
    key: 'startScene',
    value: function startScene() {
      var experience = this.experience;

      this.$viewElem = experience.view.$el;

      if (!this.queenPlayer) {
        var config = this.config;
        this.queenPlayer = new _QueenPlayer2.default([this.audioOutput]);
      }

      experience.view.model = { instrumentName: this.track.name.toUpperCase() };
      experience.view.template = template;
      experience.view.render();
      experience.view.addRenderer(this.renderer);
      experience.view.setPreRender(function (ctx, dt, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = '#000000';
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        ctx.fill();
        ctx.restore();
      });

      this.queenPlayer.startTrack(0, this.track);
      this.startMotion(this.track.name);
    }
  }, {
    key: 'enter',
    value: function enter() {
      var _this7 = this;

      if (this.notes) {
        this.startPlacer();
      } else {
        var experience = this.experience;
        var trackConfig = this.config.tracks[this.clientIndex];

        experience.audioBufferManager.loadFiles(trackConfig).then(function (track) {
          _this7.track = track;
          _this7.startPlacer();
        });
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.placer.stop();

      if (this.queenPlayer) this.queenPlayer.stopTrack(0);

      if (this.$viewElem) {
        this.$viewElem = null;
        this.experience.view.removeRenderer(this.renderer);
        this.stopMotion();
      }
    }
  }, {
    key: 'onMotionEvent',
    value: function onMotionEvent(data, intensity) {
      this.renderer.triggerBlink(intensity);
      this.queenPlayer.onMotionEvent(0, data);
      this.experience.send('motionEvent', this.clientIndex, data);
    }
  }]);
  return SceneWwryR;
}();

exports.default = SceneWwryR;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInd3cnktci5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiY2xpZW50IiwiYXVkaW9Db250ZXh0IiwiYXVkaW9TY2hlZHVsZXIiLCJhdWRpbyIsImdldFNjaGVkdWxlciIsInBsYXllckNvbG9ycyIsImNvbG9yQ29uZmlnIiwicGxheWVycyIsImdldFRpbWUiLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJIaXREZXRlY3RvciIsIm9wdGlvbnMiLCJ0aHJlc2hvbGRzIiwidGhyZXNob2xkQWxwaGEiLCJ0aHJlc2hvbGRCZXRhIiwidGhyZXNob2xkR2FtbWEiLCJ0aHJlc2hvbGREZWx0YVRpbWUiLCJsYXN0VGltZSIsInVuZGVmaW5lZCIsIm9uUm90YXRpb25SYXRlIiwiYmluZCIsImRhdGEiLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsImhpdCIsIk1hdGgiLCJhYnMiLCJ0aW1lIiwidGltZURpZmZlcmVuY2UiLCJleHBlcmllbmNlIiwibW90aW9uSW5wdXQiLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwiRHJ1bXNNb3Rpb25IYW5kbGVyIiwiY2FsbGJhY2siLCJyYW5kb20iLCJWZXJzZU1vdGlvbkhhbmRsZXIiLCJjdXJyZW50UG9zaXRpb25JblZlcnNlIiwidmVyc2VJbmRleCIsImRlbHRhVGltZSIsImZsb29yIiwic2VnbWVudEluZGV4IiwiQ2hvcnVzTW90aW9uSGFuZGxlciIsIm1hcmtlcldlIiwibWFya2VyV2lsbCIsIkZyZWRkeU1vdGlvbkhhbmRsZXIiLCJpbmRleCIsIlBvd2VyQ2hvcmRNb3Rpb25IYW5kbGVyIiwib25BY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IiwiYWNjWCIsImFjY1kiLCJhY2NaIiwicGl0Y2giLCJhdGFuIiwic3FydCIsIlBJIiwicG9zaXRpb24iLCJHdWl0YXJSaWZmTW90aW9uSGFuZGxlciIsImxhc3RNYWciLCJuZXh0U2VnbWVudEluZGV4IiwiY3VycmVudFNlZ21lbnRJbmRleCIsImxhc3RTZWdtZW50SW5kZXgiLCJsYXN0T25zZXRUaW1lIiwibWFnIiwiUmVuZGVyZXIiLCJjb2xvciIsImludGVuc2l0eSIsImR0IiwiY3R4Iiwic2F2ZSIsImdsb2JhbEFscGhhIiwiZmlsbFN0eWxlIiwicmVjdCIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwiZmlsbCIsInJlc3RvcmUiLCJDYW52YXMyZFJlbmRlcmVyIiwidGVtcGxhdGUiLCJTY2VuZVd3cnlSIiwiY29uZmlnIiwicGxhY2VyIiwiUGxhY2VyIiwibW90aW9uSGFuZGxlciIsInF1ZWVuUGxheWVyIiwiJHZpZXdFbGVtIiwiY2xpZW50SW5kZXgiLCJ0cmFjayIsInRlbXBvIiwidGVtcG9Vbml0IiwibWVhc3VyZUR1cmF0aW9uIiwidHJhY2tDb25maWciLCJ0cmFja3MiLCJyZW5kZXJlciIsImF1ZGlvT3V0cHV0Iiwib25Nb3Rpb25FdmVudCIsInRyYWNrTmFtZSIsInN0YXJ0Iiwic3RvcCIsInN0YXJ0U2NlbmUiLCJ2aWV3IiwiJGVsIiwiUXVlZW5QbGF5ZXIiLCJtb2RlbCIsImluc3RydW1lbnROYW1lIiwibmFtZSIsInRvVXBwZXJDYXNlIiwicmVuZGVyIiwiYWRkUmVuZGVyZXIiLCJzZXRQcmVSZW5kZXIiLCJzdGFydFRyYWNrIiwic3RhcnRNb3Rpb24iLCJub3RlcyIsInN0YXJ0UGxhY2VyIiwiYXVkaW9CdWZmZXJNYW5hZ2VyIiwibG9hZEZpbGVzIiwidGhlbiIsInN0b3BUcmFjayIsInJlbW92ZVJlbmRlcmVyIiwic3RvcE1vdGlvbiIsInRyaWdnZXJCbGluayIsInNlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxVOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFDQSxJQUFNQyxTQUFTRCxXQUFXQyxNQUExQjtBQUNBLElBQU1DLGVBQWVGLFdBQVdFLFlBQWhDO0FBQ0EsSUFBTUMsaUJBQWlCSCxXQUFXSSxLQUFYLENBQWlCQyxZQUFqQixFQUF2QjtBQUNBLElB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LEtBQUwsQ0FBV2tCLElBQTVCO0FBQ0Q7Ozs0QkFFTztBQUFBOztBQUNOLFVBQUksS0FBS08sS0FBVCxFQUFnQjtBQUNkLGFBQUtDLFdBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFNcEYsYUFBYSxLQUFLQSxVQUF4QjtBQUNBLFlBQU04RCxjQUFjLEtBQUtYLE1BQUwsQ0FBWVksTUFBWixDQUFtQixLQUFLTixXQUF4QixDQUFwQjs7QUFFQXpELG1CQUFXcUYsa0JBQVgsQ0FBOEJDLFNBQTlCLENBQXdDeEIsV0FBeEMsRUFBcUR5QixJQUFyRCxDQUEwRCxVQUFDN0IsS0FBRCxFQUFXO0FBQ25FLGlCQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQSxpQkFBSzBCLFdBQUw7QUFDRCxTQUhEO0FBSUQ7QUFDRjs7OzJCQUVNO0FBQ0wsV0FBS2hDLE1BQUwsQ0FBWWlCLElBQVo7O0FBRUEsVUFBSSxLQUFLZCxXQUFULEVBQ0UsS0FBS0EsV0FBTCxDQUFpQmlDLFNBQWpCLENBQTJCLENBQTNCOztBQUdGLFVBQUksS0FBS2hDLFNBQVQsRUFBb0I7QUFDbEIsYUFBS0EsU0FBTCxHQUFpQixJQUFqQjtBQUNBLGFBQUt4RCxVQUFMLENBQWdCdUUsSUFBaEIsQ0FBcUJrQixjQUFyQixDQUFvQyxLQUFLekIsUUFBekM7QUFDQSxhQUFLMEIsVUFBTDtBQUNEO0FBQ0Y7OztrQ0FFYW5HLEksRUFBTThDLFMsRUFBVztBQUM3QixXQUFLMkIsUUFBTCxDQUFjMkIsWUFBZCxDQUEyQnRELFNBQTNCO0FBQ0EsV0FBS2tCLFdBQUwsQ0FBaUJXLGFBQWpCLENBQStCLENBQS9CLEVBQWtDM0UsSUFBbEM7QUFDQSxXQUFLUyxVQUFMLENBQWdCNEYsSUFBaEIsQ0FBcUIsYUFBckIsRUFBb0MsS0FBS25DLFdBQXpDLEVBQXNEbEUsSUFBdEQ7QUFDRDs7Ozs7a0JBaElrQjJELFUiLCJmaWxlIjoid3dyeS1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgUGxhY2VyIGZyb20gJy4vUGxhY2VyJztcbmltcG9ydCBRdWVlblBsYXllciBmcm9tICcuLi8uLi9zaGFyZWQvUXVlZW5QbGF5ZXInO1xuaW1wb3J0IGNvbG9yQ29uZmlnIGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jb2xvci1jb25maWcnO1xuY29uc3QgY2xpZW50ID0gc291bmR3b3Jrcy5jbGllbnQ7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBzb3VuZHdvcmtzLmF1ZGlvQ29udGV4dDtcbmNvbnN0IGF1ZGlvU2NoZWR1bGVyID0gc291bmR3b3Jrcy5hdWRpby5nZXRTY2hlZHVsZXIoKTtcbmNvbnN0IHBsYXllckNvbG9ycyA9IGNvbG9yQ29uZmlnLnBsYXllcnM7XG5cbmZ1bmN0aW9uIGdldFRpbWUoKSB7XG4gIHJldHVybiAwLjAwMSAqIChwZXJmb3JtYW5jZS5ub3coKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG59XG5cbmNsYXNzIEhpdERldGVjdG9yIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdGhyZXNob2xkcyA9IG9wdGlvbnMudGhyZXNob2xkcztcblxuICAgIHRoaXMudGhyZXNob2xkQWxwaGEgPSA0MDA7XG4gICAgdGhpcy50aHJlc2hvbGRCZXRhID0gNDAwO1xuICAgIHRoaXMudGhyZXNob2xkR2FtbWEgPSA0MDA7XG4gICAgdGhpcy50aHJlc2hvbGREZWx0YVRpbWUgPSAwLjE7XG5cbiAgICB0aGlzLmxhc3RUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMub25Sb3RhdGlvblJhdGUgPSB0aGlzLm9uUm90YXRpb25SYXRlLmJpbmQodGhpcyk7XG4gIH1cblxuICBvblJvdGF0aW9uUmF0ZShkYXRhKSB7XG4gICAgY29uc3QgYWxwaGEgPSBkYXRhWzBdO1xuICAgIGNvbnN0IGJldGEgPSBkYXRhWzFdO1xuICAgIGNvbnN0IGdhbW1hID0gZGF0YVsyXTtcbiAgICBsZXQgaGl0O1xuXG4gICAgaWYgKE1hdGguYWJzKGFscGhhKSA+IHRoaXMudGhyZXNob2xkQWxwaGEgfHwgTWF0aC5hYnMoZ2FtbWEpID4gdGhpcy50aHJlc2hvbGRHYW1tYSkge1xuICAgICAgY29uc3QgdGltZSA9IGdldFRpbWUoKTtcbiAgICAgIGNvbnN0IHRpbWVEaWZmZXJlbmNlID0gdGltZSAtIHRoaXMubGFzdFRpbWU7XG5cbiAgICAgIGlmICh0aW1lRGlmZmVyZW5jZSA+IHRoaXMudGhyZXNob2xkRGVsdGFUaW1lKSB7XG5cbiAgICAgICAgaWYgKGFscGhhIDwgLXRoaXMudGhyZXNob2xkQWxwaGEpXG4gICAgICAgICAgaGl0ID0gJ3JpZ2h0JztcbiAgICAgICAgZWxzZSBpZiAoYWxwaGEgPiB0aGlzLnRocmVzaG9sZEFscGhhKVxuICAgICAgICAgIGhpdCA9ICdsZWZ0JztcbiAgICAgICAgZWxzZSBpZiAoYmV0YSA8IC10aGlzLnRocmVzaG9sZEJldGEpXG4gICAgICAgICAgaGl0ID0gJ291dCc7XG4gICAgICAgIGVsc2UgaWYgKGJldGEgPiB0aGlzLnRocmVzaG9sZEJldGEpXG4gICAgICAgICAgaGl0ID0gJ2luJztcbiAgICAgICAgZWxzZSBpZiAoZ2FtbWEgPCAtdGhpcy50aHJlc2hvbGRHYW1tYSlcbiAgICAgICAgICBoaXQgPSAndXAnO1xuICAgICAgICBlbHNlIGlmIChnYW1tYSA+IHRoaXMudGhyZXNob2xkR2FtbWEpXG4gICAgICAgICAgaGl0ID0gJ2Rvd24nO1xuXG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSB0aW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoaXQ7XG4gIH1cblxuICBzdGFydChleHBlcmllbmNlKSB7XG4gICAgdGhpcy5sYXN0VGltZSA9IGdldFRpbWUoKTtcbiAgICBleHBlcmllbmNlLm1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdyb3RhdGlvblJhdGUnLCB0aGlzLm9uUm90YXRpb25SYXRlKTtcbiAgfVxuXG4gIHN0b3AoZXhwZXJpZW5jZSkge1xuICAgIGV4cGVyaWVuY2UubW90aW9uSW5wdXQucmVtb3ZlTGlzdGVuZXIoJ3JvdGF0aW9uUmF0ZScsIHRoaXMub25Sb3RhdGlvblJhdGUpO1xuICB9XG59XG5cbmNsYXNzIERydW1zTW90aW9uSGFuZGxlciBleHRlbmRzIEhpdERldGVjdG9yIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2spIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy50aHJlc2hvbGRBbHBoYSA9IDQwMDtcbiAgICB0aGlzLnRocmVzaG9sZEdhbW1hID0gNDAwO1xuICAgIHRoaXMudGhyZXNob2xkRGVsdGFUaW1lID0gMC4xO1xuXG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9XG5cbiAgb25Sb3RhdGlvblJhdGUoZGF0YSkge1xuICAgIGNvbnN0IGhpdCA9IHN1cGVyLm9uUm90YXRpb25SYXRlKGRhdGEpO1xuXG4gICAgaWYgKGhpdCA9PT0gXCJsZWZ0XCIgfHwgaGl0ID09PSBcInJpZ2h0XCIpXG4gICAgICB0aGlzLmNhbGxiYWNrKDIpO1xuICAgIGVsc2UgaWYgKGhpdCA9PT0gXCJ1cFwiIHx8IGhpdCA9PT0gXCJkb3duXCIpXG4gICAgICB0aGlzLmNhbGxiYWNrKChNYXRoLnJhbmRvbSgpIDwgMC41KSA/IDAgOiAxKTtcbiAgfVxufVxuXG5jbGFzcyBWZXJzZU1vdGlvbkhhbmRsZXIgZXh0ZW5kcyBIaXREZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMudGhyZXNob2xkQWxwaGEgPSA0MDA7XG4gICAgdGhpcy50aHJlc2hvbGRCZXRhID0gNDAwO1xuICAgIHRoaXMudGhyZXNob2xkR2FtbWEgPSA0MDA7XG4gICAgdGhpcy50aHJlc2hvbGREZWx0YVRpbWUgPSAwLjQ7XG5cbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbkluVmVyc2UgPSAtMTtcbiAgICB0aGlzLnZlcnNlSW5kZXggPSAwO1xuICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICB9XG5cbiAgb25Sb3RhdGlvblJhdGUoZGF0YSkge1xuICAgIGNvbnN0IGhpdCA9IHN1cGVyLm9uUm90YXRpb25SYXRlKGRhdGEpO1xuXG4gICAgaWYgKGhpdCkge1xuICAgICAgY29uc3QgdGltZSA9IGdldFRpbWUoKTtcbiAgICAgIGNvbnN0IGRlbHRhVGltZSA9IHRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuXG4gICAgICBpZiAoZGVsdGFUaW1lIDwgMSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbkluVmVyc2UgKz0gMTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zaXRpb25JblZlcnNlID09PSAxNilcbiAgICAgICAgICB0aGlzLnZlcnNlSW5kZXggPSAoTWF0aC5mbG9vcih0aGlzLnZlcnNlSW5kZXggKyAodGhpcy5jdXJyZW50UG9zaXRpb25JblZlcnNlICsgMSkgLyAxNikpICUgMztcblxuICAgICAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbkluVmVyc2UgPSB0aGlzLmN1cnJlbnRQb3NpdGlvbkluVmVyc2UgJSAxNjtcbiAgICAgIH0gZWxzZSBpZiAoZGVsdGFUaW1lID49IDEgJiYgZGVsdGFUaW1lIDwgMiAmJiB0aGlzLmN1cnJlbnRQb3NpdGlvbkluVmVyc2UgIT09IDApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50UG9zaXRpb25JblZlcnNlIC09IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbkluVmVyc2UgPSAwO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZWdtZW50SW5kZXggPSB0aGlzLnZlcnNlSW5kZXggKiAoMTYgKyAxKSArIHRoaXMuY3VycmVudFBvc2l0aW9uSW5WZXJzZTtcbiAgICAgIHRoaXMuY2FsbGJhY2soc2VnbWVudEluZGV4KTtcblxuICAgICAgdGhpcy5sYXN0VGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIENob3J1c01vdGlvbkhhbmRsZXIgZXh0ZW5kcyBIaXREZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMudGhyZXNob2xkQWxwaGEgPSA0MDA7XG4gICAgdGhpcy50aHJlc2hvbGRHYW1tYSA9IDUwMDtcbiAgICB0aGlzLnRocmVzaG9sZERlbHRhVGltZSA9IDAuMTtcblxuICAgIHRoaXMubWFya2VyV2UgPSB0cnVlO1xuICAgIHRoaXMubWFya2VyV2lsbCA9IHRydWU7XG5cbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBvblJvdGF0aW9uUmF0ZShkYXRhKSB7XG4gICAgY29uc3QgaGl0ID0gc3VwZXIub25Sb3RhdGlvblJhdGUoZGF0YSk7XG5cbiAgICBpZiAoaGl0ID09PSBcImxlZnRcIikge1xuICAgICAgaWYgKHRoaXMubWFya2VyV2UpIHtcbiAgICAgICAgdGhpcy5jYWxsYmFjaygxKTtcbiAgICAgICAgdGhpcy5tYXJrZXJXaWxsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2soMyk7XG4gICAgICAgIHRoaXMubWFya2VyV2lsbCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaGl0ID09PSBcInJpZ2h0XCIpIHtcbiAgICAgIGlmICh0aGlzLm1hcmtlcldpbGwpIHtcbiAgICAgICAgdGhpcy5jYWxsYmFjaygyKTtcbiAgICAgICAgdGhpcy5tYXJrZXJXZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYWxsYmFjayg0KTtcbiAgICAgICAgdGhpcy5tYXJrZXJXZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChoaXQgPT09IFwidXBcIikge1xuICAgICAgdGhpcy5jYWxsYmFjayg1KTtcbiAgICAgIHRoaXMubWFya2VyV2lsbCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChoaXQgPT09IFwiZG93blwiKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrKDYpO1xuICAgICAgdGhpcy5tYXJrZXJXZSA9IHRydWU7XG4gICAgICB0aGlzLm1hcmtlcldpbGwgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBGcmVkZHlNb3Rpb25IYW5kbGVyIGV4dGVuZHMgSGl0RGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnRocmVzaG9sZEFscGhhID0gNDAwO1xuICAgIHRoaXMudGhyZXNob2xkQmV0YSA9IDQwMDtcbiAgICB0aGlzLnRocmVzaG9sZEdhbW1hID0gNDAwO1xuICAgIHRoaXMudGhyZXNob2xkRGVsdGFUaW1lID0gMC4yO1xuXG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9XG5cbiAgb25Sb3RhdGlvblJhdGUoZGF0YSkge1xuICAgIGNvbnN0IGhpdCA9IHN1cGVyLm9uUm90YXRpb25SYXRlKGRhdGEpO1xuXG4gICAgaWYgKGhpdCkge1xuICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKDYgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICAgIHRoaXMuY2FsbGJhY2soaW5kZXgpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQb3dlckNob3JkTW90aW9uSGFuZGxlciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5vbkFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSB0aGlzLm9uQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgb25BY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KGRhdGEpIHtcbiAgICBjb25zdCBhY2NYID0gZGF0YVswXTtcbiAgICBjb25zdCBhY2NZID0gZGF0YVsxXTtcbiAgICBjb25zdCBhY2NaID0gZGF0YVsyXTtcbiAgICB2YXIgcGl0Y2ggPSAyICogTWF0aC5hdGFuKGFjY1kgLyBNYXRoLnNxcnQoYWNjWiAqIGFjY1ogKyBhY2NYICogYWNjWCkpIC8gTWF0aC5QSTtcbiAgICB2YXIgcG9zaXRpb24gPSAwLjUgKiAoMSAtIHBpdGNoKTtcblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICBwb3NpdGlvbiA9IDA7XG4gICAgZWxzZSBpZiAocG9zaXRpb24gPiAxKVxuICAgICAgcG9zaXRpb24gPSAxO1xuXG4gICAgdGhpcy5jYWxsYmFjayhwb3NpdGlvbiwgcG9zaXRpb24pO1xuICB9XG5cbiAgc3RhcnQoZXhwZXJpZW5jZSkge1xuICAgIGV4cGVyaWVuY2UubW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCB0aGlzLm9uQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG4gIH1cblxuICBzdG9wKGV4cGVyaWVuY2UpIHtcbiAgICBleHBlcmllbmNlLm1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgdGhpcy5vbkFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpO1xuICB9XG59XG5cbmNsYXNzIEd1aXRhclJpZmZNb3Rpb25IYW5kbGVyIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLmxhc3RNYWcgPSAwLjA7XG4gICAgdGhpcy5uZXh0U2VnbWVudEluZGV4ID0gMTU7XG4gICAgdGhpcy5jdXJyZW50U2VnbWVudEluZGV4ID0gMTU7XG4gICAgdGhpcy5sYXN0U2VnbWVudEluZGV4ID0gMTU7XG4gICAgdGhpcy5sYXN0T25zZXRUaW1lID0gMC4wO1xuXG4gICAgdGhpcy5vblJvdGF0aW9uUmF0ZSA9IHRoaXMub25Sb3RhdGlvblJhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG9uUm90YXRpb25SYXRlKGRhdGEpIHtcbiAgICBjb25zdCBhbHBoYSA9IGRhdGFbMF07XG4gICAgY29uc3QgYmV0YSA9IGRhdGFbMV07XG4gICAgY29uc3QgZ2FtbWEgPSBkYXRhWzJdO1xuICAgIHZhciBtYWcgPSBNYXRoLnNxcnQoYWxwaGEgKiBhbHBoYSArIGdhbW1hICogZ2FtbWEpO1xuICAgIHZhciB0aW1lID0gZ2V0VGltZSgpO1xuICAgIHZhciBkZWx0YVRpbWUgPSB0aW1lIC0gdGhpcy5sYXN0T25zZXRUaW1lO1xuXG4gICAgLy8gZnVsbGZpbGwgYW50aWNpcGF0ZWQgYmVhdHNcbiAgICBpZiAodGhpcy5uZXh0U2VnbWVudEluZGV4ICUgMiA9PSAxICYmIGRlbHRhVGltZSA+IDAuMjgxMjUpXG4gICAgICB0aGlzLm5leHRTZWdtZW50SW5kZXggPSAoTWF0aC5mbG9vcih0aGlzLm5leHRTZWdtZW50SW5kZXggLyAyKSArIDEpICogMjtcbiAgICBlbHNlIGlmICh0aGlzLm5leHRTZWdtZW50SW5kZXggJSA0ID09IDIgJiYgZGVsdGFUaW1lID4gMC41NDM3NSlcbiAgICAgIHRoaXMubmV4dFNlZ21lbnRJbmRleCA9IChNYXRoLmZsb29yKHRoaXMubmV4dFNlZ21lbnRJbmRleCAvIDQpICsgMSkgKiA0O1xuICAgIGVsc2UgaWYgKHRoaXMubmV4dFNlZ21lbnRJbmRleCA9PSAxMiAmJiBkZWx0YVRpbWUgPiAwLjUpXG4gICAgICB0aGlzLm5leHRTZWdtZW50SW5kZXggPSAxNjtcbiAgICBlbHNlIGlmICh0aGlzLm5leHRTZWdtZW50SW5kZXggPT0gMTQgJiYgZGVsdGFUaW1lID4gMC4xKVxuICAgICAgdGhpcy5uZXh0U2VnbWVudEluZGV4ID0gMTY7XG4gICAgZWxzZSBpZiAodGhpcy5uZXh0U2VnbWVudEluZGV4ICUgOCA9PSA0ICYmIGRlbHRhVGltZSA+IDEuMDg3NSlcbiAgICAgIHRoaXMubmV4dFNlZ21lbnRJbmRleCA9IChNYXRoLmZsb29yKHRoaXMubmV4dFNlZ21lbnRJbmRleCAvIDgpICsgMSkgKiA4O1xuXG4gICAgaWYgKG1hZyA+IHRoaXMubGFzdE1hZyAmJiBtYWcgPiA0NTAgJiYgZGVsdGFUaW1lID4gMC4xMzApIHtcbiAgICAgIGlmIChkZWx0YVRpbWUgPCAwLjI1MClcbiAgICAgICAgdGhpcy5uZXh0U2VnbWVudEluZGV4Kys7XG4gICAgICBlbHNlIGlmIChkZWx0YVRpbWUgPCAwLjc1MClcbiAgICAgICAgdGhpcy5uZXh0U2VnbWVudEluZGV4ID0gKE1hdGguZmxvb3IodGhpcy5uZXh0U2VnbWVudEluZGV4IC8gMikgKyAxKSAqIDI7XG4gICAgICBlbHNlIGlmIChkZWx0YVRpbWUgPCAxLjEyNSlcbiAgICAgICAgdGhpcy5uZXh0U2VnbWVudEluZGV4ID0gKE1hdGguZmxvb3IodGhpcy5uZXh0U2VnbWVudEluZGV4IC8gNCkgKyAxKSAqIDQ7XG4gICAgICBlbHNlIGlmIChkZWx0YVRpbWUgPCAyLjI1MClcbiAgICAgICAgdGhpcy5uZXh0U2VnbWVudEluZGV4ID0gKE1hdGguZmxvb3IodGhpcy5uZXh0U2VnbWVudEluZGV4IC8gOCkgKyAxKSAqIDg7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMubmV4dFNlZ21lbnRJbmRleCA9IDA7XG5cbiAgICAgIGlmICh0aGlzLm5leHRTZWdtZW50SW5kZXggPiAxNSlcbiAgICAgICAgdGhpcy5uZXh0U2VnbWVudEluZGV4ID0gMDtcblxuICAgICAgbGV0IHNlZ21lbnRJbmRleCA9IHRoaXMubmV4dFNlZ21lbnRJbmRleDtcblxuICAgICAgaWYgKHRoaXMubmV4dFNlZ21lbnRJbmRleCA9PT0gNCAmJiB0aGlzLmxhc3RTZWdtZW50SW5kZXggPT09IDApXG4gICAgICAgIHRoaXMuY3VycmVudFNlZ21lbnRJbmRleCA9IDU7XG5cbiAgICAgIHRoaXMuY2FsbGJhY2soc2VnbWVudEluZGV4KTtcblxuICAgICAgdGhpcy5sYXN0U2VnbWVudEluZGV4ID0gc2VnbWVudEluZGV4O1xuICAgICAgdGhpcy5sYXN0T25zZXRUaW1lID0gdGltZTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RNYWcgPSBtYWc7XG4gIH1cblxuICBzdGFydChleHBlcmllbmNlKSB7XG4gICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgZXhwZXJpZW5jZS5tb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcigncm90YXRpb25SYXRlJywgdGhpcy5vblJvdGF0aW9uUmF0ZSk7XG4gIH1cblxuICBzdG9wKGV4cGVyaWVuY2UpIHtcbiAgICBleHBlcmllbmNlLm1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKCdyb3RhdGlvblJhdGUnLCB0aGlzLm9uUm90YXRpb25SYXRlKTtcbiAgfVxufVxuXG5jbGFzcyBSZW5kZXJlciBleHRlbmRzIHNvdW5kd29ya3MuQ2FudmFzMmRSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKDApO1xuXG4gICAgdGhpcy5jb2xvciA9ICcjJyArIHBsYXllckNvbG9yc1tzb3VuZHdvcmtzLmNsaWVudC5pbmRleF07XG4gICAgdGhpcy5pbnRlbnNpdHkgPSAwO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgdXBkYXRlKGR0KSB7fVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBjb25zdCBpbnRlbnNpdHkgPSB0aGlzLmludGVuc2l0eTtcblxuICAgIGlmIChpbnRlbnNpdHkgPiAwKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gaW50ZW5zaXR5ICogaW50ZW5zaXR5O1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICBjdHgucmVjdCgwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcblxuICAgICAgdGhpcy5pbnRlbnNpdHkgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHRyaWdnZXJCbGluayhpbnRlbnNpdHkgPSAxKSB7XG4gICAgdGhpcy5pbnRlbnNpdHkgPSBpbnRlbnNpdHk7XG4gIH1cbn1cblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kIGZsZXgtbWlkZGxlXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtbWlkZGxlXCI+XG4gICAgPHAgY2xhc3M9XCJpbnN0cnVtZW50LW5hbWVcIj48JT0gaW5zdHJ1bWVudE5hbWUgJT48L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVXd3J5UiB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGNvbmZpZykge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLnBsYWNlciA9IG5ldyBQbGFjZXIoZXhwZXJpZW5jZSk7XG4gICAgdGhpcy5tb3Rpb25IYW5kbGVyID0gbnVsbDtcbiAgICB0aGlzLnF1ZWVuUGxheWVyID0gbnVsbDtcblxuICAgIHRoaXMuJHZpZXdFbGVtID0gbnVsbDtcbiAgICB0aGlzLmNsaWVudEluZGV4ID0gc291bmR3b3Jrcy5jbGllbnQuaW5kZXg7XG4gICAgdGhpcy50cmFjayA9IG51bGw7XG5cbiAgICBjb25zdCB0ZW1wbyA9IGNvbmZpZy50ZW1wbztcbiAgICBjb25zdCB0ZW1wb1VuaXQgPSBjb25maWcudGVtcG9Vbml0O1xuICAgIHRoaXMubWVhc3VyZUR1cmF0aW9uID0gNjAgLyAodGVtcG8gKiB0ZW1wb1VuaXQpO1xuXG4gICAgY29uc3QgdHJhY2tDb25maWcgPSBjb25maWcudHJhY2tzW3RoaXMuY2xpZW50SW5kZXhdO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoKTtcblxuICAgIHRoaXMuYXVkaW9PdXRwdXQgPSBleHBlcmllbmNlLmF1ZGlvT3V0cHV0O1xuXG4gICAgdGhpcy5vbk1vdGlvbkV2ZW50ID0gdGhpcy5vbk1vdGlvbkV2ZW50LmJpbmQodGhpcyk7XG4gIH1cblxuICBzdGFydE1vdGlvbih0cmFja05hbWUpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuXG4gICAgc3dpdGNoICh0cmFja05hbWUpIHtcbiAgICAgIGNhc2UgJ2RydW1zJzpcbiAgICAgICAgdGhpcy5tb3Rpb25IYW5kbGVyID0gbmV3IERydW1zTW90aW9uSGFuZGxlcih0aGlzLm9uTW90aW9uRXZlbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndmVyc2UnOlxuICAgICAgICB0aGlzLm1vdGlvbkhhbmRsZXIgPSBuZXcgVmVyc2VNb3Rpb25IYW5kbGVyKHRoaXMub25Nb3Rpb25FdmVudCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjaG9ydXMnOlxuICAgICAgICB0aGlzLm1vdGlvbkhhbmRsZXIgPSBuZXcgQ2hvcnVzTW90aW9uSGFuZGxlcih0aGlzLm9uTW90aW9uRXZlbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZnJlZGR5JzpcbiAgICAgICAgdGhpcy5tb3Rpb25IYW5kbGVyID0gbmV3IEZyZWRkeU1vdGlvbkhhbmRsZXIodGhpcy5vbk1vdGlvbkV2ZW50KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3Bvd2VyIGNob3JkJzpcbiAgICAgICAgdGhpcy5tb3Rpb25IYW5kbGVyID0gbmV3IFBvd2VyQ2hvcmRNb3Rpb25IYW5kbGVyKHRoaXMub25Nb3Rpb25FdmVudCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdndWl0YXIgcmlmZic6XG4gICAgICAgIHRoaXMubW90aW9uSGFuZGxlciA9IG5ldyBHdWl0YXJSaWZmTW90aW9uSGFuZGxlcih0aGlzLm9uTW90aW9uRXZlbnQpO1xuICAgICAgICBicmVhaztcblxuICAgIH1cblxuICAgIHRoaXMubW90aW9uSGFuZGxlci5zdGFydCh0aGlzLmV4cGVyaWVuY2UpO1xuICB9XG5cbiAgc3RvcE1vdGlvbih0cmFja05hbWUpIHtcbiAgICBpZiAodGhpcy5tb3Rpb25IYW5kbGVyKSB7XG4gICAgICB0aGlzLm1vdGlvbkhhbmRsZXIuc3RvcCh0aGlzLmV4cGVyaWVuY2UpO1xuICAgICAgdGhpcy5tb3Rpb25IYW5kbGVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGFydFBsYWNlcigpIHtcbiAgICB0aGlzLnBsYWNlci5zdGFydCgoKSA9PiB0aGlzLnN0YXJ0U2NlbmUoKSk7XG4gIH1cblxuICBzdGFydFNjZW5lKCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG5cbiAgICB0aGlzLiR2aWV3RWxlbSA9IGV4cGVyaWVuY2Uudmlldy4kZWw7XG5cbiAgICBpZiAoIXRoaXMucXVlZW5QbGF5ZXIpIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29uZmlnO1xuICAgICAgdGhpcy5xdWVlblBsYXllciA9IG5ldyBRdWVlblBsYXllcihbdGhpcy5hdWRpb091dHB1dF0pO1xuICAgIH1cblxuICAgIGV4cGVyaWVuY2Uudmlldy5tb2RlbCA9IHsgaW5zdHJ1bWVudE5hbWU6IHRoaXMudHJhY2submFtZS50b1VwcGVyQ2FzZSgpIH07XG4gICAgZXhwZXJpZW5jZS52aWV3LnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgZXhwZXJpZW5jZS52aWV3LnJlbmRlcigpO1xuICAgIGV4cGVyaWVuY2Uudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICBleHBlcmllbmNlLnZpZXcuc2V0UHJlUmVuZGVyKGZ1bmN0aW9uKGN0eCwgZHQsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjA2O1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcbiAgICAgIGN0eC5yZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZWVuUGxheWVyLnN0YXJ0VHJhY2soMCwgdGhpcy50cmFjayk7XG4gICAgdGhpcy5zdGFydE1vdGlvbih0aGlzLnRyYWNrLm5hbWUpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgaWYgKHRoaXMubm90ZXMpIHtcbiAgICAgIHRoaXMuc3RhcnRQbGFjZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICAgIGNvbnN0IHRyYWNrQ29uZmlnID0gdGhpcy5jb25maWcudHJhY2tzW3RoaXMuY2xpZW50SW5kZXhdO1xuXG4gICAgICBleHBlcmllbmNlLmF1ZGlvQnVmZmVyTWFuYWdlci5sb2FkRmlsZXModHJhY2tDb25maWcpLnRoZW4oKHRyYWNrKSA9PiB7XG4gICAgICAgIHRoaXMudHJhY2sgPSB0cmFjaztcbiAgICAgICAgdGhpcy5zdGFydFBsYWNlcigpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB0aGlzLnBsYWNlci5zdG9wKCk7XG5cbiAgICBpZiAodGhpcy5xdWVlblBsYXllcilcbiAgICAgIHRoaXMucXVlZW5QbGF5ZXIuc3RvcFRyYWNrKDApO1xuXG5cbiAgICBpZiAodGhpcy4kdmlld0VsZW0pIHtcbiAgICAgIHRoaXMuJHZpZXdFbGVtID0gbnVsbDtcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgICAgdGhpcy5zdG9wTW90aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3Rpb25FdmVudChkYXRhLCBpbnRlbnNpdHkpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnRyaWdnZXJCbGluayhpbnRlbnNpdHkpO1xuICAgIHRoaXMucXVlZW5QbGF5ZXIub25Nb3Rpb25FdmVudCgwLCBkYXRhKTtcbiAgICB0aGlzLmV4cGVyaWVuY2Uuc2VuZCgnbW90aW9uRXZlbnQnLCB0aGlzLmNsaWVudEluZGV4LCBkYXRhKTtcbiAgfVxufVxuIl19