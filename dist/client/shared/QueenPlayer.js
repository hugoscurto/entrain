'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audio = soundworks.audio;
var audioContext = soundworks.audioContext;
var audioScheduler = soundworks.audio.getScheduler();

var HitEngine = function (_audio$SegmentEngine) {
  (0, _inherits3.default)(HitEngine, _audio$SegmentEngine);

  function HitEngine(track, output) {
    (0, _classCallCheck3.default)(this, HitEngine);

    var _this = (0, _possibleConstructorReturn3.default)(this, (HitEngine.__proto__ || (0, _getPrototypeOf2.default)(HitEngine)).call(this));

    _this.buffer = track.buffer;
    _this.positionArray = track.markers.time;
    _this.offsetArray = track.markers.offset;

    _this.releaseRel = 0.25;

    _this.connect(output);
    return _this;
  }

  (0, _createClass3.default)(HitEngine, [{
    key: 'start',
    value: function start() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }, {
    key: 'onMotionEvent',
    value: function onMotionEvent(data) {
      this.segmentIndex = data;
      this.trigger();
    }
  }]);
  return HitEngine;
}(audio.SegmentEngine);

var PowerChordEngine = function (_audio$GranularEngine) {
  (0, _inherits3.default)(PowerChordEngine, _audio$GranularEngine);

  function PowerChordEngine(track, output) {
    (0, _classCallCheck3.default)(this, PowerChordEngine);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (PowerChordEngine.__proto__ || (0, _getPrototypeOf2.default)(PowerChordEngine)).call(this));

    _this2.buffer = track.buffer;
    _this2.periodAbs = 0.01;
    _this2.periodRel = 0;
    _this2.durationAbs = 0.08;
    _this2.durationRel = 0;
    _this2.gain = 2 * _this2.periodAbs / _this2.durationAbs;

    _this2.connect(output);
    return _this2;
  }

  (0, _createClass3.default)(PowerChordEngine, [{
    key: 'start',
    value: function start() {
      if (!this.master) audioScheduler.add(this);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.master) audioScheduler.remove(this);
    }
  }, {
    key: 'onMotionEvent',
    value: function onMotionEvent(data) {
      var margin = 0.5 * this.durationAbs + this.positionVar;
      var range = this.buffer.duration - 2 * margin;
      this.position = margin + data * range;
    }
  }]);
  return PowerChordEngine;
}(audio.GranularEngine);

var GuitarRiffEngine = function (_audio$GranularEngine2) {
  (0, _inherits3.default)(GuitarRiffEngine, _audio$GranularEngine2);

  function GuitarRiffEngine(track, output) {
    (0, _classCallCheck3.default)(this, GuitarRiffEngine);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (GuitarRiffEngine.__proto__ || (0, _getPrototypeOf2.default)(GuitarRiffEngine)).call(this));

    _this3.segments = track.markers;

    _this3.buffer = track.buffer;
    _this3.periodAbs = 0.010;
    _this3.periodRel = 0;
    _this3.durationAbs = 0.080;
    _this3.durationRel = 0;
    _this3.position = 0;
    _this3.positionVar = 0.02;
    _this3.gain = 0;

    _this3.segmentIndex = 15;
    _this3.playingPosition = 0;
    _this3.playingSpeed = 0;
    _this3.gainFactor = 2 * _this3.periodAbs / _this3.durationAbs;

    _this3.connect(output);
    return _this3;
  }

  (0, _createClass3.default)(GuitarRiffEngine, [{
    key: 'trigger',
    value: function trigger(time) {
      var segments = this.segments;

      if (this.playingSpeed > 0 && this.playingPosition < segments[this.segmentIndex].end) {
        this.position = this.playingPosition;
        this.positionVar = 0;
        this.gain = this.gainFactor * 0.707;
      } else {
        this.position = segments[this.segmentIndex].end;
        this.positionVar = 0.02;

        if (this.playingSpeed !== 0) {
          this.playingSpeed = 0;
          this.gain = this.gainFactor * 1.0;
        } else {
          this.gain *= segments[this.segmentIndex].sustain;
        }
      }

      this.playingPosition += this.periodAbs * this.playingSpeed;

      return (0, _get3.default)(GuitarRiffEngine.prototype.__proto__ || (0, _getPrototypeOf2.default)(GuitarRiffEngine.prototype), 'trigger', this).call(this, time);
    }
  }, {
    key: 'start',
    value: function start() {
      if (!this.master) {
        var segments = this.segments;

        this.segmentIndex = 15;
        this.playingPosition = segments[this.segmentIndex].start;
        this.playingSpeed = segments[this.segmentIndex].speed;
        this.gain = this.gainFactor * 0.707;

        audioScheduler.add(this);
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.master) audioScheduler.remove(this);
    }
  }, {
    key: 'onMotionEvent',
    value: function onMotionEvent(data) {
      var segments = this.segments;

      this.playingPosition = segments[data].start;
      this.playingSpeed = segments[data].speed;

      this.segmentIndex = data;
    }
  }]);
  return GuitarRiffEngine;
}(audio.GranularEngine);

var QueenPlayer = function () {
  function QueenPlayer(outputs) {
    (0, _classCallCheck3.default)(this, QueenPlayer);

    this.outputs = outputs;

    this.engines = [];

    this.onMotionEvent = this.onMotionEvent.bind(this);
  }

  (0, _createClass3.default)(QueenPlayer, [{
    key: 'startTrack',
    value: function startTrack(index, track) {
      var engine = this.engines[index];

      if (!engine) {
        switch (track.name) {
          case 'drums':
          case 'verse':
          case 'chorus':
          case 'freddy':
            engine = new HitEngine(track, this.outputs[index]);
            break;

          case 'power chord':
            engine = new PowerChordEngine(track, this.outputs[index]);
            break;

          case 'guitar riff':
            engine = new GuitarRiffEngine(track, this.outputs[index]);
            break;
        }

        this.engines[index] = engine;
      }

      engine.start();
    }
  }, {
    key: 'stopTrack',
    value: function stopTrack(index) {
      var engine = this.engines[index];

      if (engine) engine.stop();
    }
  }, {
    key: 'onMotionEvent',
    value: function onMotionEvent(index, data) {
      var engine = this.engines[index];

      if (engine) engine.onMotionEvent(data);
    }
  }]);
  return QueenPlayer;
}();

exports.default = QueenPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlF1ZWVuUGxheWVyLmpzIl0sIm5hbWVzIjpbInNvdW5kd29ya3MiLCJhdWRpbyIsImF1ZGlvQ29udGV4dCIsImF1ZGlvU2NoZWR1bGVyIiwiZ2V0U2NoZWR1bGVyIiwiSGl0RW5naW5lIiwidHJhY2siLCJvdXRwdXQiLCJidWZmZXIiLCJwb3NpdGlvbkFycmF5IiwibWFya2VycyIsInRpbWUiLCJvZmZzZXRBcnJheSIsIm9mZnNldCIsInJlbGVhc2VSZWwiLCJjb25uZWN0IiwiZGF0YSIsInNlZ21lbnRJbmRleCIsInRyaWdnZXIiLCJTZWdtZW50RW5naW5lIiwiUG93ZXJDaG9yZEVuZ2luZSIsInBlcmlvZEFicyIsInBlcmlvZFJlbCIsImR1cmF0aW9uQWJzIiwiZHVyYXRpb25SZWwiLCJnYWluIiwibWFzdGVyIiwiYWRkIiwicmVtb3ZlIiwibWFyZ2luIiwicG9zaXRpb25WYXIiLCJyYW5nZSIsImR1cmF0aW9uIiwicG9zaXRpb24iLCJHcmFudWxhckVuZ2luZSIsIkd1aXRhclJpZmZFbmdpbmUiLCJzZWdtZW50cyIsInBsYXlpbmdQb3NpdGlvbiIsInBsYXlpbmdTcGVlZCIsImdhaW5GYWN0b3IiLCJlbmQiLCJzdXN0YWluIiwic3RhcnQiLCJzcGVlZCIsIlF1ZWVuUGxheWVyIiwib3V0cHV0cyIsImVuZ2luZXMiLCJvbk1vdGlvbkV2ZW50IiwiYmluZCIsImluZGV4IiwiZW5naW5lIiwibmFtZSIsInN0b3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxVOzs7Ozs7QUFDWixJQUFNQyxRQUFRRCxXQUFXQyxLQUF6QjtBQUNBLElBQU1DLGVBQWVGLFdBQVdFLFlBQWhDO0FBQ0EsSUFBTUMsaUJBQWlCSCxXQUFXQyxLQUFYLENBQWlCRyxZQUFqQixFQUF2Qjs7SUFFTUMsUzs7O0FBQ0oscUJBQVlDLEtBQVosRUFBbUJDLE1BQW5CLEVBQTJCO0FBQUE7O0FBQUE7O0FBR3pCLFVBQUtDLE1BQUwsR0FB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dCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuY29uc3QgYXVkaW8gPSBzb3VuZHdvcmtzLmF1ZGlvO1xuY29uc3QgYXVkaW9Db250ZXh0ID0gc291bmR3b3Jrcy5hdWRpb0NvbnRleHQ7XG5jb25zdCBhdWRpb1NjaGVkdWxlciA9IHNvdW5kd29ya3MuYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG5cbmNsYXNzIEhpdEVuZ2luZSBleHRlbmRzIGF1ZGlvLlNlZ21lbnRFbmdpbmUge1xuICBjb25zdHJ1Y3Rvcih0cmFjaywgb3V0cHV0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuYnVmZmVyID0gdHJhY2suYnVmZmVyO1xuICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHRyYWNrLm1hcmtlcnMudGltZTtcbiAgICB0aGlzLm9mZnNldEFycmF5ID0gdHJhY2subWFya2Vycy5vZmZzZXQ7XG5cbiAgICB0aGlzLnJlbGVhc2VSZWwgPSAwLjI1O1xuXG4gICAgdGhpcy5jb25uZWN0KG91dHB1dCk7XG4gIH1cblxuICBzdGFydCgpIHt9XG5cbiAgc3RvcCgpIHt9XG5cbiAgb25Nb3Rpb25FdmVudChkYXRhKSB7XG4gICAgdGhpcy5zZWdtZW50SW5kZXggPSBkYXRhO1xuICAgIHRoaXMudHJpZ2dlcigpO1xuICB9XG59XG5cbmNsYXNzIFBvd2VyQ2hvcmRFbmdpbmUgZXh0ZW5kcyBhdWRpby5HcmFudWxhckVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKHRyYWNrLCBvdXRwdXQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5idWZmZXIgPSB0cmFjay5idWZmZXI7XG4gICAgdGhpcy5wZXJpb2RBYnMgPSAwLjAxO1xuICAgIHRoaXMucGVyaW9kUmVsID0gMDtcbiAgICB0aGlzLmR1cmF0aW9uQWJzID0gMC4wODtcbiAgICB0aGlzLmR1cmF0aW9uUmVsID0gMDtcbiAgICB0aGlzLmdhaW4gPSAyICogdGhpcy5wZXJpb2RBYnMgLyB0aGlzLmR1cmF0aW9uQWJzO1xuXG4gICAgdGhpcy5jb25uZWN0KG91dHB1dCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMubWFzdGVyKVxuICAgICAgYXVkaW9TY2hlZHVsZXIuYWRkKHRoaXMpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICBhdWRpb1NjaGVkdWxlci5yZW1vdmUodGhpcyk7XG4gIH1cblxuICBvbk1vdGlvbkV2ZW50KGRhdGEpIHtcbiAgICB2YXIgbWFyZ2luID0gMC41ICogdGhpcy5kdXJhdGlvbkFicyArIHRoaXMucG9zaXRpb25WYXI7XG4gICAgdmFyIHJhbmdlID0gdGhpcy5idWZmZXIuZHVyYXRpb24gLSAyICogbWFyZ2luO1xuICAgIHRoaXMucG9zaXRpb24gPSBtYXJnaW4gKyBkYXRhICogcmFuZ2U7XG4gIH1cbn1cblxuY2xhc3MgR3VpdGFyUmlmZkVuZ2luZSBleHRlbmRzIGF1ZGlvLkdyYW51bGFyRW5naW5lIHtcbiAgY29uc3RydWN0b3IodHJhY2ssIG91dHB1dCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNlZ21lbnRzID0gdHJhY2subWFya2VycztcblxuICAgIHRoaXMuYnVmZmVyID0gdHJhY2suYnVmZmVyO1xuICAgIHRoaXMucGVyaW9kQWJzID0gMC4wMTA7XG4gICAgdGhpcy5wZXJpb2RSZWwgPSAwO1xuICAgIHRoaXMuZHVyYXRpb25BYnMgPSAwLjA4MDtcbiAgICB0aGlzLmR1cmF0aW9uUmVsID0gMDtcbiAgICB0aGlzLnBvc2l0aW9uID0gMDtcbiAgICB0aGlzLnBvc2l0aW9uVmFyID0gMC4wMjtcbiAgICB0aGlzLmdhaW4gPSAwO1xuXG4gICAgdGhpcy5zZWdtZW50SW5kZXggPSAxNTtcbiAgICB0aGlzLnBsYXlpbmdQb3NpdGlvbiA9IDA7XG4gICAgdGhpcy5wbGF5aW5nU3BlZWQgPSAwO1xuICAgIHRoaXMuZ2FpbkZhY3RvciA9IDIgKiB0aGlzLnBlcmlvZEFicyAvIHRoaXMuZHVyYXRpb25BYnM7XG5cbiAgICB0aGlzLmNvbm5lY3Qob3V0cHV0KTtcbiAgfVxuXG4gIHRyaWdnZXIodGltZSkge1xuICAgIGNvbnN0IHNlZ21lbnRzID0gdGhpcy5zZWdtZW50cztcblxuICAgIGlmICh0aGlzLnBsYXlpbmdTcGVlZCA+IDAgJiYgdGhpcy5wbGF5aW5nUG9zaXRpb24gPCBzZWdtZW50c1t0aGlzLnNlZ21lbnRJbmRleF0uZW5kKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wbGF5aW5nUG9zaXRpb247XG4gICAgICB0aGlzLnBvc2l0aW9uVmFyID0gMDtcbiAgICAgIHRoaXMuZ2FpbiA9IHRoaXMuZ2FpbkZhY3RvciAqIDAuNzA3O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvc2l0aW9uID0gc2VnbWVudHNbdGhpcy5zZWdtZW50SW5kZXhdLmVuZDtcbiAgICAgIHRoaXMucG9zaXRpb25WYXIgPSAwLjAyO1xuXG4gICAgICBpZiAodGhpcy5wbGF5aW5nU3BlZWQgIT09IDApIHtcbiAgICAgICAgdGhpcy5wbGF5aW5nU3BlZWQgPSAwO1xuICAgICAgICB0aGlzLmdhaW4gPSB0aGlzLmdhaW5GYWN0b3IgKiAxLjA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdhaW4gKj0gc2VnbWVudHNbdGhpcy5zZWdtZW50SW5kZXhdLnN1c3RhaW47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5aW5nUG9zaXRpb24gKz0gdGhpcy5wZXJpb2RBYnMgKiB0aGlzLnBsYXlpbmdTcGVlZDtcblxuICAgIHJldHVybiBzdXBlci50cmlnZ2VyKHRpbWUpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCF0aGlzLm1hc3Rlcikge1xuICAgICAgY29uc3Qgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRzO1xuXG4gICAgICB0aGlzLnNlZ21lbnRJbmRleCA9IDE1O1xuICAgICAgdGhpcy5wbGF5aW5nUG9zaXRpb24gPSBzZWdtZW50c1t0aGlzLnNlZ21lbnRJbmRleF0uc3RhcnQ7XG4gICAgICB0aGlzLnBsYXlpbmdTcGVlZCA9IHNlZ21lbnRzW3RoaXMuc2VnbWVudEluZGV4XS5zcGVlZDtcbiAgICAgIHRoaXMuZ2FpbiA9IHRoaXMuZ2FpbkZhY3RvciAqIDAuNzA3O1xuXG4gICAgICBhdWRpb1NjaGVkdWxlci5hZGQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICBhdWRpb1NjaGVkdWxlci5yZW1vdmUodGhpcyk7XG4gIH1cblxuICBvbk1vdGlvbkV2ZW50KGRhdGEpIHtcbiAgICBjb25zdCBzZWdtZW50cyA9IHRoaXMuc2VnbWVudHM7XG5cbiAgICB0aGlzLnBsYXlpbmdQb3NpdGlvbiA9IHNlZ21lbnRzW2RhdGFdLnN0YXJ0O1xuICAgIHRoaXMucGxheWluZ1NwZWVkID0gc2VnbWVudHNbZGF0YV0uc3BlZWQ7XG5cbiAgICB0aGlzLnNlZ21lbnRJbmRleCA9IGRhdGE7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlZW5QbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihvdXRwdXRzKSB7XG4gICAgdGhpcy5vdXRwdXRzID0gb3V0cHV0cztcblxuICAgIHRoaXMuZW5naW5lcyA9IFtdO1xuXG4gICAgdGhpcy5vbk1vdGlvbkV2ZW50ID0gdGhpcy5vbk1vdGlvbkV2ZW50LmJpbmQodGhpcyk7XG4gIH1cblxuICBzdGFydFRyYWNrKGluZGV4LCB0cmFjaykge1xuICAgIGxldCBlbmdpbmUgPSB0aGlzLmVuZ2luZXNbaW5kZXhdO1xuXG4gICAgaWYgKCFlbmdpbmUpIHtcbiAgICAgIHN3aXRjaCAodHJhY2submFtZSkge1xuICAgICAgICBjYXNlICdkcnVtcyc6XG4gICAgICAgIGNhc2UgJ3ZlcnNlJzpcbiAgICAgICAgY2FzZSAnY2hvcnVzJzpcbiAgICAgICAgY2FzZSAnZnJlZGR5JzpcbiAgICAgICAgICBlbmdpbmUgPSBuZXcgSGl0RW5naW5lKHRyYWNrLCB0aGlzLm91dHB1dHNbaW5kZXhdKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdwb3dlciBjaG9yZCc6XG4gICAgICAgICAgZW5naW5lID0gbmV3IFBvd2VyQ2hvcmRFbmdpbmUodHJhY2ssIHRoaXMub3V0cHV0c1tpbmRleF0pO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2d1aXRhciByaWZmJzpcbiAgICAgICAgICBlbmdpbmUgPSBuZXcgR3VpdGFyUmlmZkVuZ2luZSh0cmFjaywgdGhpcy5vdXRwdXRzW2luZGV4XSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW5naW5lc1tpbmRleF0gPSBlbmdpbmU7XG4gICAgfVxuXG4gICAgZW5naW5lLnN0YXJ0KCk7XG4gIH1cblxuICBzdG9wVHJhY2soaW5kZXgpIHtcbiAgICBjb25zdCBlbmdpbmUgPSB0aGlzLmVuZ2luZXNbaW5kZXhdO1xuXG4gICAgaWYgKGVuZ2luZSlcbiAgICAgIGVuZ2luZS5zdG9wKCk7XG4gIH1cblxuICBvbk1vdGlvbkV2ZW50KGluZGV4LCBkYXRhKSB7XG4gICAgY29uc3QgZW5naW5lID0gdGhpcy5lbmdpbmVzW2luZGV4XTtcblxuICAgIGlmIChlbmdpbmUpXG4gICAgICBlbmdpbmUub25Nb3Rpb25FdmVudChkYXRhKTtcbiAgfVxufVxuIl19