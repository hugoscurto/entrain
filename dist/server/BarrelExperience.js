'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _server = require('soundworks/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BarrelExperience = function (_Experience) {
  (0, _inherits3.default)(BarrelExperience, _Experience);

  function BarrelExperience(clientType) {
    (0, _classCallCheck3.default)(this, BarrelExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BarrelExperience.__proto__ || (0, _getPrototypeOf2.default)(BarrelExperience)).call(this, clientType));

    _this.sharedParams = _this.require('shared-params');
    _this.audioBufferManager = _this.require('audio-buffer-manager');
    _this.metricScheduler = _this.require('metric-scheduler');
    return _this;
  }

  return BarrelExperience;
}(_server.Experience);

exports.default = BarrelExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhcnJlbEV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiQmFycmVsRXhwZXJpZW5jZSIsImNsaWVudFR5cGUiLCJzaGFyZWRQYXJhbXMiLCJyZXF1aXJlIiwiYXVkaW9CdWZmZXJNYW5hZ2VyIiwibWV0cmljU2NoZWR1bGVyIiwiRXhwZXJpZW5jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0lBRXFCQSxnQjs7O0FBQ25CLDRCQUFZQyxVQUFaLEVBQXdCO0FBQUE7O0FBQUEsMEpBQ2hCQSxVQURnQjs7QUFHdEIsVUFBS0MsWUFBTCxHQUFvQixNQUFLQyxPQUFMLENBQWEsZUFBYixDQUFwQjtBQUNBLFVBQUtDLGtCQUFMLEdBQTBCLE1BQUtELE9BQUwsQ0FBYSxzQkFBYixDQUExQjtBQUNBLFVBQUtFLGVBQUwsR0FBdUIsTUFBS0YsT0FBTCxDQUFhLGtCQUFiLENBQXZCO0FBTHNCO0FBTXZCOzs7RUFQMkNHLGtCOztrQkFBekJOLGdCIiwiZmlsZSI6IkJhcnJlbEV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHBlcmllbmNlIH0gZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXJyZWxFeHBlcmllbmNlIGV4dGVuZHMgRXhwZXJpZW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNsaWVudFR5cGUpIHtcbiAgICBzdXBlcihjbGllbnRUeXBlKTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gICAgdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJyk7XG4gICAgdGhpcy5tZXRyaWNTY2hlZHVsZXIgPSB0aGlzLnJlcXVpcmUoJ21ldHJpYy1zY2hlZHVsZXInKTtcbiAgfVxufVxuIl19