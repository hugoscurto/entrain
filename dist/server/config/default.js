'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

// Configuration of the application.
// Other entries can be added (as long as their name doesn't conflict with
// existing ones) to define global parameters of the application (e.g. BPM,
// synth parameters) that can then be shared easily among all clients using
// the `shared-config` service.
exports.default = {
  // name of the application, used in the `.ejs` template and by default in
  // the `platform` service to populate its view
  appName: 'CoLoop',

  // name of the environnement ('production' enable cache in express application)
  env: 'development',

  someArray: [0, 1, 2],
  // version of application, can be used to force reload css and js files
  // from server (cf. `html/default.ejs`)
  version: '0.0.1',

  // name of the default client type, i.e. the client that can access the
  // application at its root URL
  defaultClient: 'player',

  // define from where the assets (static files) should be loaded, these value
  // could also refer to a separate server for scalability reasons. This value
  // should also be used client-side to configure the `audio-buffer-manager` service.
  assetsDomain: '/',

  // port used to open the http server, in production this value is typically 80
  port: 8000,

  // define if the server should use gzip compression for static files
  enableGZipCompression: true,

  // location of the public directory (accessible through http(s) requests)
  publicDirectory: _path2.default.join(cwd, 'public'),

  // directory where the server templating system looks for the `ejs` templates
  templateDirectory: _path2.default.join(cwd, 'html'),

  // define if the HTTP server should be launched using secure connections.
  // For development purposes when set to `true` and no certificates are given
  // (cf. `httpsInfos`), a self-signed certificate is created.
  useHttps: false,

  // paths to the key and certificate to be used in order to launch the https
  // server. Both entries are required otherwise a self-signed certificate
  // is generated.
  httpsInfos: {
    key: null,
    cert: null
  },

  // socket.io configuration
  websockets: {
    url: '',
    transports: ['websocket'],
    path: ''
    // @note: EngineIO defaults
    // pingTimeout: 3000,
    // pingInterval: 1000,
    // upgradeTimeout: 10000,
    // maxHttpBufferSize: 10E7,
  },

  // describe the location where the experience takes places, theses values are
  // used by the `placer`, `checkin` and `locator` services.
  // if one of these service is required, this entry shouldn't be removed.
  setup: {
    area: {
      width: 1,
      height: 1,
      // path to an image to be used in the area representation
      background: null
    },
    // list of predefined labels
    labels: null,
    // list of predefined coordinates given as an array of `[x:Number, y:Number]`
    coordinates: null,
    // maximum number of clients allowed in a position
    maxClientsPerPosition: 1,
    // maximum number of positions (may limit or be limited by the number of
    // labels and/or coordinates)
    capacity: 8
  },

  // password to be used by the `auth` service
  password: '',

  // configuration of the `osc` service
  osc: {
    // IP of the currently running node server
    receiveAddress: '127.0.0.1',
    // port listening for incomming messages
    receivePort: 57121,
    // IP of the remote application
    sendAddress: '127.0.0.1',
    // port where the remote application is listening for messages
    sendPort: 57120
  },

  // configuration of the `raw-socket` service
  rawSocket: {
    // port used for socket connection
    port: 8080
  },

  // bunyan configuration
  logger: {
    name: 'soundworks',
    level: 'info',
    streams: [{
      level: 'info',
      stream: process.stdout
    }]
  },

  // directory where error reported from the clients are written
  errorReporterDirectory: _path2.default.join(cwd, 'logs', 'clients')
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHQuanMiXSwibmFtZXMiOlsiY3dkIiwicHJvY2VzcyIsImFwcE5hbWUiLCJlbnYiLCJzb21lQXJyYXkiLCJ2ZXJzaW9uIiwiZGVmYXVsdENsaWVudCIsImFzc2V0c0RvbWFpbiIsInBvcnQiLCJlbmFibGVHWmlwQ29tcHJlc3Npb24iLCJwdWJsaWNEaXJlY3RvcnkiLCJwYXRoIiwiam9pbiIsInRlbXBsYXRlRGlyZWN0b3J5IiwidXNlSHR0cHMiLCJodHRwc0luZm9zIiwia2V5IiwiY2VydCIsIndlYnNvY2tldHMiLCJ1cmwiLCJ0cmFuc3BvcnRzIiwic2V0dXAiLCJhcmVhIiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kIiwibGFiZWxzIiwiY29vcmRpbmF0ZXMiLCJtYXhDbGllbnRzUGVyUG9zaXRpb24iLCJjYXBhY2l0eSIsInBhc3N3b3JkIiwib3NjIiwicmVjZWl2ZUFkZHJlc3MiLCJyZWNlaXZlUG9ydCIsInNlbmRBZGRyZXNzIiwic2VuZFBvcnQiLCJyYXdTb2NrZXQiLCJsb2dnZXIiLCJuYW1lIiwibGV2ZWwiLCJzdHJlYW1zIiwic3RyZWFtIiwic3Rkb3V0IiwiZXJyb3JSZXBvcnRlckRpcmVjdG9yeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUNBLElBQU1BLE1BQU1DLFFBQVFELEdBQVIsRUFBWjs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO2tCQUNlO0FBQ2I7QUFDQTtBQUNBRSxXQUFTLFFBSEk7O0FBS2I7QUFDQUMsT0FBSyxhQU5ROztBQVFiQyxhQUFXLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBUkU7QUFTYjtBQUNBO0FBQ0FDLFdBQVMsT0FYSTs7QUFhYjtBQUNBO0FBQ0FDLGlCQUFlLFFBZkY7O0FBaUJiO0FBQ0E7QUFDQTtBQUNBQyxnQkFBYyxHQXBCRDs7QUFzQmI7QUFDQUMsUUFBTSxJQXZCTzs7QUEwQmI7QUFDQUMseUJBQXVCLElBM0JWOztBQTZCYjtBQUNBQyxtQkFBaUJDLGVBQUtDLElBQUwsQ0FBVVosR0FBVixFQUFlLFFBQWYsQ0E5Qko7O0FBZ0NiO0FBQ0FhLHFCQUFtQkYsZUFBS0MsSUFBTCxDQUFVWixHQUFWLEVBQWUsTUFBZixDQWpDTjs7QUFvQ2I7QUFDQTtBQUNBO0FBQ0FjLFlBQVUsS0F2Q0c7O0FBeUNiO0FBQ0E7QUFDQTtBQUNBQyxjQUFZO0FBQ1ZDLFNBQUssSUFESztBQUVWQyxVQUFNO0FBRkksR0E1Q0M7O0FBaURiO0FBQ0FDLGNBQVk7QUFDVkMsU0FBSyxFQURLO0FBRVZDLGdCQUFZLENBQUMsV0FBRCxDQUZGO0FBR1ZULFVBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUlUsR0FsREM7O0FBNkRiO0FBQ0E7QUFDQTtBQUNBVSxTQUFPO0FBQ0xDLFVBQU07QUFDSkMsYUFBTyxDQURIO0FBRUpDLGNBQVEsQ0FGSjtBQUdKO0FBQ0FDLGtCQUFZO0FBSlIsS0FERDtBQU9MO0FBQ0FDLFlBQVEsSUFSSDtBQVNMO0FBQ0FDLGlCQUFhLElBVlI7QUFXTDtBQUNBQywyQkFBdUIsQ0FabEI7QUFhTDtBQUNBO0FBQ0FDLGNBQVU7QUFmTCxHQWhFTTs7QUFrRmI7QUFDQUMsWUFBVSxFQW5GRzs7QUFxRmI7QUFDQUMsT0FBSztBQUNIO0FBQ0FDLG9CQUFnQixXQUZiO0FBR0g7QUFDQUMsaUJBQWEsS0FKVjtBQUtIO0FBQ0FDLGlCQUFhLFdBTlY7QUFPSDtBQUNBQyxjQUFVO0FBUlAsR0F0RlE7O0FBaUdiO0FBQ0FDLGFBQVc7QUFDVDtBQUNBNUIsVUFBTTtBQUZHLEdBbEdFOztBQXVHYjtBQUNBNkIsVUFBUTtBQUNOQyxVQUFNLFlBREE7QUFFTkMsV0FBTyxNQUZEO0FBR05DLGFBQVMsQ0FBQztBQUNSRCxhQUFPLE1BREM7QUFFUkUsY0FBUXhDLFFBQVF5QztBQUZSLEtBQUQ7QUFISCxHQXhHSzs7QUFvSGI7QUFDQUMsMEJBQXdCaEMsZUFBS0MsSUFBTCxDQUFVWixHQUFWLEVBQWUsTUFBZixFQUF1QixTQUF2QjtBQXJIWCxDIiwiZmlsZSI6ImRlZmF1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmNvbnN0IGN3ZCA9IHByb2Nlc3MuY3dkKCk7XG5cblxuLy8gQ29uZmlndXJhdGlvbiBvZiB0aGUgYXBwbGljYXRpb24uXG4vLyBPdGhlciBlbnRyaWVzIGNhbiBiZSBhZGRlZCAoYXMgbG9uZyBhcyB0aGVpciBuYW1lIGRvZXNuJ3QgY29uZmxpY3Qgd2l0aFxuLy8gZXhpc3Rpbmcgb25lcykgdG8gZGVmaW5lIGdsb2JhbCBwYXJhbWV0ZXJzIG9mIHRoZSBhcHBsaWNhdGlvbiAoZS5nLiBCUE0sXG4vLyBzeW50aCBwYXJhbWV0ZXJzKSB0aGF0IGNhbiB0aGVuIGJlIHNoYXJlZCBlYXNpbHkgYW1vbmcgYWxsIGNsaWVudHMgdXNpbmdcbi8vIHRoZSBgc2hhcmVkLWNvbmZpZ2Agc2VydmljZS5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gbmFtZSBvZiB0aGUgYXBwbGljYXRpb24sIHVzZWQgaW4gdGhlIGAuZWpzYCB0ZW1wbGF0ZSBhbmQgYnkgZGVmYXVsdCBpblxuICAvLyB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlIHRvIHBvcHVsYXRlIGl0cyB2aWV3XG4gIGFwcE5hbWU6ICdDb0xvb3AnLFxuXG4gIC8vIG5hbWUgb2YgdGhlIGVudmlyb25uZW1lbnQgKCdwcm9kdWN0aW9uJyBlbmFibGUgY2FjaGUgaW4gZXhwcmVzcyBhcHBsaWNhdGlvbilcbiAgZW52OiAnZGV2ZWxvcG1lbnQnLFxuXG4gIHNvbWVBcnJheTogWzAsIDEsIDJdLFxuICAvLyB2ZXJzaW9uIG9mIGFwcGxpY2F0aW9uLCBjYW4gYmUgdXNlZCB0byBmb3JjZSByZWxvYWQgY3NzIGFuZCBqcyBmaWxlc1xuICAvLyBmcm9tIHNlcnZlciAoY2YuIGBodG1sL2RlZmF1bHQuZWpzYClcbiAgdmVyc2lvbjogJzAuMC4xJyxcblxuICAvLyBuYW1lIG9mIHRoZSBkZWZhdWx0IGNsaWVudCB0eXBlLCBpLmUuIHRoZSBjbGllbnQgdGhhdCBjYW4gYWNjZXNzIHRoZVxuICAvLyBhcHBsaWNhdGlvbiBhdCBpdHMgcm9vdCBVUkxcbiAgZGVmYXVsdENsaWVudDogJ3BsYXllcicsXG5cbiAgLy8gZGVmaW5lIGZyb20gd2hlcmUgdGhlIGFzc2V0cyAoc3RhdGljIGZpbGVzKSBzaG91bGQgYmUgbG9hZGVkLCB0aGVzZSB2YWx1ZVxuICAvLyBjb3VsZCBhbHNvIHJlZmVyIHRvIGEgc2VwYXJhdGUgc2VydmVyIGZvciBzY2FsYWJpbGl0eSByZWFzb25zLiBUaGlzIHZhbHVlXG4gIC8vIHNob3VsZCBhbHNvIGJlIHVzZWQgY2xpZW50LXNpZGUgdG8gY29uZmlndXJlIHRoZSBgYXVkaW8tYnVmZmVyLW1hbmFnZXJgIHNlcnZpY2UuXG4gIGFzc2V0c0RvbWFpbjogJy8nLFxuXG4gIC8vIHBvcnQgdXNlZCB0byBvcGVuIHRoZSBodHRwIHNlcnZlciwgaW4gcHJvZHVjdGlvbiB0aGlzIHZhbHVlIGlzIHR5cGljYWxseSA4MFxuICBwb3J0OiA4MDAwLFxuXG5cbiAgLy8gZGVmaW5lIGlmIHRoZSBzZXJ2ZXIgc2hvdWxkIHVzZSBnemlwIGNvbXByZXNzaW9uIGZvciBzdGF0aWMgZmlsZXNcbiAgZW5hYmxlR1ppcENvbXByZXNzaW9uOiB0cnVlLFxuXG4gIC8vIGxvY2F0aW9uIG9mIHRoZSBwdWJsaWMgZGlyZWN0b3J5IChhY2Nlc3NpYmxlIHRocm91Z2ggaHR0cChzKSByZXF1ZXN0cylcbiAgcHVibGljRGlyZWN0b3J5OiBwYXRoLmpvaW4oY3dkLCAncHVibGljJyksXG5cbiAgLy8gZGlyZWN0b3J5IHdoZXJlIHRoZSBzZXJ2ZXIgdGVtcGxhdGluZyBzeXN0ZW0gbG9va3MgZm9yIHRoZSBgZWpzYCB0ZW1wbGF0ZXNcbiAgdGVtcGxhdGVEaXJlY3Rvcnk6IHBhdGguam9pbihjd2QsICdodG1sJyksXG5cblxuICAvLyBkZWZpbmUgaWYgdGhlIEhUVFAgc2VydmVyIHNob3VsZCBiZSBsYXVuY2hlZCB1c2luZyBzZWN1cmUgY29ubmVjdGlvbnMuXG4gIC8vIEZvciBkZXZlbG9wbWVudCBwdXJwb3NlcyB3aGVuIHNldCB0byBgdHJ1ZWAgYW5kIG5vIGNlcnRpZmljYXRlcyBhcmUgZ2l2ZW5cbiAgLy8gKGNmLiBgaHR0cHNJbmZvc2ApLCBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGlzIGNyZWF0ZWQuXG4gIHVzZUh0dHBzOiBmYWxzZSxcblxuICAvLyBwYXRocyB0byB0aGUga2V5IGFuZCBjZXJ0aWZpY2F0ZSB0byBiZSB1c2VkIGluIG9yZGVyIHRvIGxhdW5jaCB0aGUgaHR0cHNcbiAgLy8gc2VydmVyLiBCb3RoIGVudHJpZXMgYXJlIHJlcXVpcmVkIG90aGVyd2lzZSBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlXG4gIC8vIGlzIGdlbmVyYXRlZC5cbiAgaHR0cHNJbmZvczoge1xuICAgIGtleTogbnVsbCxcbiAgICBjZXJ0OiBudWxsLFxuICB9LFxuXG4gIC8vIHNvY2tldC5pbyBjb25maWd1cmF0aW9uXG4gIHdlYnNvY2tldHM6IHtcbiAgICB1cmw6ICcnLFxuICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgcGF0aDogJycsXG4gICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgLy8gcGluZ1RpbWVvdXQ6IDMwMDAsXG4gICAgLy8gcGluZ0ludGVydmFsOiAxMDAwLFxuICAgIC8vIHVwZ3JhZGVUaW1lb3V0OiAxMDAwMCxcbiAgICAvLyBtYXhIdHRwQnVmZmVyU2l6ZTogMTBFNyxcbiAgfSxcblxuICAvLyBkZXNjcmliZSB0aGUgbG9jYXRpb24gd2hlcmUgdGhlIGV4cGVyaWVuY2UgdGFrZXMgcGxhY2VzLCB0aGVzZXMgdmFsdWVzIGFyZVxuICAvLyB1c2VkIGJ5IHRoZSBgcGxhY2VyYCwgYGNoZWNraW5gIGFuZCBgbG9jYXRvcmAgc2VydmljZXMuXG4gIC8vIGlmIG9uZSBvZiB0aGVzZSBzZXJ2aWNlIGlzIHJlcXVpcmVkLCB0aGlzIGVudHJ5IHNob3VsZG4ndCBiZSByZW1vdmVkLlxuICBzZXR1cDoge1xuICAgIGFyZWE6IHtcbiAgICAgIHdpZHRoOiAxLFxuICAgICAgaGVpZ2h0OiAxLFxuICAgICAgLy8gcGF0aCB0byBhbiBpbWFnZSB0byBiZSB1c2VkIGluIHRoZSBhcmVhIHJlcHJlc2VudGF0aW9uXG4gICAgICBiYWNrZ3JvdW5kOiBudWxsLFxuICAgIH0sXG4gICAgLy8gbGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVsc1xuICAgIGxhYmVsczogbnVsbCxcbiAgICAvLyBsaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMgZ2l2ZW4gYXMgYW4gYXJyYXkgb2YgYFt4Ok51bWJlciwgeTpOdW1iZXJdYFxuICAgIGNvb3JkaW5hdGVzOiBudWxsLFxuICAgIC8vIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgYWxsb3dlZCBpbiBhIHBvc2l0aW9uXG4gICAgbWF4Q2xpZW50c1BlclBvc2l0aW9uOiAxLFxuICAgIC8vIG1heGltdW0gbnVtYmVyIG9mIHBvc2l0aW9ucyAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZlxuICAgIC8vIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpXG4gICAgY2FwYWNpdHk6IDgsXG4gIH0sXG5cbiAgLy8gcGFzc3dvcmQgdG8gYmUgdXNlZCBieSB0aGUgYGF1dGhgIHNlcnZpY2VcbiAgcGFzc3dvcmQ6ICcnLFxuXG4gIC8vIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGBvc2NgIHNlcnZpY2VcbiAgb3NjOiB7XG4gICAgLy8gSVAgb2YgdGhlIGN1cnJlbnRseSBydW5uaW5nIG5vZGUgc2VydmVyXG4gICAgcmVjZWl2ZUFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIC8vIHBvcnQgbGlzdGVuaW5nIGZvciBpbmNvbW1pbmcgbWVzc2FnZXNcbiAgICByZWNlaXZlUG9ydDogNTcxMjEsXG4gICAgLy8gSVAgb2YgdGhlIHJlbW90ZSBhcHBsaWNhdGlvblxuICAgIHNlbmRBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICAvLyBwb3J0IHdoZXJlIHRoZSByZW1vdGUgYXBwbGljYXRpb24gaXMgbGlzdGVuaW5nIGZvciBtZXNzYWdlc1xuICAgIHNlbmRQb3J0OiA1NzEyMCxcbiAgfSxcblxuICAvLyBjb25maWd1cmF0aW9uIG9mIHRoZSBgcmF3LXNvY2tldGAgc2VydmljZVxuICByYXdTb2NrZXQ6IHtcbiAgICAvLyBwb3J0IHVzZWQgZm9yIHNvY2tldCBjb25uZWN0aW9uXG4gICAgcG9ydDogODA4MFxuICB9LFxuXG4gIC8vIGJ1bnlhbiBjb25maWd1cmF0aW9uXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFt7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICB9LCAvKiB7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgcGF0aDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdsb2dzJywgJ3NvdW5kd29ya3MubG9nJyksXG4gICAgfSAqL11cbiAgfSxcblxuICAvLyBkaXJlY3Rvcnkgd2hlcmUgZXJyb3IgcmVwb3J0ZWQgZnJvbSB0aGUgY2xpZW50cyBhcmUgd3JpdHRlblxuICBlcnJvclJlcG9ydGVyRGlyZWN0b3J5OiBwYXRoLmpvaW4oY3dkLCAnbG9ncycsICdjbGllbnRzJyksXG59XG4iXX0=