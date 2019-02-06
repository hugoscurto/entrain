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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

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

var template = '\n  <canvas class="background flex-middle"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-middle"></div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

// this experience plays a sound when it starts, and plays another sound when
// other clients join the experience

var PlayerExperience = function (_soundworks$Experienc) {
  (0, _inherits3.default)(PlayerExperience, _soundworks$Experienc);

  function PlayerExperience(assetsDomain) {
    (0, _classCallCheck3.default)(this, PlayerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PlayerExperience.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience)).call(this));

    _this.platform = _this.require('platform', { features: ['web-audio'] });
    _this.motionInput = _this.require('motion-input', { descriptors: ['accelerationIncludingGravity', 'rotationRate'] });

    _this.scenes = {};
    _this.currentScene = null;

    _this.sharedParams = _this.require('shared-params');
    _this.checkin = _this.require('checkin');
    _this.audioBufferManager = _this.require('audio-buffer-manager', { assetsDomain: assetsDomain });

    _this.syncScheduler = _this.require('sync-scheduler');
    _this.metricScheduler = _this.require('metric-scheduler');
    _this.surface = null;

    _this.tempo = 120;

    _this.onTempoChange = _this.onTempoChange.bind(_this);
    _this.onSceneChange = _this.onSceneChange.bind(_this);
    _this.onClear = _this.onClear.bind(_this);
    _this.onReload = _this.onReload.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(PlayerExperience, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(PlayerExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience.prototype), 'start', this).call(this);

      this.view = new soundworks.CanvasView(template, {}, {}, {
        id: this.id,
        ratios: {
          '.section-top': 0,
          '.section-center': 1,
          '.section-bottom': 0
        }
      });

      this.show().then(function () {
        _this2.surface = new soundworks.TouchSurface(_this2.view.$el, { normalizeCoordinates: false });

        _this2.initAudio();
        _this2.initScenes();
        _this2.currentScene.enter();

        _this2.sharedParams.addParamListener('tempo', _this2.onTempoChange);
        _this2.sharedParams.addParamListener('scene', _this2.onSceneChange);
        _this2.sharedParams.addParamListener('clear', _this2.onClear);
        _this2.sharedParams.addParamListener('reload', _this2.onReload);
      });
    }
  }, {
    key: 'initSurface',
    value: function initSurface() {
      var surface = new soundworks.TouchSurface(this.view.$el);
    }
  }, {
    key: 'initAudio',
    value: function initAudio() {
      this.audioOutput = audioContext.createGain();
      this.audioOutput.connect(audioContext.destination);
      this.audioOutput.gain.value = 1;
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
    }
  }, {
    key: 'onTempoChange',
    value: function onTempoChange(value) {
      this.tempo = value;

      if (this.currentScene.setTempo) this.currentScene.setTempo(value);
    }
  }, {
    key: 'onSceneChange',
    value: function onSceneChange(value) {
      this.currentScene.exit();
      this.currentScene = this.scenes[value];
      this.currentScene.enter();
    }
  }, {
    key: 'onClear',
    value: function onClear() {
      if (this.currentScene.clear) this.currentScene.clear();
    }
  }, {
    key: 'onReload',
    value: function onReload(value) {
      window.location.reload();
    }
  }]);
  return PlayerExperience;
}(soundworks.Experience);

exports.default = PlayerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImF1ZGlvQ29udGV4dCIsInNjZW5lQ3RvcnMiLCJTY2VuZU9mZiIsIlNjZW5lQ285MDkiLCJTY2VuZUNvbGxlY3RpdmVMb29wcyIsIlNjZW5lQ29NaXgiLCJTY2VuZVd3cnlSIiwidGVtcGxhdGUiLCJQbGF5ZXJFeHBlcmllbmNlIiwiYXNzZXRzRG9tYWluIiwicGxhdGZvcm0iLCJyZXF1aXJlIiwiZmVhdHVyZXMiLCJtb3Rpb25JbnB1dCIsImRlc2NyaXB0b3JzIiwic2NlbmVzIiwiY3VycmVudFNjZW5lIiwic2hhcmVkUGFyYW1zIiwiY2hlY2tpbiIsImF1ZGlvQnVmZmVyTWFuYWdlciIsInN5bmNTY2hlZHVsZXIiLCJtZXRyaWNTY2hlZHVsZXIiLCJzdXJmYWNlIiwidGVtcG8iLCJvblRlbXBvQ2hhbmdlIiwiYmluZCIsIm9uU2NlbmVDaGFuZ2UiLCJvbkNsZWFyIiwib25SZWxvYWQiLCJ2aWV3IiwiQ2FudmFzVmlldyIsImlkIiwicmF0aW9zIiwic2hvdyIsInRoZW4iLCJUb3VjaFN1cmZhY2UiLCIkZWwiLCJub3JtYWxpemVDb29yZGluYXRlcyIsImluaXRBdWRpbyIsImluaXRTY2VuZXMiLCJlbnRlciIsImFkZFBhcmFtTGlzdGVuZXIiLCJhdWRpb091dHB1dCIsImNyZWF0ZUdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJnYWluIiwidmFsdWUiLCJzY2VuZSIsImN0b3IiLCJjb25maWciLCJzY2VuZUNvbmZpZyIsIkVycm9yIiwib2ZmIiwic2V0VGVtcG8iLCJleGl0IiwiY2xlYXIiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlbG9hZCIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxVOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFDQSxJQUFNQyxlQUFlRCxXQUFXQyxZQUFoQzs7QUFFQSxJQUFNQyxhQUFhO0FBQ2pCLFNBQU9DLGFBRFU7QUFFakIsWUFBVUMsWUFGTztBQUdqQixzQkFBb0JDLHlCQUhIO0FBSWpCLFlBQVVDLGVBSk87QUFLakIsWUFBVUM7QUFMTyxDQUFuQjs7QUFRQSxJQUFNQyxrUUFBTjs7QUFTQTtBQUNBOztJQUNxQkMsZ0I7OztBQUNuQiw0QkFBWUMsWUFBWixFQUEwQjtBQUFBOztBQUFBOztBQUd4QixVQUFLQyxRQUFMLEdBQWdCLE1BQUtDLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQUVDLFVBQVUsQ0FBQyxXQUFELENBQVosRUFBekIsQ0FBaEI7QUFDQSxVQUFLQyxXQUFMLEdBQW1CLE1BQUtGLE9BQUwsQ0FBYSxjQUFiLEVBQTZCLEVBQUVHLGFBQWEsQ0FBQyw4QkFBRCxFQUFpQyxjQUFqQyxDQUFmLEVBQTdCLENBQW5COztBQUVBLFVBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQixJQUFwQjs7QUFFQSxVQUFLQyxZQUFMLEdBQW9CLE1BQUtOLE9BQUwsQ0FBYSxlQUFiLENBQXBCO0FBQ0EsVUFBS08sT0FBTCxHQUFlLE1BQUtQLE9BQUwsQ0FBYSxTQUFiLENBQWY7QUFDQSxVQUFLUSxrQkFBTCxHQUEwQixNQUFLUixPQUFMLENBQWEsc0JBQWIsRUFBcUMsRUFBRUYsY0FBY0EsWUFBaEIsRUFBckMsQ0FBMUI7O0FBRUEsVUFBS1csYUFBTCxHQUFxQixNQUFLVCxPQUFMLENBQWEsZ0JBQWIsQ0FBckI7QUFDQSxVQUFLVSxlQUFMLEdBQXVCLE1BQUtWLE9BQUwsQ0FBYSxrQkFBYixDQUF2QjtBQUNBLFVBQUtXLE9BQUwsR0FBZSxJQUFmOztBQUVBLFVBQUtDLEtBQUwsR0FBYSxHQUFiOztBQUVBLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQkMsSUFBbkIsT0FBckI7QUFDQSxVQUFLQyxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJELElBQW5CLE9BQXJCO0FBQ0EsVUFBS0UsT0FBTCxHQUFlLE1BQUtBLE9BQUwsQ0FBYUYsSUFBYixPQUFmO0FBQ0EsVUFBS0csUUFBTCxHQUFnQixNQUFLQSxRQUFMLENBQWNILElBQWQsT0FBaEI7QUF0QndCO0FBdUJ6Qjs7Ozs0QkFFTztBQUFBOztBQUNOOztBQUVBLFdBQUtJLElBQUwsR0FBWSxJQUFJOUIsV0FBVytCLFVBQWYsQ0FBMEJ2QixRQUExQixFQUFvQyxFQUFwQyxFQUF3QyxFQUF4QyxFQUE0QztBQUN0RHdCLFlBQUksS0FBS0EsRUFENkM7QUFFdERDLGdCQUFRO0FBQ04sMEJBQWdCLENBRFY7QUFFTiw2QkFBbUIsQ0FGYjtBQUdOLDZCQUFtQjtBQUhiO0FBRjhDLE9BQTVDLENBQVo7O0FBU0EsV0FBS0MsSUFBTCxHQUFZQyxJQUFaLENBQWlCLFlBQU07QUFDckIsZUFBS1osT0FBTCxHQUFlLElBQUl2QixXQUFXb0MsWUFBZixDQUE0QixPQUFLTixJQUFMLENBQVVPLEdBQXRDLEVBQTJDLEVBQUVDLHNCQUFzQixLQUF4QixFQUEzQyxDQUFmOztBQUVBLGVBQUtDLFNBQUw7QUFDQSxlQUFLQyxVQUFMO0FBQ0EsZUFBS3ZCLFlBQUwsQ0FBa0J3QixLQUFsQjs7QUFFQSxlQUFLdkIsWUFBTCxDQUFrQndCLGdCQUFsQixDQUFtQyxPQUFuQyxFQUE0QyxPQUFLakIsYUFBakQ7QUFDQSxlQUFLUCxZQUFMLENBQWtCd0IsZ0JBQWxCLENBQW1DLE9BQW5DLEVBQTRDLE9BQUtmLGFBQWpEO0FBQ0EsZUFBS1QsWUFBTCxDQUFrQndCLGdCQUFsQixDQUFtQyxPQUFuQyxFQUE0QyxPQUFLZCxPQUFqRDtBQUNBLGVBQUtWLFlBQUwsQ0FBa0J3QixnQkFBbEIsQ0FBbUMsUUFBbkMsRUFBNkMsT0FBS2IsUUFBbEQ7QUFDRCxPQVhEO0FBWUQ7OztrQ0FFYTtBQUNaLFVBQU1OLFVBQVUsSUFBSXZCLFdBQVdvQyxZQUFmLENBQTRCLEtBQUtOLElBQUwsQ0FBVU8sR0FBdEMsQ0FBaEI7QUFDRDs7O2dDQUVXO0FBQ1YsV0FBS00sV0FBTCxHQUFtQjFDLGFBQWEyQyxVQUFiLEVBQW5CO0FBQ0EsV0FBS0QsV0FBTCxDQUFpQkUsT0FBakIsQ0FBeUI1QyxhQUFhNkMsV0FBdEM7QUFDQSxXQUFLSCxXQUFMLENBQWlCSSxJQUFqQixDQUFzQkMsS0FBdEIsR0FBOEIsQ0FBOUI7QUFDRDs7O2lDQUVZO0FBQ1gsV0FBSyxJQUFJQyxLQUFULElBQWtCL0MsVUFBbEIsRUFBOEI7QUFDNUIsWUFBTWdELE9BQU9oRCxXQUFXK0MsS0FBWCxDQUFiO0FBQ0EsWUFBTUUsU0FBU0MsdUJBQVlILEtBQVosQ0FBZjs7QUFFQSxZQUFJRSxNQUFKLEVBQ0UsS0FBS25DLE1BQUwsQ0FBWWlDLEtBQVosSUFBcUIsSUFBSUMsSUFBSixDQUFTLElBQVQsRUFBZUMsTUFBZixDQUFyQixDQURGLEtBR0UsTUFBTSxJQUFJRSxLQUFKLHFDQUEyQ0osS0FBM0MsUUFBTjtBQUNIOztBQUVELFdBQUtoQyxZQUFMLEdBQW9CLEtBQUtELE1BQUwsQ0FBWXNDLEdBQWhDO0FBQ0Q7OztrQ0FFYU4sSyxFQUFPO0FBQ25CLFdBQUt4QixLQUFMLEdBQWF3QixLQUFiOztBQUVBLFVBQUksS0FBSy9CLFlBQUwsQ0FBa0JzQyxRQUF0QixFQUNFLEtBQUt0QyxZQUFMLENBQWtCc0MsUUFBbEIsQ0FBMkJQLEtBQTNCO0FBQ0g7OztrQ0FFYUEsSyxFQUFPO0FBQ25CLFdBQUsvQixZQUFMLENBQWtCdUMsSUFBbEI7QUFDQSxXQUFLdkMsWUFBTCxHQUFvQixLQUFLRCxNQUFMLENBQVlnQyxLQUFaLENBQXBCO0FBQ0EsV0FBSy9CLFlBQUwsQ0FBa0J3QixLQUFsQjtBQUNEOzs7OEJBRVM7QUFDUixVQUFHLEtBQUt4QixZQUFMLENBQWtCd0MsS0FBckIsRUFDRSxLQUFLeEMsWUFBTCxDQUFrQndDLEtBQWxCO0FBQ0g7Ozs2QkFFUVQsSyxFQUFPO0FBQ2RVLGFBQU9DLFFBQVAsQ0FBZ0JDLE1BQWhCO0FBQ0Q7OztFQWhHMkM1RCxXQUFXNkQsVTs7a0JBQXBDcEQsZ0IiLCJmaWxlIjoiUGxheWVyRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IHNjZW5lQ29uZmlnIGZyb20gJy4uLy4uL3NoYXJlZC9zY2VuZXMtY29uZmlnJztcbmltcG9ydCBTY2VuZU9mZiBmcm9tICcuL3NjZW5lcy9vZmYnO1xuaW1wb3J0IFNjZW5lQ285MDkgZnJvbSAnLi9zY2VuZXMvY28tOTA5JztcbmltcG9ydCBTY2VuZUNvbGxlY3RpdmVMb29wcyBmcm9tICcuL3NjZW5lcy9jb2xsZWN0aXZlLWxvb3BzJztcbmltcG9ydCBTY2VuZUNvTWl4IGZyb20gJy4vc2NlbmVzL2NvLW1peCc7XG5pbXBvcnQgU2NlbmVXd3J5UiBmcm9tICcuL3NjZW5lcy93d3J5LXInO1xuY29uc3QgYXVkaW9Db250ZXh0ID0gc291bmR3b3Jrcy5hdWRpb0NvbnRleHQ7XG5cbmNvbnN0IHNjZW5lQ3RvcnMgPSB7XG4gICdvZmYnOiBTY2VuZU9mZixcbiAgJ2NvLTkwOSc6IFNjZW5lQ285MDksXG4gICdjb2xsZWN0aXZlLWxvb3BzJzogU2NlbmVDb2xsZWN0aXZlTG9vcHMsXG4gICdjby1taXgnOiBTY2VuZUNvTWl4LFxuICAnd3dyeS1yJzogU2NlbmVXd3J5Uixcbn07XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZCBmbGV4LW1pZGRsZVwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbi8vIHRoaXMgZXhwZXJpZW5jZSBwbGF5cyBhIHNvdW5kIHdoZW4gaXQgc3RhcnRzLCBhbmQgcGxheXMgYW5vdGhlciBzb3VuZCB3aGVuXG4vLyBvdGhlciBjbGllbnRzIGpvaW4gdGhlIGV4cGVyaWVuY2VcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckV4cGVyaWVuY2UgZXh0ZW5kcyBzb3VuZHdvcmtzLkV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3Rvcihhc3NldHNEb21haW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiBbJ3dlYi1hdWRpbyddIH0pO1xuICAgIHRoaXMubW90aW9uSW5wdXQgPSB0aGlzLnJlcXVpcmUoJ21vdGlvbi1pbnB1dCcsIHsgZGVzY3JpcHRvcnM6IFsnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScsICdyb3RhdGlvblJhdGUnXSB9KTtcblxuICAgIHRoaXMuc2NlbmVzID0ge307XG4gICAgdGhpcy5jdXJyZW50U2NlbmUgPSBudWxsO1xuXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLmNoZWNraW4gPSB0aGlzLnJlcXVpcmUoJ2NoZWNraW4nKTtcbiAgICB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tYnVmZmVyLW1hbmFnZXInLCB7IGFzc2V0c0RvbWFpbjogYXNzZXRzRG9tYWluIH0pO1xuXG4gICAgdGhpcy5zeW5jU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzeW5jLXNjaGVkdWxlcicpO1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdtZXRyaWMtc2NoZWR1bGVyJyk7XG4gICAgdGhpcy5zdXJmYWNlID0gbnVsbDtcblxuICAgIHRoaXMudGVtcG8gPSAxMjA7XG5cbiAgICB0aGlzLm9uVGVtcG9DaGFuZ2UgPSB0aGlzLm9uVGVtcG9DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uU2NlbmVDaGFuZ2UgPSB0aGlzLm9uU2NlbmVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQ2xlYXIgPSB0aGlzLm9uQ2xlYXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uUmVsb2FkID0gdGhpcy5vblJlbG9hZC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMudmlldyA9IG5ldyBzb3VuZHdvcmtzLkNhbnZhc1ZpZXcodGVtcGxhdGUsIHt9LCB7fSwge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICByYXRpb3M6IHtcbiAgICAgICAgJy5zZWN0aW9uLXRvcCc6IDAsXG4gICAgICAgICcuc2VjdGlvbi1jZW50ZXInOiAxLFxuICAgICAgICAnLnNlY3Rpb24tYm90dG9tJzogMCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnNob3coKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBzb3VuZHdvcmtzLlRvdWNoU3VyZmFjZSh0aGlzLnZpZXcuJGVsLCB7IG5vcm1hbGl6ZUNvb3JkaW5hdGVzOiBmYWxzZSB9KTtcblxuICAgICAgdGhpcy5pbml0QXVkaW8oKTtcbiAgICAgIHRoaXMuaW5pdFNjZW5lcygpO1xuICAgICAgdGhpcy5jdXJyZW50U2NlbmUuZW50ZXIoKTtcblxuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigndGVtcG8nLCB0aGlzLm9uVGVtcG9DaGFuZ2UpO1xuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignc2NlbmUnLCB0aGlzLm9uU2NlbmVDaGFuZ2UpO1xuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignY2xlYXInLCB0aGlzLm9uQ2xlYXIpO1xuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigncmVsb2FkJywgdGhpcy5vblJlbG9hZCk7XG4gICAgfSk7XG4gIH1cblxuICBpbml0U3VyZmFjZSgpIHtcbiAgICBjb25zdCBzdXJmYWNlID0gbmV3IHNvdW5kd29ya3MuVG91Y2hTdXJmYWNlKHRoaXMudmlldy4kZWwpO1xuICB9XG5cbiAgaW5pdEF1ZGlvKCkge1xuICAgIHRoaXMuYXVkaW9PdXRwdXQgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuYXVkaW9PdXRwdXQuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIHRoaXMuYXVkaW9PdXRwdXQuZ2Fpbi52YWx1ZSA9IDE7XG4gIH1cblxuICBpbml0U2NlbmVzKCkge1xuICAgIGZvciAobGV0IHNjZW5lIGluIHNjZW5lQ3RvcnMpIHtcbiAgICAgIGNvbnN0IGN0b3IgPSBzY2VuZUN0b3JzW3NjZW5lXTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHNjZW5lQ29uZmlnW3NjZW5lXTtcblxuICAgICAgaWYgKGNvbmZpZylcbiAgICAgICAgdGhpcy5zY2VuZXNbc2NlbmVdID0gbmV3IGN0b3IodGhpcywgY29uZmlnKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBjb25maWcgZm9yIHNjZW5lICcke3NjZW5lfSdgKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IHRoaXMuc2NlbmVzLm9mZjtcbiAgfVxuXG4gIG9uVGVtcG9DaGFuZ2UodmFsdWUpIHtcbiAgICB0aGlzLnRlbXBvID0gdmFsdWU7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50U2NlbmUuc2V0VGVtcG8pXG4gICAgICB0aGlzLmN1cnJlbnRTY2VuZS5zZXRUZW1wbyh2YWx1ZSk7XG4gIH1cblxuICBvblNjZW5lQ2hhbmdlKHZhbHVlKSB7XG4gICAgdGhpcy5jdXJyZW50U2NlbmUuZXhpdCgpO1xuICAgIHRoaXMuY3VycmVudFNjZW5lID0gdGhpcy5zY2VuZXNbdmFsdWVdO1xuICAgIHRoaXMuY3VycmVudFNjZW5lLmVudGVyKCk7XG4gIH1cblxuICBvbkNsZWFyKCkge1xuICAgIGlmKHRoaXMuY3VycmVudFNjZW5lLmNsZWFyKVxuICAgICAgdGhpcy5jdXJyZW50U2NlbmUuY2xlYXIoKTtcbiAgfVxuXG4gIG9uUmVsb2FkKHZhbHVlKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9XG59XG4iXX0=