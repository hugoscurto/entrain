'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setTheme = setTheme;

var _styles = require('../utils/styles');

var styles = _interopRequireWildcard(_styles);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

// default theme
var theme = 'light';
// set of the instanciated controllers
var controllers = new Set();

/**
 * Change the theme of the controllers, currently 3 themes are available:
 *  - `'light'` (default)
 *  - `'grey'`
 *  - `'dark'`
 *
 * @param {String} theme - Name of the theme.
 */
function setTheme(value) {
  controllers.forEach(function (controller) {
    return controller.$el.classList.remove(theme);
  });
  theme = value;
  controllers.forEach(function (controller) {
    return controller.$el.classList.add(theme);
  });
}

/**
 * display mixin - components with DOM
 * @private
 */
var display = function display(superclass) {
  return function (_superclass) {
    _inherits(_class, _superclass);

    function _class() {
      var _ref;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // insert styles and listen window resize when the first controller is created
      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

      if (controllers.size === 0) {
        styles.insertStyleSheet();

        window.addEventListener('resize', function () {
          controllers.forEach(function (controller) {
            return controller.resize();
          });
        });
      }

      controllers.add(_this);
      return _this;
    }

    _createClass(_class, [{
      key: 'initialize',
      value: function initialize() {
        var _this2 = this;

        var $container = this.params.container;

        if ($container) {
          // css selector
          if (typeof $container === 'string') {
            $container = document.querySelector($container);
            // group
          } else if ($container.$container) {
            // this.group = $container;
            $container.elements.add(this);
            $container = $container.$container;
          }

          $container.appendChild(this.render());
          setTimeout(function () {
            return _this2.resize();
          }, 0);
        }
      }

      /** @private */

    }, {
      key: 'render',
      value: function render() {
        this.$el = document.createElement('div');
        this.$el.classList.add(styles.ns, theme, this.type);

        return this.$el;
      }

      /** @private */

    }, {
      key: 'resize',
      value: function resize() {
        var boundingRect = this.$el.getBoundingClientRect();
        var width = boundingRect.width;
        var method = width > 600 ? 'remove' : 'add';

        this.$el.classList[method]('small');
      }
    }]);

    return _class;
  }(superclass);
};

exports.default = display;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3BsYXkuanMiXSwibmFtZXMiOlsic2V0VGhlbWUiLCJzdHlsZXMiLCJ0aGVtZSIsImNvbnRyb2xsZXJzIiwiU2V0IiwidmFsdWUiLCJmb3JFYWNoIiwiY29udHJvbGxlciIsIiRlbCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsImRpc3BsYXkiLCJzdXBlcmNsYXNzIiwiYXJncyIsInNpemUiLCJpbnNlcnRTdHlsZVNoZWV0Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2l6ZSIsIiRjb250YWluZXIiLCJwYXJhbXMiLCJjb250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50cyIsImFwcGVuZENoaWxkIiwicmVuZGVyIiwic2V0VGltZW91dCIsImNyZWF0ZUVsZW1lbnQiLCJucyIsInR5cGUiLCJib3VuZGluZ1JlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ3aWR0aCIsIm1ldGhvZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFrQmdCQSxRLEdBQUFBLFE7O0FBbEJoQjs7SUFBWUMsTTs7Ozs7Ozs7OztBQUVaOztBQUVBO0FBQ0EsSUFBSUMsUUFBUSxPQUFaO0FBQ0E7QUFDQSxJQUFNQyxjQUFjLElBQUlDLEdBQUosRUFBcEI7O0FBR0E7Ozs7Ozs7O0FBUU8sU0FBU0osUUFBVCxDQUFrQkssS0FBbEIsRUFBeUI7QUFDOUJGLGNBQVlHLE9BQVosQ0FBb0IsVUFBQ0MsVUFBRDtBQUFBLFdBQWdCQSxXQUFXQyxHQUFYLENBQWVDLFNBQWYsQ0FBeUJDLE1BQXpCLENBQWdDUixLQUFoQyxDQUFoQjtBQUFBLEdBQXBCO0FBQ0FBLFVBQVFHLEtBQVI7QUFDQUYsY0FBWUcsT0FBWixDQUFvQixVQUFDQyxVQUFEO0FBQUEsV0FBZ0JBLFdBQVdDLEdBQVgsQ0FBZUMsU0FBZixDQUF5QkUsR0FBekIsQ0FBNkJULEtBQTdCLENBQWhCO0FBQUEsR0FBcEI7QUFDRDs7QUFFRDs7OztBQUlBLElBQU1VLFVBQVUsU0FBVkEsT0FBVSxDQUFDQyxVQUFEO0FBQUE7QUFBQTs7QUFDZCxzQkFBcUI7QUFBQTs7QUFBQTs7QUFBQSx3Q0FBTkMsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBR25CO0FBSG1CLDZJQUNWQSxJQURVOztBQUluQixVQUFJWCxZQUFZWSxJQUFaLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCZCxlQUFPZSxnQkFBUDs7QUFFQUMsZUFBT0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBVztBQUMzQ2Ysc0JBQVlHLE9BQVosQ0FBb0IsVUFBQ0MsVUFBRDtBQUFBLG1CQUFnQkEsV0FBV1ksTUFBWCxFQUFoQjtBQUFBLFdBQXBCO0FBQ0QsU0FGRDtBQUdEOztBQUVEaEIsa0JBQVlRLEdBQVo7QUFabUI7QUFhcEI7O0FBZGE7QUFBQTtBQUFBLG1DQWdCRDtBQUFBOztBQUNYLFlBQUlTLGFBQWEsS0FBS0MsTUFBTCxDQUFZQyxTQUE3Qjs7QUFFQSxZQUFJRixVQUFKLEVBQWdCO0FBQ2Q7QUFDQSxjQUFJLE9BQU9BLFVBQVAsS0FBc0IsUUFBMUIsRUFBb0M7QUFDbENBLHlCQUFhRyxTQUFTQyxhQUFULENBQXVCSixVQUF2QixDQUFiO0FBQ0Y7QUFDQyxXQUhELE1BR08sSUFBSUEsV0FBV0EsVUFBZixFQUEyQjtBQUNoQztBQUNBQSx1QkFBV0ssUUFBWCxDQUFvQmQsR0FBcEIsQ0FBd0IsSUFBeEI7QUFDQVMseUJBQWFBLFdBQVdBLFVBQXhCO0FBQ0Q7O0FBRURBLHFCQUFXTSxXQUFYLENBQXVCLEtBQUtDLE1BQUwsRUFBdkI7QUFDQUMscUJBQVc7QUFBQSxtQkFBTSxPQUFLVCxNQUFMLEVBQU47QUFBQSxXQUFYLEVBQWdDLENBQWhDO0FBQ0Q7QUFDRjs7QUFFRDs7QUFuQ2M7QUFBQTtBQUFBLCtCQW9DTDtBQUNQLGFBQUtYLEdBQUwsR0FBV2UsU0FBU00sYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsYUFBS3JCLEdBQUwsQ0FBU0MsU0FBVCxDQUFtQkUsR0FBbkIsQ0FBdUJWLE9BQU82QixFQUE5QixFQUFrQzVCLEtBQWxDLEVBQXlDLEtBQUs2QixJQUE5Qzs7QUFFQSxlQUFPLEtBQUt2QixHQUFaO0FBQ0Q7O0FBRUQ7O0FBM0NjO0FBQUE7QUFBQSwrQkE0Q0w7QUFDUCxZQUFNd0IsZUFBZSxLQUFLeEIsR0FBTCxDQUFTeUIscUJBQVQsRUFBckI7QUFDQSxZQUFNQyxRQUFRRixhQUFhRSxLQUEzQjtBQUNBLFlBQU1DLFNBQVNELFFBQVEsR0FBUixHQUFjLFFBQWQsR0FBeUIsS0FBeEM7O0FBRUEsYUFBSzFCLEdBQUwsQ0FBU0MsU0FBVCxDQUFtQjBCLE1BQW5CLEVBQTJCLE9BQTNCO0FBQ0Q7QUFsRGE7O0FBQUE7QUFBQSxJQUE4QnRCLFVBQTlCO0FBQUEsQ0FBaEI7O2tCQXFEZUQsTyIsImZpbGUiOiJkaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc3R5bGVzIGZyb20gJy4uL3V0aWxzL3N0eWxlcyc7XG5cbi8qKiBAbW9kdWxlIGJhc2ljLWNvbnRyb2xsZXJzICovXG5cbi8vIGRlZmF1bHQgdGhlbWVcbmxldCB0aGVtZSA9ICdsaWdodCc7XG4vLyBzZXQgb2YgdGhlIGluc3RhbmNpYXRlZCBjb250cm9sbGVyc1xuY29uc3QgY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG5cblxuLyoqXG4gKiBDaGFuZ2UgdGhlIHRoZW1lIG9mIHRoZSBjb250cm9sbGVycywgY3VycmVudGx5IDMgdGhlbWVzIGFyZSBhdmFpbGFibGU6XG4gKiAgLSBgJ2xpZ2h0J2AgKGRlZmF1bHQpXG4gKiAgLSBgJ2dyZXknYFxuICogIC0gYCdkYXJrJ2BcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGhlbWUgLSBOYW1lIG9mIHRoZSB0aGVtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFRoZW1lKHZhbHVlKSB7XG4gIGNvbnRyb2xsZXJzLmZvckVhY2goKGNvbnRyb2xsZXIpID0+IGNvbnRyb2xsZXIuJGVsLmNsYXNzTGlzdC5yZW1vdmUodGhlbWUpKTtcbiAgdGhlbWUgPSB2YWx1ZTtcbiAgY29udHJvbGxlcnMuZm9yRWFjaCgoY29udHJvbGxlcikgPT4gY29udHJvbGxlci4kZWwuY2xhc3NMaXN0LmFkZCh0aGVtZSkpO1xufVxuXG4vKipcbiAqIGRpc3BsYXkgbWl4aW4gLSBjb21wb25lbnRzIHdpdGggRE9NXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBkaXNwbGF5ID0gKHN1cGVyY2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgc3VwZXJjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIC8vIGluc2VydCBzdHlsZXMgYW5kIGxpc3RlbiB3aW5kb3cgcmVzaXplIHdoZW4gdGhlIGZpcnN0IGNvbnRyb2xsZXIgaXMgY3JlYXRlZFxuICAgIGlmIChjb250cm9sbGVycy5zaXplID09PSAwKSB7XG4gICAgICBzdHlsZXMuaW5zZXJ0U3R5bGVTaGVldCgpO1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnRyb2xsZXJzLmZvckVhY2goKGNvbnRyb2xsZXIpID0+IGNvbnRyb2xsZXIucmVzaXplKCkpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29udHJvbGxlcnMuYWRkKHRoaXMpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBsZXQgJGNvbnRhaW5lciA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcjtcblxuICAgIGlmICgkY29udGFpbmVyKSB7XG4gICAgICAvLyBjc3Mgc2VsZWN0b3JcbiAgICAgIGlmICh0eXBlb2YgJGNvbnRhaW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgJGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJGNvbnRhaW5lcik7XG4gICAgICAvLyBncm91cFxuICAgICAgfSBlbHNlIGlmICgkY29udGFpbmVyLiRjb250YWluZXIpIHtcbiAgICAgICAgLy8gdGhpcy5ncm91cCA9ICRjb250YWluZXI7XG4gICAgICAgICRjb250YWluZXIuZWxlbWVudHMuYWRkKHRoaXMpO1xuICAgICAgICAkY29udGFpbmVyID0gJGNvbnRhaW5lci4kY29udGFpbmVyO1xuICAgICAgfVxuXG4gICAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyKCkpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlc2l6ZSgpLCAwKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZChzdHlsZXMubnMsIHRoZW1lLCB0aGlzLnR5cGUpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc2l6ZSgpIHtcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB3aWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBtZXRob2QgPSB3aWR0aCA+IDYwMCA/ICdyZW1vdmUnIDogJ2FkZCc7XG5cbiAgICB0aGlzLiRlbC5jbGFzc0xpc3RbbWV0aG9kXSgnc21hbGwnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5O1xuIl19