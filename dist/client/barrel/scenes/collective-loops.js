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

var SceneCollectiveLoops = function () {
  function SceneCollectiveLoops(experience, config) {
    (0, _classCallCheck3.default)(this, SceneCollectiveLoops);

    this.experience = experience;
    this.config = config;
    this.notes = null;

    var numSteps = config.numSteps;
    var numNotes = config.notes.length;

    this.stepStates = new Array(numSteps);

    for (var i = 0; i < numSteps; i++) {
      this.stepStates[i] = new Array(numNotes);
      this.resetStepStates(i);
    }

    this.outputBusses = experience.outputBusses;

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onSwitchNote = this.onSwitchNote.bind(this);
  }

  (0, _createClass3.default)(SceneCollectiveLoops, [{
    key: 'clientEnter',
    value: function clientEnter(index) {}
  }, {
    key: 'clientExit',
    value: function clientExit(index) {
      this.resetStepStates(index);
    }
  }, {
    key: 'enterScene',
    value: function enterScene() {
      var experience = this.experience;
      var numSteps = this.stepStates.length;
      experience.metricScheduler.addMetronome(this.onMetroBeat, numSteps, numSteps, 1, 0, true);
      experience.receive('switchNote', this.onSwitchNote);
    }
  }, {
    key: 'enter',
    value: function enter() {
      var _this = this;

      var experience = this.experience;

      if (this.notes) {
        this.enterScene();
      } else {
        var noteConfig = this.config.notes;
        experience.audioBufferManager.loadFiles(noteConfig).then(function (notes) {
          _this.notes = notes;
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
    key: 'resetStepStates',
    value: function resetStepStates(step) {
      var states = this.stepStates[step];

      for (var i = 0; i < states.length; i++) {
        states[i] = 0;
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var i = 0; i < this.stepStates.length; i++) {
        this.resetStepStates(i);
      }
    }
  }, {
    key: 'onMetroBeat',
    value: function onMetroBeat(measure, beat) {
      var time = audioScheduler.currentTime;
      var notes = this.notes;
      var states = this.stepStates[beat];
      var output = this.outputBusses[beat];

      for (var i = 0; i < states.length; i++) {
        var note = notes[i];
        var state = states[i];

        if (state > 0) {
          var gain = audioContext.createGain();
          gain.connect(output);
          gain.gain.value = (0, _math.decibelToLinear)(note.gain);

          var src = audioContext.createBufferSource();
          src.connect(gain);
          src.buffer = note.buffer;
          src.start(time);
        }
      }
    }
  }, {
    key: 'onSwitchNote',
    value: function onSwitchNote(step, note, state) {
      var states = this.stepStates[step];
      states[note] = state;
    }
  }]);
  return SceneCollectiveLoops;
}();

exports.default = SceneCollectiveLoops;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbGxlY3RpdmUtbG9vcHMuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImF1ZGlvQ29udGV4dCIsImF1ZGlvU2NoZWR1bGVyIiwiYXVkaW8iLCJnZXRTY2hlZHVsZXIiLCJTY2VuZUNvbGxlY3RpdmVMb29wcyIsImV4cGVyaWVuY2UiLCJjb25maWciLCJub3RlcyIsIm51bVN0ZXBzIiwibnVtTm90ZXMiLCJsZW5ndGgiLCJzdGVwU3RhdGVzIiwiQXJyYXkiLCJpIiwicmVzZXRTdGVwU3RhdGVzIiwib3V0cHV0QnVzc2VzIiwib25NZXRyb0JlYXQiLCJiaW5kIiwib25Td2l0Y2hOb3RlIiwiaW5kZXgiLCJtZXRyaWNTY2hlZHVsZXIiLCJhZGRNZXRyb25vbWUiLCJyZWNlaXZlIiwiZW50ZXJTY2VuZSIsIm5vdGVDb25maWciLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJsb2FkRmlsZXMiLCJ0aGVuIiwicmVtb3ZlTWV0cm9ub21lIiwic3RvcFJlY2VpdmluZyIsInN0ZXAiLCJzdGF0ZXMiLCJtZWFzdXJlIiwiYmVhdCIsInRpbWUiLCJjdXJyZW50VGltZSIsIm91dHB1dCIsIm5vdGUiLCJzdGF0ZSIsImdhaW4iLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsInZhbHVlIiwic3JjIiwiY3JlYXRlQnVmZmVyU291cmNlIiwiYnVmZmVyIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLFU7O0FBQ1o7Ozs7OztBQUNBLElBQU1DLGVBQWVELFdBQVdDLFlBQWhDO0FBQ0EsSUFBTUMsaUJBQWlCRixXQUFXRyxLQUFYLENBQWlCQyxZQUFqQixFQUF2Qjs7SUFFcUJDLG9CO0FBQ25CLGdDQUFZQyxVQUFaLEVBQXdCQyxNQUF4QixFQUFnQztBQUFBOztBQUM5QixTQUFLRCxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLEtBQUwsR0FBYSxJQUFiOztBQUVBLFFBQU1DLFdBQVdGLE9B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Q0FBZDs7QUFFQSxZQUFJeUIsUUFBUSxDQUFaLEVBQWU7QUFDYixjQUFNQyxPQUFPdkMsYUFBYXdDLFVBQWIsRUFBYjtBQUNBRCxlQUFLRSxPQUFMLENBQWFMLE1BQWI7QUFDQUcsZUFBS0EsSUFBTCxDQUFVRyxLQUFWLEdBQWtCLDJCQUFnQkwsS0FBS0UsSUFBckIsQ0FBbEI7O0FBRUEsY0FBTUksTUFBTTNDLGFBQWE0QyxrQkFBYixFQUFaO0FBQ0FELGNBQUlGLE9BQUosQ0FBWUYsSUFBWjtBQUNBSSxjQUFJRSxNQUFKLEdBQWFSLEtBQUtRLE1BQWxCO0FBQ0FGLGNBQUlHLEtBQUosQ0FBVVosSUFBVjtBQUNEO0FBQ0Y7QUFDRjs7O2lDQUVZSixJLEVBQU1PLEksRUFBTUMsSyxFQUFPO0FBQzlCLFVBQU1QLFNBQVMsS0FBS3BCLFVBQUwsQ0FBZ0JtQixJQUFoQixDQUFmO0FBQ0FDLGFBQU9NLElBQVAsSUFBZUMsS0FBZjtBQUNEOzs7OztrQkE5RmtCbEMsb0IiLCJmaWxlIjoiY29sbGVjdGl2ZS1sb29wcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IHsgZGVjaWJlbFRvTGluZWFyIH0gZnJvbSAnc291bmR3b3Jrcy91dGlscy9tYXRoJztcbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgYXVkaW9TY2hlZHVsZXIgPSBzb3VuZHdvcmtzLmF1ZGlvLmdldFNjaGVkdWxlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZUNvbGxlY3RpdmVMb29wcyB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGNvbmZpZykge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5ub3RlcyA9IG51bGw7XG5cbiAgICBjb25zdCBudW1TdGVwcyA9IGNvbmZpZy5udW1TdGVwcztcbiAgICBjb25zdCBudW1Ob3RlcyA9IGNvbmZpZy5ub3Rlcy5sZW5ndGg7XG5cbiAgICB0aGlzLnN0ZXBTdGF0ZXMgPSBuZXcgQXJyYXkobnVtU3RlcHMpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TdGVwczsgaSsrKSB7XG4gICAgICB0aGlzLnN0ZXBTdGF0ZXNbaV0gPSBuZXcgQXJyYXkobnVtTm90ZXMpO1xuICAgICAgdGhpcy5yZXNldFN0ZXBTdGF0ZXMoaSk7XG4gICAgfVxuXG4gICAgdGhpcy5vdXRwdXRCdXNzZXMgPSBleHBlcmllbmNlLm91dHB1dEJ1c3NlcztcblxuICAgIHRoaXMub25NZXRyb0JlYXQgPSB0aGlzLm9uTWV0cm9CZWF0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblN3aXRjaE5vdGUgPSB0aGlzLm9uU3dpdGNoTm90ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY2xpZW50RW50ZXIoaW5kZXgpIHt9XG5cbiAgY2xpZW50RXhpdChpbmRleCkge1xuICAgIHRoaXMucmVzZXRTdGVwU3RhdGVzKGluZGV4KTtcbiAgfVxuXG4gIGVudGVyU2NlbmUoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBudW1TdGVwcyA9IHRoaXMuc3RlcFN0YXRlcy5sZW5ndGg7XG4gICAgZXhwZXJpZW5jZS5tZXRyaWNTY2hlZHVsZXIuYWRkTWV0cm9ub21lKHRoaXMub25NZXRyb0JlYXQsIG51bVN0ZXBzLCBudW1TdGVwcywgMSwgMCwgdHJ1ZSk7XG4gICAgZXhwZXJpZW5jZS5yZWNlaXZlKCdzd2l0Y2hOb3RlJywgdGhpcy5vblN3aXRjaE5vdGUpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcblxuICAgIGlmICh0aGlzLm5vdGVzKSB7XG4gICAgICB0aGlzLmVudGVyU2NlbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgbm90ZUNvbmZpZyA9IHRoaXMuY29uZmlnLm5vdGVzO1xuICAgICAgZXhwZXJpZW5jZS5hdWRpb0J1ZmZlck1hbmFnZXIubG9hZEZpbGVzKG5vdGVDb25maWcpLnRoZW4oKG5vdGVzKSA9PiB7XG4gICAgICAgIHRoaXMubm90ZXMgPSBub3RlcztcbiAgICAgICAgdGhpcy5lbnRlclNjZW5lKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBleGl0KCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5tZXRyaWNTY2hlZHVsZXIucmVtb3ZlTWV0cm9ub21lKHRoaXMub25NZXRyb0JlYXQpO1xuICAgIGV4cGVyaWVuY2Uuc3RvcFJlY2VpdmluZygnc3dpdGNoTm90ZScsIHRoaXMub25Td2l0Y2hOb3RlKTtcbiAgfVxuXG4gIHJlc2V0U3RlcFN0YXRlcyhzdGVwKSB7XG4gICAgY29uc3Qgc3RhdGVzID0gdGhpcy5zdGVwU3RhdGVzW3N0ZXBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXRlc1tpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0ZXBTdGF0ZXMubGVuZ3RoOyBpKyspXG4gICAgICB0aGlzLnJlc2V0U3RlcFN0YXRlcyhpKTtcbiAgfVxuXG4gIG9uTWV0cm9CZWF0KG1lYXN1cmUsIGJlYXQpIHtcbiAgICBjb25zdCB0aW1lID0gYXVkaW9TY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gICAgY29uc3Qgbm90ZXMgPSB0aGlzLm5vdGVzO1xuICAgIGNvbnN0IHN0YXRlcyA9IHRoaXMuc3RlcFN0YXRlc1tiZWF0XTtcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLm91dHB1dEJ1c3Nlc1tiZWF0XTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBub3RlID0gbm90ZXNbaV07XG4gICAgICBjb25zdCBzdGF0ZSA9IHN0YXRlc1tpXTtcblxuICAgICAgaWYgKHN0YXRlID4gMCkge1xuICAgICAgICBjb25zdCBnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgZ2Fpbi5jb25uZWN0KG91dHB1dCk7XG4gICAgICAgIGdhaW4uZ2Fpbi52YWx1ZSA9IGRlY2liZWxUb0xpbmVhcihub3RlLmdhaW4pO1xuXG4gICAgICAgIGNvbnN0IHNyYyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgICAgc3JjLmNvbm5lY3QoZ2Fpbik7XG4gICAgICAgIHNyYy5idWZmZXIgPSBub3RlLmJ1ZmZlcjtcbiAgICAgICAgc3JjLnN0YXJ0KHRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uU3dpdGNoTm90ZShzdGVwLCBub3RlLCBzdGF0ZSkge1xuICAgIGNvbnN0IHN0YXRlcyA9IHRoaXMuc3RlcFN0YXRlc1tzdGVwXTtcbiAgICBzdGF0ZXNbbm90ZV0gPSBzdGF0ZTtcbiAgfVxufVxuIl19