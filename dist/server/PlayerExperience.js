'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _server = require('soundworks/server');

var _scenesConfig = require('../shared/scenes-config');

var _scenesConfig2 = _interopRequireDefault(_scenesConfig);

var _Scheduler = require('./Scheduler');

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _LedDisplay = require('./LedDisplay');

var _LedDisplay2 = _interopRequireDefault(_LedDisplay);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sceneCtors = {
  'off': _off2.default,
  'co-909': _co2.default,
  'collective-loops': _collectiveLoops2.default,
  'co-mix': _coMix2.default,
  'wwry-r': _wwryR2.default
};

var PlayerExperience = function (_Experience) {
  (0, _inherits3.default)(PlayerExperience, _Experience);

  function PlayerExperience(clientType) {
    (0, _classCallCheck3.default)(this, PlayerExperience);

    // client/server services
    var _this = (0, _possibleConstructorReturn3.default)(this, (PlayerExperience.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience)).call(this, clientType));

    _this.sharedParams = _this.require('shared-params');
    _this.checkin = _this.require('checkin');
    _this.audioBufferManager = _this.require('audio-buffer-manager');
    _this.syncScheduler = _this.require('sync-scheduler');
    _this.metricScheduler = _this.require('metric-scheduler', { tempo: 120, tempoUnit: 1 / 4 });
    _this.sync = _this.require('sync');

    _this.scheduler = null;
    _this.scenes = {};
    _this.currentScene = null;

    _this.tempoChangeEnabled = true;
    _this.tempo = 120;

    _this.onSceneChange = _this.onSceneChange.bind(_this);
    _this.onTempoChange = _this.onTempoChange.bind(_this);
    _this.onClear = _this.onClear.bind(_this);
    _this.onTemperature = _this.onTemperature.bind(_this);
    _this.onButtonIncremented = _this.onButtonIncremented.bind(_this);
    _this.onButtonDecremented = _this.onButtonDecremented.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(PlayerExperience, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      this.scheduler = new _Scheduler2.default(this.sync);

      this.ledDisplay = new _LedDisplay2.default();
      this.ledDisplay.connect(null, function () {
        // null means automatic port search, otherwise put something like : /dev/tty.wchusbserial1420

        _this2.ledDisplay.addListener('temperature', _this2.onTemperature);
        _this2.ledDisplay.addListener('buttonIncremented', _this2.onButtonIncremented);
        _this2.ledDisplay.addListener('buttonDecremented', _this2.onButtonDecremented);

        // we need to wait that arduino start his processes and starts to listen
        // this is not beautiful way to do it. Arduino has to send one byte when is ready... todo
        setTimeout(function () {
          _this2.ledDisplay.requestTemperature();
        }, 2000);
      });

      this.initScenes();

      this.sharedParams.addParamListener('scene', this.onSceneChange);
      this.sharedParams.addParamListener('tempo', this.onTempoChange);
      this.sharedParams.addParamListener('clear', this.onClear);
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

      this.currentScene.exit();
    }
  }, {
    key: 'enter',
    value: function enter(client) {
      (0, _get3.default)(PlayerExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience.prototype), 'enter', this).call(this, client);
      this.currentScene.clientEnter(client);

      this.broadcast('barrel', null, 'connectClient', client.index);
      this.sharedParams.update('numPlayers', this.clients.length);
    }
  }, {
    key: 'exit',
    value: function exit(client) {
      (0, _get3.default)(PlayerExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience.prototype), 'exit', this).call(this, client);

      this.currentScene.clientExit(client);

      this.broadcast('barrel', null, 'disconnectClient', client.index);
      this.sharedParams.update('numPlayers', this.clients.length);
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
    key: 'enableTempoChange',
    value: function enableTempoChange(value) {
      if (value !== this.tempoChangeEnabled) {
        this.tempoChangeEnabled = value;

        if (value) this.sharedParams.addParamListener('tempo', this.onTempoChange);else this.sharedParams.removeParamListener('tempo', this.onTempoChange);
      }
    }
  }, {
    key: 'onSceneChange',
    value: function onSceneChange(value) {
      // get temperature on each change of scenario
      try {
        this.ledDisplay.requestTemperature();
      } catch (e) {
        console.log("will get temperature later");
      }
      this.exitCurrentScene();
      this.currentScene = this.scenes[value];
      this.enterCurrentScene();
    }
  }, {
    key: 'onTempoChange',
    value: function onTempoChange(tempo) {
      if (this.currentScene.setTempo) this.currentScene.setTempo(tempo);

      this.tempo = tempo;

      var syncTime = this.metricScheduler.syncTime;
      var metricPosition = this.metricScheduler.getMetricPositionAtSyncTime(syncTime);
      this.metricScheduler.sync(syncTime, metricPosition, tempo, 1 / 4, 'tempoChange');
    }
  }, {
    key: 'onClear',
    value: function onClear() {
      if (this.currentScene.clear) this.currentScene.clear();
    }
  }, {
    key: 'onTemperature',
    value: function onTemperature(data) {
      this.sharedParams.update('temperature', data);
    }
  }, {
    key: 'onButtonIncremented',
    value: function onButtonIncremented(data) {
      if (this.tempoChangeEnabled) this.sharedParams.update('tempo', this.tempo + 1);
    }
  }, {
    key: 'onButtonDecremented',
    value: function onButtonDecremented(data) {
      if (this.tempoChangeEnabled) this.sharedParams.update('tempo', this.tempo - 1);
    }
  }]);
  return PlayerExperience;
}(_server.Experience);

exports.default = PlayerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsic2NlbmVDdG9ycyIsIlNjZW5lT2ZmIiwiU2NlbmVDbzkwOSIsIlNjZW5lQ29sbGVjdGl2ZUxvb3BzIiwiU2NlbmVDb01peCIsIlNjZW5lV3dyeVIiLCJQbGF5ZXJFeHBlcmllbmNlIiwiY2xpZW50VHlwZSIsInNoYXJlZFBhcmFtcyIsInJlcXVpcmUiLCJjaGVja2luIiwiYXVkaW9CdWZmZXJNYW5hZ2VyIiwic3luY1NjaGVkdWxlciIsIm1ldHJpY1NjaGVkdWxlciIsInRlbXBvIiwidGVtcG9Vbml0Iiwic3luYyIsInNjaGVkdWxlciIsInNjZW5lcyIsImN1cnJlbnRTY2VuZSIsInRlbXBvQ2hhbmdlRW5hYmxlZCIsIm9uU2NlbmVDaGFuZ2UiLCJiaW5kIiwib25UZW1wb0NoYW5nZSIsIm9uQ2xlYXIiLCJvblRlbXBlcmF0dXJlIiwib25CdXR0b25JbmNyZW1lbnRlZCIsIm9uQnV0dG9uRGVjcmVtZW50ZWQiLCJTY2hlZHVsZXIiLCJsZWREaXNwbGF5IiwiTGVkRGlzcGxheSIsImNvbm5lY3QiLCJhZGRMaXN0ZW5lciIsInNldFRpbWVvdXQiLCJyZXF1ZXN0VGVtcGVyYXR1cmUiLCJpbml0U2NlbmVzIiwiYWRkUGFyYW1MaXN0ZW5lciIsImVudGVyIiwiY2xpZW50cyIsImNsaWVudCIsImNsaWVudEVudGVyIiwiY2xpZW50RXhpdCIsImV4aXQiLCJicm9hZGNhc3QiLCJpbmRleCIsInVwZGF0ZSIsImxlbmd0aCIsInNjZW5lIiwiY3RvciIsImNvbmZpZyIsInNjZW5lQ29uZmlnIiwiRXJyb3IiLCJvZmYiLCJlbnRlckN1cnJlbnRTY2VuZSIsInZhbHVlIiwicmVtb3ZlUGFyYW1MaXN0ZW5lciIsImUiLCJjb25zb2xlIiwibG9nIiwiZXhpdEN1cnJlbnRTY2VuZSIsInNldFRlbXBvIiwic3luY1RpbWUiLCJtZXRyaWNQb3NpdGlvbiIsImdldE1ldHJpY1Bvc2l0aW9uQXRTeW5jVGltZSIsImNsZWFy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QUFMLEdBQWFBLEtBQWI7O0FBRUEsVUFBTStDLFdBQVcsS0FBS2hELGVBQUwsQ0FBcUJnRCxRQUF0QztBQUNBLFVBQU1DLGlCQUFpQixLQUFLakQsZUFBTCxDQUFxQmtELDJCQUFyQixDQUFpREYsUUFBakQsQ0FBdkI7QUFDQSxXQUFLaEQsZUFBTCxDQUFxQkcsSUFBckIsQ0FBMEI2QyxRQUExQixFQUFvQ0MsY0FBcEMsRUFBb0RoRCxLQUFwRCxFQUEyRCxJQUFFLENBQTdELEVBQWdFLGFBQWhFO0FBQ0Q7Ozs4QkFFUztBQUNSLFVBQUksS0FBS0ssWUFBTCxDQUFrQjZDLEtBQXRCLEVBQ0UsS0FBSzdDLFlBQUwsQ0FBa0I2QyxLQUFsQjtBQUNIOzs7a0NBRWFDLEksRUFBTTtBQUNsQixXQUFLekQsWUFBTCxDQUFrQnFDLE1BQWxCLENBQXlCLGFBQXpCLEVBQXdDb0IsSUFBeEM7QUFDRDs7O3dDQUVtQkEsSSxFQUFNO0FBQ3hCLFVBQUcsS0FBSzdDLGtCQUFSLEVBQ0UsS0FBS1osWUFBTCxDQUFrQnFDLE1BQWxCLENBQXlCLE9BQXpCLEVBQWtDLEtBQUsvQixLQUFMLEdBQWEsQ0FBL0M7QUFDSDs7O3dDQUVtQm1ELEksRUFBTTtBQUN4QixVQUFHLEtBQUs3QyxrQkFBUixFQUNFLEtBQUtaLFlBQUwsQ0FBa0JxQyxNQUFsQixDQUF5QixPQUF6QixFQUFrQyxLQUFLL0IsS0FBTCxHQUFhLENBQS9DO0FBQ0g7OztFQXBKMkNvRCxrQjs7a0JBQXpCNUQsZ0IiLCJmaWxlIjoiUGxheWVyRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV4cGVyaWVuY2UgfSBmcm9tICdzb3VuZHdvcmtzL3NlcnZlcic7XG5pbXBvcnQgc2NlbmVDb25maWcgZnJvbSAnLi4vc2hhcmVkL3NjZW5lcy1jb25maWcnO1xuaW1wb3J0IFNjaGVkdWxlciBmcm9tICcuL1NjaGVkdWxlcic7XG5pbXBvcnQgTGVkRGlzcGxheSBmcm9tICcuL0xlZERpc3BsYXknO1xuaW1wb3J0IFNjZW5lT2ZmIGZyb20gJy4vc2NlbmVzL29mZic7XG5pbXBvcnQgU2NlbmVDbzkwOSBmcm9tICcuL3NjZW5lcy9jby05MDknO1xuaW1wb3J0IFNjZW5lQ29sbGVjdGl2ZUxvb3BzIGZyb20gJy4vc2NlbmVzL2NvbGxlY3RpdmUtbG9vcHMnO1xuaW1wb3J0IFNjZW5lQ29NaXggZnJvbSAnLi9zY2VuZXMvY28tbWl4JztcbmltcG9ydCBTY2VuZVd3cnlSIGZyb20gJy4vc2NlbmVzL3d3cnktcic7XG5cbmNvbnN0IHNjZW5lQ3RvcnMgPSB7XG4gICdvZmYnOiBTY2VuZU9mZixcbiAgJ2NvLTkwOSc6IFNjZW5lQ285MDksXG4gICdjb2xsZWN0aXZlLWxvb3BzJzogU2NlbmVDb2xsZWN0aXZlTG9vcHMsXG4gICdjby1taXgnOiBTY2VuZUNvTWl4LFxuICAnd3dyeS1yJzogU2NlbmVXd3J5Uixcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckV4cGVyaWVuY2UgZXh0ZW5kcyBFeHBlcmllbmNlIHtcbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZSkge1xuICAgIHN1cGVyKGNsaWVudFR5cGUpO1xuXG4gICAgLy8gY2xpZW50L3NlcnZlciBzZXJ2aWNlc1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gICAgdGhpcy5jaGVja2luID0gdGhpcy5yZXF1aXJlKCdjaGVja2luJyk7XG4gICAgdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJyk7XG4gICAgdGhpcy5zeW5jU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzeW5jLXNjaGVkdWxlcicpO1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdtZXRyaWMtc2NoZWR1bGVyJywgeyB0ZW1wbzogMTIwLCB0ZW1wb1VuaXQ6IDEgLyA0IH0pO1xuICAgIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuXG4gICAgdGhpcy5zY2hlZHVsZXIgPSBudWxsO1xuICAgIHRoaXMuc2NlbmVzID0ge307XG4gICAgdGhpcy5jdXJyZW50U2NlbmUgPSBudWxsO1xuXG4gICAgdGhpcy50ZW1wb0NoYW5nZUVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMudGVtcG8gPSAxMjA7XG5cbiAgICB0aGlzLm9uU2NlbmVDaGFuZ2UgPSB0aGlzLm9uU2NlbmVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVGVtcG9DaGFuZ2UgPSB0aGlzLm9uVGVtcG9DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQ2xlYXIgPSB0aGlzLm9uQ2xlYXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVGVtcGVyYXR1cmUgPSB0aGlzLm9uVGVtcGVyYXR1cmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQnV0dG9uSW5jcmVtZW50ZWQgPSB0aGlzLm9uQnV0dG9uSW5jcmVtZW50ZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQnV0dG9uRGVjcmVtZW50ZWQgPSB0aGlzLm9uQnV0dG9uRGVjcmVtZW50ZWQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcih0aGlzLnN5bmMpO1xuXG4gICAgdGhpcy5sZWREaXNwbGF5ID0gbmV3IExlZERpc3BsYXkoKTtcbiAgICB0aGlzLmxlZERpc3BsYXkuY29ubmVjdChudWxsLCAoKSA9PiB7XG4gICAgICAvLyBudWxsIG1lYW5zIGF1dG9tYXRpYyBwb3J0IHNlYXJjaCwgb3RoZXJ3aXNlIHB1dCBzb21ldGhpbmcgbGlrZSA6IC9kZXYvdHR5LndjaHVzYnNlcmlhbDE0MjBcblxuICAgICAgdGhpcy5sZWREaXNwbGF5LmFkZExpc3RlbmVyKCd0ZW1wZXJhdHVyZScsIHRoaXMub25UZW1wZXJhdHVyZSk7XG4gICAgICB0aGlzLmxlZERpc3BsYXkuYWRkTGlzdGVuZXIoJ2J1dHRvbkluY3JlbWVudGVkJywgdGhpcy5vbkJ1dHRvbkluY3JlbWVudGVkKTtcbiAgICAgIHRoaXMubGVkRGlzcGxheS5hZGRMaXN0ZW5lcignYnV0dG9uRGVjcmVtZW50ZWQnLCB0aGlzLm9uQnV0dG9uRGVjcmVtZW50ZWQpO1xuXG4gICAgICAvLyB3ZSBuZWVkIHRvIHdhaXQgdGhhdCBhcmR1aW5vIHN0YXJ0IGhpcyBwcm9jZXNzZXMgYW5kIHN0YXJ0cyB0byBsaXN0ZW5cbiAgICAgIC8vIHRoaXMgaXMgbm90IGJlYXV0aWZ1bCB3YXkgdG8gZG8gaXQuIEFyZHVpbm8gaGFzIHRvIHNlbmQgb25lIGJ5dGUgd2hlbiBpcyByZWFkeS4uLiB0b2RvXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5sZWREaXNwbGF5LnJlcXVlc3RUZW1wZXJhdHVyZSgpOyB9LCAyMDAwKTtcblxuICAgIH0pO1xuXG4gICAgdGhpcy5pbml0U2NlbmVzKCk7XG5cbiAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdzY2VuZScsIHRoaXMub25TY2VuZUNoYW5nZSk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigndGVtcG8nLCB0aGlzLm9uVGVtcG9DaGFuZ2UpO1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2NsZWFyJywgdGhpcy5vbkNsZWFyKTtcbiAgfVxuXG4gIGVudGVyQ3VycmVudFNjZW5lKCkge1xuICAgIHRoaXMuY3VycmVudFNjZW5lLmVudGVyKCk7XG5cbiAgICBmb3IgKGxldCBjbGllbnQgb2YgdGhpcy5jbGllbnRzKVxuICAgICAgdGhpcy5jdXJyZW50U2NlbmUuY2xpZW50RW50ZXIoY2xpZW50KTtcbiAgfVxuXG4gIGV4aXRDdXJyZW50U2NlbmUoKSB7XG4gICAgZm9yIChsZXQgY2xpZW50IG9mIHRoaXMuY2xpZW50cylcbiAgICAgIHRoaXMuY3VycmVudFNjZW5lLmNsaWVudEV4aXQoY2xpZW50KTtcblxuICAgIHRoaXMuY3VycmVudFNjZW5lLmV4aXQoKTtcbiAgfVxuXG4gIGVudGVyKGNsaWVudCkge1xuICAgIHN1cGVyLmVudGVyKGNsaWVudCk7XG4gICAgdGhpcy5jdXJyZW50U2NlbmUuY2xpZW50RW50ZXIoY2xpZW50KTtcblxuICAgIHRoaXMuYnJvYWRjYXN0KCdiYXJyZWwnLCBudWxsLCAnY29ubmVjdENsaWVudCcsIGNsaWVudC5pbmRleCk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMudXBkYXRlKCdudW1QbGF5ZXJzJywgdGhpcy5jbGllbnRzLmxlbmd0aCk7XG4gIH1cblxuICBleGl0KGNsaWVudCkge1xuICAgIHN1cGVyLmV4aXQoY2xpZW50KTtcblxuICAgIHRoaXMuY3VycmVudFNjZW5lLmNsaWVudEV4aXQoY2xpZW50KTtcblxuICAgIHRoaXMuYnJvYWRjYXN0KCdiYXJyZWwnLCBudWxsLCAnZGlzY29ubmVjdENsaWVudCcsIGNsaWVudC5pbmRleCk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMudXBkYXRlKCdudW1QbGF5ZXJzJywgdGhpcy5jbGllbnRzLmxlbmd0aCk7XG4gIH1cblxuICBpbml0U2NlbmVzKCkge1xuICAgIGZvciAobGV0IHNjZW5lIGluIHNjZW5lQ3RvcnMpIHtcbiAgICAgIGNvbnN0IGN0b3IgPSBzY2VuZUN0b3JzW3NjZW5lXTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHNjZW5lQ29uZmlnW3NjZW5lXTtcblxuICAgICAgaWYgKGNvbmZpZylcbiAgICAgICAgdGhpcy5zY2VuZXNbc2NlbmVdID0gbmV3IGN0b3IodGhpcywgY29uZmlnKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBjb25maWcgZm9yIHNjZW5lICcke3NjZW5lfSdgKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IHRoaXMuc2NlbmVzLm9mZjtcbiAgICB0aGlzLmVudGVyQ3VycmVudFNjZW5lKCk7XG4gIH1cblxuICBlbmFibGVUZW1wb0NoYW5nZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy50ZW1wb0NoYW5nZUVuYWJsZWQpIHtcbiAgICAgIHRoaXMudGVtcG9DaGFuZ2VFbmFibGVkID0gdmFsdWU7XG5cbiAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigndGVtcG8nLCB0aGlzLm9uVGVtcG9DaGFuZ2UpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCd0ZW1wbycsIHRoaXMub25UZW1wb0NoYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgb25TY2VuZUNoYW5nZSh2YWx1ZSkge1xuICAgIC8vIGdldCB0ZW1wZXJhdHVyZSBvbiBlYWNoIGNoYW5nZSBvZiBzY2VuYXJpb1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmxlZERpc3BsYXkucmVxdWVzdFRlbXBlcmF0dXJlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coXCJ3aWxsIGdldCB0ZW1wZXJhdHVyZSBsYXRlclwiKTtcbiAgICB9XG4gICAgdGhpcy5leGl0Q3VycmVudFNjZW5lKCk7XG4gICAgdGhpcy5jdXJyZW50U2NlbmUgPSB0aGlzLnNjZW5lc1t2YWx1ZV07XG4gICAgdGhpcy5lbnRlckN1cnJlbnRTY2VuZSgpO1xuICB9XG5cbiAgb25UZW1wb0NoYW5nZSh0ZW1wbykge1xuICAgIGlmICh0aGlzLmN1cnJlbnRTY2VuZS5zZXRUZW1wbylcbiAgICAgIHRoaXMuY3VycmVudFNjZW5lLnNldFRlbXBvKHRlbXBvKTtcblxuICAgIHRoaXMudGVtcG8gPSB0ZW1wbztcblxuICAgIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5tZXRyaWNTY2hlZHVsZXIuc3luY1RpbWU7XG4gICAgY29uc3QgbWV0cmljUG9zaXRpb24gPSB0aGlzLm1ldHJpY1NjaGVkdWxlci5nZXRNZXRyaWNQb3NpdGlvbkF0U3luY1RpbWUoc3luY1RpbWUpO1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyLnN5bmMoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgMS80LCAndGVtcG9DaGFuZ2UnKTtcbiAgfVxuXG4gIG9uQ2xlYXIoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFNjZW5lLmNsZWFyKVxuICAgICAgdGhpcy5jdXJyZW50U2NlbmUuY2xlYXIoKTtcbiAgfVxuXG4gIG9uVGVtcGVyYXR1cmUoZGF0YSkge1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zLnVwZGF0ZSgndGVtcGVyYXR1cmUnLCBkYXRhKTtcbiAgfVxuXG4gIG9uQnV0dG9uSW5jcmVtZW50ZWQoZGF0YSkge1xuICAgIGlmKHRoaXMudGVtcG9DaGFuZ2VFbmFibGVkKVxuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMudXBkYXRlKCd0ZW1wbycsIHRoaXMudGVtcG8gKyAxKTtcbiAgfVxuXG4gIG9uQnV0dG9uRGVjcmVtZW50ZWQoZGF0YSkge1xuICAgIGlmKHRoaXMudGVtcG9DaGFuZ2VFbmFibGVkKVxuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMudXBkYXRlKCd0ZW1wbycsIHRoaXMudGVtcG8gLSAxKTtcbiAgfVxufVxuIl19