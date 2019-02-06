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

var numBeats = 32;
var numMeasures = 1;

var CoMix = function () {
  function CoMix(experience, config) {
    (0, _classCallCheck3.default)(this, CoMix);

    this.experience = experience;
    this.config = config;

    this.placer = new _Placer2.default(experience);

    this.tracks = config.tracks;
    var numTracks = config.tracks.length;
    this.isPlacing = new Array(numTracks);
    this.trackCutoffs = [0, 0, 0, 0, 0, 0, 0, 0];
    this.trackLayers = [0, 0, 0, 0, 0, 0, 0, 0];

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onTrackCutoff = this.onTrackCutoff.bind(this);
    this.onSwitchLayer = this.onSwitchLayer.bind(this);

    this.metronome = new _Metronome2.default(experience.scheduler, experience.metricScheduler, numBeats * numMeasures, numBeats, this.onMetroBeat);
  }

  (0, _createClass3.default)(CoMix, [{
    key: 'clientEnter',
    value: function clientEnter(client) {
      var _this = this;

      var experience = this.experience;
      var clientIndex = client.index;

      experience.receive(client, 'trackCutoff', this.onTrackCutoff);
      experience.receive(client, 'switchLayer', this.onSwitchLayer);

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

      this.stopTrack(clientIndex);
      experience.stopReceiving(client, 'trackCutoff', this.onTrackCutoff);
      experience.stopReceiving(client, 'switchLayer', this.onSwitchLayer);

      if (this.isPlacing[clientIndex]) {
        this.placer.stop(client);
        this.isPlacing[clientIndex] = false;
      }
    }
  }, {
    key: 'enter',
    value: function enter() {
      var experience = this.experience;
      experience.sharedParams.update('tempo', this.config.tempo);
      experience.enableTempoChange(false);
      experience.ledDisplay.screenOff();

      this.metronome.start();
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.metronome.stop();

      var experience = this.experience;
      experience.sharedParams.update('tempo', this.config.tempo);
      experience.enableTempoChange(true);
    }
  }, {
    key: 'stopTrack',
    value: function stopTrack(step) {}
  }, {
    key: 'stopAllTracks',
    value: function stopAllTracks() {
      for (var i = 0; i < this.tracks.length; i++) {
        this.stopTrack(i);
      }
    }
  }, {
    key: 'onMetroBeat',
    value: function onMetroBeat(measure, beat) {
      var experience = this.experience;
      var numTracks = this.tracks.length;

      // control LED display
      experience.ledDisplay.clearPixels();

      for (var i = 0; i < this.tracks.length; i++) {
        var isPlacing = this.isPlacing[i];

        if (isPlacing) {
          if (beat <= numBeats / 2) experience.ledDisplay.segment(i, '0x' + playerColors[i]);
        } else if (this.trackCutoffs[i] > 0) {
          var ccc = this.colorLuminance(playerColors[i], 0 - (1 - this.trackCutoffs[i]));
          experience.ledDisplay.segment(i, '0x' + ccc);
        }
      }

      // tempo white gradient
      experience.ledDisplay.line(beat, "0xFFFBCB");

      if (beat > 0) {
        experience.ledDisplay.line(beat - 1, "0xC7C49E");
      } else {
        experience.ledDisplay.line(32 - 1, "0xC7C49E");
      }
      if (beat > 1) {
        experience.ledDisplay.line(beat - 2, "0x8A886E");
      }
      if (beat > 2) {
        experience.ledDisplay.line(beat - 3, "0x434235");
      }

      experience.ledDisplay.redraw();
      // control LEDs turning around for each measure ???
      // could also use trackCutoffs and/or trackLayers of the 8 tracks (this.tracks.length = 8)
      console.log(beat);
    }
  }, {
    key: 'mapF',
    value: function mapF(value, istart, istop, ostart, ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }
  }, {
    key: 'colorLuminance',
    value: function colorLuminance(hex, lum) {
      // validate hex string
      hex = String(hex).replace(/[^0-9a-f]/gi, '');

      if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      lum = lum || 0;

      // convert to decimal and change luminosity
      var rgb = '',
          c,
          i;

      for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ('00' + c).substr(c.length);
      }

      return rgb;
    }
  }, {
    key: 'onTrackCutoff',
    value: function onTrackCutoff(track, value) {
      this.trackCutoffs[track] = value;

      var experience = this.experience;
      experience.broadcast('barrel', null, 'trackCutoff', track, value);
    }
  }, {
    key: 'onSwitchLayer',
    value: function onSwitchLayer(track, value) {
      this.trackLayers[track] = value;

      var experience = this.experience;
      experience.broadcast('barrel', null, 'switchLayer', track, value);
    }
  }]);
  return CoMix;
}();

exports.default = CoMix;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvLW1peC5qcyJdLCJuYW1lcyI6WyJwbGF5ZXJDb2xvcnMiLCJjb2xvckNvbmZpZyIsInBsYXllcnMiLCJudW1CZWF0cyIsIm51bU1lYXN1cmVzIiwiQ29NaXgiLCJleHBlcmllbmNlIiwiY29uZmlnIiwicGxhY2VyIiwiUGxhY2VyIiwidHJhY2tzIiwibnVtVHJhY2tzIiwibGVuZ3RoIiwiaXNQbGFjaW5nIiwiQXJyYXkiLCJ0cmFja0N1dG9mZnMiLCJ0cmFja0xheWVycyIsIm9uTWV0cm9CZWF0IiwiYmluZCIsIm9uVHJhY2tDdXRvZmYiLCJvblN3aXRjaExheWVyIiwibWV0cm9ub21lIiwiTWV0cm9ub21lIiwic2NoZWR1bGVyIiwibWV0cmljU2NoZWR1bGVyIiwiY2xpZW50IiwiY2xpZW50SW5kZXgiLCJpbmRleCIsInJlY2VpdmUiLCJzdGFydCIsInN0b3BUcmFjayIsInN0b3BSZWNlaXZpbmciLCJzdG9wIiwic2hhcmVkUGFyYW1zIiwidXBkYXRlIiwidGVtcG8iLCJlbmFibGVUZW1wb0NoYW5nZSIsImxlZERpc3BsYXkiLCJzY3JlZW5PZmYiLCJzdGVwIiwiaSIsIm1lYXN1cmUiLCJiZWF0IiwiY2xlYXJQaXhlbHMiLCJzZWdtZW50IiwiY2NjIiwiY29sb3JMdW1pbmFuY2UiLCJsaW5lIiwicmVkcmF3IiwiY29uc29sZSIsImxvZyIsInZhbHVlIiwiaXN0YXJ0IiwiaXN0b3AiLCJvc3RhcnQiLCJvc3RvcCIsImhleCIsImx1bSIsIlN0cmluZyIsInJlcGxhY2UiLCJyZ2IiLCJjIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJNYXRoIiwicm91bmQiLCJtaW4iLCJtYXgiLCJ0b1N0cmluZyIsInRyYWNrIiwiYnJvYWRjYXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBQ0EsSUFBTUEsZUFBZUMsc0JBQVlDLE9BQWpDOztBQUVBLElBQU1DLFdBQVcsRUFBakI7QUFDQSxJQUFNQyxjQUFjLENBQXBC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SmtCOUMsSyIsImZpbGUiOiJjby1taXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWV0cm9ub21lIGZyb20gJy4uL01ldHJvbm9tZSc7XG5pbXBvcnQgUGxhY2VyIGZyb20gJy4vUGxhY2VyJztcbmltcG9ydCBjb2xvckNvbmZpZyBmcm9tICcuLi8uLi9zaGFyZWQvY29sb3ItY29uZmlnJztcbmNvbnN0IHBsYXllckNvbG9ycyA9IGNvbG9yQ29uZmlnLnBsYXllcnM7XG5cbmNvbnN0IG51bUJlYXRzID0gMzI7XG5jb25zdCBudW1NZWFzdXJlcyA9IDE7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvTWl4IHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSwgY29uZmlnKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIHRoaXMucGxhY2VyID0gbmV3IFBsYWNlcihleHBlcmllbmNlKTtcblxuICAgIHRoaXMudHJhY2tzID0gY29uZmlnLnRyYWNrcztcbiAgICBjb25zdCBudW1UcmFja3MgPSBjb25maWcudHJhY2tzLmxlbmd0aDtcbiAgICB0aGlzLmlzUGxhY2luZyA9IG5ldyBBcnJheShudW1UcmFja3MpO1xuICAgIHRoaXMudHJhY2tDdXRvZmZzID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdO1xuICAgIHRoaXMudHJhY2tMYXllcnMgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG5cbiAgICB0aGlzLm9uTWV0cm9CZWF0ID0gdGhpcy5vbk1ldHJvQmVhdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25UcmFja0N1dG9mZiA9IHRoaXMub25UcmFja0N1dG9mZi5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Td2l0Y2hMYXllciA9IHRoaXMub25Td2l0Y2hMYXllci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5tZXRyb25vbWUgPSBuZXcgTWV0cm9ub21lKGV4cGVyaWVuY2Uuc2NoZWR1bGVyLCBleHBlcmllbmNlLm1ldHJpY1NjaGVkdWxlciwgbnVtQmVhdHMgKiBudW1NZWFzdXJlcywgbnVtQmVhdHMsIHRoaXMub25NZXRyb0JlYXQpO1xuICB9XG5cbiAgY2xpZW50RW50ZXIoY2xpZW50KSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBjbGllbnRJbmRleCA9IGNsaWVudC5pbmRleDtcblxuICAgIGV4cGVyaWVuY2UucmVjZWl2ZShjbGllbnQsICd0cmFja0N1dG9mZicsIHRoaXMub25UcmFja0N1dG9mZik7XG4gICAgZXhwZXJpZW5jZS5yZWNlaXZlKGNsaWVudCwgJ3N3aXRjaExheWVyJywgdGhpcy5vblN3aXRjaExheWVyKTtcblxuICAgIHRoaXMuaXNQbGFjaW5nW2NsaWVudEluZGV4XSA9IHRydWU7XG4gICAgdGhpcy5wbGFjZXIuc3RhcnQoY2xpZW50LCAoKSA9PiB7XG4gICAgICB0aGlzLmlzUGxhY2luZ1tjbGllbnRJbmRleF0gPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsaWVudEV4aXQoY2xpZW50KSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBjbGllbnRJbmRleCA9IGNsaWVudC5pbmRleDtcblxuICAgIHRoaXMuc3RvcFRyYWNrKGNsaWVudEluZGV4KTtcbiAgICBleHBlcmllbmNlLnN0b3BSZWNlaXZpbmcoY2xpZW50LCAndHJhY2tDdXRvZmYnLCB0aGlzLm9uVHJhY2tDdXRvZmYpO1xuICAgIGV4cGVyaWVuY2Uuc3RvcFJlY2VpdmluZyhjbGllbnQsICdzd2l0Y2hMYXllcicsIHRoaXMub25Td2l0Y2hMYXllcik7XG5cbiAgICBpZiAodGhpcy5pc1BsYWNpbmdbY2xpZW50SW5kZXhdKSB7XG4gICAgICB0aGlzLnBsYWNlci5zdG9wKGNsaWVudCk7XG4gICAgICB0aGlzLmlzUGxhY2luZ1tjbGllbnRJbmRleF0gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zLnVwZGF0ZSgndGVtcG8nLCB0aGlzLmNvbmZpZy50ZW1wbyk7XG4gICAgZXhwZXJpZW5jZS5lbmFibGVUZW1wb0NoYW5nZShmYWxzZSk7XG4gICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LnNjcmVlbk9mZigpO1xuICAgIFxuICAgIHRoaXMubWV0cm9ub21lLnN0YXJ0KCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMubWV0cm9ub21lLnN0b3AoKTtcblxuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXMudXBkYXRlKCd0ZW1wbycsIHRoaXMuY29uZmlnLnRlbXBvKTtcbiAgICBleHBlcmllbmNlLmVuYWJsZVRlbXBvQ2hhbmdlKHRydWUpO1xuICB9XG5cbiAgc3RvcFRyYWNrKHN0ZXApIHtcblxuICB9XG5cbiAgc3RvcEFsbFRyYWNrcygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudHJhY2tzLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5zdG9wVHJhY2soaSk7XG4gIH1cblxuICBvbk1ldHJvQmVhdChtZWFzdXJlLCBiZWF0KSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBudW1UcmFja3MgPSB0aGlzLnRyYWNrcy5sZW5ndGg7XG5cbiAgICAvLyBjb250cm9sIExFRCBkaXNwbGF5XG4gICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LmNsZWFyUGl4ZWxzKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudHJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpc1BsYWNpbmcgPSB0aGlzLmlzUGxhY2luZ1tpXTtcblxuICAgICAgaWYgKGlzUGxhY2luZykge1xuICAgICAgICBpZiAoYmVhdCA8PSBudW1CZWF0cyAvIDIpXG4gICAgICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LnNlZ21lbnQoaSwgJzB4JyArIHBsYXllckNvbG9yc1tpXSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudHJhY2tDdXRvZmZzW2ldID4gMCkge1xuICAgICAgICBsZXQgY2NjID0gdGhpcy5jb2xvckx1bWluYW5jZShwbGF5ZXJDb2xvcnNbaV0sIDAgLSAoMSAtIHRoaXMudHJhY2tDdXRvZmZzW2ldKSk7XG4gICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5zZWdtZW50KGksICcweCcgKyBjY2MpO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gdGVtcG8gd2hpdGUgZ3JhZGllbnRcbiAgICBleHBlcmllbmNlLmxlZERpc3BsYXkubGluZShiZWF0LCBcIjB4RkZGQkNCXCIpO1xuXG4gICAgaWYgKGJlYXQgPiAwKSB7XG4gICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkubGluZShiZWF0IC0gMSwgXCIweEM3QzQ5RVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LmxpbmUoMzIgLSAxLCBcIjB4QzdDNDlFXCIpO1xuICAgIH1cbiAgICBpZiAoYmVhdCA+IDEpIHtcbiAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5saW5lKGJlYXQgLSAyLCBcIjB4OEE4ODZFXCIpO1xuICAgIH1cbiAgICBpZiAoYmVhdCA+IDIpIHtcbiAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5saW5lKGJlYXQgLSAzLCBcIjB4NDM0MjM1XCIpO1xuICAgIH1cblxuICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5yZWRyYXcoKTtcbiAgICAvLyBjb250cm9sIExFRHMgdHVybmluZyBhcm91bmQgZm9yIGVhY2ggbWVhc3VyZSA/Pz9cbiAgICAvLyBjb3VsZCBhbHNvIHVzZSB0cmFja0N1dG9mZnMgYW5kL29yIHRyYWNrTGF5ZXJzIG9mIHRoZSA4IHRyYWNrcyAodGhpcy50cmFja3MubGVuZ3RoID0gOClcbiAgICBjb25zb2xlLmxvZyhiZWF0KTtcbiAgfVxuXG4gIG1hcEYodmFsdWUsXG4gICAgaXN0YXJ0LCBpc3RvcCxcbiAgICBvc3RhcnQsIG9zdG9wKSB7XG4gICAgcmV0dXJuIG9zdGFydCArIChvc3RvcCAtIG9zdGFydCkgKiAoKHZhbHVlIC0gaXN0YXJ0KSAvIChpc3RvcCAtIGlzdGFydCkpO1xuICB9XG5cbiAgY29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcbiAgICAvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG4gICAgaGV4ID0gU3RyaW5nKGhleCkucmVwbGFjZSgvW14wLTlhLWZdL2dpLCAnJyk7XG5cbiAgICBpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcbiAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcbiAgICB9XG5cbiAgICBsdW0gPSBsdW0gfHwgMDtcblxuICAgIC8vIGNvbnZlcnQgdG8gZGVjaW1hbCBhbmQgY2hhbmdlIGx1bWlub3NpdHlcbiAgICB2YXIgcmdiID0gJycsIGMsIGk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBjID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpICogMiwgMiksIDE2KTtcbiAgICAgIGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG4gICAgICByZ2IgKz0gKCcwMCcgKyBjKS5zdWJzdHIoYy5sZW5ndGgpO1xuICAgIH1cblxuICAgIHJldHVybiByZ2I7XG4gIH1cblxuICBvblRyYWNrQ3V0b2ZmKHRyYWNrLCB2YWx1ZSkge1xuICAgIHRoaXMudHJhY2tDdXRvZmZzW3RyYWNrXSA9IHZhbHVlO1xuXG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBleHBlcmllbmNlLmJyb2FkY2FzdCgnYmFycmVsJywgbnVsbCwgJ3RyYWNrQ3V0b2ZmJywgdHJhY2ssIHZhbHVlKTtcbiAgfVxuXG4gIG9uU3dpdGNoTGF5ZXIodHJhY2ssIHZhbHVlKSB7XG4gICAgdGhpcy50cmFja0xheWVyc1t0cmFja10gPSB2YWx1ZTtcblxuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5icm9hZGNhc3QoJ2JhcnJlbCcsIG51bGwsICdzd2l0Y2hMYXllcicsIHRyYWNrLCB2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==