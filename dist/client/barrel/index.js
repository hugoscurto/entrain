'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

var _BarrelExperience = require('./BarrelExperience');

var _BarrelExperience2 = _interopRequireDefault(_BarrelExperience);

var _serviceViews = require('../shared/serviceViews');

var _serviceViews2 = _interopRequireDefault(_serviceViews);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bootstrap() {
  var config = (0, _assign2.default)({ appContainer: '#container' }, window.soundworksConfig);
  soundworks.client.init(config.clientType, config);

  soundworks.client.setServiceInstanciationHook(function (id, instance) {
    if (_serviceViews2.default.has(id)) instance.view = _serviceViews2.default.get(id, config);
  });

  var experience = new _BarrelExperience2.default(config.assetsDomain);
  soundworks.client.start();
} // import client side soundworks and player experience


window.addEventListener('load', bootstrap);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInNvdW5kd29ya3MiLCJib290c3RyYXAiLCJjb25maWciLCJhcHBDb250YWluZXIiLCJ3aW5kb3ciLCJzb3VuZHdvcmtzQ29uZmlnIiwiY2xpZW50IiwiaW5pdCIsImNsaWVudFR5cGUiLCJzZXRTZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2siLCJpZCIsImluc3RhbmNlIiwic2VydmljZVZpZXdzIiwiaGFzIiwidmlldyIsImdldCIsImV4cGVyaWVuY2UiLCJCYXJyZWxFeHBlcmllbmNlIiwiYXNzZXRzRG9tYWluIiwic3RhcnQiLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7SUFBWUEsVTs7QUFDWjs7OztBQUNBOzs7Ozs7OztBQUVBLFNBQVNDLFNBQVQsR0FBcUI7QUFDbkIsTUFBTUMsU0FBUyxzQkFBYyxFQUFFQyxjQUFjLFlBQWhCLEVBQWQsRUFBOENDLE9BQU9DLGdCQUFyRCxDQUFmO0FBQ0FMLGFBQVdNLE1BQVgsQ0FBa0JDLElBQWxCLENBQXVCTCxPQUFPTSxVQUE5QixFQUEwQ04sTUFBMUM7O0FBRUFGLGFBQVdNLE1BQVgsQ0FBa0JHLDJCQUFsQixDQUE4QyxVQUFDQyxFQUFELEVBQUtDLFFBQUwsRUFBa0I7QUFDOUQsUUFBSUMsdUJBQWFDLEdBQWIsQ0FBaUJILEVBQWpCLENBQUosRUFDRUMsU0FBU0csSUFBVCxHQUFnQkYsdUJBQWFHLEdBQWIsQ0FBaUJMLEVBQWpCLEVBQXFCUixNQUFyQixDQUFoQjtBQUNILEdBSEQ7O0FBS0EsTUFBTWMsYUFBYSxJQUFJQywwQkFBSixDQUFxQmYsT0FBT2dCLFlBQTVCLENBQW5CO0FBQ0FsQixhQUFXTSxNQUFYLENBQWtCYSxLQUFsQjtBQUNELEMsQ0FoQkQ7OztBQWtCQWYsT0FBT2dCLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDbkIsU0FBaEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgY2xpZW50IHNpZGUgc291bmR3b3JrcyBhbmQgcGxheWVyIGV4cGVyaWVuY2VcbmltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IEJhcnJlbEV4cGVyaWVuY2UgZnJvbSAnLi9CYXJyZWxFeHBlcmllbmNlJztcbmltcG9ydCBzZXJ2aWNlVmlld3MgZnJvbSAnLi4vc2hhcmVkL3NlcnZpY2VWaWV3cyc7XG5cbmZ1bmN0aW9uIGJvb3RzdHJhcCgpIHtcbiAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7IGFwcENvbnRhaW5lcjogJyNjb250YWluZXInIH0sIHdpbmRvdy5zb3VuZHdvcmtzQ29uZmlnKTtcbiAgc291bmR3b3Jrcy5jbGllbnQuaW5pdChjb25maWcuY2xpZW50VHlwZSwgY29uZmlnKTtcblxuICBzb3VuZHdvcmtzLmNsaWVudC5zZXRTZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2soKGlkLCBpbnN0YW5jZSkgPT4ge1xuICAgIGlmIChzZXJ2aWNlVmlld3MuaGFzKGlkKSlcbiAgICAgIGluc3RhbmNlLnZpZXcgPSBzZXJ2aWNlVmlld3MuZ2V0KGlkLCBjb25maWcpO1xuICB9KTtcblxuICBjb25zdCBleHBlcmllbmNlID0gbmV3IEJhcnJlbEV4cGVyaWVuY2UoY29uZmlnLmFzc2V0c0RvbWFpbik7XG4gIHNvdW5kd29ya3MuY2xpZW50LnN0YXJ0KCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgYm9vdHN0cmFwKTtcbiJdfQ==