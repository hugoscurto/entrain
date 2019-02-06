'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Metronome = require('../Metronome');

var _Metronome2 = _interopRequireDefault(_Metronome);

var _Placer = require('./Placer');

var _Placer2 = _interopRequireDefault(_Placer);

var _colorConfig = require('../../shared/color-config');

var _colorConfig2 = _interopRequireDefault(_colorConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playerColors = _colorConfig2.default.players;

var SceneCo909 = function () {
  function SceneCo909(experience, config) {
    (0, _classCallCheck3.default)(this, SceneCo909);

    this.experience = experience;
    this.config = config;

    this.placer = new _Placer2.default(experience);

    var numSteps = config.numSteps;
    var numInstruments = config.instruments.length;
    var numFeatures = 2;

    this.instrumentSequences = new Array(numInstruments);
    this.instrumentPrevSequences = new Array(numInstruments);
    this.instrumentFeatures = new Array(numInstruments);
    this.isPlacing = new Array(numInstruments);

    for (var i = 0; i < numInstruments; i++) {
      this.instrumentSequences[i] = new Array(numSteps);
      this.resetInstrumentSequence(i);
      this.instrumentPrevSequences[i] = new Array(numSteps);
      this.resetInstrumentPrevSequence(i);
      this.instrumentFeatures[i] = new Array(numFeatures);
    }

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onSwitchNote = this.onSwitchNote.bind(this);

    // display
    this.onButtonTurned = this.onButtonTurned.bind(this);

    this.metronome = new _Metronome2.default(experience.scheduler, experience.metricScheduler, numSteps, numSteps, this.onMetroBeat);
  }

  (0, _createClass3.default)(SceneCo909, [{
    key: 'clientEnter',
    value: function clientEnter(client) {
      var _this = this;

      var experience = this.experience;
      var clientIndex = client.index;

      experience.receive(client, 'switchNote', this.onSwitchNote);

      this.isPlacing[clientIndex] = true;
      this.placer.start(client, function () {
        _this.isPlacing[clientIndex] = false;
      });
    }
  }, {
    key: 'clientExit',
    value: function clientExit(client) {
      var experience = this.experience;
      var clientIndex = client.index;

      // reset sequence of exiting client
      this.resetInstrumentSequence(client.index);

      experience.stopReceiving(client, 'switchNote', this.onSwitchNote);

      if (this.isPlacing[clientIndex]) {
        this.placer.stop(client);
        this.isPlacing[clientIndex] = false;
      }
    }
  }, {
    key: 'enter',
    value: function enter() {
      var experience = this.experience;
      experience.ledDisplay.addListener('buttonTurned', this.onButtonTurned);
      experience.ledDisplay.screenOff();

      this.metronome.start();
    }
  }, {
    key: 'exit',
    value: function exit() {
      var experience = this.experience;
      experience.ledDisplay.removeListener('buttonTurned', this.onButtonTurned);

      this.metronome.stop();
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
    key: 'resetInstrumentPrevSequence',
    value: function resetInstrumentPrevSequence(instrument) {
      var sequence = this.instrumentPrevSequences[instrument];

      for (var i = 0; i < sequence.length; i++) {
        sequence[i] = 0;
      }
    }
  }, {
    key: 'setInstrumentPrevSequence',
    value: function setInstrumentPrevSequence(instrument, sequence) {
      var prevSequence = this.instrumentPrevSequences[instrument];

      for (var i = 0; i < sequence.length; i++) {
        prevSequence[i] = sequence[i];
      }
    }
  }, {
    key: 'setInstrumentFeature',
    value: function setInstrumentFeature(instrument, index, feature) {
      var instrumentFeature = this.instrumentFeatures[instrument];
      instrumentFeature[index] = feature;
    }
  }, {
    key: 'setNoteState',
    value: function setNoteState(instrument, beat, state) {
      var sequence = this.instrumentSequences[instrument];
      sequence[beat] = state;
    }
  }, {
    key: 'setTempo',
    value: function setTempo(tempo) {
      var _this2 = this;

      setTimeout(function () {
        return _this2.metronome.sync();
      }, 0);
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
      var experience = this.experience;
      var instrumentSequences = this.instrumentSequences;
      var instrumentPrevSequences = this.instrumentPrevSequences;
      var instrumentFeatures = this.instrumentFeatures;
      var displaySelector = Math.round(32.0 / 16.0 * beat);
      var numBeats = this.config.numSteps;

      /// compute descriptors (at end of each measure)
      if (beat === 0) {
        for (var inst = 0; inst < instrumentSequences.length; inst++) {
          var sequence = instrumentSequences[inst];
          var prevSequence = instrumentPrevSequences[inst];
          var numDifferentBeats = 0; // cumulated sequence changes ("activity")
          var autoCorr = new Array(sequence.length); // sequence autocorrelation ("groove")
          var normSequence = new Array(sequence.length);

          for (var i = 0; i < sequence.length; i++) {
            var temp = sequence[i] - prevSequence[i];
            if (temp != 0) {
              numDifferentBeats += 1;
            }

            if (sequence[i] != 0) {
              normSequence[i] = 1;
            } else {
              normSequence[i] = 0;
            }
          }

          for (var _i = 0; _i < normSequence.length; _i++) {
            autoCorr[_i] = 0;
            for (var j = 0; j < normSequence.length - _i - 1; j++) {
              autoCorr[_i] += normSequence[j] * normSequence[j + _i];
            }
          }
          autoCorr = autoCorr.slice(1);

          this.setInstrumentFeature(inst, 0, numDifferentBeats);
          this.setInstrumentFeature(inst, 1, autoCorr.indexOf(Math.max.apply(Math, (0, _toConsumableArray3.default)(autoCorr))) + 1);
          console.log(instrumentFeatures[inst]);
          // TODO if (instrumentFeatures[inst] === X) {} 

          this.setInstrumentPrevSequence(inst, sequence);
        }
      }

      /// clear screen
      experience.ledDisplay.clearPixels();

      var simpleGrid = true;
      for (var _inst = 4; _inst < instrumentSequences.length; _inst++) {
        var _sequence = instrumentSequences[_inst];
        for (var _i2 = 0; _i2 < _sequence.length; _i2++) {
          if (_sequence[_i2] === 1 || _sequence[_i2] === 2) {
            simpleGrid = false;
            break;
          }
        }
      }

      //console.log(displaySelector);
      /// Display grid
      if (simpleGrid) {
        for (var _i3 = 0; _i3 < 16; _i3++) {
          var ds = Math.round(32.0 / 16.0 * _i3);
          experience.ledDisplay.line(ds, "0x808080");
        }
      } else {
        // grid for more than 4 players
        for (var _i4 = 0; _i4 < 32; _i4++) {
          experience.ledDisplay.line(_i4, "0x808080");
        }
      }
      ///

      /// show instruments
      for (var _inst2 = 0; _inst2 < instrumentSequences.length; _inst2++) {
        var _sequence2 = instrumentSequences[_inst2];
        for (var _i5 = 0; _i5 < _sequence2.length; _i5++) {
          if (_sequence2[_i5] === 1 || _sequence2[_i5] === 2) {
            var colorCode = '0x' + playerColors[_inst2];
            var _ds = Math.round(32.0 / 16.0 * _i5);

            if (_inst2 <= 3) {
              experience.ledDisplay.ledOnLine(_ds, _inst2 % 4, colorCode);
            } else {
              if (_ds <= 31) experience.ledDisplay.ledOnLine(_ds + 1, _inst2 % 4, colorCode);else experience.ledDisplay.ledOnLine(0, _inst2 % 4, colorCode);
            }
          }
        }
      }
      ///

      ///current beat line
      if (simpleGrid) {
        experience.ledDisplay.line(displaySelector, "0xFFFBCB");
      } else {
        /// double line
        if (displaySelector < 31) {
          experience.ledDisplay.line(displaySelector, "0xFFFBCB");
          experience.ledDisplay.line(displaySelector + 1, "0xFFFBCB");
        } else {
          experience.ledDisplay.line(displaySelector, "0xFFFBCB");
          experience.ledDisplay.line(0, "0xFFFBCB");
        }
      }

      if (beat === 0) console.log("BD SD HH MT PC HT LT CY -", measure);

      var str = "";
      for (var _i6 = 0; _i6 < instrumentSequences.length; _i6++) {
        var isPlacing = this.isPlacing[_i6];
        var _sequence3 = instrumentSequences[_i6];
        var state = _sequence3[beat];
        var char = '.  ';

        if (isPlacing) {
          char = '|  ';
          if (beat <= numBeats / 2) {
            experience.ledDisplay.segment(_i6, '0x' + playerColors[_i6]);
          }
        }

        if (state === 1) char = String.fromCharCode(0x25EF) + '  ';else if (state === 2) char = String.fromCharCode(0x25C9) + '  ';
        str += char;
      }

      /// draw screen
      experience.ledDisplay.redraw();
      console.log(str, beat);
    }
  }, {
    key: 'onSwitchNote',
    value: function onSwitchNote(instrument, beat, state) {
      var experience = this.experience;
      experience.broadcast('barrel', null, 'switchNote', instrument, beat, state);
      this.setNoteState(instrument, beat, state);
    }
  }, {
    key: 'onButtonTurned',
    value: function onButtonTurned(data) {
      console.log("button turned:", data);
    }
  }]);
  return SceneCo909;
}();

exports.default = SceneCo909;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvLTkwOS5qcyJdLCJuYW1lcyI6WyJwbGF5ZXJDb2xvcnMiLCJjb2xvckNvbmZpZyIsInBsYXllcnMiLCJTY2VuZUNvOTA5IiwiZXhwZXJpZW5jZSIsImNvbmZpZyIsInBsYWNlciIsIlBsYWNlciIsIm51bVN0ZXBzIiwibnVtSW5zdHJ1bWVudHMiLCJpbnN0cnVtZW50cyIsImxlbmd0aCIsIm51bUZlYXR1cmVzIiwiaW5zdHJ1bWVudFNlcXVlbmNlcyIsIkFycmF5IiwiaW5zdHJ1bWVudFByZXZTZXF1ZW5jZXMiLCJpbnN0cnVtZW50RmVhdHVyZXMiLCJpc1BsYWNpbmciLCJpIiwicmVzZXRJbnN0cnVtZW50U2VxdWVuY2UiLCJyZXNldEluc3RydW1lbnRQcmV2U2VxdWVuY2UiLCJvbk1ldHJvQmVhdCIsImJpbmQiLCJvblN3aXRjaE5vdGUiLCJvbkJ1dHRvblR1cm5lZCIsIm1ldHJvbm9tZSIsIk1ldHJvbm9tZSIsInNjaGVkdWxlciIsIm1ldHJpY1NjaGVkdWxlciIsImNsaWVudCIsImNsaWVudEluZGV4IiwiaW5kZXgiLCJyZWNlaXZlIiwic3RhcnQiLCJzdG9wUmVjZWl2aW5nIiwic3RvcCIsImxlZERpc3BsYXkiLCJhZGRMaXN0ZW5lciIsInNjcmVlbk9mZiIsInJlbW92ZUxpc3RlbmVyIiwiaW5zdHJ1bWVudCIsInNlcXVlbmNlIiwicHJldlNlcXVlbmNlIiwiZmVhdHVyZSIsImluc3RydW1lbnRGZWF0dXJlIiwiYmVhdCIsInN0YXRlIiwidGVtcG8iLCJzZXRUaW1lb3V0Iiwic3luYyIsIm1lYXN1cmUiLCJkaXNwbGF5U2VsZWN0b3IiLCJNYXRoIiwicm91bmQiLCJudW1CZWF0cyIsImluc3QiLCJudW1EaWZmZXJlbnRCZWF0cyIsImF1dG9Db3JyIiwibm9ybVNlcXVlbmNlIiwidGVtcCIsImoiLCJzbGljZSIsInNldEluc3RydW1lbnRGZWF0dXJlIiwiaW5kZXhPZiIsIm1heCIsImNvbnNvbGUiLCJsb2ciLCJzZXRJbnN0cnVtZW50UHJldlNlcXVlbmNlIiwiY2xlYXJQaXhlbHMiLCJzaW1wbGVHcmlkIiwiZHMiLCJsaW5lIiwiY29sb3JDb2RlIiwibGVkT25MaW5lIiwic3RyIiwiY2hhciIsInNlZ21lbnQiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJyZWRyYXciLCJicm9hZGNhc3QiLCJzZXROb3RlU3RhdGUiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUNBLElBQU1BLGVBQWVDLHNCQUFZQyxPQUFqQzs7SUFFcUJDLFU7QUFDbkIsc0JBQVlDLFVBQVosRUFBd0JDLE1BQXhCLEVBQWdDO0FBQUE7O0FBQzlCLFNBQUtELFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkOztBQUVBLFNBQUtDLE1BQUwsR0FBYyxJQUFJQyxnQkFBSixDQUFXSCxVQUFYLENBQWQ7O0FBRUEsUUFBTUksV0FBV0gsT0FBT0csUUFBeEI7QUFDQSxRQUFNQyxpQkFBaUJKLE9BQU9LLFdBQVAsQ0FBbUJDLE1BQTFDO0FBQ0EsUUFBTUMsY0FBYyxDQUFwQjs7QUFFQSxTQUFLQyxtQkFBTCxHQUEyQixJQUFJQyxLQUFKLENBQVVMLGNBQVYsQ0FBM0I7QUFDQSxTQUFLTSx1QkFBTCxHQUErQixJQUFJRCxLQUFKLENBQVVMLGNBQVYsQ0FBL0I7QUFDQSxTQUFLTyxrQkFBTCxHQUEwQixJQUFJRixLQUFKLENBQVVMLGNBQVYsQ0FBMUI7QUFDQSxTQUFLUSxTQUFMLEdBQWlCLElBQUlILEtBQUosQ0FBVUwsY0FBVixDQUFqQjs7QUFFQSxTQUFLLElBQUlTLElBQUksQ0FBYixFQUFnQkEsSUFBSVQsY0FBcEIsRUFBb0NTLEdBQXBDLEVBQXlDO0FBQ3ZDLFdBQUtMLG1CQUFMLENBQXlCSyxDQUF6QixJQUE4QixJQUFJSixLQUFKLENBQVVOLFFBQVYsQ0FBOUI7QUFDQSxXQUFLVyx1QkFBTCxDQUE2QkQsQ0FBN0I7QUFDQSxXQUFLSCx1QkFBTCxDQUE2QkcsQ0FBN0IsSUFB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UCxDQUFvQixNQUFwQixJQUE4QixJQUFyQyxDQURGLEtBRUssSUFBSWhDLFVBQVUsQ0FBZCxFQUNINkIsT0FBT0UsT0FBT0MsWUFBUCxDQUFvQixNQUFwQixJQUE4QixJQUFyQztBQUNGSixlQUFPQyxJQUFQO0FBQ0Q7O0FBRUQ7QUFDQXZFLGlCQUFXZ0MsVUFBWCxDQUFzQjJDLE1BQXRCO0FBQ0FkLGNBQVFDLEdBQVIsQ0FBWVEsR0FBWixFQUFpQjdCLElBQWpCO0FBQ0Q7OztpQ0FFWUwsVSxFQUFZSyxJLEVBQU1DLEssRUFBTztBQUNwQyxVQUFNMUMsYUFBYSxLQUFLQSxVQUF4QjtBQUNBQSxpQkFBVzRFLFNBQVgsQ0FBcUIsUUFBckIsRUFBK0IsSUFBL0IsRUFBcUMsWUFBckMsRUFBbUR4QyxVQUFuRCxFQUErREssSUFBL0QsRUFBcUVDLEtBQXJFO0FBQ0EsV0FBS21DLFlBQUwsQ0FBa0J6QyxVQUFsQixFQUE4QkssSUFBOUIsRUFBb0NDLEtBQXBDO0FBQ0Q7OzttQ0FFY29DLEksRUFBTTtBQUNuQmpCLGNBQVFDLEdBQVIsQ0FBWSxnQkFBWixFQUE4QmdCLElBQTlCO0FBQ0Q7Ozs7O2tCQXBRa0IvRSxVIiwiZmlsZSI6ImNvLTkwOS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNZXRyb25vbWUgZnJvbSAnLi4vTWV0cm9ub21lJztcbmltcG9ydCBQbGFjZXIgZnJvbSAnLi9QbGFjZXInO1xuaW1wb3J0IGNvbG9yQ29uZmlnIGZyb20gJy4uLy4uL3NoYXJlZC9jb2xvci1jb25maWcnO1xuY29uc3QgcGxheWVyQ29sb3JzID0gY29sb3JDb25maWcucGxheWVycztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVDbzkwOSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGNvbmZpZykge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLnBsYWNlciA9IG5ldyBQbGFjZXIoZXhwZXJpZW5jZSk7XG5cbiAgICBjb25zdCBudW1TdGVwcyA9IGNvbmZpZy5udW1TdGVwcztcbiAgICBjb25zdCBudW1JbnN0cnVtZW50cyA9IGNvbmZpZy5pbnN0cnVtZW50cy5sZW5ndGg7XG4gICAgY29uc3QgbnVtRmVhdHVyZXMgPSAyO1xuXG4gICAgdGhpcy5pbnN0cnVtZW50U2VxdWVuY2VzID0gbmV3IEFycmF5KG51bUluc3RydW1lbnRzKTtcbiAgICB0aGlzLmluc3RydW1lbnRQcmV2U2VxdWVuY2VzID0gbmV3IEFycmF5KG51bUluc3RydW1lbnRzKTtcbiAgICB0aGlzLmluc3RydW1lbnRGZWF0dXJlcyA9IG5ldyBBcnJheShudW1JbnN0cnVtZW50cyk7XG4gICAgdGhpcy5pc1BsYWNpbmcgPSBuZXcgQXJyYXkobnVtSW5zdHJ1bWVudHMpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1JbnN0cnVtZW50czsgaSsrKSB7XG4gICAgICB0aGlzLmluc3RydW1lbnRTZXF1ZW5jZXNbaV0gPSBuZXcgQXJyYXkobnVtU3RlcHMpO1xuICAgICAgdGhpcy5yZXNldEluc3RydW1lbnRTZXF1ZW5jZShpKTtcbiAgICAgIHRoaXMuaW5zdHJ1bWVudFByZXZTZXF1ZW5jZXNbaV0gPSBuZXcgQXJyYXkobnVtU3RlcHMpO1xuICAgICAgdGhpcy5yZXNldEluc3RydW1lbnRQcmV2U2VxdWVuY2UoaSk7XG4gICAgICB0aGlzLmluc3RydW1lbnRGZWF0dXJlc1tpXSA9IG5ldyBBcnJheShudW1GZWF0dXJlcyk7XG4gICAgfVxuXG4gICAgdGhpcy5vbk1ldHJvQmVhdCA9IHRoaXMub25NZXRyb0JlYXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uU3dpdGNoTm90ZSA9IHRoaXMub25Td2l0Y2hOb3RlLmJpbmQodGhpcyk7XG5cbiAgICAvLyBkaXNwbGF5XG4gICAgdGhpcy5vbkJ1dHRvblR1cm5lZCA9IHRoaXMub25CdXR0b25UdXJuZWQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMubWV0cm9ub21lID0gbmV3IE1ldHJvbm9tZShleHBlcmllbmNlLnNjaGVkdWxlciwgZXhwZXJpZW5jZS5tZXRyaWNTY2hlZHVsZXIsIG51bVN0ZXBzLCBudW1TdGVwcywgdGhpcy5vbk1ldHJvQmVhdCk7XG4gIH1cblxuICBjbGllbnRFbnRlcihjbGllbnQpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gY2xpZW50LmluZGV4O1xuXG4gICAgZXhwZXJpZW5jZS5yZWNlaXZlKGNsaWVudCwgJ3N3aXRjaE5vdGUnLCB0aGlzLm9uU3dpdGNoTm90ZSk7XG5cbiAgICB0aGlzLmlzUGxhY2luZ1tjbGllbnRJbmRleF0gPSB0cnVlO1xuICAgIHRoaXMucGxhY2VyLnN0YXJ0KGNsaWVudCwgKCkgPT4ge1xuICAgICAgdGhpcy5pc1BsYWNpbmdbY2xpZW50SW5kZXhdID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBjbGllbnRFeGl0KGNsaWVudCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgY29uc3QgY2xpZW50SW5kZXggPSBjbGllbnQuaW5kZXg7XG5cbiAgICAvLyByZXNldCBzZXF1ZW5jZSBvZiBleGl0aW5nIGNsaWVudFxuICAgIHRoaXMucmVzZXRJbnN0cnVtZW50U2VxdWVuY2UoY2xpZW50LmluZGV4KTtcblxuICAgIGV4cGVyaWVuY2Uuc3RvcFJlY2VpdmluZyhjbGllbnQsICdzd2l0Y2hOb3RlJywgdGhpcy5vblN3aXRjaE5vdGUpO1xuXG4gICAgaWYgKHRoaXMuaXNQbGFjaW5nW2NsaWVudEluZGV4XSkge1xuICAgICAgdGhpcy5wbGFjZXIuc3RvcChjbGllbnQpO1xuICAgICAgdGhpcy5pc1BsYWNpbmdbY2xpZW50SW5kZXhdID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBleHBlcmllbmNlLmxlZERpc3BsYXkuYWRkTGlzdGVuZXIoJ2J1dHRvblR1cm5lZCcsIHRoaXMub25CdXR0b25UdXJuZWQpO1xuICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5zY3JlZW5PZmYoKTtcblxuICAgIHRoaXMubWV0cm9ub21lLnN0YXJ0KCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LnJlbW92ZUxpc3RlbmVyKCdidXR0b25UdXJuZWQnLCB0aGlzLm9uQnV0dG9uVHVybmVkKTtcblxuICAgIHRoaXMubWV0cm9ub21lLnN0b3AoKTtcbiAgfVxuXG4gIHJlc2V0SW5zdHJ1bWVudFNlcXVlbmNlKGluc3RydW1lbnQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZSA9IHRoaXMuaW5zdHJ1bWVudFNlcXVlbmNlc1tpbnN0cnVtZW50XTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VxdWVuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIHNlcXVlbmNlW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICByZXNldEluc3RydW1lbnRQcmV2U2VxdWVuY2UoaW5zdHJ1bWVudCkge1xuICAgIGNvbnN0IHNlcXVlbmNlID0gdGhpcy5pbnN0cnVtZW50UHJldlNlcXVlbmNlc1tpbnN0cnVtZW50XTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VxdWVuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIHNlcXVlbmNlW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICBzZXRJbnN0cnVtZW50UHJldlNlcXVlbmNlKGluc3RydW1lbnQsIHNlcXVlbmNlKSB7XG4gICAgY29uc3QgcHJldlNlcXVlbmNlID0gdGhpcy5pbnN0cnVtZW50UHJldlNlcXVlbmNlc1tpbnN0cnVtZW50XTtcblxuICAgIGZvciAobGV0IGkgPSAwO2kgPCBzZXF1ZW5jZS5sZW5ndGg7IGkrKykge1xuICAgICAgcHJldlNlcXVlbmNlW2ldID0gc2VxdWVuY2VbaV07XG4gICAgfVxuICB9XG5cbiAgc2V0SW5zdHJ1bWVudEZlYXR1cmUoaW5zdHJ1bWVudCwgaW5kZXgsIGZlYXR1cmUpIHtcbiAgICBjb25zdCBpbnN0cnVtZW50RmVhdHVyZSA9IHRoaXMuaW5zdHJ1bWVudEZlYXR1cmVzW2luc3RydW1lbnRdO1xuICAgIGluc3RydW1lbnRGZWF0dXJlW2luZGV4XSA9IGZlYXR1cmU7XG4gIH1cblxuICBzZXROb3RlU3RhdGUoaW5zdHJ1bWVudCwgYmVhdCwgc3RhdGUpIHtcbiAgICBjb25zdCBzZXF1ZW5jZSA9IHRoaXMuaW5zdHJ1bWVudFNlcXVlbmNlc1tpbnN0cnVtZW50XTtcbiAgICBzZXF1ZW5jZVtiZWF0XSA9IHN0YXRlO1xuXG4gIH1cblxuICBzZXRUZW1wbyh0ZW1wbykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5tZXRyb25vbWUuc3luYygpLCAwKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pbnN0cnVtZW50U2VxdWVuY2VzLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5yZXNldEluc3RydW1lbnRTZXF1ZW5jZShpKTtcbiAgfVxuXG4gIG9uTWV0cm9CZWF0KG1lYXN1cmUsIGJlYXQpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGNvbnN0IGluc3RydW1lbnRTZXF1ZW5jZXMgPSB0aGlzLmluc3RydW1lbnRTZXF1ZW5jZXM7XG4gICAgY29uc3QgaW5zdHJ1bWVudFByZXZTZXF1ZW5jZXMgPSB0aGlzLmluc3RydW1lbnRQcmV2U2VxdWVuY2VzO1xuICAgIGNvbnN0IGluc3RydW1lbnRGZWF0dXJlcyA9IHRoaXMuaW5zdHJ1bWVudEZlYXR1cmVzO1xuICAgIGxldCBkaXNwbGF5U2VsZWN0b3IgPSBNYXRoLnJvdW5kKCgzMi4wIC8gMTYuMCkgKiBiZWF0KTtcbiAgICBjb25zdCBudW1CZWF0cyA9IHRoaXMuY29uZmlnLm51bVN0ZXBzO1xuXG4gICAgLy8vIGNvbXB1dGUgZGVzY3JpcHRvcnMgKGF0IGVuZCBvZiBlYWNoIG1lYXN1cmUpXG4gICAgaWYgKGJlYXQgPT09IDApIHtcbiAgICAgIGZvciAobGV0IGluc3QgPSAwOyBpbnN0IDwgaW5zdHJ1bWVudFNlcXVlbmNlcy5sZW5ndGg7IGluc3QrKykgeyAgIFxuICAgICAgICBsZXQgc2VxdWVuY2UgPSBpbnN0cnVtZW50U2VxdWVuY2VzW2luc3RdO1xuICAgICAgICBsZXQgcHJldlNlcXVlbmNlID0gaW5zdHJ1bWVudFByZXZTZXF1ZW5jZXNbaW5zdF07XG4gICAgICAgIGxldCBudW1EaWZmZXJlbnRCZWF0cyA9IDA7IC8vIGN1bXVsYXRlZCBzZXF1ZW5jZSBjaGFuZ2VzIChcImFjdGl2aXR5XCIpXG4gICAgICAgIGxldCBhdXRvQ29yciA9IG5ldyBBcnJheShzZXF1ZW5jZS5sZW5ndGgpOyAvLyBzZXF1ZW5jZSBhdXRvY29ycmVsYXRpb24gKFwiZ3Jvb3ZlXCIpXG4gICAgICAgIGxldCBub3JtU2VxdWVuY2UgPSBuZXcgQXJyYXkoc2VxdWVuY2UubGVuZ3RoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlcXVlbmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHRlbXAgPSBzZXF1ZW5jZVtpXSAtIHByZXZTZXF1ZW5jZVtpXTtcbiAgICAgICAgICBpZiAodGVtcCAhPSAwKSB7bnVtRGlmZmVyZW50QmVhdHMgKz0gMX1cblxuICAgICAgICAgIGlmIChzZXF1ZW5jZVtpXSAhPSAwKSB7bm9ybVNlcXVlbmNlW2ldID0gMX0gZWxzZSB7bm9ybVNlcXVlbmNlW2ldID0gMH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9ybVNlcXVlbmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXV0b0NvcnJbaV0gPSAwO1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9ybVNlcXVlbmNlLmxlbmd0aCAtIGkgLSAxOyBqKyspIHtcbiAgICAgICAgICAgIGF1dG9Db3JyW2ldICs9IG5vcm1TZXF1ZW5jZVtqXSAqIG5vcm1TZXF1ZW5jZVtqK2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdXRvQ29yciA9IGF1dG9Db3JyLnNsaWNlKDEpO1xuXG4gICAgICAgIHRoaXMuc2V0SW5zdHJ1bWVudEZlYXR1cmUoaW5zdCwgMCwgbnVtRGlmZmVyZW50QmVhdHMpO1xuICAgICAgICB0aGlzLnNldEluc3RydW1lbnRGZWF0dXJlKGluc3QsIDEsIGF1dG9Db3JyLmluZGV4T2YoTWF0aC5tYXgoLi4uYXV0b0NvcnIpKSsxKTtcbiAgICAgICAgY29uc29sZS5sb2coaW5zdHJ1bWVudEZlYXR1cmVzW2luc3RdKVxuICAgICAgICAvLyBUT0RPIGlmIChpbnN0cnVtZW50RmVhdHVyZXNbaW5zdF0gPT09IFgpIHt9IFxuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRJbnN0cnVtZW50UHJldlNlcXVlbmNlKGluc3QsIHNlcXVlbmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLy8gY2xlYXIgc2NyZWVuXG4gICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LmNsZWFyUGl4ZWxzKCk7XG5cbiAgICBsZXQgc2ltcGxlR3JpZCA9IHRydWU7XG4gICAgZm9yIChsZXQgaW5zdCA9IDQ7IGluc3QgPCBpbnN0cnVtZW50U2VxdWVuY2VzLmxlbmd0aDsgaW5zdCsrKSB7XG4gICAgICBsZXQgc2VxdWVuY2UgPSBpbnN0cnVtZW50U2VxdWVuY2VzW2luc3RdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXF1ZW5jZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoKHNlcXVlbmNlW2ldID09PSAxKSB8fCAoc2VxdWVuY2VbaV0gPT09IDIpKSB7XG4gICAgICAgICAgc2ltcGxlR3JpZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9jb25zb2xlLmxvZyhkaXNwbGF5U2VsZWN0b3IpO1xuICAgIC8vLyBEaXNwbGF5IGdyaWRcbiAgICBpZiAoc2ltcGxlR3JpZCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgIGxldCBkcyA9IE1hdGgucm91bmQoKDMyLjAgLyAxNi4wKSAqIGkpO1xuICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkubGluZShkcywgXCIweDgwODA4MFwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBncmlkIGZvciBtb3JlIHRoYW4gNCBwbGF5ZXJzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDMyOyBpKyspIHtcbiAgICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LmxpbmUoaSwgXCIweDgwODA4MFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8vXG5cbiAgICAvLy8gc2hvdyBpbnN0cnVtZW50c1xuICAgIGZvciAobGV0IGluc3QgPSAwOyBpbnN0IDwgaW5zdHJ1bWVudFNlcXVlbmNlcy5sZW5ndGg7IGluc3QrKykge1xuICAgICAgbGV0IHNlcXVlbmNlID0gaW5zdHJ1bWVudFNlcXVlbmNlc1tpbnN0XTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VxdWVuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKChzZXF1ZW5jZVtpXSA9PT0gMSkgfHwgKHNlcXVlbmNlW2ldID09PSAyKSkge1xuICAgICAgICAgIGNvbnN0IGNvbG9yQ29kZSA9ICcweCcgKyBwbGF5ZXJDb2xvcnNbaW5zdF07XG4gICAgICAgICAgbGV0IGRzID0gTWF0aC5yb3VuZCgoMzIuMCAvIDE2LjApICogaSk7XG5cbiAgICAgICAgICBpZiAoaW5zdCA8PSAzKSB7XG4gICAgICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkubGVkT25MaW5lKGRzLCBpbnN0ICUgNCwgY29sb3JDb2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRzIDw9IDMxKVxuICAgICAgICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkubGVkT25MaW5lKGRzICsgMSwgaW5zdCAlIDQsIGNvbG9yQ29kZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5sZWRPbkxpbmUoMCwgaW5zdCAlIDQsIGNvbG9yQ29kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vL1xuXG4gICAgLy8vY3VycmVudCBiZWF0IGxpbmVcbiAgICBpZiAoc2ltcGxlR3JpZCkge1xuICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LmxpbmUoZGlzcGxheVNlbGVjdG9yLCBcIjB4RkZGQkNCXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLy8gZG91YmxlIGxpbmVcbiAgICAgIGlmIChkaXNwbGF5U2VsZWN0b3IgPCAzMSkge1xuICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkubGluZShkaXNwbGF5U2VsZWN0b3IsIFwiMHhGRkZCQ0JcIik7XG4gICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5saW5lKGRpc3BsYXlTZWxlY3RvciArIDEsIFwiMHhGRkZCQ0JcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkubGluZShkaXNwbGF5U2VsZWN0b3IsIFwiMHhGRkZCQ0JcIik7XG4gICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5saW5lKDAsIFwiMHhGRkZCQ0JcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJlYXQgPT09IDApXG4gICAgICBjb25zb2xlLmxvZyhcIkJEIFNEIEhIIE1UIFBDIEhUIExUIENZIC1cIiwgbWVhc3VyZSk7XG5cbiAgICBsZXQgc3RyID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluc3RydW1lbnRTZXF1ZW5jZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGlzUGxhY2luZyA9IHRoaXMuaXNQbGFjaW5nW2ldO1xuICAgICAgY29uc3Qgc2VxdWVuY2UgPSBpbnN0cnVtZW50U2VxdWVuY2VzW2ldO1xuICAgICAgY29uc3Qgc3RhdGUgPSBzZXF1ZW5jZVtiZWF0XTtcbiAgICAgIGxldCBjaGFyID0gJy4gICc7XG5cbiAgICAgIGlmIChpc1BsYWNpbmcpIHtcbiAgICAgICAgY2hhciA9ICd8ICAnO1xuICAgICAgICBpZiAoYmVhdCA8PSBudW1CZWF0cyAvIDIpIHtcbiAgICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkuc2VnbWVudChpLCAnMHgnICsgcGxheWVyQ29sb3JzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IDEpXG4gICAgICAgIGNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4MjVFRikgKyAnICAnO1xuICAgICAgZWxzZSBpZiAoc3RhdGUgPT09IDIpXG4gICAgICAgIGNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4MjVDOSkgKyAnICAnO1xuICAgICAgc3RyICs9IGNoYXI7XG4gICAgfVxuXG4gICAgLy8vIGRyYXcgc2NyZWVuXG4gICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LnJlZHJhdygpO1xuICAgIGNvbnNvbGUubG9nKHN0ciwgYmVhdCk7XG4gIH1cblxuICBvblN3aXRjaE5vdGUoaW5zdHJ1bWVudCwgYmVhdCwgc3RhdGUpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGV4cGVyaWVuY2UuYnJvYWRjYXN0KCdiYXJyZWwnLCBudWxsLCAnc3dpdGNoTm90ZScsIGluc3RydW1lbnQsIGJlYXQsIHN0YXRlKTtcbiAgICB0aGlzLnNldE5vdGVTdGF0ZShpbnN0cnVtZW50LCBiZWF0LCBzdGF0ZSk7XG4gIH1cblxuICBvbkJ1dHRvblR1cm5lZChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJidXR0b24gdHVybmVkOlwiLCBkYXRhKTtcbiAgfVxufVxuIl19