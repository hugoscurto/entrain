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
  options: null,
  default: null,
  container: null,
  callback: null
};

/**
 * List of buttons with state.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Array} [config.options=null] - Values of the drop down list.
 * @param {Number} [config.default=null] - Default value.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const selectButtons = new controllers.SelectButtons({
 *   label: 'SelectButtons',
 *   options: ['standby', 'run', 'end'],
 *   default: 'run',
 *   container: '#container',
 *   callback: (value, index) => console.log(value, index),
 * });
 */

var SelectButtons = function (_display) {
  _inherits(SelectButtons, _display);

  function SelectButtons(config) {
    _classCallCheck(this, SelectButtons);

    var _this = _possibleConstructorReturn(this, (SelectButtons.__proto__ || Object.getPrototypeOf(SelectButtons)).call(this, 'select-buttons', defaults, config));

    if (!Array.isArray(_this.params.options)) throw new Error('TriggerButton: Invalid option "options"');

    _this._value = _this.params.default;

    var options = _this.params.options;
    var index = options.indexOf(_this._value);
    _this._index = index === -1 ? 0 : index;
    _this._maxIndex = options.length - 1;

    _get(SelectButtons.prototype.__proto__ || Object.getPrototypeOf(SelectButtons.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Current value.
   * @type {String}
   */


  _createClass(SelectButtons, [{
    key: 'render',


    /** @private */
    value: function render() {
      var _params = this.params,
          options = _params.options,
          label = _params.label;

      var content = '\n      <span class="label">' + label + '</span>\n      <div class="inner-wrapper">\n        ' + elements.arrowLeft + '\n        ' + options.map(function (option, index) {
        return '\n            <button class="btn" data-index="' + index + '" data-value="' + option + '">\n              ' + option + '\n            </button>';
      }).join('') + '\n        ' + elements.arrowRight + '\n      </div>\n    ';

      this.$el = _get(SelectButtons.prototype.__proto__ || Object.getPrototypeOf(SelectButtons.prototype), 'render', this).call(this, this.type);
      this.$el.innerHTML = content;

      this.$prev = this.$el.querySelector('.arrow-left');
      this.$next = this.$el.querySelector('.arrow-right');
      this.$btns = Array.from(this.$el.querySelectorAll('.btn'));

      this._highlightBtn(this._index);
      this._bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$prev.addEventListener('click', function () {
        var index = _this2._index - 1;
        _this2._propagate(index);
      });

      this.$next.addEventListener('click', function () {
        var index = _this2._index + 1;
        _this2._propagate(index);
      });

      this.$btns.forEach(function ($btn, index) {
        $btn.addEventListener('click', function (e) {
          e.preventDefault();
          _this2._propagate(index);
        });
      });
    }

    /** @private */

  }, {
    key: '_propagate',
    value: function _propagate(index) {
      if (index < 0 || index > this._maxIndex) return;

      this._index = index;
      this._value = this.params.options[index];
      this._highlightBtn(this._index);

      this.executeListeners(this._value, this._index);
    }

    /** @private */

  }, {
    key: '_highlightBtn',
    value: function _highlightBtn(activeIndex) {
      this.$btns.forEach(function ($btn, index) {
        $btn.classList.remove('active');

        if (activeIndex === index) {
          $btn.classList.add('active');
        }
      });
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      var index = this.params.options.indexOf(value);

      if (index !== -1) this.index = index;
    }

    /**
     * Current option index.
     * @type {Number}
     */

  }, {
    key: 'index',
    get: function get() {
      this._index;
    },
    set: function set(index) {
      if (index < 0 || index > this._maxIndex) return;

      this._value = this.params.options[index];
      this._index = index;
      this._highlightBtn(this._index);
    }
  }]);

  return SelectButtons;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = SelectButtons;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlbGVjdEJ1dHRvbnMuanMiXSwibmFtZXMiOlsiZWxlbWVudHMiLCJkZWZhdWx0cyIsImxhYmVsIiwib3B0aW9ucyIsImRlZmF1bHQiLCJjb250YWluZXIiLCJjYWxsYmFjayIsIlNlbGVjdEJ1dHRvbnMiLCJjb25maWciLCJBcnJheSIsImlzQXJyYXkiLCJwYXJhbXMiLCJFcnJvciIsIl92YWx1ZSIsImluZGV4IiwiaW5kZXhPZiIsIl9pbmRleCIsIl9tYXhJbmRleCIsImxlbmd0aCIsImNvbnRlbnQiLCJhcnJvd0xlZnQiLCJtYXAiLCJvcHRpb24iLCJqb2luIiwiYXJyb3dSaWdodCIsIiRlbCIsInR5cGUiLCJpbm5lckhUTUwiLCIkcHJldiIsInF1ZXJ5U2VsZWN0b3IiLCIkbmV4dCIsIiRidG5zIiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfaGlnaGxpZ2h0QnRuIiwiX2JpbmRFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX3Byb3BhZ2F0ZSIsImZvckVhY2giLCIkYnRuIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZXhlY3V0ZUxpc3RlbmVycyIsImFjdGl2ZUluZGV4IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLFE7Ozs7Ozs7Ozs7OztBQUVaOztBQUVBLElBQU1DLFdBQVc7QUFDZkMsU0FBTyxRQURRO0FBRWZDLFdBQVMsSUFGTTtBQUdmQyxXQUFTLElBSE07QUFJZkMsYUFBVyxJQUpJO0FBS2ZDLFlBQVU7QUFMSyxDQUFqQjs7QUFRQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJNQyxhOzs7QUFDSix5QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUFBLDhIQUNaLGdCQURZLEVBQ01QLFFBRE4sRUFDZ0JPLE1BRGhCOztBQUdsQixRQUFJLENBQUNDLE1BQU1DLE9BQU4sQ0FBYyxNQUFLQyxNQUFMLENBQVlSLE9BQTFCLENB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QjtBQUNsQ3lCLGFBQUtLLFNBQUwsQ0FBZUMsTUFBZixDQUFzQixRQUF0Qjs7QUFFQSxZQUFJRixnQkFBZ0I3QixLQUFwQixFQUEyQjtBQUN6QnlCLGVBQUtLLFNBQUwsQ0FBZUUsR0FBZixDQUFtQixRQUFuQjtBQUNEO0FBQ0YsT0FORDtBQU9EOzs7d0JBakdXO0FBQ1YsYUFBTyxLQUFLakMsTUFBWjtBQUNELEs7c0JBRVNrQyxLLEVBQU87QUFDZixVQUFNakMsUUFBUSxLQUFLSCxNQUFMLENBQVlSLE9BQVosQ0FBb0JZLE9BQXBCLENBQTRCZ0MsS0FBNUIsQ0FBZDs7QUFFQSxVQUFJakMsVUFBVSxDQUFDLENBQWYsRUFDRSxLQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDSDs7QUFFRDs7Ozs7Ozt3QkFJWTtBQUNWLFdBQUtFLE1BQUw7QUFDRCxLO3NCQUVTRixLLEVBQU87QUFDZixVQUFJQSxRQUFRLENBQVIsSUFBYUEsUUFBUSxLQUFLRyxTQUE5QixFQUF5Qzs7QUFFekMsV0FBS0osTUFBTCxHQUFjLEtBQUtGLE1BQUwsQ0FBWVIsT0FBWixDQUFvQlcsS0FBcEIsQ0FBZDtBQUNBLFdBQUtFLE1BQUwsR0FBY0YsS0FBZDtBQUNBLFdBQUtvQixhQUFMLENBQW1CLEtBQUtsQixNQUF4QjtBQUNEOzs7O0VBOUN5QiwrQzs7a0JBeUhiVCxhIiwiZmlsZSI6IlNlbGVjdEJ1dHRvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSAnLi4vbWl4aW5zL2Rpc3BsYXknO1xuaW1wb3J0ICogYXMgZWxlbWVudHMgZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbGFiZWw6ICcmbmJzcDsnLFxuICBvcHRpb25zOiBudWxsLFxuICBkZWZhdWx0OiBudWxsLFxuICBjb250YWluZXI6IG51bGwsXG4gIGNhbGxiYWNrOiBudWxsLFxufTtcblxuLyoqXG4gKiBMaXN0IG9mIGJ1dHRvbnMgd2l0aCBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy5sYWJlbCAtIExhYmVsIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5vcHRpb25zPW51bGxdIC0gVmFsdWVzIG9mIHRoZSBkcm9wIGRvd24gbGlzdC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbY29uZmlnLmRlZmF1bHQ9bnVsbF0gLSBEZWZhdWx0IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxiYXNpYy1jb250cm9sbGVyfkdyb3VwfSBbY29uZmlnLmNvbnRhaW5lcj1udWxsXSAtXG4gKiAgQ29udGFpbmVyIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbmZpZy5jYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlXG4gKiAgdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udHJvbGxlcnMnO1xuICpcbiAqIGNvbnN0IHNlbGVjdEJ1dHRvbnMgPSBuZXcgY29udHJvbGxlcnMuU2VsZWN0QnV0dG9ucyh7XG4gKiAgIGxhYmVsOiAnU2VsZWN0QnV0dG9ucycsXG4gKiAgIG9wdGlvbnM6IFsnc3RhbmRieScsICdydW4nLCAnZW5kJ10sXG4gKiAgIGRlZmF1bHQ6ICdydW4nLFxuICogICBjb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAqICAgY2FsbGJhY2s6ICh2YWx1ZSwgaW5kZXgpID0+IGNvbnNvbGUubG9nKHZhbHVlLCBpbmRleCksXG4gKiB9KTtcbiAqL1xuY2xhc3MgU2VsZWN0QnV0dG9ucyBleHRlbmRzIGRpc3BsYXkoQmFzZUNvbXBvbmVudCkge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcignc2VsZWN0LWJ1dHRvbnMnLCBkZWZhdWx0cywgY29uZmlnKTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnBhcmFtcy5vcHRpb25zKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJpZ2dlckJ1dHRvbjogSW52YWxpZCBvcHRpb24gXCJvcHRpb25zXCInKTtcblxuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5wYXJhbXMuZGVmYXVsdDtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnBhcmFtcy5vcHRpb25zO1xuICAgIGNvbnN0IGluZGV4ID0gb3B0aW9ucy5pbmRleE9mKHRoaXMuX3ZhbHVlKTtcbiAgICB0aGlzLl9pbmRleCA9IGluZGV4ID09PSAtMSA/wqAwIDogaW5kZXg7XG4gICAgdGhpcy5fbWF4SW5kZXggPSBvcHRpb25zLmxlbmd0aCAtIDE7XG5cbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCB2YWx1ZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucGFyYW1zLm9wdGlvbnMuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgb3B0aW9uIGluZGV4LlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGluZGV4KCkge1xuICAgIHRoaXMuX2luZGV4O1xuICB9XG5cbiAgc2V0IGluZGV4KGluZGV4KSB7XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuX21heEluZGV4KSByZXR1cm47XG5cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMucGFyYW1zLm9wdGlvbnNbaW5kZXhdO1xuICAgIHRoaXMuX2luZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5faGlnaGxpZ2h0QnRuKHRoaXMuX2luZGV4KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvcHRpb25zLCBsYWJlbCB9ID0gdGhpcy5wYXJhbXM7XG4gICAgY29uc3QgY29udGVudCA9IGBcbiAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWxcIj4ke2xhYmVsfTwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbm5lci13cmFwcGVyXCI+XG4gICAgICAgICR7ZWxlbWVudHMuYXJyb3dMZWZ0fVxuICAgICAgICAke29wdGlvbnMubWFwKChvcHRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIiBkYXRhLWluZGV4PVwiJHtpbmRleH1cIiBkYXRhLXZhbHVlPVwiJHtvcHRpb259XCI+XG4gICAgICAgICAgICAgICR7b3B0aW9ufVxuICAgICAgICAgICAgPC9idXR0b24+YDtcbiAgICAgICAgfSkuam9pbignJyl9XG4gICAgICAgICR7ZWxlbWVudHMuYXJyb3dSaWdodH1cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcih0aGlzLnR5cGUpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICB0aGlzLiRwcmV2ID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmFycm93LWxlZnQnKTtcbiAgICB0aGlzLiRuZXh0ID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmFycm93LXJpZ2h0Jyk7XG4gICAgdGhpcy4kYnRucyA9IEFycmF5LmZyb20odGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbCgnLmJ0bicpKTtcblxuICAgIHRoaXMuX2hpZ2hsaWdodEJ0bih0aGlzLl9pbmRleCk7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuJHByZXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4IC0gMTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZShpbmRleCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRuZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleCArIDE7XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kYnRucy5mb3JFYWNoKCgkYnRuLCBpbmRleCkgPT4ge1xuICAgICAgJGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRlKGluZGV4KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9wcm9wYWdhdGUoaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5fbWF4SW5kZXgpIHJldHVybjtcblxuICAgIHRoaXMuX2luZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLnBhcmFtcy5vcHRpb25zW2luZGV4XTtcbiAgICB0aGlzLl9oaWdobGlnaHRCdG4odGhpcy5faW5kZXgpO1xuXG4gICAgdGhpcy5leGVjdXRlTGlzdGVuZXJzKHRoaXMuX3ZhbHVlLCB0aGlzLl9pbmRleCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2hpZ2hsaWdodEJ0bihhY3RpdmVJbmRleCkge1xuICAgIHRoaXMuJGJ0bnMuZm9yRWFjaCgoJGJ0biwgaW5kZXgpID0+IHtcbiAgICAgICRidG4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgICAgIGlmIChhY3RpdmVJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgJGJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RCdXR0b25zO1xuIl19