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

var _Placer = require('./Placer');

var _Placer2 = _interopRequireDefault(_Placer);

var _LoopPlayer = require('../../shared/LoopPlayer');

var _LoopPlayer2 = _interopRequireDefault(_LoopPlayer);

var _colorConfig = require('../../../shared/color-config');

var _colorConfig2 = _interopRequireDefault(_colorConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = soundworks.client;
var audioContext = soundworks.audioContext;
var audioScheduler = soundworks.audio.getScheduler();
var playerColors = _colorConfig2.default.players;

function clip(value) {
  return Math.max(0, Math.min(1, value));
}

var numDiv = 1024;

var Renderer = function (_soundworks$Canvas2dR) {
  (0, _inherits3.default)(Renderer, _soundworks$Canvas2dR);

  function Renderer(measureDuration) {
    (0, _classCallCheck3.default)(this, Renderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Renderer.__proto__ || (0, _getPrototypeOf2.default)(Renderer)).call(this, 0));

    _this.measureDuration = measureDuration;
    _this.layer = null;
    _this.layerIndex = 0;
    _this.layerPending = false;
    _this.measureStartTime = 0;
    _this.measurePhase = 0;
    return _this;
  }

  (0, _createClass3.default)(Renderer, [{
    key: 'init',
    value: function init() {
      var canvasMin = Math.min(this.canvasWidth, this.canvasHeight);
      this.ringRadius = canvasMin / 3;
      this.innerRadius = 5 * canvasMin / 24 - 10;
      this.width = Math.PI / 128;
      this.lineWidth = canvasMin / 4;
    }
  }, {
    key: 'setLayerIndex',
    value: function setLayerIndex(index) {
      this.layerIndex = index;
      this.layerPending = true;
    }
  }, {
    key: 'setMeasure',
    value: function setMeasure(audioTime, layer, measureCount) {
      this.layer = layer;
      this.layerPending = false;
      this.measureStartTime = audioTime;
      this.loopMeasure = measureCount % layer.length;
      this.measurePhase = 0;
    }
  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'render',
    value: function render(ctx) {
      var measureStartTime = this.measureStartTime;
      var clientIndex = soundworks.client.index;

      if (measureStartTime > 0) {
        var layer = this.layer;
        var color = '#' + playerColors[clientIndex];
        var x0 = this.canvasWidth / 2;
        var y0 = this.canvasHeight / 2;
        var ringRadius = this.ringRadius;
        var innerRadius = this.innerRadius;
        var width = this.width;
        var measureDuration = this.measureDuration;
        var loopMeasure = this.loopMeasure;
        var lastDiv = Math.floor(numDiv * this.measurePhase + 0.5);
        var time = audioScheduler.currentTime;
        var loopDuration = measureDuration * layer.length;
        var measurePhase = (time - measureStartTime) % measureDuration / measureDuration;
        var div = Math.floor(numDiv * measurePhase + 0.5);

        if (div < lastDiv) div += numDiv;

        ctx.save();

        for (var d = lastDiv; d < div; d++) {
          var phi = d % numDiv / numDiv;
          var angle = 2 * Math.PI * (phi - 0.25);
          var loopPhase = (loopMeasure + phi) / layer.length;
          var intensityIndex = Math.floor(loopPhase * layer.intensity.length + 0.5);
          var intensityInDb = layer.intensity[intensityIndex] + 36;
          var intensity = clip(Math.exp(0.3 * intensityInDb));

          ctx.strokeStyle = color;

          ctx.globalAlpha = intensity;
          ctx.lineWidth = this.lineWidth;

          ctx.beginPath();
          ctx.arc(x0, y0, ringRadius, angle - width, angle + width);
          ctx.stroke();
        }

        ctx.globalAlpha = 0.05;

        if (this.layerPending) {
          ctx.fillStyle = color;
        } else {
          ctx.fillStyle = '#000000';
        }

        ctx.beginPath();
        ctx.arc(x0, y0, innerRadius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();

        this.measurePhase = measurePhase;
      }
    }
  }]);
  return Renderer;
}(soundworks.Canvas2dRenderer);

var template = '\n  <canvas class="background flex-middle"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-middle">\n    <p class="big"></p>\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var SceneCoMix = function () {
  function SceneCoMix(experience, config) {
    (0, _classCallCheck3.default)(this, SceneCoMix);

    this.experience = experience;
    this.config = config;

    this.placer = new _Placer2.default(experience);

    this.$viewElem = null;
    this.clientIndex = soundworks.client.index;
    this.track = null;
    this.layerIndex = 0;

    var tempo = config.tempo;
    var tempoUnit = config.tempoUnit;
    this.measureDuration = 60 / (tempo * tempoUnit);

    var trackConfig = config.tracks[this.clientIndex];
    this.renderer = new Renderer(this.measureDuration);

    this.intensity = trackConfig.intensity;
    this.audioOutput = experience.audioOutput;

    this.lastTrackCutoff = -Infinity;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMotionInput = this.onMotionInput.bind(this);
    this.onMeasureStart = this.onMeasureStart.bind(this);
  }

  (0, _createClass3.default)(SceneCoMix, [{
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

      if (!this.loopPlayer) {
        var config = this.config;
        this.loopPlayer = new _LoopPlayer2.default(experience.metricScheduler, [this.audioOutput], 1, config.tempo, config.tempoUnit, 0.05, this.onMeasureStart);
      }

      this.loopPlayer.addLoopTrack(0, this.track.layers);
      this.renderer.setMeasure(0, 0);

      experience.view.model = {};
      experience.view.template = template;
      experience.view.render();
      experience.view.addRenderer(this.renderer);
      experience.view.setPreRender(function (ctx, dt, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#000000';
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        ctx.fill();
        ctx.restore();
      });

      experience.surface.addListener('touchstart', this.onTouchStart);
      experience.motionInput.addListener('accelerationIncludingGravity', this.onMotionInput);
    }
  }, {
    key: 'enter',
    value: function enter() {
      var _this3 = this;

      if (this.notes) {
        this.startPlacer();
      } else {
        var experience = this.experience;
        var trackConfig = this.config.tracks[this.clientIndex];

        experience.audioBufferManager.loadFiles(trackConfig).then(function (track) {
          _this3.track = track;
          _this3.startPlacer();
        });
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      if (this.loopPlayer) this.loopPlayer.removeLoopTrack(0);

      this.placer.stop();

      if (this.$viewElem) {
        this.$viewElem = null;

        var experience = this.experience;
        experience.view.removeRenderer(this.renderer);
        experience.surface.removeListener('touchstart', this.onTouchStart);
        experience.motionInput.removeListener('accelerationIncludingGravity', this.onMotionInput);
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(id, normX, normY) {
      var experience = this.experience;

      var numLayers = this.track.layers.length;
      var layerIndex = (this.layerIndex + 1) % numLayers;

      this.layerIndex = layerIndex;
      this.loopPlayer.setLayer(0, layerIndex);
      this.renderer.setLayerIndex(layerIndex);
      experience.send('switchLayer', this.clientIndex, layerIndex);
    }
  }, {
    key: 'onMotionInput',
    value: function onMotionInput(data) {
      var accX = data[0];
      var accY = data[1];
      var accZ = data[2];
      var pitch = 2 * Math.atan2(accY, Math.sqrt(accZ * accZ + accX * accX)) / Math.PI;
      var roll = -2 * Math.atan2(accX, Math.sqrt(accY * accY + accZ * accZ)) / Math.PI;
      var cutoff = 0.5 + Math.max(-0.8, Math.min(0.8, accZ / 9.81)) / 1.6;

      if (Math.abs(cutoff - this.lastTrackCutoff) > 0.01) {
        var experience = this.experience;

        this.lastTrackCutoff = cutoff;
        this.loopPlayer.setCutoff(0, cutoff);

        experience.send('trackCutoff', this.clientIndex, cutoff);
      }
    }
  }, {
    key: 'onMeasureStart',
    value: function onMeasureStart(audioTime, measureCount) {
      var layer = this.track.layers[this.layerIndex];
      this.renderer.setMeasure(audioTime, layer, measureCount);
    }
  }]);
  return SceneCoMix;
}();

exports.default = SceneCoMix;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvLW1peC5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiY2xpZW50IiwiYXVkaW9Db250ZXh0IiwiYXVkaW9TY2hlZHVsZXIiLCJhdWRpbyIsImdldFNjaGVkdWxlciIsInBsYXllckNvbG9ycyIsImNvbG9yQ29uZmlnIiwicGxheWVycyIsImNsaXAiLCJ2YWx1ZSIsIk1hdGgiLCJtYXgiLCJtaW4iLCJudW1EaXYiLCJSZW5kZXJlciIsIm1lYXN1cmVEdXJhdGlvbiIsImxheWVyIiwibGF5ZXJJbmRleCIsImxheWVyUGVuZGluZyIsIm1lYXN1cmVTdGFydFRpbWUiLCJtZWFzdXJlUGhhc2UiLCJjYW52YXNNaW4iLCJjYW52YXNXaWR0aCIsImNhbnZhc0hlaWdodCIsInJpbmdSYWRpdXMiLCJpbm5lclJhZGl1cyIsIndpZHRoIiwiUEkiLCJsaW5lV2lkdGgiLCJpbmRleCIsImF1ZGlvVGltZSIsIm1lYXN1cmVDb3VudCIsImxvb3BNZWFzdXJlIiwibGVuZ3RoIiwiZHQiLCJjdHgiLCJjbGllbnRJbmRleCIsImNvbG9yIiwieDAiLCJ5MCIsImxhc3REaXYiLCJmbG9vciIsInRpbWUiLCJjdXJyZW50VGltZSIsImxvb3BEdXJhdGlvbiIsImRpdiIsInNhdmUiLCJkIiwicGhpIiwiYW5nbGUiLCJsb29wUGhhc2UiLCJpbnRlbnNpdHlJbmRleCIsImludGVuc2l0eSIsImludGVuc2l0eUluRGIiLCJleHAiLCJzdHJva2VTdHlsZSIsImdsb2JhbEFscGhhIiwiYmVnaW5QYXRoIiwiYXJjIiwic3Ryb2tlIiwiZmlsbFN0eWxlIiwiZmlsbCIsInJlc3RvcmUiLCJDYW52YXMyZFJlbmRlcmVyIiwidGVtcGxhdGUiLCJTY2VuZUNvTWl4IiwiZXhwZXJpZW5jZSIsImNvbmZpZyIsInBsYWNlciIsIlBsYWNlciIsIiR2aWV3RWxlbSIsInRyYWNrIiwidGVtcG8iLCJ0ZW1wb1VuaXQiLCJ0cmFja0NvbmZpZyIsInRyYWNrcyIsInJlbmRlcmVyIiwiYXVkaW9PdXRwdXQiLCJsYXN0VHJhY2tDdXRvZmYiLCJJbmZpbml0eSIsIm9uVG91Y2hTdGFydCIsImJpbmQiLCJvbk1vdGlvbklucHV0Iiwib25NZWFzdXJlU3RhcnQiLCJzdGFydCIsInN0YXJ0U2NlbmUiLCJudW1TdGVwcyIsInZpZXciLCIkZWwiLCJsb29wUGxheWVyIiwiTG9vcFBsYXllciIsIm1ldHJpY1NjaGVkdWxlciIsImFkZExvb3BUcmFjayIsImxheWVycyIsInNldE1lYXN1cmUiLCJtb2RlbCIsInJlbmRlciIsImFkZFJlbmRlcmVyIiwic2V0UHJlUmVuZGVyIiwicmVjdCIsInN1cmZhY2UiLCJhZGRMaXN0ZW5lciIsIm1vdGlvbklucHV0Iiwibm90ZXMiLCJzdGFydFBsYWNlciIsImF1ZGlvQnVmZmVyTWFuYWdlciIsImxvYWRGaWxlcyIsInRoZW4iLCJyZW1vdmVMb29wVHJhY2siLCJzdG9wIiwicmVtb3ZlUmVuZGVyZXIiLCJyZW1vdmVMaXN0ZW5lciIsImlkIiwibm9ybVgiLCJub3JtWSIsIm51bUxheWVycyIsInNldExheWVyIiwic2V0TGF5ZXJJbmRleCIsInNlbmQiLCJkYXRhIiwiYWNjWCIsImFjY1kiLCJhY2NaIiwicGl0Y2giLCJhdGFuMiIsInNxcnQiLCJyb2xsIiwiY3V0b2ZmIiwiYWJzIiwic2V0Q3V0b2ZmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxVOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFDQSxJQUFNQyxTQUFTRCxXQUFXQyxNQUExQjtBQUNBLElBQU1DLGVBQWVGLFdBQVdFLFlBQWhDO0FBQ0EsSUFBTUMsaUJBQWlCSCxXQUFXSSxLQUFYLENBQWlCQyxZQUFqQixFQUF2QjtBQUNBLElBQU1DLGVBQWVDLHNCQUFZQyxPQUFqQzs7QUFFQSxTQUFTQyxJQUFULENBQWNDLEtBQWQsRUFBcUI7QUFDbkIsU0FBT0MsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUQsS0FBS0UsR0FBTCxDQUFTLENBQVQsRUFBWUgsS0FBWixD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YUFBS1ksZUFBTCxHQUF1QmlELE1BQXZCO0FBQ0EsYUFBS3RDLFVBQUwsQ0FBZ0J3QyxTQUFoQixDQUEwQixDQUExQixFQUE2QkYsTUFBN0I7O0FBRUE3RCxtQkFBV29ELElBQVgsQ0FBZ0IsYUFBaEIsRUFBK0IsS0FBS2xGLFdBQXBDLEVBQWlEMkYsTUFBakQ7QUFDRDtBQUNGOzs7bUNBRWNqRyxTLEVBQVdDLFksRUFBYztBQUN0QyxVQUFNZixRQUFRLEtBQUt1RCxLQUFMLENBQVdzQixNQUFYLENBQWtCLEtBQUs1RSxVQUF2QixDQUFkO0FBQ0EsV0FBSzJELFFBQUwsQ0FBY2tCLFVBQWQsQ0FBeUJoRSxTQUF6QixFQUFvQ2QsS0FBcEMsRUFBMkNlLFlBQTNDO0FBQ0Q7Ozs7O2tCQS9Ia0JrQyxVIiwiZmlsZSI6ImNvLW1peC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IFBsYWNlciBmcm9tICcuL1BsYWNlcic7XG5pbXBvcnQgTG9vcFBsYXllciBmcm9tICcuLi8uLi9zaGFyZWQvTG9vcFBsYXllcic7XG5pbXBvcnQgY29sb3JDb25maWcgZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbG9yLWNvbmZpZyc7XG5jb25zdCBjbGllbnQgPSBzb3VuZHdvcmtzLmNsaWVudDtcbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgYXVkaW9TY2hlZHVsZXIgPSBzb3VuZHdvcmtzLmF1ZGlvLmdldFNjaGVkdWxlcigpO1xuY29uc3QgcGxheWVyQ29sb3JzID0gY29sb3JDb25maWcucGxheWVycztcblxuZnVuY3Rpb24gY2xpcCh2YWx1ZSkge1xuICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgdmFsdWUpKTtcbn1cblxuY29uc3QgbnVtRGl2ID0gMTAyNDtcblxuY2xhc3MgUmVuZGVyZXIgZXh0ZW5kcyBzb3VuZHdvcmtzLkNhbnZhczJkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihtZWFzdXJlRHVyYXRpb24pIHtcbiAgICBzdXBlcigwKTtcblxuICAgIHRoaXMubWVhc3VyZUR1cmF0aW9uID0gbWVhc3VyZUR1cmF0aW9uO1xuICAgIHRoaXMubGF5ZXIgPSBudWxsO1xuICAgIHRoaXMubGF5ZXJJbmRleCA9IDA7XG4gICAgdGhpcy5sYXllclBlbmRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm1lYXN1cmVTdGFydFRpbWUgPSAwO1xuICAgIHRoaXMubWVhc3VyZVBoYXNlID0gMDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgY2FudmFzTWluID0gTWF0aC5taW4odGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xuICAgIHRoaXMucmluZ1JhZGl1cyA9IGNhbnZhc01pbiAvIDM7XG4gICAgdGhpcy5pbm5lclJhZGl1cyA9IDUgKiBjYW52YXNNaW4gLyAyNCAtIDEwO1xuICAgIHRoaXMud2lkdGggPSBNYXRoLlBJIC8gMTI4O1xuICAgIHRoaXMubGluZVdpZHRoID0gY2FudmFzTWluIC8gNDtcbiAgfVxuXG4gIHNldExheWVySW5kZXgoaW5kZXgpIHtcbiAgICB0aGlzLmxheWVySW5kZXggPSBpbmRleDtcbiAgICB0aGlzLmxheWVyUGVuZGluZyA9IHRydWU7XG4gIH1cblxuICBzZXRNZWFzdXJlKGF1ZGlvVGltZSwgbGF5ZXIsIG1lYXN1cmVDb3VudCkge1xuICAgIHRoaXMubGF5ZXIgPSBsYXllcjtcbiAgICB0aGlzLmxheWVyUGVuZGluZyA9IGZhbHNlO1xuICAgIHRoaXMubWVhc3VyZVN0YXJ0VGltZSA9IGF1ZGlvVGltZTtcbiAgICB0aGlzLmxvb3BNZWFzdXJlID0gbWVhc3VyZUNvdW50ICUgbGF5ZXIubGVuZ3RoO1xuICAgIHRoaXMubWVhc3VyZVBoYXNlID0gMDtcbiAgfVxuXG4gIHVwZGF0ZShkdCkgeyB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIGNvbnN0IG1lYXN1cmVTdGFydFRpbWUgPSB0aGlzLm1lYXN1cmVTdGFydFRpbWU7XG4gICAgbGV0IGNsaWVudEluZGV4ID0gc291bmR3b3Jrcy5jbGllbnQuaW5kZXg7XG5cbiAgICBpZiAobWVhc3VyZVN0YXJ0VGltZSA+IDApIHtcbiAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5sYXllcjtcbiAgICAgIGNvbnN0IGNvbG9yID0gJyMnICsgcGxheWVyQ29sb3JzW2NsaWVudEluZGV4XTtcbiAgICAgIGNvbnN0IHgwID0gdGhpcy5jYW52YXNXaWR0aCAvIDI7XG4gICAgICBjb25zdCB5MCA9IHRoaXMuY2FudmFzSGVpZ2h0IC8gMjtcbiAgICAgIGNvbnN0IHJpbmdSYWRpdXMgPSB0aGlzLnJpbmdSYWRpdXM7XG4gICAgICBjb25zdCBpbm5lclJhZGl1cyA9IHRoaXMuaW5uZXJSYWRpdXM7XG4gICAgICBjb25zdCB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICBjb25zdCBtZWFzdXJlRHVyYXRpb24gPSB0aGlzLm1lYXN1cmVEdXJhdGlvbjtcbiAgICAgIGNvbnN0IGxvb3BNZWFzdXJlID0gdGhpcy5sb29wTWVhc3VyZTtcbiAgICAgIGNvbnN0IGxhc3REaXYgPSBNYXRoLmZsb29yKG51bURpdiAqIHRoaXMubWVhc3VyZVBoYXNlICsgMC41KTtcbiAgICAgIGNvbnN0IHRpbWUgPSBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgICAgIGNvbnN0IGxvb3BEdXJhdGlvbiA9IG1lYXN1cmVEdXJhdGlvbiAqIGxheWVyLmxlbmd0aDtcbiAgICAgIGNvbnN0IG1lYXN1cmVQaGFzZSA9ICgodGltZSAtIG1lYXN1cmVTdGFydFRpbWUpICUgbWVhc3VyZUR1cmF0aW9uKSAvIG1lYXN1cmVEdXJhdGlvbjtcbiAgICAgIGxldCBkaXYgPSBNYXRoLmZsb29yKG51bURpdiAqIG1lYXN1cmVQaGFzZSArIDAuNSk7XG5cbiAgICAgIGlmIChkaXYgPCBsYXN0RGl2KVxuICAgICAgICBkaXYgKz0gbnVtRGl2O1xuXG4gICAgICBjdHguc2F2ZSgpO1xuXG4gICAgICBmb3IgKGxldCBkID0gbGFzdERpdjsgZCA8IGRpdjsgZCsrKSB7XG4gICAgICAgIGNvbnN0IHBoaSA9IChkICUgbnVtRGl2KSAvIG51bURpdjtcbiAgICAgICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5QSSAqIChwaGkgLSAwLjI1KTtcbiAgICAgICAgY29uc3QgbG9vcFBoYXNlID0gKGxvb3BNZWFzdXJlICsgcGhpKSAvIGxheWVyLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaW50ZW5zaXR5SW5kZXggPSBNYXRoLmZsb29yKGxvb3BQaGFzZSAqIGxheWVyLmludGVuc2l0eS5sZW5ndGggKyAwLjUpO1xuICAgICAgICBjb25zdCBpbnRlbnNpdHlJbkRiID0gbGF5ZXIuaW50ZW5zaXR5W2ludGVuc2l0eUluZGV4XSArIDM2O1xuICAgICAgICBjb25zdCBpbnRlbnNpdHkgPSBjbGlwKE1hdGguZXhwKDAuMyAqIGludGVuc2l0eUluRGIpKTtcblxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcblxuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSBpbnRlbnNpdHk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcblxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoeDAsIHkwLCByaW5nUmFkaXVzLCBhbmdsZSAtIHdpZHRoLCBhbmdsZSArIHdpZHRoKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuXG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjA1O1xuXG4gICAgICBpZiAodGhpcy5sYXllclBlbmRpbmcpIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcbiAgICAgIH1cblxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyh4MCwgeTAsIGlubmVyUmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICBjdHguZmlsbCgpO1xuXG4gICAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgICB0aGlzLm1lYXN1cmVQaGFzZSA9IG1lYXN1cmVQaGFzZTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kIGZsZXgtbWlkZGxlXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtbWlkZGxlXCI+XG4gICAgPHAgY2xhc3M9XCJiaWdcIj48L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVDb01peCB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGNvbmZpZykge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLnBsYWNlciA9IG5ldyBQbGFjZXIoZXhwZXJpZW5jZSk7XG5cbiAgICB0aGlzLiR2aWV3RWxlbSA9IG51bGw7XG4gICAgdGhpcy5jbGllbnRJbmRleCA9IHNvdW5kd29ya3MuY2xpZW50LmluZGV4O1xuICAgIHRoaXMudHJhY2sgPSBudWxsO1xuICAgIHRoaXMubGF5ZXJJbmRleCA9IDA7XG5cbiAgICBjb25zdCB0ZW1wbyA9IGNvbmZpZy50ZW1wbztcbiAgICBjb25zdCB0ZW1wb1VuaXQgPSBjb25maWcudGVtcG9Vbml0O1xuICAgIHRoaXMubWVhc3VyZUR1cmF0aW9uID0gNjAgLyAodGVtcG8gKiB0ZW1wb1VuaXQpO1xuXG4gICAgY29uc3QgdHJhY2tDb25maWcgPSBjb25maWcudHJhY2tzW3RoaXMuY2xpZW50SW5kZXhdO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIodGhpcy5tZWFzdXJlRHVyYXRpb24pO1xuXG4gICAgdGhpcy5pbnRlbnNpdHkgPSB0cmFja0NvbmZpZy5pbnRlbnNpdHk7XG4gICAgdGhpcy5hdWRpb091dHB1dCA9IGV4cGVyaWVuY2UuYXVkaW9PdXRwdXQ7XG5cbiAgICB0aGlzLmxhc3RUcmFja0N1dG9mZiA9IC1JbmZpbml0eTtcblxuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uTW90aW9uSW5wdXQgPSB0aGlzLm9uTW90aW9uSW5wdXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uTWVhc3VyZVN0YXJ0ID0gdGhpcy5vbk1lYXN1cmVTdGFydC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc3RhcnRQbGFjZXIoKSB7XG4gICAgdGhpcy5wbGFjZXIuc3RhcnQoKCkgPT4gdGhpcy5zdGFydFNjZW5lKCkpO1xuICB9XG5cbiAgc3RhcnRTY2VuZSgpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGNvbnN0IG51bVN0ZXBzID0gdGhpcy5jb25maWcubnVtU3RlcHM7XG5cbiAgICB0aGlzLiR2aWV3RWxlbSA9IGV4cGVyaWVuY2Uudmlldy4kZWw7XG5cbiAgICBpZiAoIXRoaXMubG9vcFBsYXllcikge1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICB0aGlzLmxvb3BQbGF5ZXIgPSBuZXcgTG9vcFBsYXllcihleHBlcmllbmNlLm1ldHJpY1NjaGVkdWxlciwgW3RoaXMuYXVkaW9PdXRwdXRdLCAxLCBjb25maWcudGVtcG8sIGNvbmZpZy50ZW1wb1VuaXQsIDAuMDUsIHRoaXMub25NZWFzdXJlU3RhcnQpO1xuICAgIH1cblxuICAgIHRoaXMubG9vcFBsYXllci5hZGRMb29wVHJhY2soMCwgdGhpcy50cmFjay5sYXllcnMpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0TWVhc3VyZSgwLCAwKTtcblxuICAgIGV4cGVyaWVuY2Uudmlldy5tb2RlbCA9IHt9O1xuICAgIGV4cGVyaWVuY2Uudmlldy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIGV4cGVyaWVuY2Uudmlldy5yZW5kZXIoKTtcbiAgICBleHBlcmllbmNlLnZpZXcuYWRkUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG4gICAgZXhwZXJpZW5jZS52aWV3LnNldFByZVJlbmRlcihmdW5jdGlvbiAoY3R4LCBkdCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuMDU7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuICAgICAgY3R4LnJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGV4cGVyaWVuY2Uuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICBleHBlcmllbmNlLm1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgdGhpcy5vbk1vdGlvbklucHV0KTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIGlmICh0aGlzLm5vdGVzKSB7XG4gICAgICB0aGlzLnN0YXJ0UGxhY2VyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgICBjb25zdCB0cmFja0NvbmZpZyA9IHRoaXMuY29uZmlnLnRyYWNrc1t0aGlzLmNsaWVudEluZGV4XTtcbiAgICAgIFxuICAgICAgZXhwZXJpZW5jZS5hdWRpb0J1ZmZlck1hbmFnZXIubG9hZEZpbGVzKHRyYWNrQ29uZmlnKS50aGVuKCh0cmFjaykgPT4ge1xuICAgICAgICB0aGlzLnRyYWNrID0gdHJhY2s7XG4gICAgICAgIHRoaXMuc3RhcnRQbGFjZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgaWYgKHRoaXMubG9vcFBsYXllcilcbiAgICAgIHRoaXMubG9vcFBsYXllci5yZW1vdmVMb29wVHJhY2soMCk7XG5cbiAgICB0aGlzLnBsYWNlci5zdG9wKCk7XG5cbiAgICBpZiAodGhpcy4kdmlld0VsZW0pIHtcbiAgICAgIHRoaXMuJHZpZXdFbGVtID0gbnVsbDtcblxuICAgICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICAgIGV4cGVyaWVuY2Uudmlldy5yZW1vdmVSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICAgIGV4cGVyaWVuY2Uuc3VyZmFjZS5yZW1vdmVMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICAgIGV4cGVyaWVuY2UubW90aW9uSW5wdXQucmVtb3ZlTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCB0aGlzLm9uTW90aW9uSW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIG9uVG91Y2hTdGFydChpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcblxuICAgIGNvbnN0IG51bUxheWVycyA9IHRoaXMudHJhY2subGF5ZXJzLmxlbmd0aDtcbiAgICBjb25zdCBsYXllckluZGV4ID0gKHRoaXMubGF5ZXJJbmRleCArIDEpICUgbnVtTGF5ZXJzO1xuXG4gICAgdGhpcy5sYXllckluZGV4ID0gbGF5ZXJJbmRleDtcbiAgICB0aGlzLmxvb3BQbGF5ZXIuc2V0TGF5ZXIoMCwgbGF5ZXJJbmRleCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRMYXllckluZGV4KGxheWVySW5kZXgpO1xuICAgIGV4cGVyaWVuY2Uuc2VuZCgnc3dpdGNoTGF5ZXInLCB0aGlzLmNsaWVudEluZGV4LCBsYXllckluZGV4KTtcbiAgfVxuXG4gIG9uTW90aW9uSW5wdXQoZGF0YSkge1xuICAgIGNvbnN0IGFjY1ggPSBkYXRhWzBdO1xuICAgIGNvbnN0IGFjY1kgPSBkYXRhWzFdO1xuICAgIGNvbnN0IGFjY1ogPSBkYXRhWzJdO1xuICAgIGNvbnN0IHBpdGNoID0gMiAqIE1hdGguYXRhbjIoYWNjWSwgTWF0aC5zcXJ0KGFjY1ogKiBhY2NaICsgYWNjWCAqIGFjY1gpKSAvIE1hdGguUEk7XG4gICAgY29uc3Qgcm9sbCA9IC0yICogTWF0aC5hdGFuMihhY2NYLCBNYXRoLnNxcnQoYWNjWSAqIGFjY1kgKyBhY2NaICogYWNjWikpIC8gTWF0aC5QSTtcbiAgICBjb25zdCBjdXRvZmYgPSAwLjUgKyBNYXRoLm1heCgtMC44LCBNYXRoLm1pbigwLjgsIChhY2NaIC8gOS44MSkpKSAvIDEuNjtcblxuICAgIGlmIChNYXRoLmFicyhjdXRvZmYgLSB0aGlzLmxhc3RUcmFja0N1dG9mZikgPiAwLjAxKSB7XG4gICAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuXG4gICAgICB0aGlzLmxhc3RUcmFja0N1dG9mZiA9IGN1dG9mZjtcbiAgICAgIHRoaXMubG9vcFBsYXllci5zZXRDdXRvZmYoMCwgY3V0b2ZmKTtcblxuICAgICAgZXhwZXJpZW5jZS5zZW5kKCd0cmFja0N1dG9mZicsIHRoaXMuY2xpZW50SW5kZXgsIGN1dG9mZik7XG4gICAgfVxuICB9XG5cbiAgb25NZWFzdXJlU3RhcnQoYXVkaW9UaW1lLCBtZWFzdXJlQ291bnQpIHtcbiAgICBjb25zdCBsYXllciA9IHRoaXMudHJhY2subGF5ZXJzW3RoaXMubGF5ZXJJbmRleF07XG4gICAgdGhpcy5yZW5kZXJlci5zZXRNZWFzdXJlKGF1ZGlvVGltZSwgbGF5ZXIsIG1lYXN1cmVDb3VudCk7XG4gIH1cbn1cbiJdfQ==