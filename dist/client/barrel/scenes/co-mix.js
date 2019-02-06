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

var _Placer = require('./Placer');

var _Placer2 = _interopRequireDefault(_Placer);

var _LoopPlayer = require('../../shared/LoopPlayer');

var _LoopPlayer2 = _interopRequireDefault(_LoopPlayer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioContext = soundworks.audioContext;
var audioScheduler = soundworks.audio.getScheduler();

var SceneCoMix = function () {
  function SceneCoMix(experience, config) {
    (0, _classCallCheck3.default)(this, SceneCoMix);

    this.experience = experience;
    this.config = config;
    this.notes = null;

    var numTracks = config.tracks.length;
    this.outputBusses = experience.outputBusses;

    this.placer = new _Placer2.default(experience);
    this.loopPlayer = null;

    this.onTrackCutoff = this.onTrackCutoff.bind(this);
    this.onSwitchLayer = this.onSwitchLayer.bind(this);
  }

  (0, _createClass3.default)(SceneCoMix, [{
    key: 'clientEnter',
    value: function clientEnter(index) {
      var _this = this;

      var experience = this.experience;

      this.placer.start(index, function () {
        var loopPlayer = _this.loopPlayer;

        if (loopPlayer) {
          var track = _this.tracks[index];
          loopPlayer.addLoopTrack(index, track.layers);
        }
      });
    }
  }, {
    key: 'clientExit',
    value: function clientExit(index) {
      var loopPlayer = this.loopPlayer;

      if (loopPlayer) loopPlayer.removeLoopTrack(index);
    }
  }, {
    key: 'enterScene',
    value: function enterScene() {
      var experience = this.experience;
      experience.receive('trackCutoff', this.onTrackCutoff);
      experience.receive('switchLayer', this.onSwitchLayer);

      if (!this.loopPlayer) {
        var config = this.config;
        this.loopPlayer = new _LoopPlayer2.default(experience.metricScheduler, this.outputBusses, 1, config.tempo, config.tempoUnit, 0.05);
      }
    }
  }, {
    key: 'enter',
    value: function enter() {
      var _this2 = this;

      var experience = this.experience;

      if (this.notes) {
        this.enterScene();
      } else {
        var trackConfig = this.config.tracks;
        experience.audioBufferManager.loadFiles(trackConfig).then(function (tracks) {
          _this2.tracks = tracks;
          _this2.enterScene();
        });
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      var experience = this.experience;
      experience.stopReceiving('trackCutoff', this.onTrackCutoff);
      experience.stopReceiving('switchLayer', this.onSwitchLayer);

      this.placer.clear();
      this.loopPlayer.stopAllTracks();
    }
  }, {
    key: 'onTrackCutoff',
    value: function onTrackCutoff(index, value) {
      var loopPlayer = this.loopPlayer;

      if (loopPlayer) loopPlayer.setCutoff(index, value);
    }
  }, {
    key: 'onSwitchLayer',
    value: function onSwitchLayer(index, value) {
      var loopPlayer = this.loopPlayer;

      if (loopPlayer) loopPlayer.setLayer(index, value);
    }
  }]);
  return SceneCoMix;
}();

exports.default = SceneCoMix;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvLW1peC5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiYXVkaW9Db250ZXh0IiwiYXVkaW9TY2hlZHVsZXIiLCJhdWRpbyIsImdldFNjaGVkdWxlciIsIlNjZW5lQ29NaXgiLCJleHBlcmllbmNlIiwiY29uZmlnIiwibm90ZXMiLCJudW1UcmFja3MiLCJ0cmFja3MiLCJsZW5ndGgiLCJvdXRwdXRCdXNzZXMiLCJwbGFjZXIiLCJQbGFjZXIiLCJsb29wUGxheWVyIiwib25UcmFja0N1dG9mZiIsImJpbmQiLCJvblN3aXRjaExheWVyIiwiaW5kZXgiLCJzdGFydCIsInRyYWNrIiwiYWRkTG9vcFRyYWNrIiwibGF5ZXJzIiwicmVtb3ZlTG9vcFRyYWNrIiwicmVjZWl2ZSIsIkxvb3BQbGF5ZXIiLCJtZXRyaWNTY2hlZHVsZXIiLCJ0ZW1wbyIsInRlbXBvVW5pdCIsImVudGVyU2NlbmUiLCJ0cmFja0NvbmZpZyIsImF1ZGlvQnVmZmVyTWFuYWdlciIsImxvYWRGaWxlcyIsInRoZW4iLCJzdG9wUmVjZWl2aW5nIiwiY2xlYXIiLCJzdG9wQWxsVHJhY2tzIiwidmFsdWUiLCJzZXRDdXRvZmYiLCJzZXRMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsVTs7QUFDWjs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU1DLGVBQWVELFdBQVdDLFlBQWhDO0FBQ0EsSUFBTUMsaUJBQWlCRixXQUFXRyxLQUFYLENBQWlCQyxZQUFqQixFQUF2Qjs7SUFFcUJDLFU7QUFDbkIsc0JBQVlDLFVBQVosRUFBd0JDLE1BQXhCLEVBQWdDO0FBQUE7O0FBQzlCLFNBQUtELFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLElBQWI7O0FBRUEsUUFBTUMsWUFBWUYsT0FBT0csTUFBUCxDQUFjQyxNQUFoQztBQUNBLFNBQUtDLFlBQUwsR0FBb0JOLFdBQVdNLFlBQS9COztBQUVBLFNBQUtDLE1BQUwsR0FBYyxJQUFJQyxnQkFBSixDQUFXUixVQUFYLENBQWQ7QUFDQSxTQUFLUyxVQUFMLEdBQWtCLElBQWxCOztBQUVBLFNBQUtDLGFBQUwsR0FBcUIsS0FBS0EsYUFBTCxDQUFtQkMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBckI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLEtBQUtBLGFBQUwsQ0FBbUJELElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0Q7Ozs7Z0NBRVdFLEssRUFBTztBQUFBOztBQUNqQixVQUFNYixhQUFhLEtBQUtBLFVBQXhCOztBQUVBLFdBQUtPLE1BQUwsQ0FBWU8sS0FBWixDQUFrQkQsS0FBbEIsRUFBeUIsWUFBTTtBQUM3QixZQUFNSixhQUFhLE1BQUtBLFVBQXhCOztBQUVBLFlBQUlBLFVBQUosRUFBZ0I7QUFDZCxjQUFNTSxRQUFRLE1BQUtYLE1BQUwsQ0FBWVMsS0FBWixDQUFkO0FBQ0FKLHFCQUFXTyxZQUFYLENBQXdCSCxLQUF4QixFQUErQkUsTUFBTUUsTUFBckM7QUFDRDtBQUNGLE9BUEQ7QUFRRDs7OytCQUVVSixLLEVBQU87QUFDaEIsVUFBTUosYUFBYSxLQUFLQSxVQUF4Qjs7QUFFQSxVQUFJQSxVQUFKLEVBQ0VBLFdBQVdTLGVBQVgsQ0FBMkJMLEtBQTNCO0FBQ0g7OztpQ0FFWTtBQUNYLFVBQU1iLGFBQWEsS0FBS0EsVUFBeEI7QUFDQUEsaUJBQVdtQixPQUFYLENBQW1CLGFBQW5CLEVBQWtDLEtBQUtULGFBQXZDO0FBQ0FWLGlCQUFXbUIsT0FBWCxDQUFtQixhQUFuQixFQUFrQyxLQUFLUCxhQUF2Qzs7QUFFQSxVQUFJLENBQUMsS0FBS0gsVUFBVixFQUFzQjtBQUNwQixZQUFNUixTQUFTLEtBQUtBLE1BQXBCO0FBQ0EsYUFBS1EsVUFBTCxHQUFrQixJQUFJVyxvQkFBSixDQUFlcEIsV0FBV3FCLGVBQTFCLEVBQTJDLEtBQUtmLFlBQWhELEVBQThELENBQTlELEVBQWlFTCxPQUFPcUIsS0FBeEUsRUFBK0VyQixPQUFPc0IsU0FBdEYsRUFBaUcsSUFBakcsQ0FBbEI7QUFDRDtBQUNGOzs7NEJBRU87QUFBQTs7QUFDTixVQUFNdkIsYUFBYSxLQUFLQSxVQUF4Qjs7QUFFQSxVQUFJLEtBQUtFLEtBQVQsRUFBZ0I7QUFDZCxhQUFLc0IsVUFBTDtBQUNELE9BRkQsTUFFTztBQUNMLFlBQU1DLGNBQWMsS0FBS3hCLE1BQUwsQ0FBWUcsTUFBaEM7QUFDQUosbUJBQVcwQixrQkFBWCxDQUE4QkMsU0FBOUIsQ0FBd0NGLFdBQXhDLEVBQXFERyxJQUFyRCxDQUEwRCxVQUFDeEIsTUFBRCxFQUFZO0FBQ3BFLGlCQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxpQkFBS29CLFVBQUw7QUFDRCxTQUhEO0FBSUQ7QUFDRjs7OzJCQUVNO0FBQ0wsVUFBTXhCLGFBQWEsS0FBS0EsVUFBeEI7QUFDQUEsaUJBQVc2QixhQUFYLENBQXlCLGFBQXpCLEVBQXdDLEtBQUtuQixhQUE3QztBQUNBVixpQkFBVzZCLGFBQVgsQ0FBeUIsYUFBekIsRUFBd0MsS0FBS2pCLGFBQTdDOztBQUVBLFdBQUtMLE1BQUwsQ0FBWXVCLEtBQVo7QUFDQSxXQUFLckIsVUFBTCxDQUFnQnNCLGFBQWhCO0FBQ0Q7OztrQ0FFYWxCLEssRUFBT21CLEssRUFBTztBQUMxQixVQUFNdkIsYUFBYSxLQUFLQSxVQUF4Qjs7QUFFQSxVQUFJQSxVQUFKLEVBQ0VBLFdBQVd3QixTQUFYLENBQXFCcEIsS0FBckIsRUFBNEJtQixLQUE1QjtBQUNIOzs7a0NBRWFuQixLLEVBQU9tQixLLEVBQU87QUFDMUIsVUFBTXZCLGFBQWEsS0FBS0EsVUFBeEI7O0FBRUEsVUFBSUEsVUFBSixFQUNFQSxXQUFXeUIsUUFBWCxDQUFvQnJCLEtBQXBCLEVBQTJCbUIsS0FBM0I7QUFDSDs7Ozs7a0JBbEZrQmpDLFUiLCJmaWxlIjoiY28tbWl4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgUGxhY2VyIGZyb20gJy4vUGxhY2VyJztcbmltcG9ydCBMb29wUGxheWVyIGZyb20gJy4uLy4uL3NoYXJlZC9Mb29wUGxheWVyJztcbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgYXVkaW9TY2hlZHVsZXIgPSBzb3VuZHdvcmtzLmF1ZGlvLmdldFNjaGVkdWxlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZUNvTWl4IHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSwgY29uZmlnKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm5vdGVzID0gbnVsbDtcblxuICAgIGNvbnN0IG51bVRyYWNrcyA9IGNvbmZpZy50cmFja3MubGVuZ3RoO1xuICAgIHRoaXMub3V0cHV0QnVzc2VzID0gZXhwZXJpZW5jZS5vdXRwdXRCdXNzZXM7XG5cbiAgICB0aGlzLnBsYWNlciA9IG5ldyBQbGFjZXIoZXhwZXJpZW5jZSk7XG4gICAgdGhpcy5sb29wUGxheWVyID0gbnVsbDtcblxuICAgIHRoaXMub25UcmFja0N1dG9mZiA9IHRoaXMub25UcmFja0N1dG9mZi5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25Td2l0Y2hMYXllciA9IHRoaXMub25Td2l0Y2hMYXllci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY2xpZW50RW50ZXIoaW5kZXgpIHtcbiAgICBjb25zdCBleHBlcmllbmNlID0gdGhpcy5leHBlcmllbmNlO1xuXG4gICAgdGhpcy5wbGFjZXIuc3RhcnQoaW5kZXgsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvb3BQbGF5ZXIgPSB0aGlzLmxvb3BQbGF5ZXI7XG5cbiAgICAgIGlmIChsb29wUGxheWVyKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy50cmFja3NbaW5kZXhdO1xuICAgICAgICBsb29wUGxheWVyLmFkZExvb3BUcmFjayhpbmRleCwgdHJhY2subGF5ZXJzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNsaWVudEV4aXQoaW5kZXgpIHtcbiAgICBjb25zdCBsb29wUGxheWVyID0gdGhpcy5sb29wUGxheWVyO1xuXG4gICAgaWYgKGxvb3BQbGF5ZXIpXG4gICAgICBsb29wUGxheWVyLnJlbW92ZUxvb3BUcmFjayhpbmRleCk7XG4gIH1cblxuICBlbnRlclNjZW5lKCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5yZWNlaXZlKCd0cmFja0N1dG9mZicsIHRoaXMub25UcmFja0N1dG9mZik7XG4gICAgZXhwZXJpZW5jZS5yZWNlaXZlKCdzd2l0Y2hMYXllcicsIHRoaXMub25Td2l0Y2hMYXllcik7XG5cbiAgICBpZiAoIXRoaXMubG9vcFBsYXllcikge1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICB0aGlzLmxvb3BQbGF5ZXIgPSBuZXcgTG9vcFBsYXllcihleHBlcmllbmNlLm1ldHJpY1NjaGVkdWxlciwgdGhpcy5vdXRwdXRCdXNzZXMsIDEsIGNvbmZpZy50ZW1wbywgY29uZmlnLnRlbXBvVW5pdCwgMC4wNSk7XG4gICAgfVxuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcblxuICAgIGlmICh0aGlzLm5vdGVzKSB7XG4gICAgICB0aGlzLmVudGVyU2NlbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdHJhY2tDb25maWcgPSB0aGlzLmNvbmZpZy50cmFja3M7XG4gICAgICBleHBlcmllbmNlLmF1ZGlvQnVmZmVyTWFuYWdlci5sb2FkRmlsZXModHJhY2tDb25maWcpLnRoZW4oKHRyYWNrcykgPT4ge1xuICAgICAgICB0aGlzLnRyYWNrcyA9IHRyYWNrcztcbiAgICAgICAgdGhpcy5lbnRlclNjZW5lKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBleGl0KCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5zdG9wUmVjZWl2aW5nKCd0cmFja0N1dG9mZicsIHRoaXMub25UcmFja0N1dG9mZik7XG4gICAgZXhwZXJpZW5jZS5zdG9wUmVjZWl2aW5nKCdzd2l0Y2hMYXllcicsIHRoaXMub25Td2l0Y2hMYXllcik7XG5cbiAgICB0aGlzLnBsYWNlci5jbGVhcigpO1xuICAgIHRoaXMubG9vcFBsYXllci5zdG9wQWxsVHJhY2tzKCk7XG4gIH1cblxuICBvblRyYWNrQ3V0b2ZmKGluZGV4LCB2YWx1ZSkge1xuICAgIGNvbnN0IGxvb3BQbGF5ZXIgPSB0aGlzLmxvb3BQbGF5ZXI7XG5cbiAgICBpZiAobG9vcFBsYXllcilcbiAgICAgIGxvb3BQbGF5ZXIuc2V0Q3V0b2ZmKGluZGV4LCB2YWx1ZSk7XG4gIH1cblxuICBvblN3aXRjaExheWVyKGluZGV4LCB2YWx1ZSkge1xuICAgIGNvbnN0IGxvb3BQbGF5ZXIgPSB0aGlzLmxvb3BQbGF5ZXI7XG5cbiAgICBpZiAobG9vcFBsYXllcilcbiAgICAgIGxvb3BQbGF5ZXIuc2V0TGF5ZXIoaW5kZXgsIHZhbHVlKTtcbiAgfVxufVxuIl19