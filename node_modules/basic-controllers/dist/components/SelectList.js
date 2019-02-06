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
 * Drop-down list controller.
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
 * const selectList = new controllers.SelectList({
 *   label: 'SelectList',
 *   options: ['standby', 'run', 'end'],
 *   default: 'run',
 *   container: '#container',
 *   callback: (value, index) => console.log(value, index),
 * });
 */

var SelectList = function (_display) {
  _inherits(SelectList, _display);

  function SelectList(config) {
    _classCallCheck(this, SelectList);

    var _this = _possibleConstructorReturn(this, (SelectList.__proto__ || Object.getPrototypeOf(SelectList)).call(this, 'select-list', defaults, config));

    if (!Array.isArray(_this.params.options)) throw new Error('TriggerButton: Invalid option "options"');

    _this._value = _this.params.default;

    var options = _this.params.options;
    var index = options.indexOf(_this._value);
    _this._index = index === -1 ? 0 : index;
    _this._maxIndex = options.length - 1;

    _get(SelectList.prototype.__proto__ || Object.getPrototypeOf(SelectList.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Current value.
   * @type {String}
   */


  _createClass(SelectList, [{
    key: 'render',


    /** @private */
    value: function render() {
      var _params = this.params,
          label = _params.label,
          options = _params.options;

      var content = '\n      <span class="label">' + label + '</span>\n      <div class="inner-wrapper">\n        ' + elements.arrowLeft + '\n        <select>\n        ' + options.map(function (option, index) {
        return '<option value="' + option + '">' + option + '</option>';
      }).join('') + '\n        <select>\n        ' + elements.arrowRight + '\n      </div>\n    ';

      this.$el = _get(SelectList.prototype.__proto__ || Object.getPrototypeOf(SelectList.prototype), 'render', this).call(this, this.type);
      this.$el.classList.add('align-small');
      this.$el.innerHTML = content;

      this.$prev = this.$el.querySelector('.arrow-left');
      this.$next = this.$el.querySelector('.arrow-right');
      this.$select = this.$el.querySelector('select');
      // set to default value
      this.$select.value = options[this._index];
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
      }, false);

      this.$next.addEventListener('click', function () {
        var index = _this2._index + 1;
        _this2._propagate(index);
      }, false);

      this.$select.addEventListener('change', function () {
        var value = _this2.$select.value;
        var index = _this2.params.options.indexOf(value);
        _this2._propagate(index);
      });
    }

    /** @private */

  }, {
    key: '_propagate',
    value: function _propagate(index) {
      if (index < 0 || index > this._maxIndex) return;

      var value = this.params.options[index];
      this._index = index;
      this._value = value;
      this.$select.value = value;

      this.executeListeners(this._value, this._index);
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      this.$select.value = value;
      this._value = value;
      this._index = this.params.options.indexOf(value);
    }

    /**
     * Current option index.
     * @type {Number}
     */

  }, {
    key: 'index',
    get: function get() {
      return this._index;
    },
    set: function set(index) {
      if (index < 0 || index > this._maxIndex) return;
      this.value = this.params.options[index];
    }
  }]);

  return SelectList;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = SelectList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlbGVjdExpc3QuanMiXSwibmFtZXMiOlsiZWxlbWVudHMiLCJkZWZhdWx0cyIsImxhYmVsIiwib3B0aW9ucyIsImRlZmF1bHQiLCJjb250YWluZXIiLCJjYWxsYmFjayIsIlNlbGVjdExpc3QiLCJjb25maWciLCJBcnJheSIsImlzQXJyYXkiLCJwYXJhbXMiLCJFcnJvciIsIl92YWx1ZSIsImluZGV4IiwiaW5kZXhPZiIsIl9pbmRleCIsIl9tYXhJbmRleCIsImxlbmd0aCIsImNvbnRlbnQiLCJhcnJvd0xlZnQiLCJtYXAiLCJvcHRpb24iLCJqb2luIiwiYXJyb3dSaWdodCIsIiRlbCIsInR5cGUiLCJjbGFzc0xpc3QiLCJhZGQiLCJpbm5lckhUTUwiLCIkcHJldiIsInF1ZXJ5U2VsZWN0b3IiLCIkbmV4dCIsIiRzZWxlY3QiLCJ2YWx1ZSIsIl9iaW5kRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9wcm9wYWdhdGUiLCJleGVjdXRlTGlzdGVuZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxROzs7Ozs7Ozs7Ozs7QUFFWjs7QUFFQSxJQUFNQyxXQUFXO0FBQ2ZDLFNBQU8sUUFEUTtBQUVmQyxXQUFTLElBRk07QUFHZkMsV0FBUyxJQUhNO0FBSWZDLGFBQVcsSUFKSTtBQUtmQyxZQUFVO0FBTEssQ0FBakI7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCTUMsVTs7O0FBQ0osc0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFBQSx3SEFDWixhQURZLEVBQ0dQLFFBREgsRUFDYU8sTUFEYjs7QUFHbEIsUUFBSSxDQUFDQyxNQUFNQyxPQUFOLENBQWMsTUFBS0MsTUFBTCxDQUFZUixPQUExQixDQUFMLEVBQ0UsTUFBTSxJQUFJUyxLQUFKLENBQVUseUNBQVYsQ0FBTjs7QUFFRixVQUFLQyxNQUFMLEdBQWMsTUFBS0YsTUFBTCxDQUFZUCxPQUExQjs7QUFFQSxRQUFNRCxVQUFVLE1BQUtRLE1B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QjtBQUNBLFdBQUtyQixNQUFMLEdBQWNxQixLQUFkO0FBQ0EsV0FBS2xCLE1BQUwsR0FBYyxLQUFLTCxNQUFMLENBQVlSLE9BQVosQ0FBb0JZLE9BQXBCLENBQTRCbUIsS0FBNUIsQ0FBZDtBQUNEOztBQUVEOzs7Ozs7O3dCQUlZO0FBQ1YsYUFBTyxLQUFLbEIsTUFBWjtBQUNELEs7c0JBRVNGLEssRUFBTztBQUNmLFVBQUlBLFFBQVEsQ0FBUixJQUFhQSxRQUFRLEtBQUtHLFNBQTlCLEVBQXlDO0FBQ3pDLFdBQUtpQixLQUFMLEdBQWEsS0FBS3ZCLE1BQUwsQ0FBWVIsT0FBWixDQUFvQlcsS0FBcEIsQ0FBYjtBQUNEOzs7O0VBMUNzQiwrQzs7a0JBMEdWUCxVIiwiZmlsZSI6IlNlbGVjdExpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSAnLi4vbWl4aW5zL2Rpc3BsYXknO1xuaW1wb3J0ICogYXMgZWxlbWVudHMgZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbGFiZWw6ICcmbmJzcDsnLFxuICBvcHRpb25zOiBudWxsLFxuICBkZWZhdWx0OiBudWxsLFxuICBjb250YWluZXI6IG51bGwsXG4gIGNhbGxiYWNrOiBudWxsLFxufVxuXG4vKipcbiAqIERyb3AtZG93biBsaXN0IGNvbnRyb2xsZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcubGFiZWwgLSBMYWJlbCBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcub3B0aW9ucz1udWxsXSAtIFZhbHVlcyBvZiB0aGUgZHJvcCBkb3duIGxpc3QuXG4gKiBAcGFyYW0ge051bWJlcn0gW2NvbmZpZy5kZWZhdWx0PW51bGxdIC0gRGVmYXVsdCB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8YmFzaWMtY29udHJvbGxlcn5Hcm91cH0gW2NvbmZpZy5jb250YWluZXI9bnVsbF0gLVxuICogIENvbnRhaW5lciBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb25maWcuY2FsbGJhY2s9bnVsbF0gLSBDYWxsYmFjayB0byBiZSBleGVjdXRlZCB3aGVuIHRoZVxuICogIHZhbHVlIGNoYW5nZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGNvbnRyb2xsZXJzIGZyb20gJ2Jhc2ljLWNvbnRyb2xsZXJzJztcbiAqXG4gKiBjb25zdCBzZWxlY3RMaXN0ID0gbmV3IGNvbnRyb2xsZXJzLlNlbGVjdExpc3Qoe1xuICogICBsYWJlbDogJ1NlbGVjdExpc3QnLFxuICogICBvcHRpb25zOiBbJ3N0YW5kYnknLCAncnVuJywgJ2VuZCddLFxuICogICBkZWZhdWx0OiAncnVuJyxcbiAqICAgY29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gKiAgIGNhbGxiYWNrOiAodmFsdWUsIGluZGV4KSA9PiBjb25zb2xlLmxvZyh2YWx1ZSwgaW5kZXgpLFxuICogfSk7XG4gKi9cbmNsYXNzIFNlbGVjdExpc3QgZXh0ZW5kcyBkaXNwbGF5KEJhc2VDb21wb25lbnQpIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoJ3NlbGVjdC1saXN0JywgZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5wYXJhbXMub3B0aW9ucykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyaWdnZXJCdXR0b246IEludmFsaWQgb3B0aW9uIFwib3B0aW9uc1wiJyk7XG5cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMucGFyYW1zLmRlZmF1bHQ7XG5cbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wYXJhbXMub3B0aW9ucztcbiAgICBjb25zdCBpbmRleCA9IG9wdGlvbnMuaW5kZXhPZih0aGlzLl92YWx1ZSk7XG4gICAgdGhpcy5faW5kZXggPSBpbmRleCA9PT0gLTEgP8KgMCA6IGluZGV4O1xuICAgIHRoaXMuX21heEluZGV4ID0gb3B0aW9ucy5sZW5ndGggLSAxO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgdmFsdWUuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy4kc2VsZWN0LnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9pbmRleCA9IHRoaXMucGFyYW1zLm9wdGlvbnMuaW5kZXhPZih2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBvcHRpb24gaW5kZXguXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgaW5kZXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2luZGV4O1xuICB9XG5cbiAgc2V0IGluZGV4KGluZGV4KSB7XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuX21heEluZGV4KSByZXR1cm47XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMucGFyYW1zLm9wdGlvbnNbaW5kZXhdO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBvcHRpb25zwqB9ID0gdGhpcy5wYXJhbXM7XG4gICAgY29uc3QgY29udGVudCA9IGBcbiAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWxcIj4ke2xhYmVsfTwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbm5lci13cmFwcGVyXCI+XG4gICAgICAgICR7ZWxlbWVudHMuYXJyb3dMZWZ0fVxuICAgICAgICA8c2VsZWN0PlxuICAgICAgICAke29wdGlvbnMubWFwKChvcHRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGA8b3B0aW9uIHZhbHVlPVwiJHtvcHRpb259XCI+JHtvcHRpb259PC9vcHRpb24+YDtcbiAgICAgICAgfSkuam9pbignJyl9XG4gICAgICAgIDxzZWxlY3Q+XG4gICAgICAgICR7ZWxlbWVudHMuYXJyb3dSaWdodH1cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcih0aGlzLnR5cGUpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2FsaWduLXNtYWxsJyk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIHRoaXMuJHByZXYgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuYXJyb3ctbGVmdCcpO1xuICAgIHRoaXMuJG5leHQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuYXJyb3ctcmlnaHQnKTtcbiAgICB0aGlzLiRzZWxlY3QgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKTtcbiAgICAvLyBzZXQgdG8gZGVmYXVsdCB2YWx1ZVxuICAgIHRoaXMuJHNlbGVjdC52YWx1ZSA9IG9wdGlvbnNbdGhpcy5faW5kZXhdO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRwcmV2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleCAtIDE7XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoaW5kZXgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHRoaXMuJG5leHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4ICsgMTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZShpbmRleCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdGhpcy4kc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy4kc2VsZWN0LnZhbHVlO1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnBhcmFtcy5vcHRpb25zLmluZGV4T2YodmFsdWUpO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKGluZGV4KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcHJvcGFnYXRlKGluZGV4KSB7XG4gICAgaWYgKGluZGV4IDwgMCB8fMKgaW5kZXggPiB0aGlzLl9tYXhJbmRleCkgcmV0dXJuO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcmFtcy5vcHRpb25zW2luZGV4XTtcbiAgICB0aGlzLl9pbmRleCA9IGluZGV4O1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy4kc2VsZWN0LnZhbHVlID0gdmFsdWU7XG5cbiAgICB0aGlzLmV4ZWN1dGVMaXN0ZW5lcnModGhpcy5fdmFsdWUsIHRoaXMuX2luZGV4KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RMaXN0O1xuIl19