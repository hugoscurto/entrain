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

var _QueenPlayer = require('../../shared/QueenPlayer');

var _QueenPlayer2 = _interopRequireDefault(_QueenPlayer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioContext = soundworks.audioContext;
var audioScheduler = soundworks.audio.getScheduler();

var SceneWwryR = function () {
  function SceneWwryR(experience, config) {
    (0, _classCallCheck3.default)(this, SceneWwryR);

    this.experience = experience;
    this.config = config;
    this.notes = null;

    var numTracks = config.tracks.length;
    this.outputBusses = experience.outputBusses;

    this.placer = new _Placer2.default(experience);
    this.queenPlayer = null;
    this.tracks = [];

    this.onMotionEvent = this.onMotionEvent.bind(this);
  }

  (0, _createClass3.default)(SceneWwryR, [{
    key: 'clientEnter',
    value: function clientEnter(index) {
      var _this = this;

      var experience = this.experience;

      this.placer.start(index, function () {
        var queenPlayer = _this.queenPlayer;

        if (queenPlayer) queenPlayer.startTrack(index, _this.tracks[index]);
      });
    }
  }, {
    key: 'clientExit',
    value: function clientExit(index) {
      var queenPlayer = this.queenPlayer;

      if (queenPlayer) queenPlayer.stopTrack(index);
    }
  }, {
    key: 'enterScene',
    value: function enterScene() {
      var experience = this.experience;
      experience.receive('motionEvent', this.onMotionEvent);

      if (!this.queenPlayer) this.queenPlayer = new _QueenPlayer2.default(this.outputBusses);
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
      experience.stopReceiving('motionEvent', this.onMotionEvent);

      this.placer.clear();
    }
  }, {
    key: 'onMotionEvent',
    value: function onMotionEvent(index, data) {
      var queenPlayer = this.queenPlayer;

      if (queenPlayer) queenPlayer.onMotionEvent(index, data);
    }
  }]);
  return SceneWwryR;
}();

exports.default = SceneWwryR;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInd3cnktci5qcyJdLCJuYW1lcyI6WyJzb3VuZHdvcmtzIiwiYXVkaW9Db250ZXh0IiwiYXVkaW9TY2hlZHVsZXIiLCJhdWRpbyIsImdldFNjaGVkdWxlciIsIlNjZW5lV3dyeVIiLCJleHBlcmllbmNlIiwiY29uZmlnIiwibm90ZXMiLCJudW1UcmFja3MiLCJ0cmFja3MiLCJsZW5ndGgiLCJvdXRwdXRCdXNzZXMiLCJwbGFjZXIiLCJQbGFjZXIiLCJxdWVlblBsYXllciIsIm9uTW90aW9uRXZlbnQiLCJiaW5kIiwiaW5kZXgiLCJzdGFydCIsInN0YXJ0VHJhY2siLCJzdG9wVHJhY2siLCJyZWNlaXZlIiwiUXVlZW5QbGF5ZXIiLCJlbnRlclNjZW5lIiwidHJhY2tDb25maWciLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJsb2FkRmlsZXMiLCJ0aGVuIiwic3RvcFJlY2VpdmluZyIsImNsZWFyIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsVTs7QUFDWjs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU1DLGVBQWVELFdBQVdDLFlBQWhDO0FBQ0EsSUFBTUMsaUJBQWlCRixXQUFXRyxLQUFYLENBQWlCQyxZQUFqQixFQUF2Qjs7SUFFcUJDLFU7QUFDbkIsc0JBQVlDLFVBQVosRUFBd0JDLE1BQXhCLEVBQWdDO0FBQUE7O0FBQzlCLFNBQUtELFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLElBQWI7O0FBRUEsUUFBTUMsWUFBWUYsT0FBT0csTUFBUCxDQUFjQyxNQUFoQztBQUNBLFNBQUtDLFlBQUwsR0FBb0JOLFdBQVdNLFlBQS9COztBQUVBLFNBQUtDLE1BQUwsR0FBYyxJQUFJQyxnQkFBSixDQUFXUixVQUFYLENBQWQ7QUFDQSxTQUFLUyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsU0FBS0wsTUFBTCxHQUFjLEVBQWQ7O0FBRUEsU0FBS00sYUFBTCxHQUFxQixLQUFLQSxhQUFMLENBQW1CQyxJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNEOzs7O2dDQUVXQyxLLEVBQU87QUFBQTs7QUFDakIsVUFBTVosYUFBYSxLQUFLQSxVQUF4Qjs7QUFFQSxXQUFLTyxNQUFMLENBQVlNLEtBQVosQ0FBa0JELEtBQWxCLEVBQXlCLFlBQU07QUFDN0IsWUFBTUgsY0FBYyxNQUFLQSxXQUF6Qjs7QUFFQSxZQUFJQSxXQUFKLEVBQ0VBLFlBQVlLLFVBQVosQ0FBdUJGLEtBQXZCLEVBQThCLE1BQUtSLE1BQUwsQ0FBWVEsS0FBWixDQUE5QjtBQUNILE9BTEQ7QUFNRDs7OytCQUVVQSxLLEVBQU87QUFDaEIsVUFBTUgsY0FBYyxLQUFLQSxXQUF6Qjs7QUFFQSxVQUFJQSxXQUFKLEVBQ0VBLFlBQVlNLFNBQVosQ0FBc0JILEtBQXRCO0FBQ0g7OztpQ0FFWTtBQUNYLFVBQU1aLGFBQWEsS0FBS0EsVUFBeEI7QUFDQUEsaUJBQVdnQixPQUFYLENBQW1CLGFBQW5CLEVBQWtDLEtBQUtOLGFBQXZDOztBQUVBLFVBQUksQ0FBQyxLQUFLRCxXQUFWLEVBQ0UsS0FBS0EsV0FBTCxHQUFtQixJQUFJUSxxQkFBSixDQUFnQixLQUFLWCxZQUFyQixDQUFuQjtBQUNIOzs7NEJBRU87QUFBQTs7QUFDTixVQUFNTixhQUFhLEtBQUtBLFVBQXhCOztBQUVBLFVBQUksS0FBS0UsS0FBVCxFQUFnQjtBQUNkLGFBQUtnQixVQUFMO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBTUMsY0FBYyxLQUFLbEIsTUFBTCxDQUFZRyxNQUFoQztBQUNBSixtQkFBV29CLGtCQUFYLENBQThCQyxTQUE5QixDQUF3Q0YsV0FBeEMsRUFBcURHLElBQXJELENBQTBELFVBQUNsQixNQUFELEVBQVk7QUFDcEUsaUJBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGlCQUFLYyxVQUFMO0FBQ0QsU0FIRDtBQUlEO0FBQ0Y7OzsyQkFFTTtBQUNMLFVBQU1sQixhQUFhLEtBQUtBLFVBQXhCO0FBQ0FBLGlCQUFXdUIsYUFBWCxDQUF5QixhQUF6QixFQUF3QyxLQUFLYixhQUE3Qzs7QUFFQSxXQUFLSCxNQUFMLENBQVlpQixLQUFaO0FBQ0Q7OztrQ0FFYVosSyxFQUFPYSxJLEVBQU07QUFDekIsVUFBTWhCLGNBQWMsS0FBS0EsV0FBekI7O0FBRUEsVUFBSUEsV0FBSixFQUNFQSxZQUFZQyxhQUFaLENBQTBCRSxLQUExQixFQUFpQ2EsSUFBakM7QUFDSDs7Ozs7a0JBcEVrQjFCLFUiLCJmaWxlIjoid3dyeS1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgUGxhY2VyIGZyb20gJy4vUGxhY2VyJztcbmltcG9ydCBRdWVlblBsYXllciBmcm9tICcuLi8uLi9zaGFyZWQvUXVlZW5QbGF5ZXInO1xuY29uc3QgYXVkaW9Db250ZXh0ID0gc291bmR3b3Jrcy5hdWRpb0NvbnRleHQ7XG5jb25zdCBhdWRpb1NjaGVkdWxlciA9IHNvdW5kd29ya3MuYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lV3dyeVIge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBjb25maWcpIHtcbiAgICB0aGlzLmV4cGVyaWVuY2UgPSBleHBlcmllbmNlO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubm90ZXMgPSBudWxsO1xuXG4gICAgY29uc3QgbnVtVHJhY2tzID0gY29uZmlnLnRyYWNrcy5sZW5ndGg7XG4gICAgdGhpcy5vdXRwdXRCdXNzZXMgPSBleHBlcmllbmNlLm91dHB1dEJ1c3NlcztcblxuICAgIHRoaXMucGxhY2VyID0gbmV3IFBsYWNlcihleHBlcmllbmNlKTtcbiAgICB0aGlzLnF1ZWVuUGxheWVyID0gbnVsbDtcbiAgICB0aGlzLnRyYWNrcyA9IFtdO1xuXG4gICAgdGhpcy5vbk1vdGlvbkV2ZW50ID0gdGhpcy5vbk1vdGlvbkV2ZW50LmJpbmQodGhpcyk7XG4gIH1cblxuICBjbGllbnRFbnRlcihpbmRleCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG5cbiAgICB0aGlzLnBsYWNlci5zdGFydChpbmRleCwgKCkgPT4ge1xuICAgICAgY29uc3QgcXVlZW5QbGF5ZXIgPSB0aGlzLnF1ZWVuUGxheWVyO1xuXG4gICAgICBpZiAocXVlZW5QbGF5ZXIpXG4gICAgICAgIHF1ZWVuUGxheWVyLnN0YXJ0VHJhY2soaW5kZXgsIHRoaXMudHJhY2tzW2luZGV4XSk7XG4gICAgfSk7XG4gIH1cblxuICBjbGllbnRFeGl0KGluZGV4KSB7XG4gICAgY29uc3QgcXVlZW5QbGF5ZXIgPSB0aGlzLnF1ZWVuUGxheWVyO1xuXG4gICAgaWYgKHF1ZWVuUGxheWVyKVxuICAgICAgcXVlZW5QbGF5ZXIuc3RvcFRyYWNrKGluZGV4KTtcbiAgfVxuXG4gIGVudGVyU2NlbmUoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcbiAgICBleHBlcmllbmNlLnJlY2VpdmUoJ21vdGlvbkV2ZW50JywgdGhpcy5vbk1vdGlvbkV2ZW50KTtcblxuICAgIGlmICghdGhpcy5xdWVlblBsYXllcilcbiAgICAgIHRoaXMucXVlZW5QbGF5ZXIgPSBuZXcgUXVlZW5QbGF5ZXIodGhpcy5vdXRwdXRCdXNzZXMpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgY29uc3QgZXhwZXJpZW5jZSA9IHRoaXMuZXhwZXJpZW5jZTtcblxuICAgIGlmICh0aGlzLm5vdGVzKSB7XG4gICAgICB0aGlzLmVudGVyU2NlbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdHJhY2tDb25maWcgPSB0aGlzLmNvbmZpZy50cmFja3M7XG4gICAgICBleHBlcmllbmNlLmF1ZGlvQnVmZmVyTWFuYWdlci5sb2FkRmlsZXModHJhY2tDb25maWcpLnRoZW4oKHRyYWNrcykgPT4ge1xuICAgICAgICB0aGlzLnRyYWNrcyA9IHRyYWNrcztcbiAgICAgICAgdGhpcy5lbnRlclNjZW5lKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBleGl0KCkge1xuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSB0aGlzLmV4cGVyaWVuY2U7XG4gICAgZXhwZXJpZW5jZS5zdG9wUmVjZWl2aW5nKCdtb3Rpb25FdmVudCcsIHRoaXMub25Nb3Rpb25FdmVudCk7XG5cbiAgICB0aGlzLnBsYWNlci5jbGVhcigpO1xuICB9XG5cbiAgb25Nb3Rpb25FdmVudChpbmRleCwgZGF0YSkge1xuICAgIGNvbnN0IHF1ZWVuUGxheWVyID0gdGhpcy5xdWVlblBsYXllcjtcblxuICAgIGlmIChxdWVlblBsYXllcilcbiAgICAgIHF1ZWVuUGxheWVyLm9uTW90aW9uRXZlbnQoaW5kZXgsIGRhdGEpO1xuICB9XG59XG4iXX0=