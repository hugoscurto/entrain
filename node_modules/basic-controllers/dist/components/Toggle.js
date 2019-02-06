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
  label: '&bnsp;',
  active: false,
  container: null,
  callback: null
};

/**
 * On/Off controller.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Array} [config.active=false] - Default state of the toggle.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const toggle = new controllers.Toggle({
 *   label: 'My Toggle',
 *   active: false,
 *   container: '#container',
 *   callback: (active) => console.log(active),
 * });
 */

var Toggle = function (_display) {
  _inherits(Toggle, _display);

  function Toggle(config) {
    _classCallCheck(this, Toggle);

    var _this = _possibleConstructorReturn(this, (Toggle.__proto__ || Object.getPrototypeOf(Toggle)).call(this, 'toggle', defaults, config));

    _this._active = _this.params.active;

    _get(Toggle.prototype.__proto__ || Object.getPrototypeOf(Toggle.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Value of the toggle
   * @type {Boolean}
   */


  _createClass(Toggle, [{
    key: '_updateBtn',


    /** @private */
    value: function _updateBtn() {
      var method = this.active ? 'add' : 'remove';
      this.$toggle.classList[method]('active');
    }

    /** @private */

  }, {
    key: 'render',
    value: function render() {
      var content = '\n      <span class="label">' + this.params.label + '</span>\n      <div class="inner-wrapper">\n        ' + elements.toggle + '\n      </div>';

      this.$el = _get(Toggle.prototype.__proto__ || Object.getPrototypeOf(Toggle.prototype), 'render', this).call(this);
      this.$el.classList.add('align-small');
      this.$el.innerHTML = content;

      this.$toggle = this.$el.querySelector('.toggle-element');
      // initialize state
      this.active = this._active;
      this.bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this2 = this;

      this.$toggle.addEventListener('click', function (e) {
        e.preventDefault();

        _this2.active = !_this2.active;
        _this2.executeListeners(_this2._active);
      });
    }
  }, {
    key: 'value',
    set: function set(bool) {
      this.active = bool;
    },
    get: function get() {
      return this._active;
    }

    /**
     * Alias for `value`.
     * @type {Boolean}
     */

  }, {
    key: 'active',
    set: function set(bool) {
      this._active = bool;
      this._updateBtn();
    },
    get: function get() {
      return this._active;
    }
  }]);

  return Toggle;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = Toggle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvZ2dsZS5qcyJdLCJuYW1lcyI6WyJlbGVtZW50cyIsImRlZmF1bHRzIiwibGFiZWwiLCJhY3RpdmUiLCJjb250YWluZXIiLCJjYWxsYmFjayIsIlRvZ2dsZSIsImNvbmZpZyIsIl9hY3RpdmUiLCJwYXJhbXMiLCJtZXRob2QiLCIkdG9nZ2xlIiwiY2xhc3NMaXN0IiwiY29udGVudCIsInRvZ2dsZSIsIiRlbCIsImFkZCIsImlubmVySFRNTCIsInF1ZXJ5U2VsZWN0b3IiLCJiaW5kRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImV4ZWN1dGVMaXN0ZW5lcnMiLCJib29sIiwiX3VwZGF0ZUJ0biJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUEsUTs7Ozs7Ozs7Ozs7O0FBRVo7O0FBRUEsSUFBTUMsV0FBVztBQUNmQyxTQUFPLFFBRFE7QUFFZkMsVUFBUSxLQUZPO0FBR2ZDLGFBQVcsSUFISTtBQUlmQyxZQUFVO0FBSkssQ0FBakI7O0FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQk1DLE07OztBQUNKLGtCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsZ0hBQ1osUUFEWSxFQUNGTixRQURFLEVBQ1FNLE1BRFI7O0FBR2xCLFVBQUtDLE9BQUwsR0FBZSxNQUFLQyxNQUFMLENBQVlOLE1BQTNCOztBQUVBO0FBTGtCO0FBTW5COztBQUVEOzs7Ozs7Ozs7O0FBeUJBO2lDQUNhO0FBQ1gsVUFBSU8sU0FBUyxLQUFLUCxNQUFMLEdBQWMsS0FBZCxHQUFzQixRQUFuQztBQUNBLFdBQUtRLE9BQUwsQ0FBYUMsU0FBYixDQUF1QkYsTUFBdkIsRUFBK0IsUUFBL0I7QUFDRDs7QUFFRDs7Ozs2QkFDUztBQUNQLFVBQUlHLDJDQUNvQixLQUFLSixNQUFMLENBQVlQLEtBRGhDLDREQUdFRixTQUFTYyxNQUhYLG1CQUFKOztBQU1BLFdBQUtDLEdBQUw7QUFDQSxXQUFLQSxHQUFMLENBQVNILFNBQVQsQ0FBbUJJLEdBQW5CLENBQXVCLGFBQXZCO0FBQ0EsV0FBS0QsR0FBTCxDQUFTRSxTQUFULEdBQXFCSixPQUFyQjs7QUFFQSxXQUFLRixPQUFMLEdBQWUsS0FBS0ksR0FBTCxDQUFTRyxhQUFULENBQXVCLGlCQUF2QixDQUFmO0FBQ0E7QUFDQSxXQUFLZixNQUFMLEdBQWMsS0FBS0ssT0FBbkI7QUFDQSxXQUFLVyxVQUFMOztBQUVBLGFBQU8sS0FBS0osR0FBWjtBQUNEOztBQUVEOzs7O2lDQUNhO0FBQUE7O0FBQ1gsV0FBS0osT0FBTCxDQUFhUyxnQkFBYixDQUE4QixPQUE5QixFQUF1QyxVQUFDQyxDQUFELEVBQU87QUFDNUNBLFVBQUVDLGNBQUY7O0FBRUEsZUFBS25CLE1BQUwsR0FBYyxDQUFDLE9BQUtBLE1BQXBCO0FBQ0EsZUFBS29CLGdCQUFMLENBQXNCLE9BQUtmLE9BQTNCO0FBQ0QsT0FMRDtBQU1EOzs7c0JBdkRTZ0IsSSxFQUFNO0FBQ2QsV0FBS3JCLE1BQUwsR0FBY3FCLElBQWQ7QUFDRCxLO3dCQUVXO0FBQ1YsYUFBTyxLQUFLaEIsT0FBWjtBQUNEOztBQUVEOzs7Ozs7O3NCQUlXZ0IsSSxFQUFNO0FBQ2YsV0FBS2hCLE9BQUwsR0FBZWdCLElBQWY7QUFDQSxXQUFLQyxVQUFMO0FBQ0QsSzt3QkFFWTtBQUNYLGFBQU8sS0FBS2pCLE9BQVo7QUFDRDs7OztFQWhDa0IsK0M7O2tCQXVFTkYsTSIsImZpbGUiOiJUb2dnbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSAnLi4vbWl4aW5zL2Rpc3BsYXknO1xuaW1wb3J0ICogYXMgZWxlbWVudHMgZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbGFiZWw6ICcmYm5zcDsnLFxuICBhY3RpdmU6IGZhbHNlLFxuICBjb250YWluZXI6IG51bGwsXG4gIGNhbGxiYWNrOiBudWxsLFxufTtcblxuLyoqXG4gKiBPbi9PZmYgY29udHJvbGxlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy5sYWJlbCAtIExhYmVsIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5hY3RpdmU9ZmFsc2VdIC0gRGVmYXVsdCBzdGF0ZSBvZiB0aGUgdG9nZ2xlLlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxiYXNpYy1jb250cm9sbGVyfkdyb3VwfSBbY29uZmlnLmNvbnRhaW5lcj1udWxsXSAtXG4gKiAgQ29udGFpbmVyIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbmZpZy5jYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlXG4gKiAgdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udHJvbGxlcnMnO1xuICpcbiAqIGNvbnN0IHRvZ2dsZSA9IG5ldyBjb250cm9sbGVycy5Ub2dnbGUoe1xuICogICBsYWJlbDogJ015IFRvZ2dsZScsXG4gKiAgIGFjdGl2ZTogZmFsc2UsXG4gKiAgIGNvbnRhaW5lcjogJyNjb250YWluZXInLFxuICogICBjYWxsYmFjazogKGFjdGl2ZSkgPT4gY29uc29sZS5sb2coYWN0aXZlKSxcbiAqIH0pO1xuICovXG5jbGFzcyBUb2dnbGUgZXh0ZW5kcyBkaXNwbGF5KEJhc2VDb21wb25lbnQpIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoJ3RvZ2dsZScsIGRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgdGhpcy5fYWN0aXZlID0gdGhpcy5wYXJhbXMuYWN0aXZlO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbHVlIG9mIHRoZSB0b2dnbGVcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgdmFsdWUoYm9vbCkge1xuICAgIHRoaXMuYWN0aXZlID0gYm9vbDtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsaWFzIGZvciBgdmFsdWVgLlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHNldCBhY3RpdmUoYm9vbCkge1xuICAgIHRoaXMuX2FjdGl2ZSA9IGJvb2w7XG4gICAgdGhpcy5fdXBkYXRlQnRuKCk7XG4gIH1cblxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmU7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3VwZGF0ZUJ0bigpIHtcbiAgICB2YXIgbWV0aG9kID0gdGhpcy5hY3RpdmUgPyAnYWRkJyA6ICdyZW1vdmUnO1xuICAgIHRoaXMuJHRvZ2dsZS5jbGFzc0xpc3RbbWV0aG9kXSgnYWN0aXZlJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcmVuZGVyKCkge1xuICAgIGxldCBjb250ZW50ID0gYFxuICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbFwiPiR7dGhpcy5wYXJhbXMubGFiZWx9PC9zcGFuPlxuICAgICAgPGRpdiBjbGFzcz1cImlubmVyLXdyYXBwZXJcIj5cbiAgICAgICAgJHtlbGVtZW50cy50b2dnbGV9XG4gICAgICA8L2Rpdj5gO1xuXG4gICAgdGhpcy4kZWwgPSBzdXBlci5yZW5kZXIoKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKCdhbGlnbi1zbWFsbCcpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcudG9nZ2xlLWVsZW1lbnQnKTtcbiAgICAvLyBpbml0aWFsaXplIHN0YXRlXG4gICAgdGhpcy5hY3RpdmUgPSB0aGlzLl9hY3RpdmU7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiR0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLmFjdGl2ZSA9ICF0aGlzLmFjdGl2ZTtcbiAgICAgIHRoaXMuZXhlY3V0ZUxpc3RlbmVycyh0aGlzLl9hY3RpdmUpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvZ2dsZTtcbiJdfQ==