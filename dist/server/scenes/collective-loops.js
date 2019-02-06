'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var numBeats = 8;

var SceneCollectiveLoops = function () {
  function SceneCollectiveLoops(experience, config) {
    (0, _classCallCheck3.default)(this, SceneCollectiveLoops);

    this.experience = experience;
    this.config = config;

    this.placer = new _Placer2.default(experience);

    var numSteps = config.numSteps;
    var numNotes = config.notes.length;

    this.stepStates = new Array(numSteps);
    this.isPlacing = new Array(numSteps);

    for (var i = 0; i < numSteps; i++) {
      this.stepStates[i] = new Array(numNotes);
      this.resetStepStates(i);
    }

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onSwitchNote = this.onSwitchNote.bind(this);

    this.metronome = new _Metronome2.default(experience.scheduler, experience.metricScheduler, numSteps, numSteps, this.onMetroBeat);
  }

  (0, _createClass3.default)(SceneCollectiveLoops, [{
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

      this.resetStepStates(clientIndex);
      this.experience.stopReceiving(client, 'switchNote', this.onSwitchNote);

      if (this.isPlacing[clientIndex]) {
        this.placer.stop(client);
        this.isPlacing[clientIndex] = false;
      }
    }
  }, {
    key: 'enter',
    value: function enter() {
      this.experience.ledDisplay.screenOff();

      this.metronome.start();
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.metronome.stop();
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
    key: 'setNoteState',
    value: function setNoteState(step, note, state) {
      var states = this.stepStates[step];
      states[note] = state;
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
      for (var i = 0; i < this.stepStates.length; i++) {
        this.resetStepStates(i);
      }
    }
  }, {
    key: 'onMetroBeat',
    value: function onMetroBeat(measure, beat) {
      console.log('coucou:', measure, beat);

      var states = this.stepStates[beat];

      var isPlacing = this.isPlacing[beat];
      var experience = this.experience;

      experience.ledDisplay.clearPixels();

      // BEAT COUNT FROM 0-7
      var cnt = 0;
      for (var i = 1; i < 32; i += 4) {

        if (this.isPlacing[cnt] === false) {
          var currentColor = '0x' + playerColors[cnt];
          /// color grid
          experience.ledDisplay.line(i, currentColor);
          if (i + 1 < 32) experience.ledDisplay.line(i + 1, currentColor);
        } else {
          /// white grid
          experience.ledDisplay.line(i, "0x808080");
          if (i + 1 < 32) experience.ledDisplay.line(i + 1, "0x808080");
        }
        cnt++;
      }

      // BEAT SELECTOR
      experience.ledDisplay.segment(beat, "0xFFFBCB");

      if (beat === 0) console.log("P P P B B B B B B M M M M M M M M M M M M -", measure);

      // make sure that this LED display doesn't interfere with place blinker
      if (!this.isPlacing[beat]) {
        var str = "";

        for (var _i = 0; _i < states.length; _i++) {
          var state = states[_i];
          var sub = '  ';

          if (state === 1) sub = String.fromCharCode(0x25EF) + ' ';else sub = '. ';

          str += sub;
        }

        console.log(str);
      } else {
        console.log("- - - - - - - - - - - - - - - - - - - - -");
      }

      /// BLINK NEWCOMMERS
      for (var _i2 = 0; _i2 < numBeats; _i2++) {
        var _isPlacing = this.isPlacing[_i2];

        if (_isPlacing) {
          if (beat <= numBeats / 2) {
            var pC = '0x' + playerColors[_i2];
            experience.ledDisplay.segment(_i2, pC);
          }
        }
      }

      experience.ledDisplay.redraw();
    }
  }, {
    key: 'onSwitchNote',
    value: function onSwitchNote(step, note, state) {
      var experience = this.experience;
      experience.broadcast('barrel', null, 'switchNote', step, note, state);
      this.setNoteState(step, note, state);
    }
  }]);
  return SceneCollectiveLoops;
}();

exports.default = SceneCollectiveLoops;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbGxlY3RpdmUtbG9vcHMuanMiXSwibmFtZXMiOlsicGxheWVyQ29sb3JzIiwiY29sb3JDb25maWciLCJwbGF5ZXJzIiwibnVtQmVhdHMiLCJTY2VuZUNvbGxlY3RpdmVMb29wcyIsImV4cGVyaWVuY2UiLCJjb25maWciLCJwbGFjZXIiLCJQbGFjZXIiLCJudW1TdGVwcyIsIm51bU5vdGVzIiwibm90ZXMiLCJsZW5ndGgiLCJzdGVwU3RhdGVzIiwiQXJyYXkiLCJpc1BsYWNpbmciLCJpIiwicmVzZXRTdGVwU3RhdGVzIiwib25NZXRyb0JlYXQiLCJiaW5kIiwib25Td2l0Y2hOb3RlIiwibWV0cm9ub21lIiwiTWV0cm9ub21lIiwic2NoZWR1bGVyIiwibWV0cmljU2NoZWR1bGVyIiwiY2xpZW50IiwiY2xpZW50SW5kZXgiLCJpbmRleCIsInJlY2VpdmUiLCJzdGFydCIsInN0b3BSZWNlaXZpbmciLCJzdG9wIiwibGVkRGlzcGxheSIsInNjcmVlbk9mZiIsInN0ZXAiLCJzdGF0ZXMiLCJub3RlIiwic3RhdGUiLCJ0ZW1wbyIsInNldFRpbWVvdXQiLCJzeW5jIiwibWVhc3VyZSIsImJlYXQiLCJjb25zb2xlIiwibG9nIiwiY2xlYXJQaXhlbHMiLCJjbnQiLCJjdXJyZW50Q29sb3IiLCJsaW5lIiwic2VnbWVudCIsInN0ciIsInN1YiIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsInBDIiwicmVkcmF3IiwiYnJvYWRjYXN0Iiwic2V0Tm90ZVN0YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBQ0EsSUFBTUEsZUFBZUMsc0JBQVlDLE9BQWpDOztBQUVBLElBQU1DLFdBQVcsQ0FBakI7O0lBRXFCQyxvQjtBQUNuQixnQ0FBWUMsVUFBWixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFBQTs7QUFDOUIsU0FBS0QsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7O0FBRUEsU0FBS0Ms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LGlCQUFXbUQsU0FBWCxDQUFxQixRQUFyQixFQUErQixJQUEvQixFQUFxQyxZQUFyQyxFQUFtRHRCLElBQW5ELEVBQXlERSxJQUF6RCxFQUErREMsS0FBL0Q7QUFDQSxXQUFLb0IsWUFBTCxDQUFrQnZCLElBQWxCLEVBQXdCRSxJQUF4QixFQUE4QkMsS0FBOUI7QUFDRDs7Ozs7a0JBOUprQmpDLG9CIiwiZmlsZSI6ImNvbGxlY3RpdmUtbG9vcHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWV0cm9ub21lIGZyb20gJy4uL01ldHJvbm9tZSc7XG5pbXBvcnQgUGxhY2VyIGZyb20gJy4vUGxhY2VyJztcbmltcG9ydCBjb2xvckNvbmZpZyBmcm9tICcuLi8uLi9zaGFyZWQvY29sb3ItY29uZmlnJztcbmNvbnN0IHBsYXllckNvbG9ycyA9IGNvbG9yQ29uZmlnLnBsYXllcnM7XG5cbmNvbnN0IG51bUJlYXRzID0gODtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVDb2xsZWN0aXZlTG9vcHMge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBjb25maWcpIHtcbiAgICB0aGlzLmV4cGVyaWVuY2UgPSBleHBlcmllbmNlO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgdGhpcy5wbGFjZXIgPSBuZXcgUGxhY2VyKGV4cGVyaWVuY2UpO1xuXG4gICAgY29uc3QgbnVtU3RlcHMgPSBjb25maWcubnVtU3RlcHM7XG4gICAgY29uc3QgbnVtTm90ZXMgPSBjb25maWcubm90ZXMubGVuZ3RoO1xuXG4gICAgdGhpcy5zdGVwU3RhdGVzID0gbmV3IEFycmF5KG51bVN0ZXBzKTtcbiAgICB0aGlzLmlzUGxhY2luZyA9IG5ldyBBcnJheShudW1TdGVwcyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVN0ZXBzOyBpKyspIHtcbiAgICAgIHRoaXMuc3RlcFN0YXRlc1tpXSA9IG5ldyBBcnJheShudW1Ob3Rlcyk7XG4gICAgICB0aGlzLnJlc2V0U3RlcFN0YXRlcyhpKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uTWV0cm9CZWF0ID0gdGhpcy5vbk1ldHJvQmVhdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Td2l0Y2hOb3RlID0gdGhpcy5vblN3aXRjaE5vdGUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMubWV0cm9ub21lID0gbmV3IE1ldHJvbm9tZShleHBlcmllbmNlLnNjaGVkdWxlciwgZXhwZXJpZW5jZS5tZXRyaWNTY2hlZHVsZXIsIG51bVN0ZXBzLCBudW1TdGVwcywgdGhpcy5vbk1ldHJvQmVhdCk7XG4gIH1cblxuICBjbGllbnRFbnRlcihjbGllbnQpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gY2xpZW50LmluZGV4O1xuXG4gICAgZXhwZXJpZW5jZS5yZWNlaXZlKGNsaWVudCwgJ3N3aXRjaE5vdGUnLCB0aGlzLm9uU3dpdGNoTm90ZSk7XG5cbiAgICB0aGlzLmlzUGxhY2luZ1tjbGllbnRJbmRleF0gPSB0cnVlO1xuICAgIHRoaXMucGxhY2VyLnN0YXJ0KGNsaWVudCwgKCkgPT4ge1xuICAgICAgdGhpcy5pc1BsYWNpbmdbY2xpZW50SW5kZXhdID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBjbGllbnRFeGl0KGNsaWVudCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgY29uc3QgY2xpZW50SW5kZXggPSBjbGllbnQuaW5kZXg7XG5cbiAgICB0aGlzLnJlc2V0U3RlcFN0YXRlcyhjbGllbnRJbmRleCk7XG4gICAgdGhpcy5leHBlcmllbmNlLnN0b3BSZWNlaXZpbmcoY2xpZW50LCAnc3dpdGNoTm90ZScsIHRoaXMub25Td2l0Y2hOb3RlKTtcblxuICAgIGlmICh0aGlzLmlzUGxhY2luZ1tjbGllbnRJbmRleF0pIHtcbiAgICAgIHRoaXMucGxhY2VyLnN0b3AoY2xpZW50KTtcbiAgICAgIHRoaXMuaXNQbGFjaW5nW2NsaWVudEluZGV4XSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIHRoaXMuZXhwZXJpZW5jZS5sZWREaXNwbGF5LnNjcmVlbk9mZigpO1xuXG4gICAgdGhpcy5tZXRyb25vbWUuc3RhcnQoKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5tZXRyb25vbWUuc3RvcCgpO1xuICB9XG5cbiAgcmVzZXRTdGVwU3RhdGVzKHN0ZXApIHtcbiAgICBjb25zdCBzdGF0ZXMgPSB0aGlzLnN0ZXBTdGF0ZXNbc3RlcF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgc3RhdGVzW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICBzZXROb3RlU3RhdGUoc3RlcCwgbm90ZSwgc3RhdGUpIHtcbiAgICBjb25zdCBzdGF0ZXMgPSB0aGlzLnN0ZXBTdGF0ZXNbc3RlcF07XG4gICAgc3RhdGVzW25vdGVdID0gc3RhdGU7XG4gIH1cblxuICBzZXRUZW1wbyh0ZW1wbykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5tZXRyb25vbWUuc3luYygpLCAwKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGVwU3RhdGVzLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5yZXNldFN0ZXBTdGF0ZXMoaSk7XG4gIH1cblxuICBvbk1ldHJvQmVhdChtZWFzdXJlLCBiZWF0KSB7XG4gICAgY29uc29sZS5sb2coJ2NvdWNvdTonLCBtZWFzdXJlLCBiZWF0KTtcblxuICAgIGNvbnN0IHN0YXRlcyA9IHRoaXMuc3RlcFN0YXRlc1tiZWF0XTtcblxuICAgIGNvbnN0IGlzUGxhY2luZyA9IHRoaXMuaXNQbGFjaW5nW2JlYXRdO1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG5cbiAgICBleHBlcmllbmNlLmxlZERpc3BsYXkuY2xlYXJQaXhlbHMoKTtcblxuICAgIC8vIEJFQVQgQ09VTlQgRlJPTSAwLTdcbiAgICBsZXQgY250ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDMyOyBpICs9IDQpIHtcblxuICAgICAgaWYgKHRoaXMuaXNQbGFjaW5nW2NudF0gPT09IGZhbHNlKSB7XG4gICAgICAgIGxldCBjdXJyZW50Q29sb3IgPSAnMHgnICsgcGxheWVyQ29sb3JzW2NudF07XG4gICAgICAgIC8vLyBjb2xvciBncmlkXG4gICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5saW5lKGksIGN1cnJlbnRDb2xvcik7XG4gICAgICAgIGlmIChpICsgMSA8IDMyKVxuICAgICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5saW5lKGkgKyAxLCBjdXJyZW50Q29sb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8vIHdoaXRlIGdyaWRcbiAgICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LmxpbmUoaSwgXCIweDgwODA4MFwiKTtcbiAgICAgICAgaWYgKGkgKyAxIDwgMzIpXG4gICAgICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LmxpbmUoaSArIDEsIFwiMHg4MDgwODBcIik7XG4gICAgICB9XG4gICAgICBjbnQrKztcbiAgICB9XG5cblxuICAgIC8vIEJFQVQgU0VMRUNUT1JcbiAgICBleHBlcmllbmNlLmxlZERpc3BsYXkuc2VnbWVudChiZWF0LCBcIjB4RkZGQkNCXCIpO1xuXG4gICAgaWYgKGJlYXQgPT09IDApXG4gICAgICBjb25zb2xlLmxvZyhcIlAgUCBQIEIgQiBCIEIgQiBCIE0gTSBNIE0gTSBNIE0gTSBNIE0gTSBNIC1cIiwgbWVhc3VyZSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGlzIExFRCBkaXNwbGF5IGRvZXNuJ3QgaW50ZXJmZXJlIHdpdGggcGxhY2UgYmxpbmtlclxuICAgIGlmICghdGhpcy5pc1BsYWNpbmdbYmVhdF0pIHtcbiAgICAgIGxldCBzdHIgPSBcIlwiO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHN0YXRlc1tpXTtcbiAgICAgICAgbGV0IHN1YiA9ICcgICc7XG5cbiAgICAgICAgaWYgKHN0YXRlID09PSAxKVxuICAgICAgICAgIHN1YiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHgyNUVGKSArICcgJztcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHN1YiA9ICcuICc7XG5cbiAgICAgICAgc3RyICs9IHN1YjtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCItIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLVwiKTtcbiAgICB9XG5cbiAgICAvLy8gQkxJTksgTkVXQ09NTUVSU1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQmVhdHM7IGkrKykge1xuICAgICAgY29uc3QgaXNQbGFjaW5nID0gdGhpcy5pc1BsYWNpbmdbaV07XG5cbiAgICAgIGlmIChpc1BsYWNpbmcpIHtcbiAgICAgICAgaWYgKGJlYXQgPD0gbnVtQmVhdHMgLyAyKSB7XG4gICAgICAgICAgY29uc3QgcEMgPSAnMHgnICsgcGxheWVyQ29sb3JzW2ldO1xuICAgICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5zZWdtZW50KGksIHBDKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiBcbiAgICBleHBlcmllbmNlLmxlZERpc3BsYXkucmVkcmF3KCk7XG5cbiAgfVxuXG4gIG9uU3dpdGNoTm90ZShzdGVwLCBub3RlLCBzdGF0ZSkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5icm9hZGNhc3QoJ2JhcnJlbCcsIG51bGwsICdzd2l0Y2hOb3RlJywgc3RlcCwgbm90ZSwgc3RhdGUpO1xuICAgIHRoaXMuc2V0Tm90ZVN0YXRlKHN0ZXAsIG5vdGUsIHN0YXRlKTtcbiAgfVxufVxuIl19