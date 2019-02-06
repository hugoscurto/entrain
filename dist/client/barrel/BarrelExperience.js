'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

var _math = require('soundworks/utils/math');

var _scenesConfig = require('../../shared/scenes-config');

var _scenesConfig2 = _interopRequireDefault(_scenesConfig);

var _off = require('./scenes/off');

var _off2 = _interopRequireDefault(_off);

var _co = require('./scenes/co-909');

var _co2 = _interopRequireDefault(_co);

var _collectiveLoops = require('./scenes/collective-loops');

var _collectiveLoops2 = _interopRequireDefault(_collectiveLoops);

var _coMix = require('./scenes/co-mix');

var _coMix2 = _interopRequireDefault(_coMix);

var _wwryR = require('./scenes/wwry-r');

var _wwryR2 = _interopRequireDefault(_wwryR);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioContext = soundworks.audioContext;

var sceneCtors = {
  'off': _off2.default,
  'co-909': _co2.default,
  'collective-loops': _collectiveLoops2.default,
  'co-mix': _coMix2.default,
  'wwry-r': _wwryR2.default
};

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="flex-middle">\n      <p class="big">Barrel</p>\n    </div>\n  </div>\n';

var numOutputChannels = 8; // "virtual" output channels
var maxAudioDestinationChannels = audioContext.destination.maxChannelCount;
var numAudioOutputs = maxAudioDestinationChannels ? Math.min(numOutputChannels, maxAudioDestinationChannels) : 2; // "physical" audio outputs

var BarrelExperience = function (_soundworks$Experienc) {
  (0, _inherits3.default)(BarrelExperience, _soundworks$Experienc);

  function BarrelExperience(assetsDomain) {
    (0, _classCallCheck3.default)(this, BarrelExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BarrelExperience.__proto__ || (0, _getPrototypeOf2.default)(BarrelExperience)).call(this));

    _this.platform = _this.require('platform', { features: ['web-audio'], showDialog: true });
    _this.sharedParams = _this.require('shared-params');
    _this.audioBufferManager = _this.require('audio-buffer-manager', { assetsDomain: assetsDomain });
    _this.metricScheduler = _this.require('metric-scheduler');

    _this.scenes = {};
    _this.currentScene = null;

    _this.clients = new _set2.default();

    _this.outputBusses = new Array(numOutputChannels); // output channels (array of gain nodes)
    _this.crossFilters = new Array(numOutputChannels); // channel cross-over filters (array of biquad filter nodes)
    _this.wooferBuss = null; // bass woofer gain node
    _this.wooferGain = 1; // bass woofer gain (linear amplitude factor)
    _this.delay = 0.02;

    _this.onSceneChange = _this.onSceneChange.bind(_this);
    _this.onConnectClient = _this.onConnectClient.bind(_this);
    _this.onDisconnectClient = _this.onDisconnectClient.bind(_this);
    _this.onClear = _this.onClear.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(BarrelExperience, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(BarrelExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(BarrelExperience.prototype), 'start', this).call(this);

      this.view = new soundworks.View(template, {}, {}, { id: 'barrel' });
      this.show();

      this.initScenes();

      this.initAudio(numAudioOutputs); // init audio outputs for an interface of the given number of channels
      this.initParams();

      this.receive('connectClient', this.onConnectClient);
      this.receive('disconnectClient', this.onDisconnectClient);
      this.sharedParams.addParamListener('clear', this.onClear);
    }
  }, {
    key: 'initAudio',
    value: function initAudio() {
      var numAudioOutputs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

      var channelMerger = audioContext.createChannelMerger(numOutputChannels);
      var bassWoofer = audioContext.createGain();

      for (var i = 0; i < numOutputChannels; i++) {
        var channel = audioContext.createGain();
        var lowpass = audioContext.createBiquadFilter();
        var inverter = audioContext.createGain();

        lowpass.type = 'lowpass';
        lowpass.frequency.value = 250; // set default woofer cutoff frequency to 250 Hz
        inverter.gain.value = -1;

        // connect
        channel.connect(lowpass);

        // connect high pass to single output channel,
        // highpass = channel - lowpass(channel) = channel + inverter(lowpass(channel))
        channel.connect(channelMerger, 0, i);
        lowpass.connect(inverter);
        inverter.connect(channelMerger, 0, i);

        // connect low pass (virtual) to bass woofer
        lowpass.connect(bassWoofer);

        this.outputBusses[i] = channel;
        this.crossFilters[i] = lowpass;
      }

      // connect bass woofer to all output channels
      for (var _i = 0; _i < numOutputChannels; _i++) {
        bassWoofer.connect(channelMerger, 0, _i);
      }this.wooferBuss = bassWoofer;
      this.setWooferGain(0); // set default woofer gain to 0 dB

      audioContext.destination.channelCount = numAudioOutputs;
      var channelDestination = audioContext.destination;

      if (numAudioOutputs < numOutputChannels) {
        var splitter = audioContext.createChannelSplitter(numOutputChannels);
        var outputMerger = audioContext.createChannelMerger(numAudioOutputs);

        audioContext.destination.channelCount = numAudioOutputs;
        outputMerger.connect(audioContext.destination);
        channelMerger.connect(splitter);

        for (var _i2 = 0; _i2 < numOutputChannels; _i2++) {
          splitter.connect(outputMerger, _i2, _i2 % numAudioOutputs);
        }channelDestination = splitter;
      }

      channelMerger.connect(channelDestination);
    }
  }, {
    key: 'initParams',
    value: function initParams() {
      var _this2 = this;

      this.sharedParams.addParamListener('scene', this.onSceneChange);
      this.sharedParams.addParamListener('outputGain0', function (value) {
        return _this2.setOutputGain(0, value);
      });
      this.sharedParams.addParamListener('outputGain1', function (value) {
        return _this2.setOutputGain(1, value);
      });
      this.sharedParams.addParamListener('outputGain2', function (value) {
        return _this2.setOutputGain(2, value);
      });
      this.sharedParams.addParamListener('outputGain3', function (value) {
        return _this2.setOutputGain(3, value);
      });
      this.sharedParams.addParamListener('outputGain4', function (value) {
        return _this2.setOutputGain(4, value);
      });
      this.sharedParams.addParamListener('outputGain5', function (value) {
        return _this2.setOutputGain(5, value);
      });
      this.sharedParams.addParamListener('outputGain6', function (value) {
        return _this2.setOutputGain(6, value);
      });
      this.sharedParams.addParamListener('outputGain7', function (value) {
        return _this2.setOutputGain(7, value);
      });
      this.sharedParams.addParamListener('wooferGain', function (value) {
        return _this2.setWooferGain(value);
      });
      this.sharedParams.addParamListener('wooferCutoff', function (value) {
        return _this2.setWooferCutoff(value);
      });
      this.sharedParams.addParamListener('barrelDelay', function (value) {
        return _this2.setDelay(value);
      });
    }
  }, {
    key: 'initScenes',
    value: function initScenes() {
      for (var scene in sceneCtors) {
        var ctor = sceneCtors[scene];
        var config = _scenesConfig2.default[scene];

        if (config) this.scenes[scene] = new ctor(this, config);else throw new Error('Cannot find config for scene \'' + scene + '\'');
      }

      this.currentScene = this.scenes.off;
      this.enterCurrentScene();
    }
  }, {
    key: 'setOutputGain',
    value: function setOutputGain(index, value) {
      this.outputBusses[index].gain.value = (0, _math.decibelToLinear)(value);
    }
  }, {
    key: 'setWooferGain',
    value: function setWooferGain(value) {
      this.wooferBuss.gain.value = (0, _math.decibelToLinear)(value) / numOutputChannels;
    }
  }, {
    key: 'setWooferCutoff',
    value: function setWooferCutoff(value) {
      for (var i = 0; i < numOutputChannels; i++) {
        this.crossFilters[i].frequency.value = value;
      }
    }
  }, {
    key: 'setDelay',
    value: function setDelay(value) {
      this.delay = value;
    }
  }, {
    key: 'enterCurrentScene',
    value: function enterCurrentScene() {
      this.currentScene.enter();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.clients), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var client = _step.value;

          this.currentScene.clientEnter(client);
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
    key: 'exitCurrentScene',
    value: function exitCurrentScene() {
      this.currentScene.exit();

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.clients), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var client = _step2.value;

          this.currentScene.clientExit(client);
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
    }
  }, {
    key: 'onSceneChange',
    value: function onSceneChange(value) {
      this.exitCurrentScene();
      this.currentScene = this.scenes[value];
      this.enterCurrentScene();
    }
  }, {
    key: 'onConnectClient',
    value: function onConnectClient(index) {
      this.clients.add(index);
      this.currentScene.clientEnter(index);
    }
  }, {
    key: 'onDisconnectClient',
    value: function onDisconnectClient(index) {
      this.clients.delete(index);
      this.currentScene.clientExit(index);
    }
  }, {
    key: 'onClear',
    value: function onClear(index) {
      if (this.currentScene.clear) this.currentScene.clear(index);
    }
  }]);
  return BarrelExperience;
}(soundworks.Experience);

exports.default = BarrelExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhcnJlbEV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImF1ZGlvQ29udGV4dCIsInNjZW5lQ3RvcnMiLCJTY2VuZU9mZiIsIlNjZW5lQ285MDkiLCJTY2VuZUNvbGxlY3RpdmVMb29wcyIsIlNjZW5lQ29NaXgiLCJTY2VuZVd3cnlSIiwidGVtcGxhdGUiLCJudW1PdXRwdXRDaGFubmVscyIsIm1heEF1ZGlvRGVzdGluYXRpb25DaGFubmVscyIsImRlc3RpbmF0aW9uIiwibWF4Q2hhbm5lbENvdW50IiwibnVtQXVkaW9PdXRwdXRzIiwiTWF0aCIsIm1pbiIsIkJhcnJlbEV4cGVyaWVuY2UiLCJhc3NldHNEb21haW4iLCJwbGF0Zm9ybSIsInJlcXVpcmUiLCJmZWF0dXJlcyIsInNob3dEaWFsb2ciLCJzaGFyZWRQYXJhbXMiLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJtZXRyaWNTY2hlZHVsZXIiLCJzY2VuZXMiLCJjdXJyZW50U2NlbmUiLCJjbGllbnRzIiwib3V0cHV0QnVzc2VzIiwiQXJyYXkiLCJjcm9zc0ZpbHRlcnMiLCJ3b29mZXJCdXNzIiwid29vZmVyR2FpbiIsImRlbGF5Iiwib25TY2VuZUNoYW5nZSIsImJpbmQiLCJvbkNvbm5lY3RDbGllbnQiLCJvbkRpc2Nvbm5lY3RDbGllbnQiLCJvbkNsZWFyIiwidmlldyIsIlZpZXciLCJpZCIsInNob3ciLCJpbml0U2NlbmVzIiwiaW5pdEF1ZGlvIiwiaW5pdFBhcmFtcyIsInJlY2VpdmUiLCJhZGRQYXJhbUxpc3RlbmVyIiwiY2hhbm5lbE1lcmdlciIsImNyZWF0ZUNoYW5uZWxNZXJnZXIiLCJiYXNzV29vZmVyIiwiY3JlYXRlR2FpbiIsImkiLCJjaGFubmVsIiwibG93cGFzcyIsImNyZWF0ZUJpcXVhZEZpbHRlciIsImludmVydGVyIiwidHlwZSIsImZyZXF1ZW5jeSIsInZhbHVlIiwiZ2FpbiIsImNvbm5lY3QiLCJzZXRXb29mZXJHYWluIiwiY2hhbm5lbENvdW50IiwiY2hhbm5lbERlc3RpbmF0aW9uIiwic3BsaXR0ZXIiLCJjcmVhdGVDaGFubmVsU3BsaXR0ZXIiLCJvdXRwdXRNZXJnZXIiLCJzZXRPdXRwdXRHYWluIiwic2V0V29vZmVyQ3V0b2ZmIiwic2V0RGVsYXkiLCJzY2VuZSIsImN0b3IiLCJjb25maWciLCJzY2VuZUNvbmZpZyIsIkVycm9yIiwib2ZmIiwiZW50ZXJDdXJyZW50U2NlbmUiLCJpbmRleCIsImVudGVyIiwiY2xpZW50IiwiY2xpZW50RW50ZXIiLCJleGl0IiwiY2xpZW50RXhpdCIsImV4aXRDdXJyZW50U2NlbmUiLCJhZGQiLCJkZWxldGUiLCJjbGVhciIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLFU7O0FBQ1o7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU1DLGVBQWVELFdBQVdDLFlBQWhDOztBQUVBLElBQU1DLGFBQWE7QUFDakIsU0FBT0MsYUFEVTtBQUVqQixZQUFVQyxZQUZPO0FBR2pCLHNCQUFvQkMseUJBSEg7QUFJakIsWUFBVUMsZUFKTztBQUtqQixZQUFVQztBQUxPLENBQW5COztBQVFBLElBQU1DLHlLQUFOOztBQVNBLElBQU1DLG9CQUFvQixDQUExQixDLENBQTZCO0FBQzdCLElBQU1DLDhCQUE4QlQsYUFBYVUsV0FBYixDQUF5QkMsZUFBN0Q7QUFDQSxJQUFNQyxrQkFBa0JILDhCQUE4QkksS0FBS0MsR0FBTCxDQUFTTixpQkFBVCxFQUE0QkMsMkJBQTVCLENBQTlCLEdBQXlGLENBQWpILEMsQ0FBb0g7O0lBRS9GTSxnQjs7O0FBQ25CLDRCQUFZQyxZQUFaLEVBQTBCO0FBQUE7O0FBQUE7O0FBR3hCLFVBQUtDLFFBQUwsR0FBZ0IsTUFBS0MsT0FBTCxDQUFhLFVBQWIsRUFBeUIsRUFBRUMsVUFBVSxDQUFDLFdBQUQsQ0FBWixFQUEyQkMsWUFBWSxJQUF2QyxFQUF6QixDQUFoQjtB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QWxCLENBQW1DLGFBQW5DLEVBQWtELFVBQUNZLEtBQUQ7QUFBQSxlQUFXLE9BQUtTLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JULEtBQXRCLENBQVg7QUFBQSxPQUFsRDtBQUNBLFdBQUtyQyxZQUFMLENBQWtCeUIsZ0JBQWxCLENBQW1DLGFBQW5DLEVBQWtELFVBQUNZLEtBQUQ7QUFBQSxlQUFXLE9BQUtTLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JULEtBQXRCLENBQVg7QUFBQSxPQUFsRDtBQUNBLFdBQUtyQyxZQUFMLENBQWtCeUIsZ0JBQWxCLENBQW1DLGFBQW5DLEVBQWtELFVBQUNZLEtBQUQ7QUFBQSxlQUFXLE9BQUtTLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JULEtBQXRCLENBQVg7QUFBQSxPQUFsRDtBQUNBLFdBQUtyQyxZQUFMLENBQWtCeUIsZ0JBQWxCLENBQW1DLGFBQW5DLEVBQWtELFVBQUNZLEtBQUQ7QUFBQSxlQUFXLE9BQUtTLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JULEtBQXRCLENBQVg7QUFBQSxPQUFsRDtBQUNBLFdBQUtyQyxZQUFMLENBQWtCeUIsZ0JBQWxCLENBQW1DLGFBQW5DLEVBQWtELFVBQUNZLEtBQUQ7QUFBQSxlQUFXLE9BQUtTLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JULEtBQXRCLENBQVg7QUFBQSxPQUFsRDtBQUNBLFdBQUtyQyxZQUFMLENBQWtCeUIsZ0JBQWxCLENBQW1DLGFBQW5DLEVBQWtELFVBQUNZLEtBQUQ7QUFBQSxlQUFXLE9BQUtTLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JULEtBQXRCLENBQVg7QUFBQSxPQUFsRDtBQUNBLFdBQUtyQyxZQUFMLENBQWtCeUIsZ0JBQWxCLENBQW1DLGFBQW5DLEVBQWtELFVBQUNZLEtBQUQ7QUFBQSxlQUFXLE9BQUtTLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JULEtBQXRCLENBQVg7QUFBQSxPQUFsRDtBQUNBLFdBQUtyQyxZQUFMLENBQWtCeUIsZ0JBQWxCLENBQW1DLGFBQW5DLEVBQWtELFVBQUNZLEtBQUQ7QUFBQSxl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TCxDQUFrQnVELFdBQWxCLENBQThCSCxLQUE5QjtBQUNEOzs7dUNBRWtCQSxLLEVBQU87QUFDeEIsV0FBS25ELE9BQUwsQ0FBYTJELE1BQWIsQ0FBb0JSLEtBQXBCO0FBQ0EsV0FBS3BELFlBQUwsQ0FBa0J5RCxVQUFsQixDQUE2QkwsS0FBN0I7QUFDRDs7OzRCQUVPQSxLLEVBQU87QUFDYixVQUFHLEtBQUtwRCxZQUFMLENBQWtCNkQsS0FBckIsRUFDRSxLQUFLN0QsWUFBTCxDQUFrQjZELEtBQWxCLENBQXdCVCxLQUF4QjtBQUNIOzs7RUFsTDJDOUUsV0FBV3dGLFU7O2tCQUFwQ3hFLGdCIiwiZmlsZSI6IkJhcnJlbEV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCB7IGRlY2liZWxUb0xpbmVhciB9IGZyb20gJ3NvdW5kd29ya3MvdXRpbHMvbWF0aCc7XG5pbXBvcnQgc2NlbmVDb25maWcgZnJvbSAnLi4vLi4vc2hhcmVkL3NjZW5lcy1jb25maWcnO1xuaW1wb3J0IFNjZW5lT2ZmIGZyb20gJy4vc2NlbmVzL29mZic7XG5pbXBvcnQgU2NlbmVDbzkwOSBmcm9tICcuL3NjZW5lcy9jby05MDknO1xuaW1wb3J0IFNjZW5lQ29sbGVjdGl2ZUxvb3BzIGZyb20gJy4vc2NlbmVzL2NvbGxlY3RpdmUtbG9vcHMnO1xuaW1wb3J0IFNjZW5lQ29NaXggZnJvbSAnLi9zY2VuZXMvY28tbWl4JztcbmltcG9ydCBTY2VuZVd3cnlSIGZyb20gJy4vc2NlbmVzL3d3cnktcic7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBzb3VuZHdvcmtzLmF1ZGlvQ29udGV4dDtcblxuY29uc3Qgc2NlbmVDdG9ycyA9IHtcbiAgJ29mZic6IFNjZW5lT2ZmLFxuICAnY28tOTA5JzogU2NlbmVDbzkwOSxcbiAgJ2NvbGxlY3RpdmUtbG9vcHMnOiBTY2VuZUNvbGxlY3RpdmVMb29wcyxcbiAgJ2NvLW1peCc6IFNjZW5lQ29NaXgsXG4gICd3d3J5LXInOiBTY2VuZVd3cnlSLFxufTtcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cImZsZXgtbWlkZGxlXCI+XG4gICAgICA8cCBjbGFzcz1cImJpZ1wiPkJhcnJlbDwvcD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jb25zdCBudW1PdXRwdXRDaGFubmVscyA9IDg7IC8vIFwidmlydHVhbFwiIG91dHB1dCBjaGFubmVsc1xuY29uc3QgbWF4QXVkaW9EZXN0aW5hdGlvbkNoYW5uZWxzID0gYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uLm1heENoYW5uZWxDb3VudDtcbmNvbnN0IG51bUF1ZGlvT3V0cHV0cyA9IG1heEF1ZGlvRGVzdGluYXRpb25DaGFubmVscyA/IE1hdGgubWluKG51bU91dHB1dENoYW5uZWxzLCBtYXhBdWRpb0Rlc3RpbmF0aW9uQ2hhbm5lbHMpIDogMjsgLy8gXCJwaHlzaWNhbFwiIGF1ZGlvIG91dHB1dHNcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFycmVsRXhwZXJpZW5jZSBleHRlbmRzIHNvdW5kd29ya3MuRXhwZXJpZW5jZSB7XG4gIGNvbnN0cnVjdG9yKGFzc2V0c0RvbWFpbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnBsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6IFsnd2ViLWF1ZGlvJ10sIHNob3dEaWFsb2c6IHRydWUgfSk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tYnVmZmVyLW1hbmFnZXInLCB7IGFzc2V0c0RvbWFpbjogYXNzZXRzRG9tYWluIH0pO1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdtZXRyaWMtc2NoZWR1bGVyJyk7XG5cbiAgICB0aGlzLnNjZW5lcyA9IHt9O1xuICAgIHRoaXMuY3VycmVudFNjZW5lID0gbnVsbDtcblxuICAgIHRoaXMuY2xpZW50cyA9IG5ldyBTZXQoKTtcblxuICAgIHRoaXMub3V0cHV0QnVzc2VzID0gbmV3IEFycmF5KG51bU91dHB1dENoYW5uZWxzKTsgLy8gb3V0cHV0IGNoYW5uZWxzIChhcnJheSBvZiBnYWluIG5vZGVzKVxuICAgIHRoaXMuY3Jvc3NGaWx0ZXJzID0gbmV3IEFycmF5KG51bU91dHB1dENoYW5uZWxzKTsgLy8gY2hhbm5lbCBjcm9zcy1vdmVyIGZpbHRlcnMgKGFycmF5IG9mIGJpcXVhZCBmaWx0ZXIgbm9kZXMpXG4gICAgdGhpcy53b29mZXJCdXNzID0gbnVsbDsgLy8gYmFzcyB3b29mZXIgZ2FpbiBub2RlXG4gICAgdGhpcy53b29mZXJHYWluID0gMTsgLy8gYmFzcyB3b29mZXIgZ2FpbiAobGluZWFyIGFtcGxpdHVkZSBmYWN0b3IpXG4gICAgdGhpcy5kZWxheSA9IDAuMDI7XG5cbiAgICB0aGlzLm9uU2NlbmVDaGFuZ2UgPSB0aGlzLm9uU2NlbmVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQ29ubmVjdENsaWVudCA9IHRoaXMub25Db25uZWN0Q2xpZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbkRpc2Nvbm5lY3RDbGllbnQgPSB0aGlzLm9uRGlzY29ubmVjdENsaWVudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25DbGVhciA9IHRoaXMub25DbGVhci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMudmlldyA9IG5ldyBzb3VuZHdvcmtzLlZpZXcodGVtcGxhdGUsIHt9LCB7fSwgeyBpZDogJ2JhcnJlbCcgfSk7XG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLmluaXRTY2VuZXMoKTtcblxuICAgIHRoaXMuaW5pdEF1ZGlvKG51bUF1ZGlvT3V0cHV0cyk7IC8vIGluaXQgYXVkaW8gb3V0cHV0cyBmb3IgYW4gaW50ZXJmYWNlIG9mIHRoZSBnaXZlbiBudW1iZXIgb2YgY2hhbm5lbHNcbiAgICB0aGlzLmluaXRQYXJhbXMoKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnY29ubmVjdENsaWVudCcsIHRoaXMub25Db25uZWN0Q2xpZW50KTtcbiAgICB0aGlzLnJlY2VpdmUoJ2Rpc2Nvbm5lY3RDbGllbnQnLCB0aGlzLm9uRGlzY29ubmVjdENsaWVudCk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignY2xlYXInLCB0aGlzLm9uQ2xlYXIpO1xuICB9XG5cbiAgaW5pdEF1ZGlvKG51bUF1ZGlvT3V0cHV0cyA9IDIpIHtcbiAgICBjb25zdCBjaGFubmVsTWVyZ2VyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUNoYW5uZWxNZXJnZXIobnVtT3V0cHV0Q2hhbm5lbHMpO1xuICAgIGNvbnN0IGJhc3NXb29mZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PdXRwdXRDaGFubmVsczsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFubmVsID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIGNvbnN0IGxvd3Bhc3MgPSBhdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgICBjb25zdCBpbnZlcnRlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgICAgIGxvd3Bhc3MudHlwZSA9ICdsb3dwYXNzJztcbiAgICAgIGxvd3Bhc3MuZnJlcXVlbmN5LnZhbHVlID0gMjUwOyAvLyBzZXQgZGVmYXVsdCB3b29mZXIgY3V0b2ZmIGZyZXF1ZW5jeSB0byAyNTAgSHpcbiAgICAgIGludmVydGVyLmdhaW4udmFsdWUgPSAtMTtcblxuICAgICAgLy8gY29ubmVjdFxuICAgICAgY2hhbm5lbC5jb25uZWN0KGxvd3Bhc3MpO1xuXG4gICAgICAvLyBjb25uZWN0IGhpZ2ggcGFzcyB0byBzaW5nbGUgb3V0cHV0IGNoYW5uZWwsXG4gICAgICAvLyBoaWdocGFzcyA9IGNoYW5uZWwgLSBsb3dwYXNzKGNoYW5uZWwpID0gY2hhbm5lbCArIGludmVydGVyKGxvd3Bhc3MoY2hhbm5lbCkpXG4gICAgICBjaGFubmVsLmNvbm5lY3QoY2hhbm5lbE1lcmdlciwgMCwgaSk7XG4gICAgICBsb3dwYXNzLmNvbm5lY3QoaW52ZXJ0ZXIpO1xuICAgICAgaW52ZXJ0ZXIuY29ubmVjdChjaGFubmVsTWVyZ2VyLCAwLCBpKTtcblxuICAgICAgLy8gY29ubmVjdCBsb3cgcGFzcyAodmlydHVhbCkgdG8gYmFzcyB3b29mZXJcbiAgICAgIGxvd3Bhc3MuY29ubmVjdChiYXNzV29vZmVyKTtcblxuICAgICAgdGhpcy5vdXRwdXRCdXNzZXNbaV0gPSBjaGFubmVsO1xuICAgICAgdGhpcy5jcm9zc0ZpbHRlcnNbaV0gPSBsb3dwYXNzO1xuICAgIH1cblxuICAgIC8vIGNvbm5lY3QgYmFzcyB3b29mZXIgdG8gYWxsIG91dHB1dCBjaGFubmVsc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT3V0cHV0Q2hhbm5lbHM7IGkrKylcbiAgICAgIGJhc3NXb29mZXIuY29ubmVjdChjaGFubmVsTWVyZ2VyLCAwLCBpKTtcblxuICAgIHRoaXMud29vZmVyQnVzcyA9IGJhc3NXb29mZXI7XG4gICAgdGhpcy5zZXRXb29mZXJHYWluKDApOyAvLyBzZXQgZGVmYXVsdCB3b29mZXIgZ2FpbiB0byAwIGRCXG5cbiAgICBhdWRpb0NvbnRleHQuZGVzdGluYXRpb24uY2hhbm5lbENvdW50ID0gbnVtQXVkaW9PdXRwdXRzO1xuICAgIGxldCBjaGFubmVsRGVzdGluYXRpb24gPSBhdWRpb0NvbnRleHQuZGVzdGluYXRpb247XG5cbiAgICBpZiAobnVtQXVkaW9PdXRwdXRzIDwgbnVtT3V0cHV0Q2hhbm5lbHMpIHtcbiAgICAgIGNvbnN0IHNwbGl0dGVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcihudW1PdXRwdXRDaGFubmVscyk7XG4gICAgICBjb25zdCBvdXRwdXRNZXJnZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQ2hhbm5lbE1lcmdlcihudW1BdWRpb091dHB1dHMpO1xuXG4gICAgICBhdWRpb0NvbnRleHQuZGVzdGluYXRpb24uY2hhbm5lbENvdW50ID0gbnVtQXVkaW9PdXRwdXRzO1xuICAgICAgb3V0cHV0TWVyZ2VyLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgIGNoYW5uZWxNZXJnZXIuY29ubmVjdChzcGxpdHRlcik7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT3V0cHV0Q2hhbm5lbHM7IGkrKylcbiAgICAgICAgc3BsaXR0ZXIuY29ubmVjdChvdXRwdXRNZXJnZXIsIGksIGkgJSBudW1BdWRpb091dHB1dHMpO1xuXG4gICAgICBjaGFubmVsRGVzdGluYXRpb24gPSBzcGxpdHRlcjtcbiAgICB9XG5cbiAgICBjaGFubmVsTWVyZ2VyLmNvbm5lY3QoY2hhbm5lbERlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIGluaXRQYXJhbXMoKSB7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignc2NlbmUnLCB0aGlzLm9uU2NlbmVDaGFuZ2UpO1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ291dHB1dEdhaW4wJywgKHZhbHVlKSA9PiB0aGlzLnNldE91dHB1dEdhaW4oMCwgdmFsdWUpKTtcbiAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdvdXRwdXRHYWluMScsICh2YWx1ZSkgPT4gdGhpcy5zZXRPdXRwdXRHYWluKDEsIHZhbHVlKSk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignb3V0cHV0R2FpbjInLCAodmFsdWUpID0+IHRoaXMuc2V0T3V0cHV0R2FpbigyLCB2YWx1ZSkpO1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ291dHB1dEdhaW4zJywgKHZhbHVlKSA9PiB0aGlzLnNldE91dHB1dEdhaW4oMywgdmFsdWUpKTtcbiAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdvdXRwdXRHYWluNCcsICh2YWx1ZSkgPT4gdGhpcy5zZXRPdXRwdXRHYWluKDQsIHZhbHVlKSk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignb3V0cHV0R2FpbjUnLCAodmFsdWUpID0+IHRoaXMuc2V0T3V0cHV0R2Fpbig1LCB2YWx1ZSkpO1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ291dHB1dEdhaW42JywgKHZhbHVlKSA9PiB0aGlzLnNldE91dHB1dEdhaW4oNiwgdmFsdWUpKTtcbiAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdvdXRwdXRHYWluNycsICh2YWx1ZSkgPT4gdGhpcy5zZXRPdXRwdXRHYWluKDcsIHZhbHVlKSk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignd29vZmVyR2FpbicsICh2YWx1ZSkgPT4gdGhpcy5zZXRXb29mZXJHYWluKHZhbHVlKSk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignd29vZmVyQ3V0b2ZmJywgKHZhbHVlKSA9PiB0aGlzLnNldFdvb2ZlckN1dG9mZih2YWx1ZSkpO1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2JhcnJlbERlbGF5JywgKHZhbHVlKSA9PiB0aGlzLnNldERlbGF5KHZhbHVlKSk7XG4gIH1cblxuICBpbml0U2NlbmVzKCkge1xuICAgIGZvciAobGV0IHNjZW5lIGluIHNjZW5lQ3RvcnMpIHtcbiAgICAgIGNvbnN0IGN0b3IgPSBzY2VuZUN0b3JzW3NjZW5lXTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHNjZW5lQ29uZmlnW3NjZW5lXTtcblxuICAgICAgaWYgKGNvbmZpZylcbiAgICAgICAgdGhpcy5zY2VuZXNbc2NlbmVdID0gbmV3IGN0b3IodGhpcywgY29uZmlnKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBjb25maWcgZm9yIHNjZW5lICcke3NjZW5lfSdgKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IHRoaXMuc2NlbmVzLm9mZjtcbiAgICB0aGlzLmVudGVyQ3VycmVudFNjZW5lKCk7XG4gIH1cblxuICBzZXRPdXRwdXRHYWluKGluZGV4LCB2YWx1ZSkge1xuICAgIHRoaXMub3V0cHV0QnVzc2VzW2luZGV4XS5nYWluLnZhbHVlID0gZGVjaWJlbFRvTGluZWFyKHZhbHVlKTtcbiAgfVxuXG4gIHNldFdvb2ZlckdhaW4odmFsdWUpIHtcbiAgICB0aGlzLndvb2ZlckJ1c3MuZ2Fpbi52YWx1ZSA9IGRlY2liZWxUb0xpbmVhcih2YWx1ZSkgLyBudW1PdXRwdXRDaGFubmVscztcbiAgfVxuXG4gIHNldFdvb2ZlckN1dG9mZih2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT3V0cHV0Q2hhbm5lbHM7IGkrKylcbiAgICAgIHRoaXMuY3Jvc3NGaWx0ZXJzW2ldLmZyZXF1ZW5jeS52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgc2V0RGVsYXkodmFsdWUpIHtcbiAgICB0aGlzLmRlbGF5ID0gdmFsdWU7XG4gIH1cblxuICBlbnRlckN1cnJlbnRTY2VuZSgpIHtcbiAgICB0aGlzLmN1cnJlbnRTY2VuZS5lbnRlcigpO1xuXG4gICAgZm9yIChsZXQgY2xpZW50IG9mIHRoaXMuY2xpZW50cylcbiAgICAgIHRoaXMuY3VycmVudFNjZW5lLmNsaWVudEVudGVyKGNsaWVudCk7XG4gIH1cblxuICBleGl0Q3VycmVudFNjZW5lKCkge1xuICAgIHRoaXMuY3VycmVudFNjZW5lLmV4aXQoKTtcblxuICAgIGZvciAobGV0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpXG4gICAgICB0aGlzLmN1cnJlbnRTY2VuZS5jbGllbnRFeGl0KGNsaWVudCk7XG4gIH1cblxuICBvblNjZW5lQ2hhbmdlKHZhbHVlKSB7XG4gICAgdGhpcy5leGl0Q3VycmVudFNjZW5lKCk7XG4gICAgdGhpcy5jdXJyZW50U2NlbmUgPSB0aGlzLnNjZW5lc1t2YWx1ZV07XG4gICAgdGhpcy5lbnRlckN1cnJlbnRTY2VuZSgpO1xuICB9XG5cbiAgb25Db25uZWN0Q2xpZW50KGluZGV4KSB7XG4gICAgdGhpcy5jbGllbnRzLmFkZChpbmRleCk7XG4gICAgdGhpcy5jdXJyZW50U2NlbmUuY2xpZW50RW50ZXIoaW5kZXgpO1xuICB9XG5cbiAgb25EaXNjb25uZWN0Q2xpZW50KGluZGV4KSB7XG4gICAgdGhpcy5jbGllbnRzLmRlbGV0ZShpbmRleCk7XG4gICAgdGhpcy5jdXJyZW50U2NlbmUuY2xpZW50RXhpdChpbmRleCk7XG4gIH1cblxuICBvbkNsZWFyKGluZGV4KSB7XG4gICAgaWYodGhpcy5jdXJyZW50U2NlbmUuY2xlYXIpXG4gICAgICB0aGlzLmN1cnJlbnRTY2VuZS5jbGVhcihpbmRleCk7XG4gIH1cbn1cbiJdfQ==