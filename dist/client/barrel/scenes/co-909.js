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

var _math = require('soundworks/utils/math');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioContext = soundworks.audioContext;
var audioScheduler = soundworks.audio.getScheduler();

var SceneCo909 = function () {
  function SceneCo909(experience, config) {
    (0, _classCallCheck3.default)(this, SceneCo909);

    this.experience = experience;
    this.config = config;
    this.instruments = null;

    var numSteps = config.numSteps;
    var numInstruments = config.instruments.length;

    this.instrumentSequences = new Array(numInstruments);

    for (var i = 0; i < numInstruments; i++) {
      this.instrumentSequences[i] = new Array(numSteps);
      this.resetInstrumentSequence(i);
    }

    this.outputBusses = experience.outputBusses;

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onSwitchNote = this.onSwitchNote.bind(this);
  }

  (0, _createClass3.default)(SceneCo909, [{
    key: 'clientEnter',
    value: function clientEnter(index) {}
  }, {
    key: 'clientExit',
    value: function clientExit(index) {
      this.resetInstrumentSequence(index);
    }
  }, {
    key: 'enterScene',
    value: function enterScene() {
      var experience = this.experience;
      var numSteps = this.config.numSteps;
      experience.metricScheduler.addMetronome(this.onMetroBeat, numSteps, numSteps, 1, 0, true);
      experience.receive('switchNote', this.onSwitchNote);
    }
  }, {
    key: 'enter',
    value: function enter() {
      var _this = this;

      var experience = this.experience;

      if (this.instruments) {
        this.enterScene();
      } else {
        var instrumentConfig = this.config.instruments;
        experience.audioBufferManager.loadFiles(instrumentConfig).then(function (instruments) {
          _this.instruments = instruments;
          _this.enterScene();
        });
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      var experience = this.experience;
      experience.metricScheduler.removeMetronome(this.onMetroBeat);
      experience.stopReceiving('switchNote', this.onSwitchNote);
    }
  }, {
    key: 'resetInstrumentSequence',
    value: function resetInstrumentSequence(instrument) {
      var sequence = this.instrumentSequences[instrument];

      for (var i = 0; i < sequence.length; i++) {
        sequence[i] = 0;
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var i = 0; i < this.instrumentSequences.length; i++) {
        this.resetInstrumentSequence(i);
      }
    }
  }, {
    key: 'onMetroBeat',
    value: function onMetroBeat(measure, beat) {
      var time = audioScheduler.currentTime;

      for (var i = 0; i < this.instrumentSequences.length; i++) {
        var instrument = this.instruments[i];
        var sequence = this.instrumentSequences[i];
        var state = sequence[beat];

        if (state > 0) {
          var layer = instrument.layers[state - 1];

          var gain = audioContext.createGain();
          gain.connect(this.outputBusses[i]);
          gain.gain.value = (0, _math.decibelToLinear)(layer.gain);

          var src = audioContext.createBufferSource();
          src.connect(gain);
          src.buffer = layer.buffer;
          src.start(time);
        }
      }
    }
  }, {
    key: 'onSwitchNote',
    value: function onSwitchNote(instrument, beat, state) {
      var sequence = this.instrumentSequences[instrument];
      sequence[beat] = state;
    }
  }]);
  return SceneCo909;
}();

exports.default = SceneCo909;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvLTkwOS5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiYXVkaW9Db250ZXh0IiwiYXVkaW9TY2hlZHVsZXIiLCJhdWRpbyIsImdldFNjaGVkdWxlciIsIlNjZW5lQ285MDkiLCJleHBlcmllbmNlIiwiY29uZmlnIiwiaW5zdHJ1bWVudHMiLCJudW1TdGVwcyIsIm51bUluc3RydW1lbnRzIiwibGVuZ3RoIiwiaW5zdHJ1bWVudFNlcXVlbmNlcyIsIkFycmF5IiwiaSIsInJlc2V0SW5zdHJ1bWVudFNlcXVlbmNlIiwib3V0cHV0QnVzc2VzIiwib25NZXRyb0JlYXQiLCJiaW5kIiwib25Td2l0Y2hOb3RlIiwiaW5kZXgiLCJtZXRyaWNTY2hlZHVsZXIiLCJhZGRNZXRyb25vbWUiLCJyZWNlaXZlIiwiZW50ZXJTY2VuZSIsImluc3RydW1lbnRDb25maWciLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJsb2FkRmlsZXMiLCJ0aGVuIiwicmVtb3ZlTWV0cm9ub21lIiwic3RvcFJlY2VpdmluZyIsImluc3RydW1lbnQiLCJzZXF1ZW5jZSIsIm1lYXN1cmUiLCJiZWF0IiwidGltZSIsImN1cnJlbnRUaW1lIiwic3RhdGUiLCJsYXllciIsImxheWVycyIsImdhaW4iLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsInZhbHVlIiwic3JjIiwiY3JlYXRlQnVmZmVyU291cmNlIiwiYnVmZmVyIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLFU7O0FBQ1o7Ozs7OztBQUNBLElBQU1DLGVBQWVELFdBQVdDLFlBQWhDO0FBQ0EsSUFBTUMsaUJBQWlCRixXQUFXRyxLQUFYLENBQWlCQyxZQUFqQixFQUF2Qjs7SUFFcUJDLFU7QUFDbkIsc0JBQVlDLFVBQVosRUFBd0JDLE1BQXhCLEVBQWdDO0FBQUE7O0FBQzlCLFNBQUtELFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixJ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QSxZQUFJRyxRQUFRLENBQVosRUFBZTtBQUNiLGNBQU1DLFFBQVFQLFdBQVdRLE1BQVgsQ0FBa0JGLFFBQVEsQ0FBMUIsQ0FBZDs7QUFFQSxjQUFNRyxPQUFPdkMsYUFBYXdDLFVBQWIsRUFBYjtBQUNBRCxlQUFLRSxPQUFMLENBQWEsS0FBSzFCLFlBQUwsQ0FBa0JGLENBQWxCLENBQWI7QUFDQTBCLGVBQUtBLElBQUwsQ0FBVUcsS0FBVixHQUFrQiwyQkFBZ0JMLE1BQU1FLElBQXRCLENBQWxCOztBQUVBLGNBQU1JLE1BQU0zQyxhQUFhNEMsa0JBQWIsRUFBWjtBQUNBRCxjQUFJRixPQUFKLENBQVlGLElBQVo7QUFDQUksY0FBSUUsTUFBSixHQUFhUixNQUFNUSxNQUFuQjtBQUNBRixjQUFJRyxLQUFKLENBQVVaLElBQVY7QUFDRDtBQUNGO0FBQ0Y7OztpQ0FFWUosVSxFQUFZRyxJLEVBQU1HLEssRUFBTztBQUNwQyxVQUFNTCxXQUFXLEtBQUtwQixtQkFBTCxDQUF5Qm1CLFVBQXpCLENBQWpCO0FBQ0FDLGVBQVNFLElBQVQsSUFBaUJHLEtBQWpCO0FBQ0Q7Ozs7O2tCQTlGa0JoQyxVIiwiZmlsZSI6ImNvLTkwOS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IHsgZGVjaWJlbFRvTGluZWFyIH0gZnJvbSAnc291bmR3b3Jrcy91dGlscy9tYXRoJztcbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgYXVkaW9TY2hlZHVsZXIgPSBzb3VuZHdvcmtzLmF1ZGlvLmdldFNjaGVkdWxlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZUNvOTA5IHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSwgY29uZmlnKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmluc3RydW1lbnRzID0gbnVsbDtcblxuICAgIGNvbnN0IG51bVN0ZXBzID0gY29uZmlnLm51bVN0ZXBzO1xuICAgIGNvbnN0IG51bUluc3RydW1lbnRzID0gY29uZmlnLmluc3RydW1lbnRzLmxlbmd0aDtcblxuICAgIHRoaXMuaW5zdHJ1bWVudFNlcXVlbmNlcyA9IG5ldyBBcnJheShudW1JbnN0cnVtZW50cyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUluc3RydW1lbnRzOyBpKyspIHtcbiAgICAgIHRoaXMuaW5zdHJ1bWVudFNlcXVlbmNlc1tpXSA9IG5ldyBBcnJheShudW1TdGVwcyk7XG4gICAgICB0aGlzLnJlc2V0SW5zdHJ1bWVudFNlcXVlbmNlKGkpO1xuICAgIH1cblxuICAgIHRoaXMub3V0cHV0QnVzc2VzID0gZXhwZXJpZW5jZS5vdXRwdXRCdXNzZXM7XG5cbiAgICB0aGlzLm9uTWV0cm9CZWF0ID0gdGhpcy5vbk1ldHJvQmVhdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Td2l0Y2hOb3RlID0gdGhpcy5vblN3aXRjaE5vdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNsaWVudEVudGVyKGluZGV4KSB7fVxuXG4gIGNsaWVudEV4aXQoaW5kZXgpIHtcbiAgICB0aGlzLnJlc2V0SW5zdHJ1bWVudFNlcXVlbmNlKGluZGV4KTtcbiAgfVxuXG4gIGVudGVyU2NlbmUoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBudW1TdGVwcyA9IHRoaXMuY29uZmlnLm51bVN0ZXBzO1xuICAgIGV4cGVyaWVuY2UubWV0cmljU2NoZWR1bGVyLmFkZE1ldHJvbm9tZSh0aGlzLm9uTWV0cm9CZWF0LCBudW1TdGVwcywgbnVtU3RlcHMsIDEsIDAsIHRydWUpO1xuICAgIGV4cGVyaWVuY2UucmVjZWl2ZSgnc3dpdGNoTm90ZScsIHRoaXMub25Td2l0Y2hOb3RlKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG5cbiAgICBpZiAodGhpcy5pbnN0cnVtZW50cykge1xuICAgICAgdGhpcy5lbnRlclNjZW5lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluc3RydW1lbnRDb25maWcgPSB0aGlzLmNvbmZpZy5pbnN0cnVtZW50cztcbiAgICAgIGV4cGVyaWVuY2UuYXVkaW9CdWZmZXJNYW5hZ2VyLmxvYWRGaWxlcyhpbnN0cnVtZW50Q29uZmlnKS50aGVuKChpbnN0cnVtZW50cykgPT4ge1xuICAgICAgICB0aGlzLmluc3RydW1lbnRzID0gaW5zdHJ1bWVudHM7XG4gICAgICAgIHRoaXMuZW50ZXJTY2VuZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGV4cGVyaWVuY2UubWV0cmljU2NoZWR1bGVyLnJlbW92ZU1ldHJvbm9tZSh0aGlzLm9uTWV0cm9CZWF0KTtcbiAgICBleHBlcmllbmNlLnN0b3BSZWNlaXZpbmcoJ3N3aXRjaE5vdGUnLCB0aGlzLm9uU3dpdGNoTm90ZSk7XG4gIH1cblxuICByZXNldEluc3RydW1lbnRTZXF1ZW5jZShpbnN0cnVtZW50KSB7XG4gICAgY29uc3Qgc2VxdWVuY2UgPSB0aGlzLmluc3RydW1lbnRTZXF1ZW5jZXNbaW5zdHJ1bWVudF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlcXVlbmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzZXF1ZW5jZVtpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmluc3RydW1lbnRTZXF1ZW5jZXMubGVuZ3RoOyBpKyspXG4gICAgICB0aGlzLnJlc2V0SW5zdHJ1bWVudFNlcXVlbmNlKGkpO1xuICB9XG5cbiAgb25NZXRyb0JlYXQobWVhc3VyZSwgYmVhdCkge1xuICAgIGNvbnN0IHRpbWUgPSBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pbnN0cnVtZW50U2VxdWVuY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbnN0cnVtZW50ID0gdGhpcy5pbnN0cnVtZW50c1tpXTtcbiAgICAgIGNvbnN0IHNlcXVlbmNlID0gdGhpcy5pbnN0cnVtZW50U2VxdWVuY2VzW2ldO1xuICAgICAgY29uc3Qgc3RhdGUgPSBzZXF1ZW5jZVtiZWF0XTtcblxuICAgICAgaWYgKHN0YXRlID4gMCkge1xuICAgICAgICBjb25zdCBsYXllciA9IGluc3RydW1lbnQubGF5ZXJzW3N0YXRlIC0gMV07XG5cbiAgICAgICAgY29uc3QgZ2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7IFxuICAgICAgICBnYWluLmNvbm5lY3QodGhpcy5vdXRwdXRCdXNzZXNbaV0pO1xuICAgICAgICBnYWluLmdhaW4udmFsdWUgPSBkZWNpYmVsVG9MaW5lYXIobGF5ZXIuZ2Fpbik7XG5cbiAgICAgICAgY29uc3Qgc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICBzcmMuY29ubmVjdChnYWluKTtcbiAgICAgICAgc3JjLmJ1ZmZlciA9IGxheWVyLmJ1ZmZlcjtcbiAgICAgICAgc3JjLnN0YXJ0KHRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uU3dpdGNoTm90ZShpbnN0cnVtZW50LCBiZWF0LCBzdGF0ZSkge1xuICAgIGNvbnN0IHNlcXVlbmNlID0gdGhpcy5pbnN0cnVtZW50U2VxdWVuY2VzW2luc3RydW1lbnRdO1xuICAgIHNlcXVlbmNlW2JlYXRdID0gc3RhdGU7XG4gIH1cbn1cbiJdfQ==