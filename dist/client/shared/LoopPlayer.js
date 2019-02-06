'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

var _math = require('soundworks/utils/math');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audio = soundworks.audio;
var audioContext = soundworks.audioContext;
var audioScheduler = soundworks.audio.getScheduler();

function appendSegments(segments, loopSegment, measureDuration) {
  var buffer = loopSegment.buffer;
  var bufferDuration = buffer ? buffer.duration : 0;
  var startOffset = loopSegment.startOffset || 0;
  var gain = loopSegment.gain;
  var repeat = loopSegment.repeat || 1;

  for (var n = 0; n < repeat; n++) {
    var cont = !!loopSegment.continue;

    for (var i = 0; i < loopSegment.length; i++) {
      var offset = startOffset + i * measureDuration;

      if (offset < bufferDuration) {
        var segment = new Segment(buffer, offset, Infinity, 0, gain, cont);
        segments.push(segment);
      }

      cont = true;
    }
  }
}

var Segment = function Segment(buffer) {
  var offsetInBuffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var durationInBuffer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var offsetInMeasure = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var gain = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var cont = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  (0, _classCallCheck3.default)(this, Segment);

  this.buffer = buffer;
  this.offsetInBuffer = offsetInBuffer;
  this.durationInBuffer = durationInBuffer; // 0: continue untill next segment starts
  this.offsetInMeasure = offsetInMeasure;
  this.gain = gain;
  this.continue = cont; // segment continues previous segment
};

var SegmentTrack = function () {
  function SegmentTrack(output, segmentLayers) {
    var transitionTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.05;
    (0, _classCallCheck3.default)(this, SegmentTrack);

    this.src = audioContext.createBufferSource();

    this.segmentLayers = segmentLayers;
    this.transitionTime = transitionTime;

    this.minCutoffFreq = 5;
    this.maxCutoffFreq = audioContext.sampleRate / 2;
    this.logCutoffRatio = Math.log(this.maxCutoffFreq / this.minCutoffFreq);

    this.layerIndex = 0;
    this.discontinue = true;

    var cutoff = audioContext.createBiquadFilter();
    cutoff.connect(output);
    cutoff.type = 'lowpass';
    cutoff.frequency.value = this.maxCutoffFreq;

    this.src = null;
    this.env = null;
    this.cutoff = cutoff;
    this.endTime = 0;
  }

  (0, _createClass3.default)(SegmentTrack, [{
    key: 'startSegment',
    value: function startSegment(audioTime, segment) {
      var buffer = segment.buffer;
      var bufferDuration = buffer.duration;
      var offsetInBuffer = segment.offsetInBuffer;
      var durationInBuffer = Math.min(segment.durationInBuffer || Infinity, bufferDuration - offsetInBuffer);
      var transitionTime = this.transitionTime;

      if (audioTime < this.endTime - transitionTime) {
        var src = this.src;
        var endTime = Math.min(audioTime + transitionTime, this.endTime);

        if (transitionTime > 0) {
          var env = this.env;
          // env.gain.cancelScheduledValues(audioTime);
          env.gain.setValueAtTime(1, audioTime);
          env.gain.linearRampToValueAtTime(0, endTime);
        }

        src.stop(endTime);
      }

      if (offsetInBuffer < bufferDuration) {
        var delay = 0;

        if (offsetInBuffer < transitionTime) {
          delay = transitionTime - offsetInBuffer;
          transitionTime = offsetInBuffer;
        }

        var gain = audioContext.createGain();
        gain.connect(this.cutoff);
        gain.gain.value = (0, _math.decibelToLinear)(segment.gain);

        var _env = audioContext.createGain();
        _env.connect(gain);

        if (transitionTime > 0) {
          _env.gain.value = 0;
          _env.gain.setValueAtTime(0, audioTime + delay);
          _env.gain.linearRampToValueAtTime(1, audioTime + delay + transitionTime);
        }

        var _src = audioContext.createBufferSource();
        _src.connect(_env);
        _src.buffer = buffer;
        _src.start(audioTime + delay, offsetInBuffer - transitionTime);

        audioTime += transitionTime;

        var endInBuffer = offsetInBuffer + durationInBuffer;
        var _endTime = audioTime + durationInBuffer;

        this.src = _src;
        this.env = _env;
        this.endTime = _endTime;
      }
    }
  }, {
    key: 'stopSegment',
    value: function stopSegment() {
      var audioTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : audioContext.currentTime;

      var src = this.src;

      if (src) {
        var transitionTime = this.transitionTime;
        var env = this.env;

        env.gain.setValueAtTime(1, audioTime);
        env.gain.linearRampToValueAtTime(0, audioTime + transitionTime);

        src.stop(audioTime + transitionTime);

        this.src = null;
        this.env = null;
        this.endTime = 0;
      }
    }
  }, {
    key: 'startMeasure',
    value: function startMeasure(audioTime, measureIndex) {
      var canContinue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var segments = this.segmentLayers[this.layerIndex];
      var measureIndexInPattern = measureIndex % segments.length;
      var segment = segments[measureIndexInPattern];

      if (segment && (this.discontinue || !(segment.continue && canContinue))) {
        var delay = segment.offsetInMeasure || 0;
        this.startSegment(audioTime + delay, segment);
        this.discontinue = false;
      }
    }
  }, {
    key: 'setCutoff',
    value: function setCutoff(value) {
      var cutoffFreq = this.minCutoffFreq * Math.exp(this.logCutoffRatio * value);
      this.cutoff.frequency.value = cutoffFreq;
    }
  }, {
    key: 'setLayer',
    value: function setLayer(value) {
      this.layerIndex = value;
      this.discontinue = true;
    }
  }]);
  return SegmentTrack;
}();

var LoopPlayer = function (_audio$TimeEngine) {
  (0, _inherits3.default)(LoopPlayer, _audio$TimeEngine);

  function LoopPlayer(metricScheduler, audioOutputs) {
    var measureLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var tempo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 120;
    var tempoUnit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1 / 4;
    var transitionTime = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.05;
    var measureCallback = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : function (measureCount) {};
    (0, _classCallCheck3.default)(this, LoopPlayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (LoopPlayer.__proto__ || (0, _getPrototypeOf2.default)(LoopPlayer)).call(this));

    _this.metricScheduler = metricScheduler;
    _this.audioOutputs = audioOutputs;
    _this.measureLength = measureLength;
    _this.tempo = tempo;
    _this.tempoUnit = tempoUnit;
    _this.transitionTime = transitionTime;
    _this.measureCallback = measureCallback;

    _this.measureDuration = 60 / (tempo * tempoUnit);
    _this.measureIndex = undefined;
    _this.segmentTracks = new _map2.default();

    _this.metricScheduler.add(_this);
    return _this;
  }

  (0, _createClass3.default)(LoopPlayer, [{
    key: 'stopAllTracks',
    value: function stopAllTracks() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.segmentTracks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
              index = _step$value[0],
              segmentTrack = _step$value[1];

          segmentTrack.stopSegment();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'syncSpeed',
    value: function syncSpeed(syncTime, metricPosition, metricSpeed) {
      if (metricSpeed === 0) this.stopAllTracks();
    }
  }, {
    key: 'syncPosition',
    value: function syncPosition(syncTime, metricPosition, metricSpeed) {
      var audioTime = audioScheduler.currentTime;
      var floatMeasures = metricPosition / this.measureLength;
      var numMeasures = Math.ceil(floatMeasures);
      var nextMeasurePosition = numMeasures * this.measureLength;

      this.measureIndex = numMeasures - 1;
      this.nextMeasureTime = undefined;

      return nextMeasurePosition;
    }
  }, {
    key: 'advancePosition',
    value: function advancePosition(syncTime, metricPosition, metricSpeed) {
      var audioTime = audioScheduler.currentTime;

      this.measureIndex++;

      var canContinue = this.nextMeasureTime && Math.abs(audioTime - this.nextMeasureTime) < 0.01;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.segmentTracks), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
              index = _step2$value[0],
              segmentTrack = _step2$value[1];

          segmentTrack.startMeasure(audioTime, this.measureIndex, canContinue);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.measureCallback(audioTime, this.measureIndex);

      this.nextMeasureTime = audioTime + this.measureDuration;

      return metricPosition + this.measureLength;
    }
  }, {
    key: 'getLoopTrack',
    value: function getLoopTrack(index) {
      return this.segmentTracks.get(index);
    }
  }, {
    key: 'removeLoopTrack',
    value: function removeLoopTrack(index) {
      var segmentTrack = this.segmentTracks.get(index);

      if (segmentTrack) {
        segmentTrack.stopSegment();
        this.segmentTracks.delete(index);
      }
    }
  }, {
    key: 'addLoopTrack',
    value: function addLoopTrack(index, loopLayers) {
      var _this2 = this;

      var segmentTrack = this.segmentTracks.get(index);

      if (segmentTrack) throw new Error('Cannot add segment track twice (index: ' + index + ')');

      var segmentLayers = [];

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop = function _loop() {
          var layer = _step3.value;

          var segments = [];

          if (Array.isArray(layer)) layer.forEach(function (seg) {
            return appendSegments(segments, seg, _this2.measureDuration);
          });else appendSegments(segments, layer, _this2.measureDuration);

          segmentLayers.push(segments);
        };

        for (var _iterator3 = (0, _getIterator3.default)(loopLayers), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      segmentTrack = new SegmentTrack(this.audioOutputs[index], segmentLayers, this.transitionTime);
      this.segmentTracks.set(index, segmentTrack);
    }
  }, {
    key: 'setCutoff',
    value: function setCutoff(index, value) {
      var segmentTrack = this.segmentTracks.get(index);

      if (segmentTrack) segmentTrack.setCutoff(value);
    }
  }, {
    key: 'setLayer',
    value: function setLayer(index, value) {
      var segmentTrack = this.segmentTracks.get(index);

      if (segmentTrack) segmentTrack.setLayer(value);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.stopAllTracks();
      this.metricScheduler.remove(this);
    }
  }]);
  return LoopPlayer;
}(audio.TimeEngine);

exports.default = LoopPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvb3BQbGF5ZXIuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImF1ZGlvIiwiYXVkaW9Db250ZXh0IiwiYXVkaW9TY2hlZHVsZXIiLCJnZXRTY2hlZHVsZXIiLCJhcHBlbmRTZWdtZW50cyIsInNlZ21lbnRzIiwibG9vcFNlZ21lbnQiLCJtZWFzdXJlRHVyYXRpb24iLCJidWZmZXIiLCJidWZmZXJEdXJhdGlvbiIsImR1cmF0aW9uIiwic3RhcnRPZmZzZXQiLCJnYWluIiwicmVwZWF0IiwibiIsImNvbnQiLCJjb250aW51ZSIsImkiLCJsZW5ndGgiLCJvZmZzZXQiLCJzZWdtZW50IiwiU2VnbWVudCIsIkluZmluaXR5IiwicHVzaCIsIm9mZnNldEluQnVmZmVyIiwiZHVyYXRpb25JbkJ1ZmZlciIsIm9mZnNldEluTWVhc3VyZSIsIlNlZ21lbnRUcmFjayIsIm91dHB1dCIsInNlZ21lbnRMYXllcnMiLCJ0cmFuc2l0aW9uVGltZSIsInNyYyIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsIm1pbkN1dG9mZkZyZXEiLCJtYXhDdXRvZmZGcmVxIiwic2FtcGxlUmF0ZSIsImxvZ0N1dG9mZlJhdGlvIiwiTWF0aCIsImxvZyIsImxheWVySW5kZXgiLCJkaXNjb250aW51ZSIsImN1dG9mZiIsImNyZWF0ZUJpcXVhZEZpbHRlciIsImNvbm5lY3QiLCJ0eXBlIiwiZnJlcXVlbmN5IiwidmFsdWUiLCJlbnYiLCJlbmRUaW1lIiwiYXVkaW9UaW1lIiwibWluIiwic2V0VmFsdWVBdFRpbWUiLCJsaW5lYXJSYW1wVG9WYWx1ZUF0VGltZSIsInN0b3AiLCJkZWxheSIsImNyZWF0ZUdhaW4iLCJzdGFydCIsImVuZEluQnVmZmVyIiwiY3VycmVudFRpbWUiLCJtZWFzdXJlSW5kZXgiLCJjYW5Db250aW51ZSIsIm1lYXN1cmVJbmRleEluUGF0dGVybiIsInN0YXJ0U2VnbWVudCIsImN1dG9mZkZyZXEiLCJleHAiLCJMb29wUGxheWVyIiwibWV0cmljU2NoZWR1bGVyIiwiYXVkaW9PdXRwdXRzIiwibWVhc3VyZUxlbmd0aCIsInRlbXBvIiwidGVtcG9Vbml0IiwibWVhc3VyZUNhbGxiYWNrIiwibWVhc3VyZUNvdW50IiwidW5kZWZpbmVkIiwic2VnbWVudFRyYWNrcyIsImFkZCIsImluZGV4Iiwic2VnbWVudFRyYWNrIiwic3RvcFNlZ21lbnQiLCJzeW5jVGltZSIsIm1ldHJpY1Bvc2l0aW9uIiwibWV0cmljU3BlZWQiLCJzdG9wQWxsVHJhY2tzIiwiZmxvYXRNZWFzdXJlcyIsIm51bU1lYXN1cmVzIiwiY2VpbCIsIm5leHRNZWFzdXJlUG9zaXRpb24iLCJuZXh0TWVhc3VyZVRpbWUiLCJhYnMiLCJzdGFydE1lYXN1cmUiLCJnZXQiLCJkZWxldGUiLCJsb29wTGF5ZXJzIiwiRXJyb3IiLCJsYXllciIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJzZWciLCJzZXQiLCJzZXRDdXRvZmYiLCJzZXRMYXllciIsInJlbW92ZSIsIlRpbWVFbmdpbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLFU7O0FBQ1o7Ozs7OztBQUVBLElBQU1DLFFBQVFELFdBQVdDLEtBQXpCO0FBQ0EsSUFBTUMsZUFBZUYsV0FBV0UsWUFBaEM7QUFDQSxJQUFNQyxpQkFBaUJILFdBQVdDLEtBQVgsQ0FBaUJHLFlBQWpCLEVBQXZCOztBQUVBLFNBQVNDLGNBQVQsQ0FBd0JDLFFBQXhCLEVBQWtDQyxXQUFsQyxFQUErQ0MsZUFBL0MsRUFBZ0U7QUFDOUQsTUFBTUMsU0FBU0YsWUFBWUUsTUFBM0I7QUFDQSxNQUFNQyxpQkFBaUJELFNBQVNBLE9BQU9FLFFBQWhCLEdBQTJCLENBQWxEO0FBQ0EsTUFBTUMsY0FBY0wsWUFBWUssV0FBWixJQUEyQixDQUEvQztBQUNBLE1BQU1DLE9BQU9OLFlBQVlNLElBQXpCO0FBQ0EsTUFBTUMsU0FBU1AsWUFBWU8sTUFBWixJQUFzQixDQUFyQzs7QUFFQSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEs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QUFlQyxRQUFmLEVBQXlCeUYsS0FBekIsRUFBZ0MsT0FBS3ZGLGVBQXJDOztBQUVGc0Isd0JBQWNOLElBQWQsQ0FBbUJsQixRQUFuQjtBQWhCNEI7O0FBUTlCLHlEQUFrQnVGLFVBQWxCLGlIQUE4QjtBQUFBO0FBUzdCO0FBakI2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQW1COUJmLHFCQUFlLElBQUlsRCxZQUFKLENBQWlCLEtBQUt3QyxZQUFMLENBQWtCUyxLQUFsQixDQUFqQixFQUEyQy9DLGFBQTNDLEVBQTBELEtBQUtDLGNBQS9ELENBQWY7QUFDQSxXQUFLNEMsYUFBTCxDQUFtQnlCLEdBQW5CLENBQXVCdkIsS0FBdkIsRUFBOEJDLFlBQTlCO0FBQ0Q7Ozs4QkFFU0QsSyxFQUFPOUIsSyxFQUFPO0FBQ3RCLFVBQU0rQixlQUFlLEtBQUtILGFBQUwsQ0FBbUJnQixHQUFuQixDQUF1QmQsS0FBdkIsQ0FBckI7O0FBRUEsVUFBSUMsWUFBSixFQUNFQSxhQUFhdUIsU0FBYixDQUF1QnRELEtBQXZCO0FBQ0g7Ozs2QkFFUThCLEssRUFBTzlCLEssRUFBTztBQUNyQixVQUFNK0IsZUFBZSxLQUFLSCxhQUFMLENBQW1CZ0IsR0FBbkIsQ0FBdUJkLEtBQXZCLENBQXJCOztBQUVBLFVBQUlDLFlBQUosRUFDRUEsYUFBYXdCLFFBQWIsQ0FBc0J2RCxLQUF0QjtBQUNIOzs7OEJBRVM7QUFDUixXQUFLb0MsYUFBTDtBQUNBLFdBQUtoQixlQUFMLENBQXFCb0MsTUFBckIsQ0FBNEIsSUFBNUI7QUFDRDs7O0VBL0dxQ3RHLE1BQU11RyxVOztrQkFBekJ0QyxVIiwiZmlsZSI6Ikxvb3BQbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCB7IGRlY2liZWxUb0xpbmVhciB9IGZyb20gJ3NvdW5kd29ya3MvdXRpbHMvbWF0aCc7XG5cbmNvbnN0IGF1ZGlvID0gc291bmR3b3Jrcy5hdWRpbztcbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgYXVkaW9TY2hlZHVsZXIgPSBzb3VuZHdvcmtzLmF1ZGlvLmdldFNjaGVkdWxlcigpO1xuXG5mdW5jdGlvbiBhcHBlbmRTZWdtZW50cyhzZWdtZW50cywgbG9vcFNlZ21lbnQsIG1lYXN1cmVEdXJhdGlvbikge1xuICBjb25zdCBidWZmZXIgPSBsb29wU2VnbWVudC5idWZmZXI7XG4gIGNvbnN0IGJ1ZmZlckR1cmF0aW9uID0gYnVmZmVyID8gYnVmZmVyLmR1cmF0aW9uIDogMDtcbiAgY29uc3Qgc3RhcnRPZmZzZXQgPSBsb29wU2VnbWVudC5zdGFydE9mZnNldCB8fCAwO1xuICBjb25zdCBnYWluID0gbG9vcFNlZ21lbnQuZ2FpbjtcbiAgY29uc3QgcmVwZWF0ID0gbG9vcFNlZ21lbnQucmVwZWF0IHx8IDE7XG5cbiAgZm9yIChsZXQgbiA9IDA7IG4gPCByZXBlYXQ7IG4rKykge1xuICAgIGxldCBjb250ID0gISFsb29wU2VnbWVudC5jb250aW51ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcFNlZ21lbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHN0YXJ0T2Zmc2V0ICsgaSAqIG1lYXN1cmVEdXJhdGlvbjtcblxuICAgICAgaWYgKG9mZnNldCA8IGJ1ZmZlckR1cmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNlZ21lbnQgPSBuZXcgU2VnbWVudChidWZmZXIsIG9mZnNldCwgSW5maW5pdHksIDAsIGdhaW4sIGNvbnQpO1xuICAgICAgICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuXG4gICAgICBjb250ID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU2VnbWVudCB7XG4gIGNvbnN0cnVjdG9yKGJ1ZmZlciwgb2Zmc2V0SW5CdWZmZXIgPSAwLCBkdXJhdGlvbkluQnVmZmVyID0gSW5maW5pdHksIG9mZnNldEluTWVhc3VyZSA9IDAsIGdhaW4gPSAwLCBjb250ID0gZmFsc2UpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICB0aGlzLm9mZnNldEluQnVmZmVyID0gb2Zmc2V0SW5CdWZmZXI7XG4gICAgdGhpcy5kdXJhdGlvbkluQnVmZmVyID0gZHVyYXRpb25JbkJ1ZmZlcjsgLy8gMDogY29udGludWUgdW50aWxsIG5leHQgc2VnbWVudCBzdGFydHNcbiAgICB0aGlzLm9mZnNldEluTWVhc3VyZSA9IG9mZnNldEluTWVhc3VyZTtcbiAgICB0aGlzLmdhaW4gPSBnYWluO1xuICAgIHRoaXMuY29udGludWUgPSBjb250OyAvLyBzZWdtZW50IGNvbnRpbnVlcyBwcmV2aW91cyBzZWdtZW50XG4gIH1cbn1cblxuY2xhc3MgU2VnbWVudFRyYWNrIHtcbiAgY29uc3RydWN0b3Iob3V0cHV0LCBzZWdtZW50TGF5ZXJzLCB0cmFuc2l0aW9uVGltZSA9IDAuMDUpIHtcbiAgICB0aGlzLnNyYyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblxuICAgIHRoaXMuc2VnbWVudExheWVycyA9IHNlZ21lbnRMYXllcnM7XG4gICAgdGhpcy50cmFuc2l0aW9uVGltZSA9IHRyYW5zaXRpb25UaW1lO1xuXG4gICAgdGhpcy5taW5DdXRvZmZGcmVxID0gNTtcbiAgICB0aGlzLm1heEN1dG9mZkZyZXEgPSBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSAvIDI7XG4gICAgdGhpcy5sb2dDdXRvZmZSYXRpbyA9IE1hdGgubG9nKHRoaXMubWF4Q3V0b2ZmRnJlcSAvIHRoaXMubWluQ3V0b2ZmRnJlcSk7XG5cbiAgICB0aGlzLmxheWVySW5kZXggPSAwO1xuICAgIHRoaXMuZGlzY29udGludWUgPSB0cnVlO1xuXG4gICAgY29uc3QgY3V0b2ZmID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgIGN1dG9mZi5jb25uZWN0KG91dHB1dCk7XG4gICAgY3V0b2ZmLnR5cGUgPSAnbG93cGFzcyc7XG4gICAgY3V0b2ZmLmZyZXF1ZW5jeS52YWx1ZSA9IHRoaXMubWF4Q3V0b2ZmRnJlcTtcblxuICAgIHRoaXMuc3JjID0gbnVsbDtcbiAgICB0aGlzLmVudiA9IG51bGw7XG4gICAgdGhpcy5jdXRvZmYgPSBjdXRvZmY7XG4gICAgdGhpcy5lbmRUaW1lID0gMDtcbiAgfVxuXG4gIHN0YXJ0U2VnbWVudChhdWRpb1RpbWUsIHNlZ21lbnQpIHtcbiAgICBjb25zdCBidWZmZXIgPSBzZWdtZW50LmJ1ZmZlcjtcbiAgICBjb25zdCBidWZmZXJEdXJhdGlvbiA9IGJ1ZmZlci5kdXJhdGlvbjtcbiAgICBjb25zdCBvZmZzZXRJbkJ1ZmZlciA9IHNlZ21lbnQub2Zmc2V0SW5CdWZmZXI7XG4gICAgY29uc3QgZHVyYXRpb25JbkJ1ZmZlciA9IE1hdGgubWluKChzZWdtZW50LmR1cmF0aW9uSW5CdWZmZXIgfHwgSW5maW5pdHkpLCBidWZmZXJEdXJhdGlvbiAtIG9mZnNldEluQnVmZmVyKTtcbiAgICBsZXQgdHJhbnNpdGlvblRpbWUgPSB0aGlzLnRyYW5zaXRpb25UaW1lO1xuXG4gICAgaWYgKGF1ZGlvVGltZSA8IHRoaXMuZW5kVGltZSAtIHRyYW5zaXRpb25UaW1lKSB7XG4gICAgICBjb25zdCBzcmMgPSB0aGlzLnNyYztcbiAgICAgIGNvbnN0IGVuZFRpbWUgPSBNYXRoLm1pbihhdWRpb1RpbWUgKyB0cmFuc2l0aW9uVGltZSwgdGhpcy5lbmRUaW1lKTtcblxuICAgICAgaWYgKHRyYW5zaXRpb25UaW1lID4gMCkge1xuICAgICAgICBjb25zdCBlbnYgPSB0aGlzLmVudjtcbiAgICAgICAgLy8gZW52LmdhaW4uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKGF1ZGlvVGltZSk7XG4gICAgICAgIGVudi5nYWluLnNldFZhbHVlQXRUaW1lKDEsIGF1ZGlvVGltZSk7XG4gICAgICAgIGVudi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGVuZFRpbWUpO1xuICAgICAgfVxuXG4gICAgICBzcmMuc3RvcChlbmRUaW1lKTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0SW5CdWZmZXIgPCBidWZmZXJEdXJhdGlvbikge1xuICAgICAgbGV0IGRlbGF5ID0gMDtcblxuICAgICAgaWYgKG9mZnNldEluQnVmZmVyIDwgdHJhbnNpdGlvblRpbWUpIHtcbiAgICAgICAgZGVsYXkgPSB0cmFuc2l0aW9uVGltZSAtIG9mZnNldEluQnVmZmVyO1xuICAgICAgICB0cmFuc2l0aW9uVGltZSA9IG9mZnNldEluQnVmZmVyO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIGdhaW4uY29ubmVjdCh0aGlzLmN1dG9mZik7XG4gICAgICBnYWluLmdhaW4udmFsdWUgPSBkZWNpYmVsVG9MaW5lYXIoc2VnbWVudC5nYWluKTtcblxuICAgICAgY29uc3QgZW52ID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIGVudi5jb25uZWN0KGdhaW4pO1xuXG4gICAgICBpZiAodHJhbnNpdGlvblRpbWUgPiAwKSB7XG4gICAgICAgIGVudi5nYWluLnZhbHVlID0gMDtcbiAgICAgICAgZW52LmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgYXVkaW9UaW1lICsgZGVsYXkpO1xuICAgICAgICBlbnYuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCBhdWRpb1RpbWUgKyBkZWxheSArIHRyYW5zaXRpb25UaW1lKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgc3JjLmNvbm5lY3QoZW52KTtcbiAgICAgIHNyYy5idWZmZXIgPSBidWZmZXI7XG4gICAgICBzcmMuc3RhcnQoYXVkaW9UaW1lICsgZGVsYXksIG9mZnNldEluQnVmZmVyIC0gdHJhbnNpdGlvblRpbWUpO1xuXG4gICAgICBhdWRpb1RpbWUgKz0gdHJhbnNpdGlvblRpbWU7XG5cbiAgICAgIGNvbnN0IGVuZEluQnVmZmVyID0gb2Zmc2V0SW5CdWZmZXIgKyBkdXJhdGlvbkluQnVmZmVyO1xuICAgICAgbGV0IGVuZFRpbWUgPSBhdWRpb1RpbWUgKyBkdXJhdGlvbkluQnVmZmVyO1xuXG4gICAgICB0aGlzLnNyYyA9IHNyYztcbiAgICAgIHRoaXMuZW52ID0gZW52O1xuICAgICAgdGhpcy5lbmRUaW1lID0gZW5kVGltZTtcbiAgICB9XG4gIH1cblxuICBzdG9wU2VnbWVudChhdWRpb1RpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpIHtcbiAgICBjb25zdCBzcmMgPSB0aGlzLnNyYztcblxuICAgIGlmIChzcmMpIHtcbiAgICAgIGNvbnN0IHRyYW5zaXRpb25UaW1lID0gdGhpcy50cmFuc2l0aW9uVGltZTtcbiAgICAgIGNvbnN0IGVudiA9IHRoaXMuZW52O1xuXG4gICAgICBlbnYuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgxLCBhdWRpb1RpbWUpO1xuICAgICAgZW52LmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgYXVkaW9UaW1lICsgdHJhbnNpdGlvblRpbWUpO1xuXG4gICAgICBzcmMuc3RvcChhdWRpb1RpbWUgKyB0cmFuc2l0aW9uVGltZSk7XG5cbiAgICAgIHRoaXMuc3JjID0gbnVsbDtcbiAgICAgIHRoaXMuZW52ID0gbnVsbDtcbiAgICAgIHRoaXMuZW5kVGltZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgc3RhcnRNZWFzdXJlKGF1ZGlvVGltZSwgbWVhc3VyZUluZGV4LCBjYW5Db250aW51ZSA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRMYXllcnNbdGhpcy5sYXllckluZGV4XTtcbiAgICBjb25zdCBtZWFzdXJlSW5kZXhJblBhdHRlcm4gPSBtZWFzdXJlSW5kZXggJSBzZWdtZW50cy5sZW5ndGg7XG4gICAgY29uc3Qgc2VnbWVudCA9IHNlZ21lbnRzW21lYXN1cmVJbmRleEluUGF0dGVybl07XG5cbiAgICBpZiAoc2VnbWVudCAmJiAodGhpcy5kaXNjb250aW51ZSB8fCAhKHNlZ21lbnQuY29udGludWUgJiYgY2FuQ29udGludWUpKSkge1xuICAgICAgY29uc3QgZGVsYXkgPSBzZWdtZW50Lm9mZnNldEluTWVhc3VyZSB8fCAwO1xuICAgICAgdGhpcy5zdGFydFNlZ21lbnQoYXVkaW9UaW1lICsgZGVsYXksIHNlZ21lbnQpO1xuICAgICAgdGhpcy5kaXNjb250aW51ZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHNldEN1dG9mZih2YWx1ZSkge1xuICAgIGNvbnN0IGN1dG9mZkZyZXEgPSB0aGlzLm1pbkN1dG9mZkZyZXEgKiBNYXRoLmV4cCh0aGlzLmxvZ0N1dG9mZlJhdGlvICogdmFsdWUpO1xuICAgIHRoaXMuY3V0b2ZmLmZyZXF1ZW5jeS52YWx1ZSA9IGN1dG9mZkZyZXE7XG4gIH1cblxuICBzZXRMYXllcih2YWx1ZSkge1xuICAgIHRoaXMubGF5ZXJJbmRleCA9IHZhbHVlO1xuICAgIHRoaXMuZGlzY29udGludWUgPSB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3BQbGF5ZXIgZXh0ZW5kcyBhdWRpby5UaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IobWV0cmljU2NoZWR1bGVyLCBhdWRpb091dHB1dHMsIG1lYXN1cmVMZW5ndGggPSAxLCB0ZW1wbyA9IDEyMCwgdGVtcG9Vbml0ID0gMSAvIDQsIHRyYW5zaXRpb25UaW1lID0gMC4wNSwgbWVhc3VyZUNhbGxiYWNrID0gZnVuY3Rpb24obWVhc3VyZUNvdW50KSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1ldHJpY1NjaGVkdWxlciA9IG1ldHJpY1NjaGVkdWxlcjtcbiAgICB0aGlzLmF1ZGlvT3V0cHV0cyA9IGF1ZGlvT3V0cHV0cztcbiAgICB0aGlzLm1lYXN1cmVMZW5ndGggPSBtZWFzdXJlTGVuZ3RoO1xuICAgIHRoaXMudGVtcG8gPSB0ZW1wbztcbiAgICB0aGlzLnRlbXBvVW5pdCA9IHRlbXBvVW5pdDtcbiAgICB0aGlzLnRyYW5zaXRpb25UaW1lID0gdHJhbnNpdGlvblRpbWU7XG4gICAgdGhpcy5tZWFzdXJlQ2FsbGJhY2sgPSBtZWFzdXJlQ2FsbGJhY2s7XG5cbiAgICB0aGlzLm1lYXN1cmVEdXJhdGlvbiA9IDYwIC8gKHRlbXBvICogdGVtcG9Vbml0KTtcbiAgICB0aGlzLm1lYXN1cmVJbmRleCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlZ21lbnRUcmFja3MgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLm1ldHJpY1NjaGVkdWxlci5hZGQodGhpcyk7XG4gIH1cblxuICBzdG9wQWxsVHJhY2tzKCkge1xuICAgIGZvciAobGV0IFtpbmRleCwgc2VnbWVudFRyYWNrXSBvZiB0aGlzLnNlZ21lbnRUcmFja3MpXG4gICAgICBzZWdtZW50VHJhY2suc3RvcFNlZ21lbnQoKTtcbiAgfVxuXG4gIHN5bmNTcGVlZChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIG1ldHJpY1NwZWVkKSB7XG4gICAgaWYgKG1ldHJpY1NwZWVkID09PSAwKVxuICAgICAgdGhpcy5zdG9wQWxsVHJhY2tzKCk7XG4gIH1cblxuICBzeW5jUG9zaXRpb24oc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCBtZXRyaWNTcGVlZCkge1xuICAgIGNvbnN0IGF1ZGlvVGltZSA9IGF1ZGlvU2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgIGNvbnN0IGZsb2F0TWVhc3VyZXMgPSBtZXRyaWNQb3NpdGlvbiAvIHRoaXMubWVhc3VyZUxlbmd0aDtcbiAgICBjb25zdCBudW1NZWFzdXJlcyA9IE1hdGguY2VpbChmbG9hdE1lYXN1cmVzKTtcbiAgICBjb25zdCBuZXh0TWVhc3VyZVBvc2l0aW9uID0gbnVtTWVhc3VyZXMgKiB0aGlzLm1lYXN1cmVMZW5ndGg7XG5cbiAgICB0aGlzLm1lYXN1cmVJbmRleCA9IG51bU1lYXN1cmVzIC0gMTtcbiAgICB0aGlzLm5leHRNZWFzdXJlVGltZSA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBuZXh0TWVhc3VyZVBvc2l0aW9uO1xuICB9XG5cbiAgYWR2YW5jZVBvc2l0aW9uKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgbWV0cmljU3BlZWQpIHtcbiAgICBjb25zdCBhdWRpb1RpbWUgPSBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZTtcblxuICAgIHRoaXMubWVhc3VyZUluZGV4Kys7XG5cbiAgICBjb25zdCBjYW5Db250aW51ZSA9ICh0aGlzLm5leHRNZWFzdXJlVGltZSAmJiBNYXRoLmFicyhhdWRpb1RpbWUgLSB0aGlzLm5leHRNZWFzdXJlVGltZSkgPCAwLjAxKTtcblxuICAgIGZvciAobGV0IFtpbmRleCwgc2VnbWVudFRyYWNrXSBvZiB0aGlzLnNlZ21lbnRUcmFja3MpXG4gICAgICBzZWdtZW50VHJhY2suc3RhcnRNZWFzdXJlKGF1ZGlvVGltZSwgdGhpcy5tZWFzdXJlSW5kZXgsIGNhbkNvbnRpbnVlKTtcblxuICAgIHRoaXMubWVhc3VyZUNhbGxiYWNrKGF1ZGlvVGltZSwgdGhpcy5tZWFzdXJlSW5kZXgpO1xuXG4gICAgdGhpcy5uZXh0TWVhc3VyZVRpbWUgPSBhdWRpb1RpbWUgKyB0aGlzLm1lYXN1cmVEdXJhdGlvbjtcblxuICAgIHJldHVybiBtZXRyaWNQb3NpdGlvbiArIHRoaXMubWVhc3VyZUxlbmd0aDtcbiAgfVxuXG4gIGdldExvb3BUcmFjayhpbmRleCkge1xuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUcmFja3MuZ2V0KGluZGV4KTtcbiAgfVxuXG4gIHJlbW92ZUxvb3BUcmFjayhpbmRleCkge1xuICAgIGNvbnN0IHNlZ21lbnRUcmFjayA9IHRoaXMuc2VnbWVudFRyYWNrcy5nZXQoaW5kZXgpO1xuXG4gICAgaWYgKHNlZ21lbnRUcmFjaykge1xuICAgICAgc2VnbWVudFRyYWNrLnN0b3BTZWdtZW50KCk7XG4gICAgICB0aGlzLnNlZ21lbnRUcmFja3MuZGVsZXRlKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBhZGRMb29wVHJhY2soaW5kZXgsIGxvb3BMYXllcnMpIHtcbiAgICBsZXQgc2VnbWVudFRyYWNrID0gdGhpcy5zZWdtZW50VHJhY2tzLmdldChpbmRleCk7XG5cbiAgICBpZiAoc2VnbWVudFRyYWNrKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgYWRkIHNlZ21lbnQgdHJhY2sgdHdpY2UgKGluZGV4OiAke2luZGV4fSlgKTtcblxuICAgIGNvbnN0IHNlZ21lbnRMYXllcnMgPSBbXTtcblxuICAgIGZvciAobGV0IGxheWVyIG9mIGxvb3BMYXllcnMpIHtcbiAgICAgIGNvbnN0IHNlZ21lbnRzID0gW107XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGxheWVyKSlcbiAgICAgICAgbGF5ZXIuZm9yRWFjaCgoc2VnKSA9PiBhcHBlbmRTZWdtZW50cyhzZWdtZW50cywgc2VnLCB0aGlzLm1lYXN1cmVEdXJhdGlvbikpO1xuICAgICAgZWxzZVxuICAgICAgICBhcHBlbmRTZWdtZW50cyhzZWdtZW50cywgbGF5ZXIsIHRoaXMubWVhc3VyZUR1cmF0aW9uKTtcblxuICAgICAgc2VnbWVudExheWVycy5wdXNoKHNlZ21lbnRzKTtcbiAgICB9XG5cbiAgICBzZWdtZW50VHJhY2sgPSBuZXcgU2VnbWVudFRyYWNrKHRoaXMuYXVkaW9PdXRwdXRzW2luZGV4XSwgc2VnbWVudExheWVycywgdGhpcy50cmFuc2l0aW9uVGltZSk7XG4gICAgdGhpcy5zZWdtZW50VHJhY2tzLnNldChpbmRleCwgc2VnbWVudFRyYWNrKTtcbiAgfVxuXG4gIHNldEN1dG9mZihpbmRleCwgdmFsdWUpIHtcbiAgICBjb25zdCBzZWdtZW50VHJhY2sgPSB0aGlzLnNlZ21lbnRUcmFja3MuZ2V0KGluZGV4KTtcblxuICAgIGlmIChzZWdtZW50VHJhY2spXG4gICAgICBzZWdtZW50VHJhY2suc2V0Q3V0b2ZmKHZhbHVlKTtcbiAgfVxuXG4gIHNldExheWVyKGluZGV4LCB2YWx1ZSkge1xuICAgIGNvbnN0IHNlZ21lbnRUcmFjayA9IHRoaXMuc2VnbWVudFRyYWNrcy5nZXQoaW5kZXgpO1xuXG4gICAgaWYgKHNlZ21lbnRUcmFjaylcbiAgICAgIHNlZ21lbnRUcmFjay5zZXRMYXllcih2YWx1ZSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuc3RvcEFsbFRyYWNrcygpO1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyLnJlbW92ZSh0aGlzKTtcbiAgfVxufVxuIl19