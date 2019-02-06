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

var _serialport = require('serialport');

var _serialport2 = _interopRequireDefault(_serialport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventEmitter = require('events');
var fs = require('fs');

var LedDisplay = function (_EventEmitter) {
  (0, _inherits3.default)(LedDisplay, _EventEmitter);

  function LedDisplay() {
    (0, _classCallCheck3.default)(this, LedDisplay);

    // polar corrdinates
    var _this = (0, _possibleConstructorReturn3.default)(this, (LedDisplay.__proto__ || (0, _getPrototypeOf2.default)(LedDisplay)).call(this));

    _this.pixels = [7, 8, 15, 16, 23, 24, 31, 32, 39, 40, 47, 48, 55, 56, 63, 64, 71, 72, 79, 80, 87, 88, 95, 96, 103, 104, 111, 112, 119, 120, 127, 0, 1, 6, 9, 14, 17, 22, 25, 30, 33, 38, 41, 46, 49, 54, 57, 62, 65, 70, 73, 78, 81, 86, 89, 94, 97, 102, 105, 110, 113, 118, 121, 126, 2, 5, 10, 13, 18, 21, 26, 29, 34, 37, 42, 45, 50, 53, 58, 61, 66, 69, 74, 77, 82, 85, 90, 93, 98, 101, 106, 109, 114, 117, 122, 125, 3, 4, 11, 12, 19, 20, 27, 28, 35, 36, 43, 44, 51, 52, 59, 60, 67, 68, 75, 76, 83, 84, 91, 92, 99, 100, 107, 108, 115, 116, 123, 124];

    _this.serialPort = null;
    return _this;
  }

  (0, _createClass3.default)(LedDisplay, [{
    key: 'connect',
    value: function connect() {
      var _this2 = this;

      var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var openCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};


      // TODO convert this to async call
      if (port === null) {

        fs.readdirSync('/dev').forEach(function (file) {
          if (file.indexOf("wchusbserial") > -1) {
            port = '/dev/' + file;
            console.log("Found screen in :", port);
          }
        });
      }

      if (fs.existsSync(port)) {
        this.serialPort = new _serialport2.default(port, {
          baudrate: 115200,
          parser: _serialport2.default.parsers.readline('\n')
        });

        this.serialPort.on('open', function () {
          console.log('Serial port opened');
          openCallback();
        });

        this.serialPort.on('data', function (data) {
          if (data.indexOf('+1') > -1 || data.indexOf('-1') > -1) {
            _this2.emit('buttonTurned', data);

            if (data.indexOf('+1') > -1) _this2.emit('buttonIncremented');else if (data.indexOf('-1') > -1) _this2.emit('buttonDecremented');
          } else if (data.indexOf('touch') > -1 || data.indexOf('released') > -1) {
            _this2.emit('buttonClick', data);

            if (data.indexOf('touch') > -1) _this2.emit('buttonTouch');else if (data.indexOf('released') > -1) _this2.emit('buttonReleased');
          } else if (data.indexOf('°C') > -1) {
            _this2.emit('temperature', parseInt(data));
          } else {}
          // console.log('received unhandled data from serial port:', data);

          //console.log(data);
        });
      } else {
        console.log("Port", port, "doesn't exist!! Cannot open display.");
      }
    }

    /////////////////////////////////////////////

    /*
       A 0xFFFFFF - all leds in this color
       B 0xFFFFFF 55 - led 55 in this color, leds from 0-95
       C 0xFFFFFF 3 - line 3 in this color, lines 0-24
       D 0xFFFFFF 2 - segment 2 in this color, segment 0-7
       E 0xFFFFFF 2 - circle in this color - from 0-3
       F 0xFFFFFF 0xFFF222 3 - gradient from color 1 to color 2 line 3
       G - turn off
       H - turn on white
       I - turn on LEDs
       J 0xFFFFFF 0 2 - color on the line 0 and led 2
      */

  }, {
    key: 'requestTemperature',
    value: function requestTemperature() {
      if (this.serialPort) this.serialPort.write('T\n');
      // console.log("ASKED FOR TEMPERATURE");
    }
  }, {
    key: 'allPixels',
    value: function allPixels(hexColor) {
      if (this.serialPort) {
        this.serialPort.write('A ' + hexColor + '\n');
      }
    }
  }, {
    key: 'pixel',
    value: function pixel(led, hexColor) {
      if (this.serialPort) {
        if (led >= 0 && led <= 127) {
          this.serialPort.write('B ' + hexColor + ' ' + this.pixels[led] + '\n');
        } else {
          throw new Error('Pixel number is out of scope! Pixels permitted : 0-95');
        }
      }
    }
  }, {
    key: 'line',
    value: function line(lineNumber, hexColor) {
      if (this.serialPort) {
        if (lineNumber >= 0 && lineNumber <= 31) {
          this.serialPort.write('C ' + hexColor + ' ' + lineNumber + '\n');
        } else {
          throw new Error('Line number is out of scope! Lines permitted : 0-31');
        }
      }
    }
  }, {
    key: 'ledOnLine',
    value: function ledOnLine(lineNumber, led, hexColor) {
      if (this.serialPort) {
        this.serialPort.write('J ' + hexColor + ' ' + lineNumber + ' ' + led + '\n');
      }
    }
  }, {
    key: 'segment',
    value: function segment(segmentNumber, hexColor) {
      if (this.serialPort) {
        if (segmentNumber >= 0 && segmentNumber <= 7) {
          this.serialPort.write('D ' + hexColor + ' ' + segmentNumber + '\n');
          // console.log('OUT','D ' + hexColor + ' ' + segmentNumber + '\n' );
        } else {
          throw new Error('Segment number is out of scope! Segments permitted : 0-7');
        }
      }
    }
  }, {
    key: 'circle',
    value: function circle(circleNumber, hexColor) {
      if (this.serialPort) {
        if (circleNumber >= 0 && circleNumber <= 3) {

          this.serialPort.write('E ' + hexColor + ' ' + circleNumber + '\n');
        } else {
          throw new Error('Circle number is out of scope! Circles permitted : 0-3');
        }
      }
    }
  }, {
    key: 'lineGradient',
    value: function lineGradient(lineNumber, hexColor1, hexColor2) {
      if (this.serialPort) {
        if (lineNumber >= 0 && lineNumber <= 31) {

          this.serialPort.write('F ' + hexColor1 + ' ' + hexColor2 + ' ' + lineNumber + '\n');
        } else {
          throw new Error('Line number is out of scope! Lines permitted : 0-31');
        }
      }
    }
  }, {
    key: 'screenOff',
    value: function screenOff() {
      this.clearPixels();
      this.redraw();
    }
  }, {
    key: 'clearPixels',
    value: function clearPixels() {
      if (this.serialPort) this.serialPort.write('G\n');
    }
  }, {
    key: 'whitePixels',
    value: function whitePixels() {
      if (this.serialPort) this.serialPort.write('H\n');
    }
  }, {
    key: 'redraw',
    value: function redraw() {
      if (this.serialPort) this.serialPort.write('I\n');
    }
  }, {
    key: 'rgbToHex',
    value: function rgbToHex(r, g, b) {
      var color = r << 16 | g << 8 | b;
      var hex = '0x' + parseInt(color).toString(16);

      while (hex.length < 8) {
        hex += '0';
      }

      return hex;
    }
  }]);
  return LedDisplay;
}(EventEmitter);

exports.default = LedDisplay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxlZERpc3BsYXkuanMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwicmVxdWlyZSIsImZzIiwiTGVkRGlzcGxheSIsInBpeGVscyIsInNlcmlhbFBvcnQiLCJwb3J0Iiwib3BlbkNhbGxiYWNrIiwicmVhZGRpclN5bmMiLCJmb3JFYWNoIiwiZmlsZSIsImluZGV4T2YiLCJjb25zb2xlIiwibG9nIiwiZXhpc3RzU3luYyIsIlNlcmlhbFBvcnQiLCJiYXVkcmF0ZSIsInBhcnNlciIsInBhcnNlcnMiLCJyZWFkbGluZSIsIm9uIiwiZGF0YSIsImVtaXQiLCJwYXJzZUludCIsIndyaXRlIiwiaGV4Q29sb3IiLCJsZWQiLCJFcnJvciIsImxpbmVOdW1iZXIiLCJzZWdtZW50TnVtYmVyIiwiY2lyY2xlTnVtYmVyIiwiaGV4Q29sb3IxIiwiaGV4Q29sb3IyIiwiY2xlYXJQaXhlbHMiLCJyZWRyYXciLCJyIiwiZyIsImIiLCJjb2xvciIsImhleCIsInRvU3RyaW5nIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFDQSxJQUFNQSxlQUFlQyxRQUFRLFFBQVIsQ0FBckI7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDs7SUFFcUJFLFU7OztBQUNuQix3QkFBYztBQUFBOztBQUdaO0FBSFk7O0FBSVosVUFBS0MsTUFBTCxHQUFjLENBQ1osQ0FEWSxFQUNULENBRFMsRUFDTixFQURNLEVBQ0YsRUFERSxFQUNFLEVBREYsRUFDTSxFQUROLEVBQ1UsRUFEVixFQUNjLEVBRGQsRUFDa0IsRUFEbEIsRUFDc0IsRUFEdEIsRUFDMEIsRUFEMUIsRUFDOEIsRUFEOUIsRUFDa0MsRUFEbEMsRUFDc0MsRUFEdEMsRUFDMEMsRUFEMUMsRUFDOEMsRUFEOUMsRUFDa0QsRUFEbEQsRUFDc0QsRUFEdEQsRUFDMEQsRUFEMUQsRUFDOEQsRUFEOUQsRUFDa0UsRUFEbEUsRUFDc0UsRUFEdEUsRUFDMEUsRUFEMUUsRUFD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LE1BQUw7QUFDRDs7O2tDQUVhO0FBQ1osVUFBSSxLQUFLN0IsVUFBVCxFQUNFLEtBQUtBLFVBQUwsQ0FBZ0JtQixLQUFoQixDQUFzQixLQUF0QjtBQUNIOzs7a0NBRWE7QUFDWixVQUFJLEtBQUtuQixVQUFULEVBQ0UsS0FBS0EsVUFBTCxDQUFnQm1CLEtBQWhCLENBQXNCLEtBQXRCO0FBQ0g7Ozs2QkFFUTtBQUNQLFVBQUksS0FBS25CLFVBQVQsRUFDRSxLQUFLQSxVQUFMLENBQWdCbUIsS0FBaEIsQ0FBc0IsS0FBdEI7QUFDSDs7OzZCQUVRVyxDLEVBQUdDLEMsRUFBR0MsQyxFQUFHO0FBQ2hCLFVBQUlDLFFBQVNILEtBQUssRUFBTixHQUFhQyxLQUFLLENBQWxCLEdBQXVCQyxDQUFuQztBQUNBLFVBQUlFLE1BQU0sT0FBT2hCLFNBQVNlLEtBQVQsRUFBZ0JFLFFBQWhCLENBQXlCLEVBQXpCLENBQWpCOztBQUVBLGFBQU9ELElBQUlFLE1BQUosR0FBYSxDQUFwQixFQUF1QjtBQUNyQkYsZUFBTyxHQUFQO0FBQ0Q7O0FBRUQsYUFBT0EsR0FBUDtBQUNEOzs7RUF2THFDdkMsWTs7a0JBQW5CRyxVIiwiZmlsZSI6IkxlZERpc3BsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VyaWFsUG9ydCBmcm9tICdzZXJpYWxwb3J0JztcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZWREaXNwbGF5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIHBvbGFyIGNvcnJkaW5hdGVzXG4gICAgdGhpcy5waXhlbHMgPSBbXG4gICAgICA3LCA4LCAxNSwgMTYsIDIzLCAyNCwgMzEsIDMyLCAzOSwgNDAsIDQ3LCA0OCwgNTUsIDU2LCA2MywgNjQsIDcxLCA3MiwgNzksIDgwLCA4NywgODgsIDk1LCA5NiwgMTAzLCAxMDQsIDExMSwgMTEyLCAxMTksIDEyMCwgMTI3LCAwLFxuICAgICAgMSwgNiwgOSwgMTQsIDE3LCAyMiwgMjUsIDMwLCAzMywgMzgsIDQxLCA0NiwgNDksIDU0LCA1NywgNjIsIDY1LCA3MCwgNzMsIDc4LCA4MSwgODYsIDg5LCA5NCwgOTcsIDEwMiwgMTA1LCAxMTAsIDExMywgMTE4LCAxMjEsIDEyNixcbiAgICAgIDIsIDUsIDEwLCAxMywgMTgsIDIxLCAyNiwgMjksIDM0LCAzNywgNDIsIDQ1LCA1MCwgNTMsIDU4LCA2MSwgNjYsIDY5LCA3NCwgNzcsIDgyLCA4NSwgOTAsIDkzLCA5OCwgMTAxLCAxMDYsIDEwOSwgMTE0LCAxMTcsIDEyMiwgMTI1LFxuICAgICAgMywgNCwgMTEsIDEyLCAxOSwgMjAsIDI3LCAyOCwgMzUsIDM2LCA0MywgNDQsIDUxLCA1MiwgNTksIDYwLCA2NywgNjgsIDc1LCA3NiwgODMsIDg0LCA5MSwgOTIsIDk5LCAxMDAsIDEwNywgMTA4LCAxMTUsIDExNiwgMTIzLCAxMjRcbiAgICBdO1xuXG4gICAgdGhpcy5zZXJpYWxQb3J0ID0gbnVsbDtcbiAgfVxuXG4gIGNvbm5lY3QocG9ydCA9IG51bGwsIG9wZW5DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgfSkge1xuXG4gICAgLy8gVE9ETyBjb252ZXJ0IHRoaXMgdG8gYXN5bmMgY2FsbFxuICAgIGlmIChwb3J0ID09PSBudWxsKSB7XG5cbiAgICAgIGZzLnJlYWRkaXJTeW5jKCcvZGV2JykuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgaWYgKGZpbGUuaW5kZXhPZihcIndjaHVzYnNlcmlhbFwiKSA+IC0xKSB7XG4gICAgICAgICAgcG9ydCA9ICcvZGV2LycgKyBmaWxlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRm91bmQgc2NyZWVuIGluIDpcIiwgcG9ydCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBvcnQpKSB7XG4gICAgICB0aGlzLnNlcmlhbFBvcnQgPSBuZXcgU2VyaWFsUG9ydChwb3J0LCB7XG4gICAgICAgIGJhdWRyYXRlOiAxMTUyMDAsXG4gICAgICAgIHBhcnNlcjogU2VyaWFsUG9ydC5wYXJzZXJzLnJlYWRsaW5lKCdcXG4nKSxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNlcmlhbFBvcnQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTZXJpYWwgcG9ydCBvcGVuZWQnKTtcbiAgICAgICAgb3BlbkNhbGxiYWNrKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zZXJpYWxQb3J0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKChkYXRhLmluZGV4T2YoJysxJykgPiAtMSkgfHwgKGRhdGEuaW5kZXhPZignLTEnKSA+IC0xKSkge1xuICAgICAgICAgIHRoaXMuZW1pdCgnYnV0dG9uVHVybmVkJywgZGF0YSk7XG5cbiAgICAgICAgICBpZiAoZGF0YS5pbmRleE9mKCcrMScpID4gLTEpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2J1dHRvbkluY3JlbWVudGVkJyk7XG4gICAgICAgICAgZWxzZSBpZiAoZGF0YS5pbmRleE9mKCctMScpID4gLTEpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2J1dHRvbkRlY3JlbWVudGVkJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoKGRhdGEuaW5kZXhPZigndG91Y2gnKSA+IC0xKSB8fCAoZGF0YS5pbmRleE9mKCdyZWxlYXNlZCcpID4gLTEpKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdidXR0b25DbGljaycsIGRhdGEpO1xuXG4gICAgICAgICAgaWYgKGRhdGEuaW5kZXhPZigndG91Y2gnKSA+IC0xKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdidXR0b25Ub3VjaCcpO1xuICAgICAgICAgIGVsc2UgaWYgKGRhdGEuaW5kZXhPZigncmVsZWFzZWQnKSA+IC0xKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdidXR0b25SZWxlYXNlZCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuaW5kZXhPZignwrBDJykgPiAtMSkge1xuICAgICAgICAgIHRoaXMuZW1pdCgndGVtcGVyYXR1cmUnLCBwYXJzZUludChkYXRhKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlY2VpdmVkIHVuaGFuZGxlZCBkYXRhIGZyb20gc2VyaWFsIHBvcnQ6JywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlBvcnRcIiwgcG9ydCwgXCJkb2Vzbid0IGV4aXN0ISEgQ2Fubm90IG9wZW4gZGlzcGxheS5cIik7XG4gICAgfVxuICB9XG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLypcbiAgICAgQSAweEZGRkZGRiAtIGFsbCBsZWRzIGluIHRoaXMgY29sb3JcbiAgICAgQiAweEZGRkZGRiA1NSAtIGxlZCA1NSBpbiB0aGlzIGNvbG9yLCBsZWRzIGZyb20gMC05NVxuICAgICBDIDB4RkZGRkZGIDMgLSBsaW5lIDMgaW4gdGhpcyBjb2xvciwgbGluZXMgMC0yNFxuICAgICBEIDB4RkZGRkZGIDIgLSBzZWdtZW50IDIgaW4gdGhpcyBjb2xvciwgc2VnbWVudCAwLTdcbiAgICAgRSAweEZGRkZGRiAyIC0gY2lyY2xlIGluIHRoaXMgY29sb3IgLSBmcm9tIDAtM1xuICAgICBGIDB4RkZGRkZGIDB4RkZGMjIyIDMgLSBncmFkaWVudCBmcm9tIGNvbG9yIDEgdG8gY29sb3IgMiBsaW5lIDNcbiAgICAgRyAtIHR1cm4gb2ZmXG4gICAgIEggLSB0dXJuIG9uIHdoaXRlXG4gICAgIEkgLSB0dXJuIG9uIExFRHNcbiAgICAgSiAweEZGRkZGRiAwIDIgLSBjb2xvciBvbiB0aGUgbGluZSAwIGFuZCBsZWQgMlxuIFxuICAqL1xuICByZXF1ZXN0VGVtcGVyYXR1cmUoKSB7XG4gICAgaWYgKHRoaXMuc2VyaWFsUG9ydClcbiAgICAgIHRoaXMuc2VyaWFsUG9ydC53cml0ZSgnVFxcbicpO1xuICAgICAvLyBjb25zb2xlLmxvZyhcIkFTS0VEIEZPUiBURU1QRVJBVFVSRVwiKTtcbiAgfVxuICBhbGxQaXhlbHMoaGV4Q29sb3IpIHtcbiAgICBpZiAodGhpcy5zZXJpYWxQb3J0KSB7XG4gICAgICB0aGlzLnNlcmlhbFBvcnQud3JpdGUoJ0EgJyArIGhleENvbG9yICsgJ1xcbicpO1xuXG4gICAgfVxuICB9XG5cbiAgcGl4ZWwobGVkLCBoZXhDb2xvcikge1xuICAgIGlmICh0aGlzLnNlcmlhbFBvcnQpIHtcbiAgICAgIGlmICgobGVkID49IDApICYmIChsZWQgPD0gMTI3KSkge1xuICAgICAgICB0aGlzLnNlcmlhbFBvcnQud3JpdGUoJ0IgJyArIGhleENvbG9yICsgJyAnICsgdGhpcy5waXhlbHNbbGVkXSArICdcXG4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUGl4ZWwgbnVtYmVyIGlzIG91dCBvZiBzY29wZSEgUGl4ZWxzIHBlcm1pdHRlZCA6IDAtOTVgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsaW5lKGxpbmVOdW1iZXIsIGhleENvbG9yKSB7XG4gICAgaWYgKHRoaXMuc2VyaWFsUG9ydCkge1xuICAgICAgaWYgKChsaW5lTnVtYmVyID49IDApICYmIChsaW5lTnVtYmVyIDw9IDMxKSkge1xuICAgICAgICB0aGlzLnNlcmlhbFBvcnQud3JpdGUoJ0MgJyArIGhleENvbG9yICsgJyAnICsgbGluZU51bWJlciArICdcXG4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTGluZSBudW1iZXIgaXMgb3V0IG9mIHNjb3BlISBMaW5lcyBwZXJtaXR0ZWQgOiAwLTMxYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbGVkT25MaW5lKGxpbmVOdW1iZXIsIGxlZCwgaGV4Q29sb3IpIHtcbiAgICBpZiAodGhpcy5zZXJpYWxQb3J0KSB7XG4gICAgICB0aGlzLnNlcmlhbFBvcnQud3JpdGUoJ0ogJyArIGhleENvbG9yICsgJyAnICsgbGluZU51bWJlciArICcgJyArIGxlZCArICdcXG4nKTtcbiAgICB9XG4gIH1cblxuICBzZWdtZW50KHNlZ21lbnROdW1iZXIsIGhleENvbG9yKSB7XG4gICAgaWYgKHRoaXMuc2VyaWFsUG9ydCkge1xuICAgICAgaWYgKChzZWdtZW50TnVtYmVyID49IDApICYmIChzZWdtZW50TnVtYmVyIDw9IDcpKSB7XG4gICAgICAgIHRoaXMuc2VyaWFsUG9ydC53cml0ZSgnRCAnICsgaGV4Q29sb3IgKyAnICcgKyBzZWdtZW50TnVtYmVyICsgJ1xcbicpO1xuICAgICAgIC8vIGNvbnNvbGUubG9nKCdPVVQnLCdEICcgKyBoZXhDb2xvciArICcgJyArIHNlZ21lbnROdW1iZXIgKyAnXFxuJyApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZWdtZW50IG51bWJlciBpcyBvdXQgb2Ygc2NvcGUhIFNlZ21lbnRzIHBlcm1pdHRlZCA6IDAtN2ApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNpcmNsZShjaXJjbGVOdW1iZXIsIGhleENvbG9yKSB7XG4gICAgaWYgKHRoaXMuc2VyaWFsUG9ydCkge1xuICAgICAgaWYgKChjaXJjbGVOdW1iZXIgPj0gMCkgJiYgKGNpcmNsZU51bWJlciA8PSAzKSkge1xuXG4gICAgICAgIHRoaXMuc2VyaWFsUG9ydC53cml0ZSgnRSAnICsgaGV4Q29sb3IgKyAnICcgKyBjaXJjbGVOdW1iZXIgKyAnXFxuJyk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2lyY2xlIG51bWJlciBpcyBvdXQgb2Ygc2NvcGUhIENpcmNsZXMgcGVybWl0dGVkIDogMC0zYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbGluZUdyYWRpZW50KGxpbmVOdW1iZXIsIGhleENvbG9yMSwgaGV4Q29sb3IyKSB7XG4gICAgaWYgKHRoaXMuc2VyaWFsUG9ydCkge1xuICAgICAgaWYgKChsaW5lTnVtYmVyID49IDApICYmIChsaW5lTnVtYmVyIDw9IDMxKSkge1xuXG4gICAgICAgIHRoaXMuc2VyaWFsUG9ydC53cml0ZSgnRiAnICsgaGV4Q29sb3IxICsgJyAnICsgaGV4Q29sb3IyICsgJyAnICsgbGluZU51bWJlciArICdcXG4nKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMaW5lIG51bWJlciBpcyBvdXQgb2Ygc2NvcGUhIExpbmVzIHBlcm1pdHRlZCA6IDAtMzFgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzY3JlZW5PZmYoKSB7XG4gICAgdGhpcy5jbGVhclBpeGVscygpO1xuICAgIHRoaXMucmVkcmF3KCk7XG4gIH1cblxuICBjbGVhclBpeGVscygpIHtcbiAgICBpZiAodGhpcy5zZXJpYWxQb3J0KVxuICAgICAgdGhpcy5zZXJpYWxQb3J0LndyaXRlKCdHXFxuJyk7XG4gIH1cblxuICB3aGl0ZVBpeGVscygpIHtcbiAgICBpZiAodGhpcy5zZXJpYWxQb3J0KVxuICAgICAgdGhpcy5zZXJpYWxQb3J0LndyaXRlKCdIXFxuJyk7XG4gIH1cblxuICByZWRyYXcoKSB7XG4gICAgaWYgKHRoaXMuc2VyaWFsUG9ydClcbiAgICAgIHRoaXMuc2VyaWFsUG9ydC53cml0ZSgnSVxcbicpO1xuICB9XG5cbiAgcmdiVG9IZXgociwgZywgYikge1xuICAgIHZhciBjb2xvciA9IChyIDw8IDE2KSB8IChnIDw8IDgpIHwgYjtcbiAgICB2YXIgaGV4ID0gJzB4JyArIHBhcnNlSW50KGNvbG9yKS50b1N0cmluZygxNik7XG5cbiAgICB3aGlsZSAoaGV4Lmxlbmd0aCA8IDgpIHtcbiAgICAgIGhleCArPSAnMCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhleDtcbiAgfVxuXG5cbn0iXX0=