'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

var _serviceViews = require('../shared/serviceViews');

var _serviceViews2 = _interopRequireDefault(_serviceViews);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// launch application when document is fully loaded
// import client side soundworks and player experience
window.addEventListener('load', function () {
  // initialize the client with configuration received
  // from the server through the `index.html`
  // @see {~/src/server/index.js}
  // @see {~/html/default.ejs}
  var config = (0, _assign2.default)({ appContainer: '#container' }, window.soundworksConfig);
  soundworks.client.init(config.clientType, config);
  // configure views for the services
  soundworks.client.setServiceInstanciationHook(function (id, instance) {
    if (_serviceViews2.default.has(id)) instance.view = _serviceViews2.default.get(id, config);
  });

  var controller = new soundworks.ControllerExperience();

  controller.setGuiOptions('outputGain0', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('outputGain1', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('outputGain2', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('outputGain3', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('outputGain4', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('outputGain5', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('outputGain6', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('outputGain7', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('wooferGain', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('wooferCutoff', {
    type: 'slider',
    size: 'large'
  });

  controller.setGuiOptions('barrelDelay', {
    type: 'slider',
    size: 'large'
  });

  soundworks.client.start();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInNvdW5kd29ya3MiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiY29uZmlnIiwiYXBwQ29udGFpbmVyIiwic291bmR3b3Jrc0NvbmZpZyIsImNsaWVudCIsImluaXQiLCJjbGllbnRUeXBlIiwic2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rIiwiaWQiLCJpbnN0YW5jZSIsInNlcnZpY2VWaWV3cyIsImhhcyIsInZpZXciLCJnZXQiLCJjb250cm9sbGVyIiwiQ29udHJvbGxlckV4cGVyaWVuY2UiLCJzZXRHdWlPcHRpb25zIiwidHlwZSIsInNpemUiLCJzdGFydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7O0lBQVlBLFU7O0FBQ1o7Ozs7Ozs7O0FBRUE7QUFKQTtBQUtBQyxPQUFPQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxZQUFNO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTUMsU0FBUyxzQkFBYyxFQUFFQyxjQUFjLFlBQWhCLEVBQWQsRUFBOENILE9BQU9JLGdCQUFyRCxDQUFmO0FBQ0FMLGFBQVdNLE1BQVgsQ0FBa0JDLElBQWxCLENBQXVCSixPQUFPSyxVQUE5QixFQUEwQ0wsTUFBMUM7QUFDQTtBQUNBSCxhQUFXTSxNQUFYLENBQWtCRywyQkFBbEIsQ0FBOEMsVUFBQ0MsRUFBRCxFQUFLQyxRQUFMLEVBQWtCO0FBQzlELFFBQUlDLHVCQUFhQyxHQUFiLENBQWlCSCxFQUFqQixDQUFKLEVBQ0VDLFNBQVNHLElBQVQsR0FBZ0JGLHVCQUFhRyxHQUFiLENBQWlCTCxFQUFqQixFQUFxQlAsTUFBckIsQ0FBaEI7QUFDSCxHQUhEOztBQUtBLE1BQU1hLGFBQWEsSUFBSWhCLFdBQVdpQixvQkFBZixFQUFuQjs7QUFFQUQsYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixZQUF6QixFQUF1QztBQUNyQ0MsVUFBTSxRQUQrQjtBQUVyQ0MsVUFBTTtBQUYrQixHQUF2Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixjQUF6QixFQUF5QztBQUN2Q0MsVUFBTSxRQURpQztBQUV2Q0MsVUFBTTtBQUZpQyxHQUF6Qzs7QUFLQUosYUFBV0UsYUFBWCxDQUF5QixhQUF6QixFQUF3QztBQUN0Q0MsVUFBTSxRQURnQztBQUV0Q0MsVUFBTTtBQUZnQyxHQUF4Qzs7QUFLQXBCLGFBQVdNLE1BQVgsQ0FBa0JlLEtBQWxCO0FBQ0QsQ0F2RUQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgY2xpZW50IHNpZGUgc291bmR3b3JrcyBhbmQgcGxheWVyIGV4cGVyaWVuY2VcbmltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IHNlcnZpY2VWaWV3cyBmcm9tICcuLi9zaGFyZWQvc2VydmljZVZpZXdzJztcblxuLy8gbGF1bmNoIGFwcGxpY2F0aW9uIHdoZW4gZG9jdW1lbnQgaXMgZnVsbHkgbG9hZGVkXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgLy8gaW5pdGlhbGl6ZSB0aGUgY2xpZW50IHdpdGggY29uZmlndXJhdGlvbiByZWNlaXZlZFxuICAvLyBmcm9tIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgYGluZGV4Lmh0bWxgXG4gIC8vIEBzZWUge34vc3JjL3NlcnZlci9pbmRleC5qc31cbiAgLy8gQHNlZSB7fi9odG1sL2RlZmF1bHQuZWpzfVxuICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHsgYXBwQ29udGFpbmVyOiAnI2NvbnRhaW5lcicgfSwgd2luZG93LnNvdW5kd29ya3NDb25maWcpO1xuICBzb3VuZHdvcmtzLmNsaWVudC5pbml0KGNvbmZpZy5jbGllbnRUeXBlLCBjb25maWcpO1xuICAvLyBjb25maWd1cmUgdmlld3MgZm9yIHRoZSBzZXJ2aWNlc1xuICBzb3VuZHdvcmtzLmNsaWVudC5zZXRTZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2soKGlkLCBpbnN0YW5jZSkgPT4ge1xuICAgIGlmIChzZXJ2aWNlVmlld3MuaGFzKGlkKSlcbiAgICAgIGluc3RhbmNlLnZpZXcgPSBzZXJ2aWNlVmlld3MuZ2V0KGlkLCBjb25maWcpO1xuICB9KTtcblxuICBjb25zdCBjb250cm9sbGVyID0gbmV3IHNvdW5kd29ya3MuQ29udHJvbGxlckV4cGVyaWVuY2UoKTtcblxuICBjb250cm9sbGVyLnNldEd1aU9wdGlvbnMoJ291dHB1dEdhaW4wJywge1xuICAgIHR5cGU6ICdzbGlkZXInLFxuICAgIHNpemU6ICdsYXJnZScsXG4gIH0pO1xuXG4gIGNvbnRyb2xsZXIuc2V0R3VpT3B0aW9ucygnb3V0cHV0R2FpbjEnLCB7XG4gICAgdHlwZTogJ3NsaWRlcicsXG4gICAgc2l6ZTogJ2xhcmdlJyxcbiAgfSk7XG5cbiAgY29udHJvbGxlci5zZXRHdWlPcHRpb25zKCdvdXRwdXRHYWluMicsIHtcbiAgICB0eXBlOiAnc2xpZGVyJyxcbiAgICBzaXplOiAnbGFyZ2UnLFxuICB9KTtcblxuICBjb250cm9sbGVyLnNldEd1aU9wdGlvbnMoJ291dHB1dEdhaW4zJywge1xuICAgIHR5cGU6ICdzbGlkZXInLFxuICAgIHNpemU6ICdsYXJnZScsXG4gIH0pO1xuXG4gIGNvbnRyb2xsZXIuc2V0R3VpT3B0aW9ucygnb3V0cHV0R2FpbjQnLCB7XG4gICAgdHlwZTogJ3NsaWRlcicsXG4gICAgc2l6ZTogJ2xhcmdlJyxcbiAgfSk7XG5cbiAgY29udHJvbGxlci5zZXRHdWlPcHRpb25zKCdvdXRwdXRHYWluNScsIHtcbiAgICB0eXBlOiAnc2xpZGVyJyxcbiAgICBzaXplOiAnbGFyZ2UnLFxuICB9KTtcbiAgXG4gIGNvbnRyb2xsZXIuc2V0R3VpT3B0aW9ucygnb3V0cHV0R2FpbjYnLCB7XG4gICAgdHlwZTogJ3NsaWRlcicsXG4gICAgc2l6ZTogJ2xhcmdlJyxcbiAgfSk7XG5cbiAgY29udHJvbGxlci5zZXRHdWlPcHRpb25zKCdvdXRwdXRHYWluNycsIHtcbiAgICB0eXBlOiAnc2xpZGVyJyxcbiAgICBzaXplOiAnbGFyZ2UnLFxuICB9KTtcblxuICBjb250cm9sbGVyLnNldEd1aU9wdGlvbnMoJ3dvb2ZlckdhaW4nLCB7XG4gICAgdHlwZTogJ3NsaWRlcicsXG4gICAgc2l6ZTogJ2xhcmdlJyxcbiAgfSk7XG5cbiAgY29udHJvbGxlci5zZXRHdWlPcHRpb25zKCd3b29mZXJDdXRvZmYnLCB7XG4gICAgdHlwZTogJ3NsaWRlcicsXG4gICAgc2l6ZTogJ2xhcmdlJyxcbiAgfSk7XG5cbiAgY29udHJvbGxlci5zZXRHdWlPcHRpb25zKCdiYXJyZWxEZWxheScsIHtcbiAgICB0eXBlOiAnc2xpZGVyJyxcbiAgICBzaXplOiAnbGFyZ2UnLFxuICB9KTtcblxuICBzb3VuZHdvcmtzLmNsaWVudC5zdGFydCgpO1xufSk7XG4iXX0=