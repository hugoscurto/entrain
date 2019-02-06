'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

var _elements = require('../utils/elements');

var elements = _interopRequireWildcard(_elements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  min: 0,
  max: 1,
  step: 0.01,
  default: 0,
  container: null,
  callback: null
};

/**
 * Number Box controller
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Number} [config.min=0] - Minimum value.
 * @param {Number} [config.max=1] - Maximum value.
 * @param {Number} [config.step=0.01] - Step between consecutive values.
 * @param {Number} [config.default=0] - Default value.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const numberBox = new controllers.NumberBox({
 *   label: 'My Number Box',
 *   min: 0,
 *   max: 10,
 *   step: 0.1,
 *   default: 5,
 *   container: '#container',
 *   callback: (value) => console.log(value),
 * });
 */

var NumberBox = function (_display) {
  _inherits(NumberBox, _display);

  // legend, min = 0, max = 1, step = 0.01, defaultValue = 0, $container = null, callback = null
  function NumberBox(config) {
    _classCallCheck(this, NumberBox);

    var _this = _possibleConstructorReturn(this, (NumberBox.__proto__ || Object.getPrototypeOf(NumberBox)).call(this, 'number-box', defaults, config));

    _this._value = _this.params.default;
    _this._isIntStep = _this.params.step % 1 === 0;

    _get(NumberBox.prototype.__proto__ || Object.getPrototypeOf(NumberBox.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Current value of the controller.
   *
   * @type {Number}
   */


  _createClass(NumberBox, [{
    key: 'render',


    /** @private */
    value: function render() {
      var _params = this.params,
          label = _params.label,
          min = _params.min,
          max = _params.max,
          step = _params.step;

      var content = '\n      <span class="label">' + label + '</span>\n      <div class="inner-wrapper">\n        ' + elements.arrowLeft + '\n        <input class="number" type="number" min="' + min + '" max="' + max + '" step="' + step + '" value="' + this._value + '" />\n        ' + elements.arrowRight + '\n      </div>\n    ';

      this.$el = _get(NumberBox.prototype.__proto__ || Object.getPrototypeOf(NumberBox.prototype), 'render', this).call(this);
      this.$el.classList.add('align-small');
      this.$el.innerHTML = content;

      this.$prev = this.$el.querySelector('.arrow-left');
      this.$next = this.$el.querySelector('.arrow-right');
      this.$number = this.$el.querySelector('input[type="number"]');

      this._bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$prev.addEventListener('click', function (e) {
        var step = _this2.params.step;
        var decimals = step.toString().split('.')[1];
        var exp = decimals ? decimals.length : 0;
        var mult = Math.pow(10, exp);

        var intValue = Math.floor(_this2._value * mult + 0.5);
        var intStep = Math.floor(step * mult + 0.5);
        var value = (intValue - intStep) / mult;

        _this2._propagate(value);
      }, false);

      this.$next.addEventListener('click', function (e) {
        var step = _this2.params.step;
        var decimals = step.toString().split('.')[1];
        var exp = decimals ? decimals.length : 0;
        var mult = Math.pow(10, exp);

        var intValue = Math.floor(_this2._value * mult + 0.5);
        var intStep = Math.floor(step * mult + 0.5);
        var value = (intValue + intStep) / mult;

        _this2._propagate(value);
      }, false);

      this.$number.addEventListener('change', function (e) {
        var value = _this2.$number.value;
        value = _this2._isIntStep ? parseInt(value, 10) : parseFloat(value);
        value = Math.min(_this2.params.max, Math.max(_this2.params.min, value));

        _this2._propagate(value);
      }, false);
    }

    /** @private */

  }, {
    key: '_propagate',
    value: function _propagate(value) {
      if (value === this._value) {
        return;
      }

      this._value = value;
      this.$number.value = value;

      this.executeListeners(this._value);
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      // use $number element min, max and step system
      this.$number.value = value;
      value = this.$number.value;
      value = this._isIntStep ? parseInt(value, 10) : parseFloat(value);
      this._value = value;
    }
  }]);

  return NumberBox;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = NumberBox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk51bWJlckJveC5qcyJdLCJuYW1lcyI6WyJlbGVtZW50cyIsImRlZmF1bHRzIiwibGFiZWwiLCJtaW4iLCJtYXgiLCJzdGVwIiwiZGVmYXVsdCIsImNvbnRhaW5lciIsImNhbGxiYWNrIiwiTnVtYmVyQm94IiwiY29uZmlnIiwiX3ZhbHVlIiwicGFyYW1zIiwiX2lzSW50U3RlcCIsImNvbnRlbnQiLCJhcnJvd0xlZnQiLCJhcnJvd1JpZ2h0IiwiJGVsIiwiY2xhc3NMaXN0IiwiYWRkIiwiaW5uZXJIVE1MIiwiJHByZXYiLCJxdWVyeVNlbGVjdG9yIiwiJG5leHQiLCIkbnVtYmVyIiwiX2JpbmRFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImRlY2ltYWxzIiwidG9TdHJpbmciLCJzcGxpdCIsImV4cCIsImxlbmd0aCIsIm11bHQiLCJNYXRoIiwicG93IiwiaW50VmFsdWUiLCJmbG9vciIsImludFN0ZXAiLCJ2YWx1ZSIsIl9wcm9wYWdhdGUiLCJwYXJzZUludCIsInBhcnNlRmxvYXQiLCJleGVjdXRlTGlzdGVuZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxROzs7Ozs7Ozs7Ozs7QUFFWjs7QUFFQSxJQUFNQyxXQUFXO0FBQ2ZDLFNBQU8sUUFEUTtBQUVmQyxPQUFLLENBRlU7QUFHZkMsT0FBSyxDQUhVO0FBSWZDLFFBQU0sSUFKUztBQUtmQyxXQUFTLENBTE07QUFNZkMsYUFBVyxJQU5JO0FBT2ZDLFlBQVU7QUFQSyxDQUFqQjs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCTUMsUzs7O0FBQ0o7QUFDQSxxQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUFBLHNIQUNaLFlBRFksRUFDRVQsUUFERixFQUNZUyxNQURaOztBQUdsQixVQUFLQyxNQUFMLEdBQWMsTUFBS0MsTUFBTCxDQUFZTixPQUExQjtBQUNBLFVBQUtPLFVBQUwsR0FBbUIsTUFBS0QsTUFBTCxDQUFZUCxJQUFa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USxPQUFLZixPQUFMLENBQWFlLEtBQXpCO0FBQ0FBLGdCQUFRLE9BQUsxQixVQUFMLEdBQWtCNEIsU0FBU0YsS0FBVCxFQUFnQixFQUFoQixDQUFsQixHQUF3Q0csV0FBV0gsS0FBWCxDQUFoRDtBQUNBQSxnQkFBUUwsS0FBSy9CLEdBQUwsQ0FBUyxPQUFLUyxNQUFMLENBQVlSLEdBQXJCLEVBQTBCOEIsS0FBSzlCLEdBQUwsQ0FBUyxPQUFLUSxNQUFMLENBQVlULEdBQXJCLEVBQTBCb0MsS0FBMUIsQ0FBMUIsQ0FBUjs7QUFFQSxlQUFLQyxVQUFMLENBQWdCRCxLQUFoQjtBQUNELE9BTkQsRUFNRyxLQU5IO0FBT0Q7O0FBRUQ7Ozs7K0JBQ1dBLEssRUFBTztBQUNoQixVQUFJQSxVQUFVLEtBQUs1QixNQUFuQixFQUEyQjtBQUFFO0FBQVM7O0FBRXRDLFdBQUtBLE1BQUwsR0FBYzRCLEtBQWQ7QUFDQSxXQUFLZixPQUFMLENBQWFlLEtBQWIsR0FBcUJBLEtBQXJCOztBQUVBLFdBQUtJLGdCQUFMLENBQXNCLEtBQUtoQyxNQUEzQjtBQUNEOzs7d0JBbEZXO0FBQ1YsYUFBTyxLQUFLQSxNQUFaO0FBQ0QsSztzQkFFUzRCLEssRUFBTztBQUNmO0FBQ0EsV0FBS2YsT0FBTCxDQUFhZSxLQUFiLEdBQXFCQSxLQUFyQjtBQUNBQSxjQUFRLEtBQUtmLE9BQUwsQ0FBYWUsS0FBckI7QUFDQUEsY0FBUSxLQUFLMUIsVUFBTCxHQUFrQjRCLFNBQVNGLEtBQVQsRUFBZ0IsRUFBaEIsQ0FBbEIsR0FBd0NHLFdBQVdILEtBQVgsQ0FBaEQ7QUFDQSxXQUFLNUIsTUFBTCxHQUFjNEIsS0FBZDtBQUNEOzs7O0VBMUJxQiwrQzs7a0JBcUdUOUIsUyIsImZpbGUiOiJOdW1iZXJCb3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSAnLi4vbWl4aW5zL2Rpc3BsYXknO1xuaW1wb3J0ICogYXMgZWxlbWVudHMgZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbGFiZWw6ICcmbmJzcDsnLFxuICBtaW46IDAsXG4gIG1heDogMSxcbiAgc3RlcDogMC4wMSxcbiAgZGVmYXVsdDogMCxcbiAgY29udGFpbmVyOiBudWxsLFxuICBjYWxsYmFjazogbnVsbCxcbn07XG5cbi8qKlxuICogTnVtYmVyIEJveCBjb250cm9sbGVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcubGFiZWwgLSBMYWJlbCBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbY29uZmlnLm1pbj0wXSAtIE1pbmltdW0gdmFsdWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW2NvbmZpZy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtjb25maWcuc3RlcD0wLjAxXSAtIFN0ZXAgYmV0d2VlbiBjb25zZWN1dGl2ZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gW2NvbmZpZy5kZWZhdWx0PTBdIC0gRGVmYXVsdCB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8YmFzaWMtY29udHJvbGxlcn5Hcm91cH0gW2NvbmZpZy5jb250YWluZXI9bnVsbF0gLVxuICogIENvbnRhaW5lciBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb25maWcuY2FsbGJhY2s9bnVsbF0gLSBDYWxsYmFjayB0byBiZSBleGVjdXRlZCB3aGVuIHRoZVxuICogIHZhbHVlIGNoYW5nZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGNvbnRyb2xsZXJzIGZyb20gJ2Jhc2ljLWNvbnRyb2xsZXJzJztcbiAqXG4gKiBjb25zdCBudW1iZXJCb3ggPSBuZXcgY29udHJvbGxlcnMuTnVtYmVyQm94KHtcbiAqICAgbGFiZWw6ICdNeSBOdW1iZXIgQm94JyxcbiAqICAgbWluOiAwLFxuICogICBtYXg6IDEwLFxuICogICBzdGVwOiAwLjEsXG4gKiAgIGRlZmF1bHQ6IDUsXG4gKiAgIGNvbnRhaW5lcjogJyNjb250YWluZXInLFxuICogICBjYWxsYmFjazogKHZhbHVlKSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiB9KTtcbiAqL1xuY2xhc3MgTnVtYmVyQm94IGV4dGVuZHMgZGlzcGxheShCYXNlQ29tcG9uZW50KSB7XG4gIC8vIGxlZ2VuZCwgbWluID0gMCwgbWF4ID0gMSwgc3RlcCA9IDAuMDEsIGRlZmF1bHRWYWx1ZSA9IDAsICRjb250YWluZXIgPSBudWxsLCBjYWxsYmFjayA9IG51bGxcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoJ251bWJlci1ib3gnLCBkZWZhdWx0cywgY29uZmlnKTtcblxuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5wYXJhbXMuZGVmYXVsdDtcbiAgICB0aGlzLl9pc0ludFN0ZXAgPSAodGhpcy5wYXJhbXMuc3RlcCAlIDEgPT09IDApO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIGNvbnRyb2xsZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgLy8gdXNlICRudW1iZXIgZWxlbWVudCBtaW4sIG1heCBhbmQgc3RlcCBzeXN0ZW1cbiAgICB0aGlzLiRudW1iZXIudmFsdWUgPSB2YWx1ZTtcbiAgICB2YWx1ZSA9IHRoaXMuJG51bWJlci52YWx1ZTtcbiAgICB2YWx1ZSA9IHRoaXMuX2lzSW50U3RlcCA/IHBhcnNlSW50KHZhbHVlLCAxMCkgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBtaW4sIG1heCwgc3RlcCB9ID0gdGhpcy5wYXJhbXM7XG4gICAgY29uc3QgY29udGVudCA9IGBcbiAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWxcIj4ke2xhYmVsfTwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbm5lci13cmFwcGVyXCI+XG4gICAgICAgICR7ZWxlbWVudHMuYXJyb3dMZWZ0fVxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJudW1iZXJcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiJHttaW59XCIgbWF4PVwiJHttYXh9XCIgc3RlcD1cIiR7c3RlcH1cIiB2YWx1ZT1cIiR7dGhpcy5fdmFsdWV9XCIgLz5cbiAgICAgICAgJHtlbGVtZW50cy5hcnJvd1JpZ2h0fVxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIHRoaXMuJGVsID0gc3VwZXIucmVuZGVyKCk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnYWxpZ24tc21hbGwnKTtcbiAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgdGhpcy4kcHJldiA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hcnJvdy1sZWZ0Jyk7XG4gICAgdGhpcy4kbmV4dCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hcnJvdy1yaWdodCcpO1xuICAgIHRoaXMuJG51bWJlciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJudW1iZXJcIl0nKTtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRwcmV2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnBhcmFtcy5zdGVwO1xuICAgICAgY29uc3QgZGVjaW1hbHMgPSBzdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVsxXTtcbiAgICAgIGNvbnN0IGV4cCA9IGRlY2ltYWxzID8gZGVjaW1hbHMubGVuZ3RoIDogMDtcbiAgICAgIGNvbnN0IG11bHQgPSBNYXRoLnBvdygxMCwgZXhwKTtcblxuICAgICAgY29uc3QgaW50VmFsdWUgPSBNYXRoLmZsb29yKHRoaXMuX3ZhbHVlICogbXVsdCArIDAuNSk7XG4gICAgICBjb25zdCBpbnRTdGVwID0gTWF0aC5mbG9vcihzdGVwICogbXVsdCArIDAuNSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IChpbnRWYWx1ZSAtIGludFN0ZXApIC8gbXVsdDtcblxuICAgICAgdGhpcy5fcHJvcGFnYXRlKHZhbHVlKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLiRuZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnBhcmFtcy5zdGVwO1xuICAgICAgY29uc3QgZGVjaW1hbHMgPSBzdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVsxXTtcbiAgICAgIGNvbnN0IGV4cCA9IGRlY2ltYWxzID8gZGVjaW1hbHMubGVuZ3RoIDogMDtcbiAgICAgIGNvbnN0IG11bHQgPSBNYXRoLnBvdygxMCwgZXhwKTtcblxuICAgICAgY29uc3QgaW50VmFsdWUgPSBNYXRoLmZsb29yKHRoaXMuX3ZhbHVlICogbXVsdCArIDAuNSk7XG4gICAgICBjb25zdCBpbnRTdGVwID0gTWF0aC5mbG9vcihzdGVwICogbXVsdCArIDAuNSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IChpbnRWYWx1ZSArIGludFN0ZXApIC8gbXVsdDtcblxuICAgICAgdGhpcy5fcHJvcGFnYXRlKHZhbHVlKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLiRudW1iZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuJG51bWJlci52YWx1ZTtcbiAgICAgIHZhbHVlID0gdGhpcy5faXNJbnRTdGVwID8gcGFyc2VJbnQodmFsdWUsIDEwKSA6IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgdmFsdWUgPSBNYXRoLm1pbih0aGlzLnBhcmFtcy5tYXgsIE1hdGgubWF4KHRoaXMucGFyYW1zLm1pbiwgdmFsdWUpKTtcblxuICAgICAgdGhpcy5fcHJvcGFnYXRlKHZhbHVlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3Byb3BhZ2F0ZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fdmFsdWUpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuJG51bWJlci52YWx1ZSA9IHZhbHVlO1xuXG4gICAgdGhpcy5leGVjdXRlTGlzdGVuZXJzKHRoaXMuX3ZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOdW1iZXJCb3g7XG4iXX0=