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
var numMeasures = 1;

var SceneWwryR = function () {
  function SceneWwryR(experience, config) {
    (0, _classCallCheck3.default)(this, SceneWwryR);

    this.experience = experience;
    this.config = config;

    this.placer = new _Placer2.default(experience);

    this.tracks = config.tracks;
    var numTracks = config.tracks.length;
    this.isPlacing = new Array(numTracks);
    this.trackCutoffs = [0, 0, 0, 0, 0, 0, 0, 0];
    this.trackLayers = [0, 0, 0, 0, 0, 0, 0, 0];

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onMotionEvent = this.onMotionEvent.bind(this);

    this.metronome = new _Metronome2.default(experience.scheduler, experience.metricScheduler, numBeats * numMeasures, numBeats, this.onMetroBeat);
  }

  (0, _createClass3.default)(SceneWwryR, [{
    key: 'clientEnter',
    value: function clientEnter(client) {
      var _this = this;

      var experience = this.experience;
      var clientIndex = client.index;

      experience.receive(client, 'motionEvent', this.onMotionEvent);

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

      experience.stopReceiving(client, 'motionEvent', this.onMotionEvent);

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
      var experience = this.experience;
      this.metronome.stop();
      experience.sharedParams.update('tempo', this.config.tempo);
      experience.enableTempoChange(true);
    }
  }, {
    key: 'onMetroBeat',
    value: function onMetroBeat(measure, beat) {
      // control LEDs turning around for each measure ???
      // could also use trackCutoffs and/or trackLayers of the 8 tracks (this.tracks.length = 8)

      var experience = this.experience;

      var connectedUsers = 0;
      for (var i = 0; i < numBeats; i++) {
        var isPlacing = this.isPlacing[i];
        if (isPlacing === true || isPlacing === false) {
          connectedUsers++;
        }
      }

      if (connectedUsers > 0) {
        /// BLINK NEWCOMMERS
        experience.ledDisplay.clearPixels();
        for (var _i = 0; _i < numBeats; _i++) {
          var _isPlacing = this.isPlacing[_i];

          if (_isPlacing) {
            if (beat <= numBeats / 2) {
              var pC = '0x' + playerColors[_i];
              experience.ledDisplay.segment(_i, pC);
            }
          }
        }
        experience.ledDisplay.redraw();
      }

      if (connectedUsers === 0) {
        experience.ledDisplay.clearPixels();
        experience.ledDisplay.circle(beat % 4, '0xFFFBCB');
        experience.ledDisplay.redraw();
      }
      //console.log(connectedUsers, beat);
    }
  }, {
    key: 'onMotionEvent',
    value: function onMotionEvent(index, data) {

      var experience = this.experience;
      experience.broadcast('barrel', null, 'motionEvent', index, data);

      //console.log(index, data);
      if (!(index === 0)) {

        if (index === 4) {
          /// chord specail case
          if (data > 0.5) {
            experience.ledDisplay.clearPixels();
            experience.ledDisplay.segment(index, playerColors[index]);
            experience.ledDisplay.redraw();
          }
        } else {
          // all other instruments
          experience.ledDisplay.clearPixels();
          experience.ledDisplay.segment(index, playerColors[index]);
          experience.ledDisplay.redraw();
        }
      } else {
        experience.ledDisplay.clearPixels();
        experience.ledDisplay.circle(0, playerColors[index]);
        experience.ledDisplay.circle(3, playerColors[index]);
        experience.ledDisplay.redraw();
      }

      if (!(index === 4)) {
        setTimeout(function () {
          experience.ledDisplay.screenOff();
        }, 100);
      }
    }
  }]);
  return SceneWwryR;
}();

exports.default = SceneWwryR;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInd3cnktci5qcyJdLCJuYW1lcyI6WyJwbGF5ZXJDb2xvcnMiLCJjb2xvckNvbmZpZyIsInBsYXllcnMiLCJudW1CZWF0cyIsIm51bU1lYXN1cmVzIiwiU2NlbmVXd3J5UiIsImV4cGVyaWVuY2UiLCJjb25maWciLCJwbGFjZXIiLCJQbGFjZXIiLCJ0cmFja3MiLCJudW1UcmFja3MiLCJsZW5ndGgiLCJpc1BsYWNpbmciLCJBcnJheSIsInRyYWNrQ3V0b2ZmcyIsInRyYWNrTGF5ZXJzIiwib25NZXRyb0JlYXQiLCJiaW5kIiwib25Nb3Rpb25FdmVudCIsIm1ldHJvbm9tZSIsIk1ldHJvbm9tZSIsInNjaGVkdWxlciIsIm1ldHJpY1NjaGVkdWxlciIsImNsaWVudCIsImNsaWVudEluZGV4IiwiaW5kZXgiLCJyZWNlaXZlIiwic3RhcnQiLCJzdG9wUmVjZWl2aW5nIiwic3RvcCIsInNoYXJlZFBhcmFtcyIsInVwZGF0ZSIsInRlbXBvIiwiZW5hYmxlVGVtcG9DaGFuZ2UiLCJsZWREaXNwbGF5Iiwic2NyZWVuT2ZmIiwibWVhc3VyZSIsImJlYXQiLCJjb25uZWN0ZWRVc2VycyIsImkiLCJjbGVhclBpeGVscyIsInBDIiwic2VnbWVudCIsInJlZHJhdyIsImNpcmNsZSIsImRhdGEiLCJicm9hZGNhc3QiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBQ0EsSUFBTUEsZUFBZUMsc0JBQVlDLE9BQWpDOztBQUVBLElBQU1DLFdBQVcsQ0FBakI7QUFDQSxJQUFNQyxjQUFjLENBQXBCOztJQUVxQkMsVTtBQUNuQixzQkFBWUMsVUFBWixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFBQTs7QUFDOUIsU0FBS0QsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7O0FBRUEsU0FBS0MsTUFBTCxHQUFjLElBQUlDLGdCQUFKLENBQVdILFVBQVgsQ0FBZDs7QUFFQSxTQUFLSSxN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QVc2QixVQUFYLENBQXNCUSxPQUF0QixDQUE4QmpCLEtBQTlCLEVBQXFDMUIsYUFBYTBCLEtBQWIsQ0FBckM7QUFDQXBCLHVCQUFXNkIsVUFBWCxDQUFzQlMsTUFBdEI7QUFDRDtBQUNGLFNBTkQsTUFNTztBQUFFO0FBQ1B0QyxxQkFBVzZCLFVBQVgsQ0FBc0JNLFdBQXRCO0FBQ0FuQyxxQkFBVzZCLFVBQVgsQ0FBc0JRLE9BQXRCLENBQThCakIsS0FBOUIsRUFBcUMxQixhQUFhMEIsS0FBYixDQUFyQztBQUNBcEIscUJBQVc2QixVQUFYLENBQXNCUyxNQUF0QjtBQUNEO0FBQ0YsT0FiRCxNQWFPO0FBQ0x0QyxtQkFBVzZCLFVBQVgsQ0FBc0JNLFdBQXRCO0FBQ0FuQyxtQkFBVzZCLFVBQVgsQ0FBc0JVLE1BQXRCLENBQTZCLENBQTdCLEVBQWdDN0MsYUFBYTBCLEtBQWIsQ0FBaEM7QUFDQXBCLG1CQUFXNkIsVUFBWCxDQUFzQlUsTUFBdEIsQ0FBNkIsQ0FBN0IsRUFBZ0M3QyxhQUFhMEIsS0FBYixDQUFoQztBQUNBcEIsbUJBQVc2QixVQUFYLENBQXNCUyxNQUF0QjtBQUNEOztBQUVELFVBQUksRUFBRWxCLFVBQVUsQ0FBWixDQUFKLEVBQW9CO0FBQ2xCc0IsbUJBQVcsWUFBTTtBQUNmMUMscUJBQVc2QixVQUFYLENBQXNCQyxTQUF0QjtBQUNELFNBRkQsRUFFRyxHQUZIO0FBR0Q7QUFFRjs7Ozs7a0JBbElrQi9CLFUiLCJmaWxlIjoid3dyeS1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1ldHJvbm9tZSBmcm9tICcuLi9NZXRyb25vbWUnO1xuaW1wb3J0IFBsYWNlciBmcm9tICcuL1BsYWNlcic7XG5pbXBvcnQgY29sb3JDb25maWcgZnJvbSAnLi4vLi4vc2hhcmVkL2NvbG9yLWNvbmZpZyc7XG5jb25zdCBwbGF5ZXJDb2xvcnMgPSBjb2xvckNvbmZpZy5wbGF5ZXJzO1xuXG5jb25zdCBudW1CZWF0cyA9IDg7XG5jb25zdCBudW1NZWFzdXJlcyA9IDE7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lV3dyeVIge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBjb25maWcpIHtcbiAgICB0aGlzLmV4cGVyaWVuY2UgPSBleHBlcmllbmNlO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgdGhpcy5wbGFjZXIgPSBuZXcgUGxhY2VyKGV4cGVyaWVuY2UpO1xuXG4gICAgdGhpcy50cmFja3MgPSBjb25maWcudHJhY2tzO1xuICAgIGNvbnN0IG51bVRyYWNrcyA9IGNvbmZpZy50cmFja3MubGVuZ3RoO1xuICAgIHRoaXMuaXNQbGFjaW5nID0gbmV3IEFycmF5KG51bVRyYWNrcyk7XG4gICAgdGhpcy50cmFja0N1dG9mZnMgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgdGhpcy50cmFja0xheWVycyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcblxuICAgIHRoaXMub25NZXRyb0JlYXQgPSB0aGlzLm9uTWV0cm9CZWF0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbk1vdGlvbkV2ZW50ID0gdGhpcy5vbk1vdGlvbkV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLm1ldHJvbm9tZSA9IG5ldyBNZXRyb25vbWUoZXhwZXJpZW5jZS5zY2hlZHVsZXIsIGV4cGVyaWVuY2UubWV0cmljU2NoZWR1bGVyLCBudW1CZWF0cyAqIG51bU1lYXN1cmVzLCBudW1CZWF0cywgdGhpcy5vbk1ldHJvQmVhdCk7XG4gIH1cblxuICBjbGllbnRFbnRlcihjbGllbnQpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gY2xpZW50LmluZGV4O1xuXG4gICAgZXhwZXJpZW5jZS5yZWNlaXZlKGNsaWVudCwgJ21vdGlvbkV2ZW50JywgdGhpcy5vbk1vdGlvbkV2ZW50KTtcblxuICAgIHRoaXMuaXNQbGFjaW5nW2NsaWVudEluZGV4XSA9IHRydWU7XG4gICAgdGhpcy5wbGFjZXIuc3RhcnQoY2xpZW50LCAoKSA9PiB7XG4gICAgICB0aGlzLmlzUGxhY2luZ1tjbGllbnRJbmRleF0gPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsaWVudEV4aXQoY2xpZW50KSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBjb25zdCBjbGllbnRJbmRleCA9IGNsaWVudC5pbmRleDtcblxuICAgIGV4cGVyaWVuY2Uuc3RvcFJlY2VpdmluZyhjbGllbnQsICdtb3Rpb25FdmVudCcsIHRoaXMub25Nb3Rpb25FdmVudCk7XG5cbiAgICBpZiAodGhpcy5pc1BsYWNpbmdbY2xpZW50SW5kZXhdKSB7XG4gICAgICB0aGlzLnBsYWNlci5zdG9wKGNsaWVudCk7XG4gICAgICB0aGlzLmlzUGxhY2luZ1tjbGllbnRJbmRleF0gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuICAgIGV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zLnVwZGF0ZSgndGVtcG8nLCB0aGlzLmNvbmZpZy50ZW1wbyk7XG4gICAgZXhwZXJpZW5jZS5lbmFibGVUZW1wb0NoYW5nZShmYWxzZSk7XG4gICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LnNjcmVlbk9mZigpO1xuXG4gICAgdGhpcy5tZXRyb25vbWUuc3RhcnQoKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICB0aGlzLm1ldHJvbm9tZS5zdG9wKCk7XG4gICAgZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXMudXBkYXRlKCd0ZW1wbycsIHRoaXMuY29uZmlnLnRlbXBvKTtcbiAgICBleHBlcmllbmNlLmVuYWJsZVRlbXBvQ2hhbmdlKHRydWUpO1xuICB9XG5cbiAgb25NZXRyb0JlYXQobWVhc3VyZSwgYmVhdCkge1xuICAgIC8vIGNvbnRyb2wgTEVEcyB0dXJuaW5nIGFyb3VuZCBmb3IgZWFjaCBtZWFzdXJlID8/P1xuICAgIC8vIGNvdWxkIGFsc28gdXNlIHRyYWNrQ3V0b2ZmcyBhbmQvb3IgdHJhY2tMYXllcnMgb2YgdGhlIDggdHJhY2tzICh0aGlzLnRyYWNrcy5sZW5ndGggPSA4KVxuXG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcblxuICAgIGxldCBjb25uZWN0ZWRVc2VycyA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1CZWF0czsgaSsrKSB7XG4gICAgICBjb25zdCBpc1BsYWNpbmcgPSB0aGlzLmlzUGxhY2luZ1tpXTtcbiAgICAgIGlmICgoaXNQbGFjaW5nID09PSB0cnVlKSB8fCAoaXNQbGFjaW5nID09PSBmYWxzZSkpIHtcbiAgICAgICAgY29ubmVjdGVkVXNlcnMrKztcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIGlmIChjb25uZWN0ZWRVc2VycyA+IDApIHtcbiAgICAgIC8vLyBCTElOSyBORVdDT01NRVJTXG4gICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkuY2xlYXJQaXhlbHMoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQmVhdHM7IGkrKykge1xuICAgICAgICBjb25zdCBpc1BsYWNpbmcgPSB0aGlzLmlzUGxhY2luZ1tpXTtcblxuICAgICAgICBpZiAoaXNQbGFjaW5nKSB7XG4gICAgICAgICAgaWYgKGJlYXQgPD0gbnVtQmVhdHMgLyAyKSB7XG4gICAgICAgICAgICBjb25zdCBwQyA9ICcweCcgKyBwbGF5ZXJDb2xvcnNbaV07XG4gICAgICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkuc2VnbWVudChpLCBwQyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgaWYgKGNvbm5lY3RlZFVzZXJzID09PSAwKSB7XG4gICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkuY2xlYXJQaXhlbHMoKTtcbiAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5jaXJjbGUoYmVhdCAlIDQsICcweEZGRkJDQicpO1xuICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LnJlZHJhdygpO1xuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKGNvbm5lY3RlZFVzZXJzLCBiZWF0KTtcbiAgfVxuXG4gIG9uTW90aW9uRXZlbnQoaW5kZXgsIGRhdGEpIHtcblxuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5icm9hZGNhc3QoJ2JhcnJlbCcsIG51bGwsICdtb3Rpb25FdmVudCcsIGluZGV4LCBkYXRhKTtcblxuICAgIC8vY29uc29sZS5sb2coaW5kZXgsIGRhdGEpO1xuICAgIGlmICghKGluZGV4ID09PSAwKSkge1xuXG4gICAgICBpZiAoaW5kZXggPT09IDQpIHsgLy8vIGNob3JkIHNwZWNhaWwgY2FzZVxuICAgICAgICBpZiAoZGF0YSA+IDAuNSkge1xuICAgICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5jbGVhclBpeGVscygpO1xuICAgICAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5zZWdtZW50KGluZGV4LCBwbGF5ZXJDb2xvcnNbaW5kZXhdKTtcbiAgICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkucmVkcmF3KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIGFsbCBvdGhlciBpbnN0cnVtZW50c1xuICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkuY2xlYXJQaXhlbHMoKTtcbiAgICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LnNlZ21lbnQoaW5kZXgsIHBsYXllckNvbG9yc1tpbmRleF0pO1xuICAgICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkucmVkcmF3KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5jbGVhclBpeGVscygpO1xuICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LmNpcmNsZSgwLCBwbGF5ZXJDb2xvcnNbaW5kZXhdKTtcbiAgICAgIGV4cGVyaWVuY2UubGVkRGlzcGxheS5jaXJjbGUoMywgcGxheWVyQ29sb3JzW2luZGV4XSk7XG4gICAgICBleHBlcmllbmNlLmxlZERpc3BsYXkucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgaWYgKCEoaW5kZXggPT09IDQpKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZXhwZXJpZW5jZS5sZWREaXNwbGF5LnNjcmVlbk9mZigpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgfVxufVxuIl19