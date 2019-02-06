'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getScale(domain, range) {
  var slope = (range[1] - range[0]) / (domain[1] - domain[0]);
  var intercept = range[0] - slope * domain[0];

  function scale(val) {
    return slope * val + intercept;
  }

  scale.invert = function (val) {
    return (val - intercept) / slope;
  };

  return scale;
}

function getClipper(min, max, step) {
  return function (val) {
    var clippedValue = Math.round(val / step) * step;
    var fixed = Math.max(Math.log10(1 / step), 0);
    var fixedValue = clippedValue.toFixed(fixed); // fix floating point errors
    return Math.min(max, Math.max(min, parseFloat(fixedValue)));
  };
}

/**
 * @module gui-components
 */

/**
 * Versatile canvas based slider.
 *
 * @param {Object} options - Override default parameters.
 * @param {'jump'|'proportionnal'|'handle'} [options.mode='jump'] - Mode of the slider:
 *  - in 'jump' mode, the value is changed on 'touchstart' or 'mousedown', and
 *    on move.
 *  - in 'proportionnal' mode, the value is updated relatively to move.
 *  - in 'handle' mode, the slider can be grabbed only around its value.
 * @param {Function} [options.callback] - Callback to be executed when the value
 *  of the slider changes.
 * @param {Number} [options.width=200] - Width of the slider.
 * @param {Number} [options.height=30] - Height of the slider.
 * @param {Number} [options.min=0] - Minimum value.
 * @param {Number} [options.max=1] - Maximum value.
 * @param {Number} [options.step=0.01] - Step between each consecutive values.
 * @param {Number} [options.default=0] - Default value.
 * @param {String|Element} [options.container='body'] - CSS Selector or DOM
 *  element in which inserting the slider.
 * @param {String} [options.backgroundColor='#464646'] - Background color of the
 *  slider.
 * @param {String} [options.foregroundColor='steelblue'] - Foreground color of
 *  the slider.
 * @param {'horizontal'|'vertical'} [options.orientation='horizontal'] -
 *  Orientation of the slider.
 * @param {Array} [options.markers=[]] - List of values where markers should
 *  be displayed on the slider.
 * @param {Boolean} [options.showHandle=true] - In 'handle' mode, define if the
 *  draggable should be show or not.
 * @param {Number} [options.handleSize=20] - Size of the draggable zone.
 * @param {String} [options.handleColor='rgba(255, 255, 255, 0.7)'] - Color of the
 *  draggable zone (when `showHandle` is `true`).
 *
 * @example
 * import { Slider} from 'gui-components';
 *
 * const slider = new Slider({
 *   mode: 'jump',
 *   container: '#container',
 *   default: 0.6,
 *   markers: [0.5],
 *   callback: (value) => console.log(value),
 * });
 */

var Slider = function () {
  function Slider(options) {
    _classCallCheck(this, Slider);

    var defaults = {
      mode: 'jump',
      callback: function callback(value) {},
      width: 200,
      height: 30,
      min: 0,
      max: 1,
      step: 0.01,
      default: 0,
      container: 'body',
      backgroundColor: '#464646',
      foregroundColor: 'steelblue',
      orientation: 'horizontal',
      markers: [],

      // handle specific options
      showHandle: true,
      handleSize: 20,
      handleColor: 'rgba(255, 255, 255, 0.7)'
    };

    this.params = Object.assign({}, defaults, options);
    this._listeners = [];
    this._boundingClientRect = null;
    this._touchId = null;
    this._value = null;
    this._canvasWidth = null;
    this._canvasHeight = null;
    // for proportionnal mode
    this._currentMousePosition = { x: null, y: null };
    this._currentSliderPosition = null;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);

    this._onResize = this._onResize.bind(this);

    this._createElement();

    // initialize
    this._resizeElement();
    this._setScales();
    this._bindEvents();
    this._onResize();
    this._updateValue(this.params.default, true, true);

    window.addEventListener('resize', this._onResize);
  }

  /**
   * Current value of the slider.
   *
   * @type {Number}
   */


  _createClass(Slider, [{
    key: 'reset',


    /**
     * Reset the slider to its default value.
     */
    value: function reset() {
      this._updateValue(this.params.default);
    }

    /**
     * Resize the slider.
     *
     * @param {Number} width - New width of the slider.
     * @param {Number} height - New height of the slider.
     */

  }, {
    key: 'resize',
    value: function resize(width, height) {
      this.params.width = width;
      this.params.height = height;

      this._resizeElement();
      this._setScales();
      this._onResize();
      this._updateValue(this._value, true, true);
    }
  }, {
    key: '_updateValue',
    value: function _updateValue(value) {
      var _this = this;

      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var forceRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var callback = this.params.callback;

      var clippedValue = this.clipper(value);

      // resize render but don't trigger callback
      if (clippedValue === this._value && forceRender === true) requestAnimationFrame(function () {
        return _this._render(clippedValue);
      });

      // trigger callback
      if (clippedValue !== this._value) {
        this._value = clippedValue;

        if (!silent) callback(clippedValue);

        requestAnimationFrame(function () {
          return _this._render(clippedValue);
        });
      }
    }
  }, {
    key: '_createElement',
    value: function _createElement() {
      var container = this.params.container;

      this.$canvas = document.createElement('canvas');
      this.ctx = this.$canvas.getContext('2d');

      if (container instanceof Element) this.$container = container;else this.$container = document.querySelector(container);

      this.$container.appendChild(this.$canvas);
    }
  }, {
    key: '_resizeElement',
    value: function _resizeElement() {
      var _params = this.params,
          width = _params.width,
          height = _params.height;

      // logical and pixel size of the canvas

      this._pixelRatio = function (ctx) {
        var dPR = window.devicePixelRatio || 1;
        var bPR = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

        return dPR / bPR;
      }(this.ctx);

      this._canvasWidth = width * this._pixelRatio;
      this._canvasHeight = height * this._pixelRatio;

      this.ctx.canvas.width = this._canvasWidth;
      this.ctx.canvas.height = this._canvasHeight;
      this.ctx.canvas.style.width = width + 'px';
      this.ctx.canvas.style.height = height + 'px';
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      this._boundingClientRect = this.$canvas.getBoundingClientRect();
    }
  }, {
    key: '_setScales',
    value: function _setScales() {
      var _params2 = this.params,
          orientation = _params2.orientation,
          width = _params2.width,
          height = _params2.height,
          min = _params2.min,
          max = _params2.max,
          step = _params2.step;
      // define transfert functions

      var screenSize = orientation === 'horizontal' ? width : height;

      var canvasSize = orientation === 'horizontal' ? this._canvasWidth : this._canvasHeight;

      var domain = orientation === 'horizontal' ? [min, max] : [max, min];
      var screenRange = [0, screenSize];
      var canvasRange = [0, canvasSize];

      this.screenScale = getScale(domain, screenRange);
      this.canvasScale = getScale(domain, canvasRange);
      this.clipper = getClipper(min, max, step);
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      this.$canvas.addEventListener('mousedown', this._onMouseDown);
      this.$canvas.addEventListener('touchstart', this._onTouchStart);
    }
  }, {
    key: '_onStart',
    value: function _onStart(x, y) {
      var started = null;

      switch (this.params.mode) {
        case 'jump':
          this._updatePosition(x, y);
          started = true;
          break;
        case 'proportionnal':
          this._currentMousePosition.x = x;
          this._currentMousePosition.y = y;
          started = true;
          break;
        case 'handle':
          var orientation = this.params.orientation;
          var position = this.screenScale(this._value);
          var compare = orientation === 'horizontal' ? x : y;
          var delta = this.params.handleSize / 2;

          if (compare < position + delta && compare > position - delta) {
            this._currentMousePosition.x = x;
            this._currentMousePosition.y = y;
            started = true;
          } else {
            started = false;
          }
          break;
      }

      return started;
    }
  }, {
    key: '_onMove',
    value: function _onMove(x, y) {
      switch (this.params.mode) {
        case 'jump':
          break;
        case 'proportionnal':
        case 'handle':
          var deltaX = x - this._currentMousePosition.x;
          var deltaY = y - this._currentMousePosition.y;
          this._currentMousePosition.x = x;
          this._currentMousePosition.y = y;

          x = this.screenScale(this._value) + deltaX;
          y = this.screenScale(this._value) + deltaY;
          break;
      }

      this._updatePosition(x, y);
    }
  }, {
    key: '_onEnd',
    value: function _onEnd() {
      switch (this.params.mode) {
        case 'jump':
          break;
        case 'proportionnal':
        case 'handle':
          this._currentMousePosition.x = null;
          this._currentMousePosition.y = null;
          break;
      }
    }

    // mouse events

  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(e) {
      var pageX = e.pageX;
      var pageY = e.pageY;
      var x = pageX - this._boundingClientRect.left;
      var y = pageY - this._boundingClientRect.top;

      if (this._onStart(x, y) === true) {
        window.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('mouseup', this._onMouseUp);
      }
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(e) {
      e.preventDefault(); // prevent text selection

      var pageX = e.pageX;
      var pageY = e.pageY;
      var x = pageX - this._boundingClientRect.left;;
      var y = pageY - this._boundingClientRect.top;;

      this._onMove(x, y);
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(e) {
      this._onEnd();

      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('mouseup', this._onMouseUp);
    }

    // touch events

  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(e) {
      if (this._touchId !== null) return;

      var touch = e.touches[0];
      this._touchId = touch.identifier;

      var pageX = touch.pageX;
      var pageY = touch.pageY;
      var x = pageX - this._boundingClientRect.left;
      var y = pageY - this._boundingClientRect.top;

      if (this._onStart(x, y) === true) {
        window.addEventListener('touchmove', this._onTouchMove);
        window.addEventListener('touchend', this._onTouchEnd);
        window.addEventListener('touchcancel', this._onTouchEnd);
      }
    }
  }, {
    key: '_onTouchMove',
    value: function _onTouchMove(e) {
      var _this2 = this;

      e.preventDefault(); // prevent text selection

      var touches = Array.from(e.touches);
      var touch = touches.filter(function (t) {
        return t.identifier === _this2._touchId;
      })[0];

      if (touch) {
        var pageX = touch.pageX;
        var pageY = touch.pageY;
        var x = pageX - this._boundingClientRect.left;
        var y = pageY - this._boundingClientRect.top;

        this._onMove(x, y);
      }
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(e) {
      var _this3 = this;

      var touches = Array.from(e.touches);
      var touch = touches.filter(function (t) {
        return t.identifier === _this3._touchId;
      })[0];

      if (touch === undefined) {
        this._onEnd();
        this._touchId = null;

        window.removeEventListener('touchmove', this._onTouchMove);
        window.removeEventListener('touchend', this._onTouchEnd);
        window.removeEventListener('touchcancel', this._onTouchEnd);
      }
    }
  }, {
    key: '_updatePosition',
    value: function _updatePosition(x, y) {
      var _params3 = this.params,
          orientation = _params3.orientation,
          height = _params3.height;

      var position = orientation === 'horizontal' ? x : y;
      var value = this.screenScale.invert(position);

      this._updateValue(value, false, true);
    }
  }, {
    key: '_render',
    value: function _render(clippedValue) {
      var _params4 = this.params,
          backgroundColor = _params4.backgroundColor,
          foregroundColor = _params4.foregroundColor,
          orientation = _params4.orientation;

      var canvasPosition = Math.round(this.canvasScale(clippedValue));
      var width = this._canvasWidth;
      var height = this._canvasHeight;
      var ctx = this.ctx;

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // foreground
      ctx.fillStyle = foregroundColor;

      if (orientation === 'horizontal') ctx.fillRect(0, 0, canvasPosition, height);else ctx.fillRect(0, canvasPosition, width, height);

      // markers
      var markers = this.params.markers;

      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        var position = this.canvasScale(marker);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();

        if (orientation === 'horizontal') {
          ctx.moveTo(position - 0.5, 1);
          ctx.lineTo(position - 0.5, height - 1);
        } else {
          ctx.moveTo(1, height - position + 0.5);
          ctx.lineTo(width - 1, height - position + 0.5);
        }

        ctx.closePath();
        ctx.stroke();
      }

      // handle mode
      if (this.params.mode === 'handle' && this.params.showHandle) {
        var delta = this.params.handleSize * this._pixelRatio / 2;
        var start = canvasPosition - delta;
        var end = canvasPosition + delta;

        ctx.globalAlpha = 1;
        ctx.fillStyle = this.params.handleColor;

        if (orientation === 'horizontal') {
          ctx.fillRect(start, 0, end - start, height);
        } else {
          ctx.fillRect(0, start, width, end - start);
        }
      }

      ctx.restore();
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(val) {
      // don't trigger the callback when value is set from outside
      this._updateValue(val, true, false);
    }
  }]);

  return Slider;
}();

exports.default = Slider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNsaWRlci5qcyJdLCJuYW1lcyI6WyJnZXRTY2FsZSIsImRvbWFpbiIsInJhbmdlIiwic2xvcGUiLCJpbnRlcmNlcHQiLCJzY2FsZSIsInZhbCIsImludmVydCIsImdldENsaXBwZXIiLCJtaW4iLCJtYXgiLCJzdGVwIiwiY2xpcHBlZFZhbHVlIiwiTWF0aCIsInJvdW5kIiwiZml4ZWQiLCJsb2cxMCIsImZpeGVkVmFsdWUiLCJ0b0ZpeGVkIiwicGFyc2VGbG9hdCIsIlNsaWRlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsIm1vZGUiLCJjYWxsYmFjayIsIndpZHRoIiwiaGVpZ2h0IiwiZGVmYXVsdCIsImNvbnRhaW5lciIsImJhY2tncm91bmRDb2xvciIsImZvcmVncm91bmRDb2xvciIsIm9yaWVudGF0aW9uIiwibWFya2VycyIsInNob3dIYW5kbGUiLCJoYW5kbGVTaXplIiwiaGFuZGxlQ29sb3IiLCJwYXJhbXMiLCJPYmplY3QiLCJhc3NpZ24iLCJfbGlzdGVuZXJzIiwiX2JvdW5kaW5nQ2xpZW50UmVjdCIsIl90b3VjaElkIiwiX3ZhbHVlIiwiX2NhbnZhc1dpZHRoIiwiX2NhbnZhc0hlaWdodCIsIl9jdXJyZW50TW91c2VQb3NpdGlvbiIsIngiLCJ5IiwiX2N1cnJlbnRTbGlkZXJQb3NpdGlvbiIsIl9vbk1vdXNlRG93biIsImJpbmQiLCJfb25Nb3VzZU1vdmUiLCJfb25Nb3VzZVVwIiwiX29uVG91Y2hTdGFydCIsIl9vblRvdWNoTW92ZSIsIl9vblRvdWNoRW5kIiwiX29uUmVzaXplIiwiX2NyZWF0ZUVsZW1lbnQiLCJfcmVzaXplRWxlbWVudCIsIl9zZXRTY2FsZXMiLCJfYmluZEV2ZW50cyIsIl91cGRhdGVWYWx1ZSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJ2YWx1ZSIsInNpbGVudCIsImZvcmNlUmVuZGVyIiwiY2xpcHBlciIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIl9yZW5kZXIiLCIkY2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY3R4IiwiZ2V0Q29udGV4dCIsIkVsZW1lbnQiLCIkY29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsImFwcGVuZENoaWxkIiwiX3BpeGVsUmF0aW8iLCJkUFIiLCJkZXZpY2VQaXhlbFJhdGlvIiwiYlBSIiwid2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsIm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJtc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJvQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsImJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJjYW52YXMiLCJzdHlsZSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNjcmVlblNpemUiLCJjYW52YXNTaXplIiwic2NyZWVuUmFuZ2UiLCJjYW52YXNSYW5nZSIsInNjcmVlblNjYWxlIiwiY2FudmFzU2NhbGUiLCJzdGFydGVkIiwiX3VwZGF0ZVBvc2l0aW9uIiwicG9zaXRpb24iLCJjb21wYXJlIiwiZGVsdGEiLCJkZWx0YVgiLCJkZWx0YVkiLCJlIiwicGFnZVgiLCJwYWdlWSIsImxlZnQiLCJ0b3AiLCJfb25TdGFydCIsInByZXZlbnREZWZhdWx0IiwiX29uTW92ZSIsIl9vbkVuZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ0b3VjaCIsInRvdWNoZXMiLCJpZGVudGlmaWVyIiwiQXJyYXkiLCJmcm9tIiwiZmlsdGVyIiwidCIsInVuZGVmaW5lZCIsImNhbnZhc1Bvc2l0aW9uIiwic2F2ZSIsImNsZWFyUmVjdCIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiaSIsImxlbmd0aCIsIm1hcmtlciIsInN0cm9rZVN0eWxlIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwiY2xvc2VQYXRoIiwic3Ryb2tlIiwic3RhcnQiLCJlbmQiLCJnbG9iYWxBbHBoYSIsInJlc3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxTQUFTQSxRQUFULENBQWtCQyxNQUFsQixFQUEwQkMsS0FBMUIsRUFBaUM7QUFDL0IsTUFB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QUFJNEQsTUFBSixDQUFXNUcsUUFBUSxDQUFuQixFQUFzQkMsU0FBU3lFLFFBQVQsR0FBb0IsR0FBMUM7QUFDRDs7QUFFRDFCLFlBQUk2RCxTQUFKO0FBQ0E3RCxZQUFJOEQsTUFBSjtBQUNEOztBQUVEO0FBQ0EsVUFBSSxLQUFLbkcsTUFBTCxDQUFZYixJQUFaLEtBQXFCLFFBQXJCLElBQWlDLEtBQUthLE1BQUwsQ0FBWUgsVUFBakQsRUFBNkQ7QUFDM0QsWUFBTW9FLFFBQVEsS0FBS2pFLE1BQUwsQ0FBWUYsVUFBWixHQUF5QixLQUFLNkMsV0FBOUIsR0FBNEMsQ0FBMUQ7QUFDQSxZQUFNeUQsUUFBUWQsaUJBQWlCckIsS0FBL0I7QUFDQSxZQUFNb0MsTUFBTWYsaUJBQWlCckIsS0FBN0I7O0FBRUE1QixZQUFJaUUsV0FBSixHQUFrQixDQUFsQjtBQUNBakUsWUFBSW9ELFNBQUosR0FBZ0IsS0FBS3pGLE1BQUwsQ0FBWUQsV0FBNUI7O0FBRUEsWUFBSUosZ0JBQWdCLFlBQXBCLEVBQWtDO0FBQ2hDMEMsY0FBSXFELFFBQUosQ0FBYVUsS0FBYixFQUFvQixDQUFwQixFQUF1QkMsTUFBTUQsS0FBN0IsRUFBb0M5RyxNQUFwQztBQUNELFNBRkQsTUFFTztBQUNMK0MsY0FBSXFELFFBQUosQ0FBYSxDQUFiLEVBQWdCVSxLQUFoQixFQUF1Qi9HLEtBQXZCLEVBQThCZ0gsTUFBTUQsS0FBcEM7QUFDRDtBQUNGOztBQUVEL0QsVUFBSWtFLE9BQUo7QUFDRDs7O3dCQXZVVztBQUNWLGFBQU8sS0FBS2pHLE1BQVo7QUFDRCxLO3NCQUVTcEMsRyxFQUFLO0FBQ2I7QUFDQSxXQUFLdUQsWUFBTCxDQUFrQnZELEdBQWxCLEVBQXVCLElBQXZCLEVBQTZCLEtBQTdCO0FBQ0Q7Ozs7OztrQkFtVVljLE0iLCJmaWxlIjoiU2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0U2NhbGUoZG9tYWluLCByYW5nZSkge1xuICBjb25zdCBzbG9wZSA9IChyYW5nZVsxXSAtIHJhbmdlWzBdKSAvIChkb21haW5bMV0gLSBkb21haW5bMF0pO1xuICBjb25zdCBpbnRlcmNlcHQgPSByYW5nZVswXSAtIHNsb3BlICogZG9tYWluWzBdO1xuXG4gIGZ1bmN0aW9uIHNjYWxlKHZhbCkge1xuICAgIHJldHVybiBzbG9wZSAqIHZhbCArIGludGVyY2VwdDtcbiAgfVxuXG4gIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiAodmFsIC0gaW50ZXJjZXB0KSAvIHNsb3BlO1xuICB9XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG5mdW5jdGlvbiBnZXRDbGlwcGVyKG1pbiwgbWF4LCBzdGVwKSB7XG4gIHJldHVybiAodmFsKSA9PiB7XG4gICAgY29uc3QgY2xpcHBlZFZhbHVlID0gTWF0aC5yb3VuZCh2YWwgLyBzdGVwKSAqIHN0ZXA7XG4gICAgY29uc3QgZml4ZWQgPSBNYXRoLm1heChNYXRoLmxvZzEwKDEgLyBzdGVwKSwgMCk7XG4gICAgY29uc3QgZml4ZWRWYWx1ZSA9IGNsaXBwZWRWYWx1ZS50b0ZpeGVkKGZpeGVkKTsgLy8gZml4IGZsb2F0aW5nIHBvaW50IGVycm9yc1xuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgcGFyc2VGbG9hdChmaXhlZFZhbHVlKSkpO1xuICB9XG59XG5cbi8qKlxuICogQG1vZHVsZSBndWktY29tcG9uZW50c1xuICovXG5cbi8qKlxuICogVmVyc2F0aWxlIGNhbnZhcyBiYXNlZCBzbGlkZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0geydqdW1wJ3wncHJvcG9ydGlvbm5hbCd8J2hhbmRsZSd9IFtvcHRpb25zLm1vZGU9J2p1bXAnXSAtIE1vZGUgb2YgdGhlIHNsaWRlcjpcbiAqICAtIGluICdqdW1wJyBtb2RlLCB0aGUgdmFsdWUgaXMgY2hhbmdlZCBvbiAndG91Y2hzdGFydCcgb3IgJ21vdXNlZG93bicsIGFuZFxuICogICAgb24gbW92ZS5cbiAqICAtIGluICdwcm9wb3J0aW9ubmFsJyBtb2RlLCB0aGUgdmFsdWUgaXMgdXBkYXRlZCByZWxhdGl2ZWx5IHRvIG1vdmUuXG4gKiAgLSBpbiAnaGFuZGxlJyBtb2RlLCB0aGUgc2xpZGVyIGNhbiBiZSBncmFiYmVkIG9ubHkgYXJvdW5kIGl0cyB2YWx1ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmNhbGxiYWNrXSAtIENhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIHZhbHVlXG4gKiAgb2YgdGhlIHNsaWRlciBjaGFuZ2VzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTIwMF0gLSBXaWR0aCBvZiB0aGUgc2xpZGVyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD0zMF0gLSBIZWlnaHQgb2YgdGhlIHNsaWRlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49MF0gLSBNaW5pbXVtIHZhbHVlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heD0xXSAtIE1heGltdW0gdmFsdWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc3RlcD0wLjAxXSAtIFN0ZXAgYmV0d2VlbiBlYWNoIGNvbnNlY3V0aXZlIHZhbHVlcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kZWZhdWx0PTBdIC0gRGVmYXVsdCB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IFtvcHRpb25zLmNvbnRhaW5lcj0nYm9keSddIC0gQ1NTIFNlbGVjdG9yIG9yIERPTVxuICogIGVsZW1lbnQgaW4gd2hpY2ggaW5zZXJ0aW5nIHRoZSBzbGlkZXIuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuYmFja2dyb3VuZENvbG9yPScjNDY0NjQ2J10gLSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZVxuICogIHNsaWRlci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb3JlZ3JvdW5kQ29sb3I9J3N0ZWVsYmx1ZSddIC0gRm9yZWdyb3VuZCBjb2xvciBvZlxuICogIHRoZSBzbGlkZXIuXG4gKiBAcGFyYW0geydob3Jpem9udGFsJ3wndmVydGljYWwnfSBbb3B0aW9ucy5vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddIC1cbiAqICBPcmllbnRhdGlvbiBvZiB0aGUgc2xpZGVyLlxuICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMubWFya2Vycz1bXV0gLSBMaXN0IG9mIHZhbHVlcyB3aGVyZSBtYXJrZXJzIHNob3VsZFxuICogIGJlIGRpc3BsYXllZCBvbiB0aGUgc2xpZGVyLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93SGFuZGxlPXRydWVdIC0gSW4gJ2hhbmRsZScgbW9kZSwgZGVmaW5lIGlmIHRoZVxuICogIGRyYWdnYWJsZSBzaG91bGQgYmUgc2hvdyBvciBub3QuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGFuZGxlU2l6ZT0yMF0gLSBTaXplIG9mIHRoZSBkcmFnZ2FibGUgem9uZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5oYW5kbGVDb2xvcj0ncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpJ10gLSBDb2xvciBvZiB0aGVcbiAqICBkcmFnZ2FibGUgem9uZSAod2hlbiBgc2hvd0hhbmRsZWAgaXMgYHRydWVgKS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgU2xpZGVyfSBmcm9tICdndWktY29tcG9uZW50cyc7XG4gKlxuICogY29uc3Qgc2xpZGVyID0gbmV3IFNsaWRlcih7XG4gKiAgIG1vZGU6ICdqdW1wJyxcbiAqICAgY29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gKiAgIGRlZmF1bHQ6IDAuNixcbiAqICAgbWFya2VyczogWzAuNV0sXG4gKiAgIGNhbGxiYWNrOiAodmFsdWUpID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqIH0pO1xuICovXG5jbGFzcyBTbGlkZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBtb2RlOiAnanVtcCcsXG4gICAgICBjYWxsYmFjazogdmFsdWUgPT4ge30sXG4gICAgICB3aWR0aDogMjAwLFxuICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIG1pbjogMCxcbiAgICAgIG1heDogMSxcbiAgICAgIHN0ZXA6IDAuMDEsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgICAgY29udGFpbmVyOiAnYm9keScsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjNDY0NjQ2JyxcbiAgICAgIGZvcmVncm91bmRDb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnLFxuICAgICAgbWFya2VyczogW10sXG5cbiAgICAgIC8vIGhhbmRsZSBzcGVjaWZpYyBvcHRpb25zXG4gICAgICBzaG93SGFuZGxlOiB0cnVlLFxuICAgICAgaGFuZGxlU2l6ZTogMjAsXG4gICAgICBoYW5kbGVDb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC43KScsXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMuX2JvdW5kaW5nQ2xpZW50UmVjdCA9IG51bGw7XG4gICAgdGhpcy5fdG91Y2hJZCA9IG51bGw7XG4gICAgdGhpcy5fdmFsdWUgPSBudWxsO1xuICAgIHRoaXMuX2NhbnZhc1dpZHRoID0gbnVsbDtcbiAgICB0aGlzLl9jYW52YXNIZWlnaHQgPSBudWxsO1xuICAgIC8vIGZvciBwcm9wb3J0aW9ubmFsIG1vZGVcbiAgICB0aGlzLl9jdXJyZW50TW91c2VQb3NpdGlvbiA9IHsgeDogbnVsbCwgeTogbnVsbCB9O1xuICAgIHRoaXMuX2N1cnJlbnRTbGlkZXJQb3NpdGlvbiA9IG51bGw7XG5cbiAgICB0aGlzLl9vbk1vdXNlRG93biA9IHRoaXMuX29uTW91c2VEb3duLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Nb3VzZU1vdmUgPSB0aGlzLl9vbk1vdXNlTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uTW91c2VVcCA9IHRoaXMuX29uTW91c2VVcC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fb25Ub3VjaFN0YXJ0ID0gdGhpcy5fb25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Ub3VjaE1vdmUgPSB0aGlzLl9vblRvdWNoTW92ZSAuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblRvdWNoRW5kID0gdGhpcy5fb25Ub3VjaEVuZC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fb25SZXNpemUgPSB0aGlzLl9vblJlc2l6ZS5iaW5kKHRoaXMpO1xuXG5cbiAgICB0aGlzLl9jcmVhdGVFbGVtZW50KCk7XG5cbiAgICAvLyBpbml0aWFsaXplXG4gICAgdGhpcy5fcmVzaXplRWxlbWVudCgpO1xuICAgIHRoaXMuX3NldFNjYWxlcygpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICB0aGlzLl9vblJlc2l6ZSgpO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKHRoaXMucGFyYW1zLmRlZmF1bHQsIHRydWUsIHRydWUpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uUmVzaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IHZhbHVlIG9mIHRoZSBzbGlkZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbCkge1xuICAgIC8vIGRvbid0IHRyaWdnZXIgdGhlIGNhbGxiYWNrIHdoZW4gdmFsdWUgaXMgc2V0IGZyb20gb3V0c2lkZVxuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKHZhbCwgdHJ1ZSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBzbGlkZXIgdG8gaXRzIGRlZmF1bHQgdmFsdWUuXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSh0aGlzLnBhcmFtcy5kZWZhdWx0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNpemUgdGhlIHNsaWRlci5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gTmV3IHdpZHRoIG9mIHRoZSBzbGlkZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBOZXcgaGVpZ2h0IG9mIHRoZSBzbGlkZXIuXG4gICAqL1xuICByZXNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMucGFyYW1zLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5wYXJhbXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgdGhpcy5fcmVzaXplRWxlbWVudCgpO1xuICAgIHRoaXMuX3NldFNjYWxlcygpO1xuICAgIHRoaXMuX29uUmVzaXplKCk7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWUodGhpcy5fdmFsdWUsIHRydWUsIHRydWUpO1xuICB9XG5cbiAgX3VwZGF0ZVZhbHVlKHZhbHVlLCBzaWxlbnQgPSBmYWxzZSwgZm9yY2VSZW5kZXIgPSBmYWxzZSkge1xuICAgIGNvbnN0IHsgY2FsbGJhY2sgfSA9IHRoaXMucGFyYW1zO1xuICAgIGNvbnN0IGNsaXBwZWRWYWx1ZSA9IHRoaXMuY2xpcHBlcih2YWx1ZSk7XG5cbiAgICAvLyByZXNpemUgcmVuZGVyIGJ1dCBkb24ndCB0cmlnZ2VyIGNhbGxiYWNrXG4gICAgaWYgKGNsaXBwZWRWYWx1ZSA9PT0gdGhpcy5fdmFsdWUgJiYgZm9yY2VSZW5kZXIgPT09IHRydWUpXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5fcmVuZGVyKGNsaXBwZWRWYWx1ZSkpO1xuXG4gICAgLy8gdHJpZ2dlciBjYWxsYmFja1xuICAgIGlmIChjbGlwcGVkVmFsdWUgIT09IHRoaXMuX3ZhbHVlKSB7XG4gICAgICB0aGlzLl92YWx1ZSA9IGNsaXBwZWRWYWx1ZTtcblxuICAgICAgaWYgKCFzaWxlbnQpXG4gICAgICAgIGNhbGxiYWNrKGNsaXBwZWRWYWx1ZSk7XG5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLl9yZW5kZXIoY2xpcHBlZFZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZUVsZW1lbnQoKSB7XG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHRoaXMucGFyYW1zO1xuICAgIHRoaXMuJGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuY3R4ID0gdGhpcy4kY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICBpZiAoY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudClcbiAgICAgIHRoaXMuJGNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICBlbHNlXG4gICAgICB0aGlzLiRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XG5cbiAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy4kY2FudmFzKTtcbiAgfVxuXG4gIF9yZXNpemVFbGVtZW50KCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5wYXJhbXM7XG5cbiAgICAvLyBsb2dpY2FsIGFuZCBwaXhlbCBzaXplIG9mIHRoZSBjYW52YXNcbiAgICB0aGlzLl9waXhlbFJhdGlvID0gKGZ1bmN0aW9uKGN0eCkge1xuICAgIGNvbnN0IGRQUiA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgY29uc3QgYlBSID0gY3R4LndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5tb3pCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICBjdHgubXNCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICBjdHgub0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5iYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IDE7XG5cbiAgICAgIHJldHVybiBkUFIgLyBiUFI7XG4gICAgfSh0aGlzLmN0eCkpO1xuXG4gICAgdGhpcy5fY2FudmFzV2lkdGggPSB3aWR0aCAqIHRoaXMuX3BpeGVsUmF0aW87XG4gICAgdGhpcy5fY2FudmFzSGVpZ2h0ID0gaGVpZ2h0ICogdGhpcy5fcGl4ZWxSYXRpbztcblxuICAgIHRoaXMuY3R4LmNhbnZhcy53aWR0aCA9IHRoaXMuX2NhbnZhc1dpZHRoO1xuICAgIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLl9jYW52YXNIZWlnaHQ7XG4gICAgdGhpcy5jdHguY2FudmFzLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuY3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICB9XG5cbiAgX29uUmVzaXplKCkge1xuICAgIHRoaXMuX2JvdW5kaW5nQ2xpZW50UmVjdCA9IHRoaXMuJGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxuXG4gIF9zZXRTY2FsZXMoKSB7XG4gICAgY29uc3QgeyBvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCwgbWluLCBtYXgsIHN0ZXAgfSA9IHRoaXMucGFyYW1zO1xuICAgIC8vIGRlZmluZSB0cmFuc2ZlcnQgZnVuY3Rpb25zXG4gICAgY29uc3Qgc2NyZWVuU2l6ZSA9IG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcgP1xuICAgICAgd2lkdGggOiBoZWlnaHQ7XG5cbiAgICBjb25zdCBjYW52YXNTaXplID0gb3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJyA/XG4gICAgICB0aGlzLl9jYW52YXNXaWR0aCA6IHRoaXMuX2NhbnZhc0hlaWdodDtcblxuICAgIGNvbnN0IGRvbWFpbiA9IG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBbbWluLCBtYXhdIDogW21heCwgbWluXTtcbiAgICBjb25zdCBzY3JlZW5SYW5nZSA9IFswLCBzY3JlZW5TaXplXTtcbiAgICBjb25zdCBjYW52YXNSYW5nZSA9IFswLCBjYW52YXNTaXplXTtcblxuICAgIHRoaXMuc2NyZWVuU2NhbGUgPSBnZXRTY2FsZShkb21haW4sIHNjcmVlblJhbmdlKTtcbiAgICB0aGlzLmNhbnZhc1NjYWxlID0gZ2V0U2NhbGUoZG9tYWluLCBjYW52YXNSYW5nZSk7XG4gICAgdGhpcy5jbGlwcGVyID0gZ2V0Q2xpcHBlcihtaW4sIG1heCwgc3RlcCk7XG4gIH1cblxuICBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZURvd24pO1xuICAgIHRoaXMuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25Ub3VjaFN0YXJ0KTtcbiAgfVxuXG4gIF9vblN0YXJ0KHgsIHkpIHtcbiAgICBsZXQgc3RhcnRlZCA9IG51bGw7XG5cbiAgICBzd2l0Y2ggKHRoaXMucGFyYW1zLm1vZGUpIHtcbiAgICAgIGNhc2UgJ2p1bXAnOlxuICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbih4LCB5KTtcbiAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHJvcG9ydGlvbm5hbCc6XG4gICAgICAgIHRoaXMuX2N1cnJlbnRNb3VzZVBvc2l0aW9uLnggPSB4O1xuICAgICAgICB0aGlzLl9jdXJyZW50TW91c2VQb3NpdGlvbi55ID0geTtcbiAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaGFuZGxlJzpcbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSB0aGlzLnBhcmFtcy5vcmllbnRhdGlvbjtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblNjYWxlKHRoaXMuX3ZhbHVlKTtcbiAgICAgICAgY29uc3QgY29tcGFyZSA9IG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcgPyB4IDogeTtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnBhcmFtcy5oYW5kbGVTaXplIC8gMjtcblxuICAgICAgICBpZiAoY29tcGFyZSA8IHBvc2l0aW9uICsgZGVsdGEgJiYgY29tcGFyZSA+IHBvc2l0aW9uIC0gZGVsdGEpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW91c2VQb3NpdGlvbi54ID0geDtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW91c2VQb3NpdGlvbi55ID0geTtcbiAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGFydGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXJ0ZWQ7XG4gIH1cblxuICBfb25Nb3ZlKHgsIHkpIHtcbiAgICBzd2l0Y2ggKHRoaXMucGFyYW1zLm1vZGUpIHtcbiAgICAgIGNhc2UgJ2p1bXAnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Byb3BvcnRpb25uYWwnOlxuICAgICAgY2FzZSAnaGFuZGxlJzpcbiAgICAgICAgY29uc3QgZGVsdGFYID0geCAtIHRoaXMuX2N1cnJlbnRNb3VzZVBvc2l0aW9uLng7XG4gICAgICAgIGNvbnN0IGRlbHRhWSA9IHkgLSB0aGlzLl9jdXJyZW50TW91c2VQb3NpdGlvbi55O1xuICAgICAgICB0aGlzLl9jdXJyZW50TW91c2VQb3NpdGlvbi54ID0geDtcbiAgICAgICAgdGhpcy5fY3VycmVudE1vdXNlUG9zaXRpb24ueSA9IHk7XG5cbiAgICAgICAgeCA9IHRoaXMuc2NyZWVuU2NhbGUodGhpcy5fdmFsdWUpICsgZGVsdGFYO1xuICAgICAgICB5ID0gdGhpcy5zY3JlZW5TY2FsZSh0aGlzLl92YWx1ZSkgKyBkZWx0YVk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKHgsIHkpO1xuICB9XG5cbiAgX29uRW5kKCkge1xuICAgIHN3aXRjaCAodGhpcy5wYXJhbXMubW9kZSkge1xuICAgICAgY2FzZSAnanVtcCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHJvcG9ydGlvbm5hbCc6XG4gICAgICBjYXNlICdoYW5kbGUnOlxuICAgICAgICB0aGlzLl9jdXJyZW50TW91c2VQb3NpdGlvbi54ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VycmVudE1vdXNlUG9zaXRpb24ueSA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1vdXNlIGV2ZW50c1xuICBfb25Nb3VzZURvd24oZSkge1xuICAgIGNvbnN0IHBhZ2VYID0gZS5wYWdlWDtcbiAgICBjb25zdCBwYWdlWSA9IGUucGFnZVk7XG4gICAgY29uc3QgeCA9IHBhZ2VYIC0gdGhpcy5fYm91bmRpbmdDbGllbnRSZWN0LmxlZnQ7XG4gICAgY29uc3QgeSA9IHBhZ2VZIC0gdGhpcy5fYm91bmRpbmdDbGllbnRSZWN0LnRvcDtcblxuICAgIGlmICh0aGlzLl9vblN0YXJ0KHgsIHkpID09PSB0cnVlKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXApO1xuICAgIH1cbiAgfVxuXG4gIF9vbk1vdXNlTW92ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IHRleHQgc2VsZWN0aW9uXG5cbiAgICBjb25zdCBwYWdlWCA9IGUucGFnZVg7XG4gICAgY29uc3QgcGFnZVkgPSBlLnBhZ2VZO1xuICAgIGxldCB4ID0gcGFnZVggLSB0aGlzLl9ib3VuZGluZ0NsaWVudFJlY3QubGVmdDs7XG4gICAgbGV0IHkgPSBwYWdlWSAtIHRoaXMuX2JvdW5kaW5nQ2xpZW50UmVjdC50b3A7O1xuXG4gICAgdGhpcy5fb25Nb3ZlKHgsIHkpO1xuICB9XG5cbiAgX29uTW91c2VVcChlKSB7XG4gICAgdGhpcy5fb25FbmQoKTtcblxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXApO1xuICB9XG5cbiAgLy8gdG91Y2ggZXZlbnRzXG4gIF9vblRvdWNoU3RhcnQoZSkge1xuICAgIGlmICh0aGlzLl90b3VjaElkICE9PSBudWxsKSByZXR1cm47XG5cbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICB0aGlzLl90b3VjaElkID0gdG91Y2guaWRlbnRpZmllcjtcblxuICAgIGNvbnN0IHBhZ2VYID0gdG91Y2gucGFnZVg7XG4gICAgY29uc3QgcGFnZVkgPSB0b3VjaC5wYWdlWTtcbiAgICBjb25zdCB4ID0gcGFnZVggLSB0aGlzLl9ib3VuZGluZ0NsaWVudFJlY3QubGVmdDtcbiAgICBjb25zdCB5ID0gcGFnZVkgLSB0aGlzLl9ib3VuZGluZ0NsaWVudFJlY3QudG9wO1xuXG4gICAgaWYgKHRoaXMuX29uU3RhcnQoeCwgeSkgPT09IHRydWUpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9vblRvdWNoRW5kKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX29uVG91Y2hFbmQpO1xuICAgIH1cbiAgfVxuXG4gIF9vblRvdWNoTW92ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IHRleHQgc2VsZWN0aW9uXG5cbiAgICBjb25zdCB0b3VjaGVzID0gQXJyYXkuZnJvbShlLnRvdWNoZXMpO1xuICAgIGNvbnN0IHRvdWNoID0gdG91Y2hlcy5maWx0ZXIoKHQpID0+IHQuaWRlbnRpZmllciA9PT0gdGhpcy5fdG91Y2hJZClbMF07XG5cbiAgICBpZiAodG91Y2gpIHtcbiAgICAgIGNvbnN0IHBhZ2VYID0gdG91Y2gucGFnZVg7XG4gICAgICBjb25zdCBwYWdlWSA9IHRvdWNoLnBhZ2VZO1xuICAgICAgY29uc3QgeCA9IHBhZ2VYIC0gdGhpcy5fYm91bmRpbmdDbGllbnRSZWN0LmxlZnQ7XG4gICAgICBjb25zdCB5ID0gcGFnZVkgLSB0aGlzLl9ib3VuZGluZ0NsaWVudFJlY3QudG9wO1xuXG4gICAgICB0aGlzLl9vbk1vdmUoeCwgeSk7XG4gICAgfVxuICB9XG5cbiAgX29uVG91Y2hFbmQoZSkge1xuICAgIGNvbnN0IHRvdWNoZXMgPSBBcnJheS5mcm9tKGUudG91Y2hlcyk7XG4gICAgY29uc3QgdG91Y2ggPSB0b3VjaGVzLmZpbHRlcigodCkgPT4gdC5pZGVudGlmaWVyID09PSB0aGlzLl90b3VjaElkKVswXTtcblxuICAgIGlmICh0b3VjaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9vbkVuZCgpO1xuICAgICAgdGhpcy5fdG91Y2hJZCA9IG51bGw7XG5cbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9vblRvdWNoRW5kKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX29uVG91Y2hFbmQpO1xuXG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZVBvc2l0aW9uKHgsIHkpIHtcbiAgICBjb25zdCB7wqBvcmllbnRhdGlvbiwgaGVpZ2h0IH0gPSB0aGlzLnBhcmFtcztcbiAgICBjb25zdCBwb3NpdGlvbiA9IG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcgPyB4IDogeTtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc2NyZWVuU2NhbGUuaW52ZXJ0KHBvc2l0aW9uKTtcblxuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKHZhbHVlLCBmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICBfcmVuZGVyKGNsaXBwZWRWYWx1ZSkge1xuICAgIGNvbnN0IHsgYmFja2dyb3VuZENvbG9yLCBmb3JlZ3JvdW5kQ29sb3IsIG9yaWVudGF0aW9uIH0gPSB0aGlzLnBhcmFtcztcbiAgICBjb25zdCBjYW52YXNQb3NpdGlvbiA9IE1hdGgucm91bmQodGhpcy5jYW52YXNTY2FsZShjbGlwcGVkVmFsdWUpKTtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2NhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX2NhbnZhc0hlaWdodDtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIC8vIGJhY2tncm91bmRcbiAgICBjdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yO1xuICAgIGN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIC8vIGZvcmVncm91bmRcbiAgICBjdHguZmlsbFN0eWxlID0gZm9yZWdyb3VuZENvbG9yO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpXG4gICAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzUG9zaXRpb24sIGhlaWdodCk7XG4gICAgZWxzZVxuICAgICAgY3R4LmZpbGxSZWN0KDAsIGNhbnZhc1Bvc2l0aW9uLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIC8vIG1hcmtlcnNcbiAgICBjb25zdCBtYXJrZXJzID0gdGhpcy5wYXJhbXMubWFya2VycztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbWFya2VyID0gbWFya2Vyc1tpXTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jYW52YXNTY2FsZShtYXJrZXIpO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC43KSc7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGN0eC5tb3ZlVG8ocG9zaXRpb24gLSAwLjUsIDEpO1xuICAgICAgICBjdHgubGluZVRvKHBvc2l0aW9uIC0gMC41LCBoZWlnaHQgLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0eC5tb3ZlVG8oMSwgaGVpZ2h0IC0gcG9zaXRpb24gKyAwLjUpO1xuICAgICAgICBjdHgubGluZVRvKHdpZHRoIC0gMSwgaGVpZ2h0IC0gcG9zaXRpb24gKyAwLjUpO1xuICAgICAgfVxuXG4gICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIG1vZGVcbiAgICBpZiAodGhpcy5wYXJhbXMubW9kZSA9PT0gJ2hhbmRsZScgJiYgdGhpcy5wYXJhbXMuc2hvd0hhbmRsZSkge1xuICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnBhcmFtcy5oYW5kbGVTaXplICogdGhpcy5fcGl4ZWxSYXRpbyAvIDI7XG4gICAgICBjb25zdCBzdGFydCA9IGNhbnZhc1Bvc2l0aW9uIC0gZGVsdGE7XG4gICAgICBjb25zdCBlbmQgPSBjYW52YXNQb3NpdGlvbiArIGRlbHRhO1xuXG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMucGFyYW1zLmhhbmRsZUNvbG9yO1xuXG4gICAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBjdHguZmlsbFJlY3Qoc3RhcnQsIDAsIGVuZCAtIHN0YXJ0LCBoZWlnaHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIHN0YXJ0LCB3aWR0aCwgZW5kIC0gc3RhcnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyO1xuIl19