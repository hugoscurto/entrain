'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseComponent = require('./components/BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _Group = require('./components/Group');

var _Group2 = _interopRequireDefault(_Group);

var _NumberBox = require('./components/NumberBox');

var _NumberBox2 = _interopRequireDefault(_NumberBox);

var _SelectButtons = require('./components/SelectButtons');

var _SelectButtons2 = _interopRequireDefault(_SelectButtons);

var _SelectList = require('./components/SelectList');

var _SelectList2 = _interopRequireDefault(_SelectList);

var _Slider = require('./components/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _Text = require('./components/Text');

var _Text2 = _interopRequireDefault(_Text);

var _Title = require('./components/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Toggle = require('./components/Toggle');

var _Toggle2 = _interopRequireDefault(_Toggle);

var _TriggerButtons = require('./components/TriggerButtons');

var _TriggerButtons2 = _interopRequireDefault(_TriggerButtons);

var _container2 = require('./mixins/container');

var _container3 = _interopRequireDefault(_container2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// map type names to constructors
var typeCtorMap = {
  'group': _Group2.default,
  'number-box': _NumberBox2.default,
  'select-buttons': _SelectButtons2.default,
  'select-list': _SelectList2.default,
  'slider': _Slider2.default,
  'text': _Text2.default,
  'title': _Title2.default,
  'toggle': _Toggle2.default,
  'trigger-buttons': _TriggerButtons2.default
};

var defaults = {
  container: 'body'
};

var Control = function (_container) {
  _inherits(Control, _container);

  function Control(config) {
    _classCallCheck(this, Control);

    var _this = _possibleConstructorReturn(this, (Control.__proto__ || Object.getPrototypeOf(Control)).call(this, 'control', defaults, config));

    var $container = _this.params.container;

    if (typeof $container === 'string') $container = document.querySelector($container);

    _this.$container = $container;
    return _this;
  }

  return Control;
}((0, _container3.default)(_BaseComponent2.default));

/** @module basic-controllers */

/**
 * Create a whole control surface from a json definition.
 *
 * @param {String|Element} container - Container of the controls.
 * @param {Object} - Definitions for the controls.
 * @return {Object} - A `Control` instance that behaves like a group without graphic.
 * @static
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const definitions = [
 *   {
 *     id: 'my-slider',
 *     type: 'slider',
 *     label: 'My Slider',
 *     size: 'large',
 *     min: 0,
 *     max: 1000,
 *     step: 1,
 *     default: 253,
 *   }, {
 *     id: 'my-group',
 *     type: 'group',
 *     label: 'Group',
 *     default: 'opened',
 *     elements: [
 *       {
 *         id: 'my-number',
 *         type: 'number-box',
 *         default: 0.4,
 *         min: -1,
 *         max: 1,
 *         step: 0.01,
 *       }
 *     ],
 *   }
 * ];
 *
 * const controls = controllers.create('#container', definitions);
 *
 * // add a listener on all the component inside `my-group`
 * controls.addListener('my-group', (id, value) => console.log(id, value));
 *
 * // retrieve the instance of `my-number`
 * const myNumber = controls.getComponent('my-group/my-number');
 */


function create(container, definitions) {

  function _parse(container, definitions) {
    definitions.forEach(function (def, index) {
      var type = def.type;
      var ctor = typeCtorMap[type];
      var config = Object.assign({}, def);

      //
      config.container = container;
      delete config.type;

      var component = new ctor(config);

      if (type === 'group') _parse(component, config.elements);
    });
  };

  var _root = new Control({ container: container });
  _parse(_root, definitions);

  return _root;
}

exports.default = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhY3RvcnkuanMiXSwibmFtZXMiOlsidHlwZUN0b3JNYXAiLCJkZWZhdWx0cyIsImNvbnRhaW5lciIsIkNvbnRyb2wiLCJjb25maWciLCIkY29udGFpbmVyIiwicGFyYW1zIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY3JlYXRlIiwiZGVmaW5pdGlvbnMiLCJfcGFyc2UiLCJmb3JFYWNoIiwiZGVmIiwiaW5kZXgiLCJ0eXBlIiwiY3RvciIsIk9iamVjdCIsImFzc2lnbiIsImNvbXBvbmVudCIsImVsZW1lbnRzIiwiX3Jvb3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsY0FBYztBQUNsQiwwQkFEa0I7QUFFbEIsbUNBRmtCO0FBR2xCLDJDQUhrQjtBQUlsQixxQ0FKa0I7QUFLbEIsNEJBTGtCO0FBTWxCLHdCQU5rQjtBQU9sQiwwQkFQa0I7QUFRbEIsNEJBUmtCO0FBU2xCO0FBVGtCLENBQXBCOztBQVlBLElBQU1DLFdBQVc7QUFDZkMsYUFBVztBQURJLENBQWpCOztJQUlNQyxPOzs7QUFDSixtQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUFBLGtIQUNaLFNBRFksRUFDREgsUUFEQyxFQUNTRyxNQURUOztBQUdsQixRQUFJQyxhQUFhLE1BQUtDLE1BQUwsQ0FBWUosU0FBN0I7O0FBRUEsUUFBSSxPQUFPRyxVQUFQLEtBQXNCLFFBQTFCLEVBQ0VBLGFBQWFFLFNBQVNDLGFBQVQsQ0FBdUJILFVBQXZCLENBQWI7O0FBRUYsVUFBS0EsVUFBTCxHQUFrQkEsVUFBbEI7QUFSa0I7QUFTbkI7OztFQVZtQixpRDs7QUFhdEI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQ0EsU0FBU0ksTUFBVCxDQUFnQlAsU0FBaEIsRUFBMkJRLFdBQTNCLEVBQXdDOztBQUV0QyxXQUFTQyxNQUFULENBQWdCVCxTQUFoQixFQUEyQlEsV0FBM0IsRUFBd0M7QUFDdENBLGdCQUFZRSxPQUFaLENBQW9CLFVBQUNDLEdBQUQsRUFBTUMsS0FBTixFQUFnQjtBQUNsQyxVQUFNQyxPQUFPRixJQUFJRSxJQUFqQjtBQUNBLFVBQU1DLE9BQU9oQixZQUFZZSxJQUFaLENBQWI7QUFDQSxVQUFNWCxTQUFTYSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkwsR0FBbEIsQ0FBZjs7QUFFQTtBQUNBVCxhQUFPRixTQUFQLEdBQW1CQSxTQUFuQjtBQUNBLGFBQU9FLE9BQU9XLElBQWQ7O0FBRUEsVUFBTUksWUFBWSxJQUFJSCxJQUFKLENBQVNaLE1BQVQsQ0FBbEI7O0FBRUEsVUFBSVcsU0FBUyxPQUFiLEVBQ0VKLE9BQU9RLFNBQVAsRUFBa0JmLE9BQU9nQixRQUF6QjtBQUNILEtBYkQ7QUFjRDs7QUFFRCxNQUFNQyxRQUFRLElBQUlsQixPQUFKLENBQVksRUFBRUQsV0FBV0EsU0FBYixFQUFaLENBQWQ7QUFDQVMsU0FBT1UsS0FBUCxFQUFjWCxXQUFkOztBQUVBLFNBQU9XLEtBQVA7QUFDRDs7a0JBRWNaLE0iLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy9CYXNlQ29tcG9uZW50JztcbmltcG9ydCBHcm91cCBmcm9tICcuL2NvbXBvbmVudHMvR3JvdXAnO1xuaW1wb3J0IE51bWJlckJveCBmcm9tICcuL2NvbXBvbmVudHMvTnVtYmVyQm94JztcbmltcG9ydCBTZWxlY3RCdXR0b25zIGZyb20gJy4vY29tcG9uZW50cy9TZWxlY3RCdXR0b25zJztcbmltcG9ydCBTZWxlY3RMaXN0IGZyb20gJy4vY29tcG9uZW50cy9TZWxlY3RMaXN0JztcbmltcG9ydCBTbGlkZXIgZnJvbSAnLi9jb21wb25lbnRzL1NsaWRlcic7XG5pbXBvcnQgVGV4dCBmcm9tICcuL2NvbXBvbmVudHMvVGV4dCc7XG5pbXBvcnQgVGl0bGUgZnJvbSAnLi9jb21wb25lbnRzL1RpdGxlJztcbmltcG9ydCBUb2dnbGUgZnJvbSAnLi9jb21wb25lbnRzL1RvZ2dsZSc7XG5pbXBvcnQgVHJpZ2dlckJ1dHRvbnMgZnJvbSAnLi9jb21wb25lbnRzL1RyaWdnZXJCdXR0b25zJztcblxuaW1wb3J0IGNvbnRhaW5lciBmcm9tICcuL21peGlucy9jb250YWluZXInO1xuXG4vLyBtYXAgdHlwZSBuYW1lcyB0byBjb25zdHJ1Y3RvcnNcbmNvbnN0IHR5cGVDdG9yTWFwID0ge1xuICAnZ3JvdXAnOiBHcm91cCxcbiAgJ251bWJlci1ib3gnOiBOdW1iZXJCb3gsXG4gICdzZWxlY3QtYnV0dG9ucyc6IFNlbGVjdEJ1dHRvbnMsXG4gICdzZWxlY3QtbGlzdCc6IFNlbGVjdExpc3QsXG4gICdzbGlkZXInOiBTbGlkZXIsXG4gICd0ZXh0JzogVGV4dCxcbiAgJ3RpdGxlJzogVGl0bGUsXG4gICd0b2dnbGUnOiBUb2dnbGUsXG4gICd0cmlnZ2VyLWJ1dHRvbnMnOiBUcmlnZ2VyQnV0dG9ucyxcbn07XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBjb250YWluZXI6ICdib2R5Jyxcbn07XG5cbmNsYXNzIENvbnRyb2wgZXh0ZW5kcyBjb250YWluZXIoQmFzZUNvbXBvbmVudCkge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcignY29udHJvbCcsIGRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgbGV0ICRjb250YWluZXIgPSB0aGlzLnBhcmFtcy5jb250YWluZXI7XG5cbiAgICBpZiAodHlwZW9mICRjb250YWluZXIgPT09ICdzdHJpbmcnKVxuICAgICAgJGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJGNvbnRhaW5lcik7XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuICB9XG59XG5cbi8qKiBAbW9kdWxlIGJhc2ljLWNvbnRyb2xsZXJzICovXG5cbi8qKlxuICogQ3JlYXRlIGEgd2hvbGUgY29udHJvbCBzdXJmYWNlIGZyb20gYSBqc29uIGRlZmluaXRpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gY29udGFpbmVyIC0gQ29udGFpbmVyIG9mIHRoZSBjb250cm9scy5cbiAqIEBwYXJhbSB7T2JqZWN0fSAtIERlZmluaXRpb25zIGZvciB0aGUgY29udHJvbHMuXG4gKiBAcmV0dXJuIHtPYmplY3R9IC0gQSBgQ29udHJvbGAgaW5zdGFuY2UgdGhhdCBiZWhhdmVzIGxpa2UgYSBncm91cCB3aXRob3V0IGdyYXBoaWMuXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGNvbnRyb2xsZXJzIGZyb20gJ2Jhc2ljLWNvbnRyb2xsZXJzJztcbiAqXG4gKiBjb25zdCBkZWZpbml0aW9ucyA9IFtcbiAqICAge1xuICogICAgIGlkOiAnbXktc2xpZGVyJyxcbiAqICAgICB0eXBlOiAnc2xpZGVyJyxcbiAqICAgICBsYWJlbDogJ015IFNsaWRlcicsXG4gKiAgICAgc2l6ZTogJ2xhcmdlJyxcbiAqICAgICBtaW46IDAsXG4gKiAgICAgbWF4OiAxMDAwLFxuICogICAgIHN0ZXA6IDEsXG4gKiAgICAgZGVmYXVsdDogMjUzLFxuICogICB9LCB7XG4gKiAgICAgaWQ6ICdteS1ncm91cCcsXG4gKiAgICAgdHlwZTogJ2dyb3VwJyxcbiAqICAgICBsYWJlbDogJ0dyb3VwJyxcbiAqICAgICBkZWZhdWx0OiAnb3BlbmVkJyxcbiAqICAgICBlbGVtZW50czogW1xuICogICAgICAge1xuICogICAgICAgICBpZDogJ215LW51bWJlcicsXG4gKiAgICAgICAgIHR5cGU6ICdudW1iZXItYm94JyxcbiAqICAgICAgICAgZGVmYXVsdDogMC40LFxuICogICAgICAgICBtaW46IC0xLFxuICogICAgICAgICBtYXg6IDEsXG4gKiAgICAgICAgIHN0ZXA6IDAuMDEsXG4gKiAgICAgICB9XG4gKiAgICAgXSxcbiAqICAgfVxuICogXTtcbiAqXG4gKiBjb25zdCBjb250cm9scyA9IGNvbnRyb2xsZXJzLmNyZWF0ZSgnI2NvbnRhaW5lcicsIGRlZmluaXRpb25zKTtcbiAqXG4gKiAvLyBhZGQgYSBsaXN0ZW5lciBvbiBhbGwgdGhlIGNvbXBvbmVudCBpbnNpZGUgYG15LWdyb3VwYFxuICogY29udHJvbHMuYWRkTGlzdGVuZXIoJ215LWdyb3VwJywgKGlkLCB2YWx1ZSkgPT4gY29uc29sZS5sb2coaWQsIHZhbHVlKSk7XG4gKlxuICogLy8gcmV0cmlldmUgdGhlIGluc3RhbmNlIG9mIGBteS1udW1iZXJgXG4gKiBjb25zdCBteU51bWJlciA9IGNvbnRyb2xzLmdldENvbXBvbmVudCgnbXktZ3JvdXAvbXktbnVtYmVyJyk7XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShjb250YWluZXIsIGRlZmluaXRpb25zKSB7XG5cbiAgZnVuY3Rpb24gX3BhcnNlKGNvbnRhaW5lciwgZGVmaW5pdGlvbnMpIHtcbiAgICBkZWZpbml0aW9ucy5mb3JFYWNoKChkZWYsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gZGVmLnR5cGU7XG4gICAgICBjb25zdCBjdG9yID0gdHlwZUN0b3JNYXBbdHlwZV07XG4gICAgICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBkZWYpO1xuXG4gICAgICAvL1xuICAgICAgY29uZmlnLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgIGRlbGV0ZSBjb25maWcudHlwZTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IGN0b3IoY29uZmlnKTtcblxuICAgICAgaWYgKHR5cGUgPT09ICdncm91cCcpXG4gICAgICAgIF9wYXJzZShjb21wb25lbnQsIGNvbmZpZy5lbGVtZW50cyk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgX3Jvb3QgPSBuZXcgQ29udHJvbCh7IGNvbnRhaW5lcjogY29udGFpbmVyIH0pO1xuICBfcGFyc2UoX3Jvb3QsIGRlZmluaXRpb25zKTtcblxuICByZXR1cm4gX3Jvb3Q7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZTtcbiJdfQ==