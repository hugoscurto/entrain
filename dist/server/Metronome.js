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

var _timeEngine = require('./waves-audio/time-engine');

var _timeEngine2 = _interopRequireDefault(_timeEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Metronome = function (_TimeEngine) {
  (0, _inherits3.default)(Metronome, _TimeEngine);

  function Metronome(scheduler, metricScheduler, numBeats, metricDiv, callback) {
    (0, _classCallCheck3.default)(this, Metronome);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Metronome.__proto__ || (0, _getPrototypeOf2.default)(Metronome)).call(this));

    _this.scheduler = scheduler;
    _this.metricScheduler = metricScheduler;
    _this.numBeats = numBeats;
    _this.metricDiv = metricDiv;
    _this.callback = callback;

    _this.beatLength = 1 / metricDiv;
    _this.measureLength = numBeats * _this.beatLength;

    _this.beatPeriod = undefined;
    _this.measureCount = undefined;
    _this.beatCount = undefined;
    return _this;
  }

  (0, _createClass3.default)(Metronome, [{
    key: 'advanceTime',
    value: function advanceTime(time) {
      var measureCount = this.measureCount;
      var beatCount = this.beatCount;

      this.callback(measureCount, beatCount);

      beatCount++;

      if (beatCount >= this.numBeats) {
        measureCount++;
        beatCount = 0;
      }

      this.measureCount = measureCount;
      this.beatCount = beatCount;

      return time + this.beatPeriod;
    }
  }, {
    key: 'sync',
    value: function sync() {
      if (this.master) {
        var metricPosition = this.metricScheduler.metricPosition;
        var floatMeasures = metricPosition / this.measureLength;
        var measureCount = Math.floor(floatMeasures);
        var measurePhase = floatMeasures - measureCount;
        var metricSpeed = this.metricScheduler.tempo * this.metricScheduler.tempoUnit / 60;
        var beatCount = Math.ceil(this.numBeats * measurePhase);

        if (beatCount === this.numBeats) {
          measureCount++;
          beatCount = 0;
        }

        this.beatPeriod = this.beatLength / metricSpeed;
        this.measureCount = measureCount; // current measure
        this.beatCount = beatCount; // next beat

        var startPosition = measureCount * this.measureLength + beatCount * this.beatLength;
        var startTime = this.metricScheduler.getSyncTimeAtMetricPosition(startPosition);
        this.scheduler.resetEngineTime(this, startTime);
      }
    }
  }, {
    key: 'start',
    value: function start() {
      if (!this.master) {
        this.scheduler.add(this, Infinity);
        this.sync();
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.master) this.scheduler.remove(this);
    }
  }]);
  return Metronome;
}(_timeEngine2.default);

exports.default = Metronome;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldHJvbm9tZS5qcyJdLCJuYW1lcyI6WyJNZXRyb25vbWUiLCJzY2hlZHVsZXIiLCJtZXRyaWNTY2hlZHVsZXIiLCJudW1CZWF0cyIsIm1ldHJpY0RpdiIsImNhbGxiYWNrIiwiYmVhdExlbmd0aCIsIm1lYXN1cmVMZW5ndGgiLCJiZWF0UGVyaW9kIiwidW5kZWZpbmVkIiwibWVhc3VyZUNvdW50IiwiYmVhdENvdW50IiwidGltZSIsIm1hc3RlciIsIm1ldHJpY1Bvc2l0aW9uIiwiZmxvYXRNZWFzdXJlcyIsIk1hdGgiLCJmbG9vciIsIm1lYXN1cmVQaGFzZSIsIm1ldHJpY1NwZWVkIiwidGVtcG8iLCJ0ZW1wb1VuaXQiLCJjZWlsIiwic3RhcnRQb3NpdGlvbiIsInN0YXJ0VGltZSIsImdldFN5bmNUaW1lQXRNZXRyaWNQb3NpdGlvbiIsInJlc2V0RW5naW5lVGltZSIsImFkZCIsIkluZmluaXR5Iiwic3luYyIsInJlbW92ZSIsIlRpbWVFbmdpbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztJQUVxQkEsUzs7O0FBQ25CLHFCQUFZQyxTQUFaLEVBQXVCQyxlQUF2QixFQUF3Q0MsUUFBeEMsRUFBa0RDLFNBQWxELEVBQTZEQyxRQUE3RCxFQUF1RTtBQUFBOztBQUFBOztBQUdyRSxVQUFLSixTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFVBQUtDLGVBQUwsR0FBdUJBLGVBQXZCO0FBQ0EsVUFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxVQUFLQyxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFVBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCOztBQUVBLFVBQUtDLFVBQUwsR0FBa0IsSUFBSUYsU0FBdEI7QUFDQSxVQUFLRyxhQUFMLEdBQXFCSixXQUFXLE1BQUtHLFVBQXJDOztBQUVBLFVBQUtFLFVBQUwsR0FBa0JDLFNBQWxCO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQkQsU0FBcEI7QUFDQSxVQUFLRSxTQUFMLEdBQWlCRixTQUFqQjtBQWRxRTtBQWV0RTs7OztnQ0FFV0csSSxFQUFNO0FBQ2hCLFVBQUlGLGVBQWUsS0FBS0EsWUFBeEI7QUFDQSxVQUFJQyxZQUFZLEtBQUtBLFNBQXJCOztBQUVBLFdBQUtOLFFBQUwsQ0FBY0ssWUFBZCxFQUE0QkMsU0FBNUI7O0FBRUFBOztBQUVBLFVBQUlBLGFBQWEsS0FBS1IsUUFBdEIsRUFBZ0M7QUFDOUJPO0FBQ0FDLG9CQUFZLENBQVo7QUFDRDs7QUFFRCxXQUFLRCxZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLFdBQUtDLFNBQUwsR0FBaUJBLFNBQWpCOztBQUVBLGFBQU9DLE9BQU8sS0FBS0osVUFBbkI7QUFDRDs7OzJCQUVNO0FBQ0wsVUFBSSxLQUFLSyxNQUFULEVBQWlCO0FBQ2YsWUFBTUMsaUJBQWlCLEtBQUtaLGVBQUwsQ0FBcUJZLGNBQTVDO0FBQ0EsWUFBTUMsZ0JBQWdCRCxpQkFBaUIsS0FBS1AsYUFBNUM7QUFDQSxZQUFJRyxlQUFlTSxLQUFLQyxLQUFMLENBQVdGLGFBQVgsQ0FBbkI7QUFDQSxZQUFNRyxlQUFlSCxnQkFBZ0JMLFlBQXJDO0FBQ0EsWUFBTVMsY0FBYyxLQUFLakIsZUFBTCxDQUFxQmtCLEtBQXJCLEdBQTZCLEtBQUtsQixlQUFMLENBQXFCbUIsU0FBbEQsR0FBOEQsRUFBbEY7QUFDQSxZQUFJVixZQUFZSyxLQUFLTSxJQUFMLENBQVUsS0FBS25CLFFBQUwsR0FBZ0JlLFlBQTFCLENBQWhCOztBQUVBLFlBQUlQLGNBQWMsS0FBS1IsUUFBdkIsRUFBaUM7QUFDL0JPO0FBQ0FDLHNCQUFZLENBQVo7QUFDRDs7QUFFRCxhQUFLSCxVQUFMLEdBQWtCLEtBQUtGLFVBQUwsR0FBa0JhLFdBQXBDO0FBQ0EsYUFBS1QsWUFBTCxHQUFvQkEsWUFBcEIsQ0FkZSxDQWNtQjtBQUNsQyxhQUFLQyxTQUFMLEdBQWlCQSxTQUFqQixDQWZlLENBZWE7O0FBRTVCLFlBQU1ZLGdCQUFnQmIsZUFBZSxLQUFLSCxhQUFwQixHQUFvQ0ksWUFBWSxLQUFLTCxVQUEzRTtBQUNBLFlBQU1rQixZQUFZLEtBQUt0QixlQUFMLENBQXFCdUIsMkJBQXJCLENBQWlERixhQUFqRCxDQUFsQjtBQUNBLGFBQUt0QixTQUFMLENBQWV5QixlQUFmLENBQStCLElBQS9CLEVBQXFDRixTQUFyQztBQUNEO0FBQ0Y7Ozs0QkFFTztBQUNOLFVBQUksQ0FBQyxLQUFLWCxNQUFWLEVBQWtCO0FBQ2hCLGFBQUtaLFNBQUwsQ0FBZTBCLEdBQWYsQ0FBbUIsSUFBbkIsRUFBeUJDLFFBQXpCO0FBQ0EsYUFBS0MsSUFBTDtBQUNEO0FBQ0Y7OzsyQkFFTTtBQUNMLFVBQUksS0FBS2hCLE1BQVQsRUFDRSxLQUFLWixTQUFMLENBQWU2QixNQUFmLENBQXNCLElBQXRCO0FBQ0g7OztFQXZFb0NDLG9COztrQkFBbEIvQixTIiwiZmlsZSI6Ik1ldHJvbm9tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaW1lRW5naW5lIGZyb20gJy4vd2F2ZXMtYXVkaW8vdGltZS1lbmdpbmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRyb25vbWUgZXh0ZW5kcyBUaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3Ioc2NoZWR1bGVyLCBtZXRyaWNTY2hlZHVsZXIsIG51bUJlYXRzLCBtZXRyaWNEaXYsIGNhbGxiYWNrKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyID0gbWV0cmljU2NoZWR1bGVyO1xuICAgIHRoaXMubnVtQmVhdHMgPSBudW1CZWF0cztcbiAgICB0aGlzLm1ldHJpY0RpdiA9IG1ldHJpY0RpdjtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLmJlYXRMZW5ndGggPSAxIC8gbWV0cmljRGl2O1xuICAgIHRoaXMubWVhc3VyZUxlbmd0aCA9IG51bUJlYXRzICogdGhpcy5iZWF0TGVuZ3RoO1xuXG4gICAgdGhpcy5iZWF0UGVyaW9kID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubWVhc3VyZUNvdW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuYmVhdENvdW50ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgYWR2YW5jZVRpbWUodGltZSkge1xuICAgIGxldCBtZWFzdXJlQ291bnQgPSB0aGlzLm1lYXN1cmVDb3VudDtcbiAgICBsZXQgYmVhdENvdW50ID0gdGhpcy5iZWF0Q291bnQ7XG5cbiAgICB0aGlzLmNhbGxiYWNrKG1lYXN1cmVDb3VudCwgYmVhdENvdW50KTtcblxuICAgIGJlYXRDb3VudCsrO1xuXG4gICAgaWYgKGJlYXRDb3VudCA+PSB0aGlzLm51bUJlYXRzKSB7XG4gICAgICBtZWFzdXJlQ291bnQrKztcbiAgICAgIGJlYXRDb3VudCA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5tZWFzdXJlQ291bnQgPSBtZWFzdXJlQ291bnQ7XG4gICAgdGhpcy5iZWF0Q291bnQgPSBiZWF0Q291bnQ7XG5cbiAgICByZXR1cm4gdGltZSArIHRoaXMuYmVhdFBlcmlvZDtcbiAgfVxuXG4gIHN5bmMoKSB7XG4gICAgaWYgKHRoaXMubWFzdGVyKSB7XG4gICAgICBjb25zdCBtZXRyaWNQb3NpdGlvbiA9IHRoaXMubWV0cmljU2NoZWR1bGVyLm1ldHJpY1Bvc2l0aW9uO1xuICAgICAgY29uc3QgZmxvYXRNZWFzdXJlcyA9IG1ldHJpY1Bvc2l0aW9uIC8gdGhpcy5tZWFzdXJlTGVuZ3RoO1xuICAgICAgbGV0IG1lYXN1cmVDb3VudCA9IE1hdGguZmxvb3IoZmxvYXRNZWFzdXJlcyk7XG4gICAgICBjb25zdCBtZWFzdXJlUGhhc2UgPSBmbG9hdE1lYXN1cmVzIC0gbWVhc3VyZUNvdW50O1xuICAgICAgY29uc3QgbWV0cmljU3BlZWQgPSB0aGlzLm1ldHJpY1NjaGVkdWxlci50ZW1wbyAqIHRoaXMubWV0cmljU2NoZWR1bGVyLnRlbXBvVW5pdCAvIDYwO1xuICAgICAgbGV0IGJlYXRDb3VudCA9IE1hdGguY2VpbCh0aGlzLm51bUJlYXRzICogbWVhc3VyZVBoYXNlKTtcblxuICAgICAgaWYgKGJlYXRDb3VudCA9PT0gdGhpcy5udW1CZWF0cykge1xuICAgICAgICBtZWFzdXJlQ291bnQrKztcbiAgICAgICAgYmVhdENvdW50ID0gMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5iZWF0UGVyaW9kID0gdGhpcy5iZWF0TGVuZ3RoIC8gbWV0cmljU3BlZWQ7XG4gICAgICB0aGlzLm1lYXN1cmVDb3VudCA9IG1lYXN1cmVDb3VudDsgLy8gY3VycmVudCBtZWFzdXJlXG4gICAgICB0aGlzLmJlYXRDb3VudCA9IGJlYXRDb3VudDsgLy8gbmV4dCBiZWF0XG5cbiAgICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSBtZWFzdXJlQ291bnQgKiB0aGlzLm1lYXN1cmVMZW5ndGggKyBiZWF0Q291bnQgKiB0aGlzLmJlYXRMZW5ndGg7XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSB0aGlzLm1ldHJpY1NjaGVkdWxlci5nZXRTeW5jVGltZUF0TWV0cmljUG9zaXRpb24oc3RhcnRQb3NpdGlvbik7XG4gICAgICB0aGlzLnNjaGVkdWxlci5yZXNldEVuZ2luZVRpbWUodGhpcywgc3RhcnRUaW1lKTtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMubWFzdGVyKSB7XG4gICAgICB0aGlzLnNjaGVkdWxlci5hZGQodGhpcywgSW5maW5pdHkpO1xuICAgICAgdGhpcy5zeW5jKCk7XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICB0aGlzLnNjaGVkdWxlci5yZW1vdmUodGhpcyk7XG4gIH1cbn1cbiJdfQ==