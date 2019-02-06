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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  default: '',
  readonly: false,
  container: null,
  callback: null
};

/**
 * Text controller.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Array} [config.default=''] - Default value of the controller.
 * @param {Array} [config.readonly=false] - Define if the controller is readonly.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-contollers';
 *
 * const text = new controllers.Text({
 *   label: 'My Text',
 *   default: 'default value',
 *   readonly: false,
 *   container: '#container',
 *   callback: (value) => console.log(value),
 * });
 */

var Text = function (_display) {
  _inherits(Text, _display);

  function Text(config) {
    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, 'text', defaults, config));

    _this._value = _this.params.default;
    _this.initialize();
    return _this;
  }

  /**
   * Current value.
   * @type {String}
   */


  _createClass(Text, [{
    key: 'render',


    /** @private */
    value: function render() {
      var readonly = this.params.readonly ? 'readonly' : '';
      var content = '\n      <span class="label">' + this.params.label + '</span>\n      <div class="inner-wrapper">\n        <input class="text" type="text" value="' + this._value + '" ' + readonly + ' />\n      </div>\n    ';

      this.$el = _get(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), 'render', this).call(this);
      this.$el.innerHTML = content;
      this.$input = this.$el.querySelector('.text');

      this.bindEvents();
      return this.$el;
    }

    /** @private */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this2 = this;

      this.$input.addEventListener('keyup', function () {
        _this2._value = _this2.$input.value;
        _this2.executeListeners(_this2._value);
      }, false);
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      this.$input.value = value;
      this._value = value;
    }
  }]);

  return Text;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = Text;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRleHQuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJsYWJlbCIsImRlZmF1bHQiLCJyZWFkb25seSIsImNvbnRhaW5lciIsImNhbGxiYWNrIiwiVGV4dCIsImNvbmZpZyIsIl92YWx1ZSIsInBhcmFtcyIsImluaXRpYWxpemUiLCJjb250ZW50IiwiJGVsIiwiaW5uZXJIVE1MIiwiJGlucHV0IiwicXVlcnlTZWxlY3RvciIsImJpbmRFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwidmFsdWUiLCJleGVjdXRlTGlzdGVuZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7O0FBRUEsSUFBTUEsV0FBVztBQUNmQyxTQUFPLFFBRFE7QUFFZkMsV0FBUyxFQUZNO0FBR2ZDLFlBQVUsS0FISztBQUlmQyxhQUFXLElBSkk7QUFLZkMsWUFBVTtBQUxLLENBQWpCOztBQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF1Qk1DLEk7OztBQUNKLGdCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsNEdBQ1osTUFEWSxFQUNKUCxRQURJLEVBQ01PLE1BRE47O0FBR2xCLFVBQUtDLE1BQUwsR0FBYyxNQUFLQyxNQUFMLENBQVlQLE9BQTFCO0FBQ0EsVUFBS1EsVUFBTDtBQUprQjtBQUtuQjs7QUFFRDs7Ozs7Ozs7OztBQWFBOzZCQUNTO0FBQ1AsVUFBTVAsV0FBVyxLQUFLTSxNQUFMLENBQVlOLFFBQVosR0FBdUIsVUFBdkIsR0FBb0MsRUFBckQ7QUFDQSxVQUFNUSwyQ0FDa0IsS0FBS0YsTUFBTCxDQUFZUixLQUQ5QixtR0FHdUMsS0FBS08sTUFINUMsVUFHdURMLFFBSHZELDRCQUFOOztBQU9BLFdBQUtTLEdBQUw7QUFDQSxXQUFLQSxHQUFMLENBQVNDLFNBQVQsR0FBcUJGLE9BQXJCO0FBQ0EsV0FBS0csTUFBTCxHQUFjLEtBQUtGLEdBQUwsQ0FBU0csYUFBVCxDQUF1QixPQUF2QixDQUFkOztBQUVBLFdBQUtDLFVBQUw7QUFDQSxhQUFPLEtBQUtKLEdBQVo7QUFDRDs7QUFFRDs7OztpQ0FDYTtBQUFBOztBQUNYLFdBQUtFLE1BQUwsQ0FBWUcsZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsWUFBTTtBQUMxQyxlQUFLVCxNQUFMLEdBQWMsT0FBS00sTUFBTCxDQUFZSSxLQUExQjtBQUNBLGVBQUtDLGdCQUFMLENBQXNCLE9BQUtYLE1BQTNCO0FBQ0QsT0FIRCxFQUdHLEtBSEg7QUFJRDs7O3dCQWpDVztBQUNWLGFBQU8sS0FBS0EsTUFBWjtBQUNELEs7c0JBRVNVLEssRUFBTztBQUNmLFdBQUtKLE1BQUwsQ0FBWUksS0FBWixHQUFvQkEsS0FBcEI7QUFDQSxXQUFLVixNQUFMLEdBQWNVLEtBQWQ7QUFDRDs7OztFQW5CZ0IsK0M7O2tCQWdESlosSSIsImZpbGUiOiJUZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9CYXNlQ29tcG9uZW50JztcbmltcG9ydCBkaXNwbGF5IGZyb20gJy4uL21peGlucy9kaXNwbGF5JztcblxuLyoqIEBtb2R1bGUgYmFzaWMtY29udHJvbGxlcnMgKi9cblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGxhYmVsOiAnJm5ic3A7JyxcbiAgZGVmYXVsdDogJycsXG4gIHJlYWRvbmx5OiBmYWxzZSxcbiAgY29udGFpbmVyOiBudWxsLFxuICBjYWxsYmFjazogbnVsbCxcbn1cblxuLyoqXG4gKiBUZXh0IGNvbnRyb2xsZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcubGFiZWwgLSBMYWJlbCBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuZGVmYXVsdD0nJ10gLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5yZWFkb25seT1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIGNvbnRyb2xsZXIgaXMgcmVhZG9ubHkuXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fGJhc2ljLWNvbnRyb2xsZXJ+R3JvdXB9IFtjb25maWcuY29udGFpbmVyPW51bGxdIC1cbiAqICBDb250YWluZXIgb2YgdGhlIGNvbnRyb2xsZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29uZmlnLmNhbGxiYWNrPW51bGxdIC0gQ2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGVcbiAqICB2YWx1ZSBjaGFuZ2VzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBjb250cm9sbGVycyBmcm9tICdiYXNpYy1jb250b2xsZXJzJztcbiAqXG4gKiBjb25zdCB0ZXh0ID0gbmV3IGNvbnRyb2xsZXJzLlRleHQoe1xuICogICBsYWJlbDogJ015IFRleHQnLFxuICogICBkZWZhdWx0OiAnZGVmYXVsdCB2YWx1ZScsXG4gKiAgIHJlYWRvbmx5OiBmYWxzZSxcbiAqICAgY29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gKiAgIGNhbGxiYWNrOiAodmFsdWUpID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqIH0pO1xuICovXG5jbGFzcyBUZXh0IGV4dGVuZHMgZGlzcGxheShCYXNlQ29tcG9uZW50KSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHN1cGVyKCd0ZXh0JywgZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMucGFyYW1zLmRlZmF1bHQ7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCB2YWx1ZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLiRpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlYWRvbmx5ID0gdGhpcy5wYXJhbXMucmVhZG9ubHkgPyAncmVhZG9ubHknIDogJyc7XG4gICAgY29uc3QgY29udGVudCA9IGBcbiAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWxcIj4ke3RoaXMucGFyYW1zLmxhYmVsfTwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbm5lci13cmFwcGVyXCI+XG4gICAgICAgIDxpbnB1dCBjbGFzcz1cInRleHRcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJHt0aGlzLl92YWx1ZX1cIiAke3JlYWRvbmx5fSAvPlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIHRoaXMuJGVsID0gc3VwZXIucmVuZGVyKCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gY29udGVudDtcbiAgICB0aGlzLiRpbnB1dCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0Jyk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsICgpID0+IHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdGhpcy4kaW5wdXQudmFsdWU7XG4gICAgICB0aGlzLmV4ZWN1dGVMaXN0ZW5lcnModGhpcy5fdmFsdWUpO1xuICAgIH0sIGZhbHNlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUZXh0O1xuIl19