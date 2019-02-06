'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var separator = '/';

function getHead(path) {
  return path.split(separator)[0];
}

function getTail(path) {
  var parts = path.split(separator);
  parts.shift();
  return parts.join(separator);
}

var container = function container(superclass) {
  return function (_superclass) {
    _inherits(_class, _superclass);

    function _class() {
      var _ref;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

      _this.elements = new Set();

      // sure of that ?
      delete _this._listeners;
      delete _this._groupListeners;
      return _this;
    }

    /**
     * Return one of the group children according to its `id`, `null` otherwise.
     * @private
     */


    _createClass(_class, [{
      key: '_getHead',
      value: function _getHead(id) {}
    }, {
      key: '_getTail',
      value: function _getTail(id) {}

      /**
       * Return a child of the group recursively according to the given `id`,
       * `null` otherwise.
       * @private
       */

    }, {
      key: 'getComponent',
      value: function getComponent(id) {
        var head = getHead(id);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var component = _step.value;

            if (head === component.id) {
              if (head === id) return component;else if (component.type = 'group') return component.getComponent(getTail(id));else throw new Error('Undefined component ' + id);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        throw new Error('Undefined component ' + id);
      }

      /**
       * Add Listener on each components of the group.
       *
       * @param {String} id - Path to component id.
       * @param {Function} callback - Function to execute.
       */

    }, {
      key: 'addListener',
      value: function addListener(id, callback) {
        if (arguments.length === 1) {
          callback = id;
          this._addGroupListener('', '', callback);
        } else {
          this._addGroupListener(id, '', callback);
        }
      }

      /** @private */

    }, {
      key: '_addGroupListener',
      value: function _addGroupListener(id, callId, callback) {
        if (id) {
          var componentId = getHead(id);
          var component = this.getComponent(componentId);

          if (component) {
            id = getTail(id);
            component._addGroupListener(id, callId, callback);
          } else {
            throw new Error('Undefined component ' + this.rootId + '/' + componentId);
          }
        } else {
          this.elements.forEach(function (component) {
            var _callId = callId; // create a new branche
            _callId += callId === '' ? component.id : separator + component.id;
            component._addGroupListener(id, _callId, callback);
          });
        }
      }
    }]);

    return _class;
  }(superclass);
};

exports.default = container;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJzZXBhcmF0b3IiLCJnZXRIZWFkIiwicGF0aCIsInNwbGl0IiwiZ2V0VGFpbCIsInBhcnRzIiwic2hpZnQiLCJqb2luIiwiY29udGFpbmVyIiwic3VwZXJjbGFzcyIsImFyZ3MiLCJlbGVtZW50cyIsIlNldCIsIl9saXN0ZW5lcnMiLCJfZ3JvdXBMaXN0ZW5lcnMiLCJpZCIsImhlYWQiLCJjb21wb25lbnQiLCJ0eXBlIiwiZ2V0Q29tcG9uZW50IiwiRXJyb3IiLCJjYWxsYmFjayIsImFyZ3VtZW50cyIsImxlbmd0aCIsIl9hZGRHcm91cExpc3RlbmVyIiwiY2FsbElkIiwiY29tcG9uZW50SWQiLCJyb290SWQiLCJmb3JFYWNoIiwiX2NhbGxJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFNQSxZQUFZLEdBQWxCOztBQUVBLFNBQVNDLE9BQVQsQ0FBaUJDLElBQWpCLEVBQXVCO0FBQ3JCLFNBQU9BLEtBQUtDLEtBQUwsQ0FBV0gsU0FBWCxFQUFzQixDQUF0QixDQUFQO0FBQ0Q7O0FBRUQsU0FBU0ksT0FBVCxDQUFpQkYsSUFBakIsRUFBdUI7QUFDckIsTUFBTUcsUUFBUUgsS0FBS0MsS0FBTCxDQUFXSCxTQUFYLENBQWQ7QUFDQUssUUFBTUMsS0FBTjtBQUNBLFNBQU9ELE1BQU1FLElBQU4sQ0FBV1AsU0FBWCxDQUFQO0FBQ0Q7O0FBRUQsSUFBTVEsWUFBWSxTQUFaQSxTQUFZLENBQUNDLFVBQUQ7QUFBQTtBQUFBOztBQUNoQixzQkFBcUI7QUFBQTs7QUFBQTs7QUFBQSx3Q0FBTkMsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQUEsNklBQ1ZBLElBRFU7O0FBR25CLFlBQUtDLFFBQUwsR0FBZ0IsSUFBSUMsR0FBSixFQUFoQjs7QUFFQTtBQUNBLGFBQU8sTUFBS0MsVUFBWjtBQUNBLGFBQU8sTUFBS0MsZUFBWjtBQVBtQjtBQVFwQjs7QUFFRDs7Ozs7O0FBWGdCO0FBQUE7QUFBQSwrQkFlUEMsRUFmTyxFQWVILENBRVo7QUFqQmU7QUFBQTtBQUFBLCtCQW1CUEEsRUFuQk8sRUFtQkgsQ0FFWjs7QUFFRDs7Ozs7O0FBdkJnQjtBQUFBO0FBQUEsbUNBNEJIQSxFQTVCRyxFQTRCQztBQUNmLFlBQU1DLE9BQU9mLFFBQVFjLEVBQVIsQ0FBYjs7QUFEZTtBQUFBO0FBQUE7O0FBQUE7QUFHZiwrQkFBc0IsS0FBS0osUUFBM0IsOEhBQXFDO0FBQUEsZ0JBQTVCTSxTQUE0Qjs7QUFDbkMsZ0JBQUlELFNBQVNDLFVBQVVGLEVBQXZCLEVBQTJCO0FBQ3pCLGtCQUFJQyxTQUFTRCxFQUFiLEVBQ0UsT0FBT0UsU0FBUCxDQURGLEtBRUssSUFBSUEsVUFBVUMsSUFBVixHQUFpQixPQUFyQixFQUNILE9BQU9ELFVBQVVFLFlBQVYsQ0FBdUJmLFFBQVFXLEVBQVIsQ0FBdkIsQ0FBUCxDQURHLEtBR0gsTUFBTSxJQUFJSyxLQUFKLDBCQUFpQ0wsRUFBakMsQ0FBTjtBQUNIO0FBQ0Y7QUFaYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWNmLGNBQU0sSUFBSUssS0FBSiwwQkFBaUNMLEVBQWpDLENBQU47QUFDRDs7QUFFRDs7Ozs7OztBQTdDZ0I7QUFBQTtBQUFBLGtDQW1ESkEsRUFuREksRUFtREFNLFFBbkRBLEVBbURVO0FBQ3hCLFlBQUlDLFVBQVVDLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUJGLHFCQUFXTixFQUFYO0FBQ0EsZUFBS1MsaUJBQUwsQ0FBdUIsRUFBdkIsRUFBMkIsRUFBM0IsRUFBK0JILFFBQS9CO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsZUFBS0csaUJBQUwsQ0FBdUJULEVBQXZCLEVBQTJCLEVBQTNCLEVBQStCTSxRQUEvQjtBQUNEO0FBQ0Y7O0FBRUQ7O0FBNURnQjtBQUFBO0FBQUEsd0NBNkRFTixFQTdERixFQTZETVUsTUE3RE4sRUE2RGNKLFFBN0RkLEVBNkR3QjtBQUN0QyxZQUFJTixFQUFKLEVBQVE7QUFDTixjQUFNVyxjQUFjekIsUUFBUWMsRUFBUixDQUFwQjtBQUNBLGNBQU1FLFlBQVksS0FBS0UsWUFBTCxDQUFrQk8sV0FBbEIsQ0FBbEI7O0FBRUEsY0FBSVQsU0FBSixFQUFlO0FBQ2JGLGlCQUFLWCxRQUFRVyxFQUFSLENBQUw7QUFDQUUsc0JBQVVPLGlCQUFWLENBQTRCVCxFQUE1QixFQUFnQ1UsTUFBaEMsRUFBd0NKLFFBQXhDO0FBQ0QsV0FIRCxNQUdPO0FBQ0wsa0JBQU0sSUFBSUQsS0FBSiwwQkFBaUMsS0FBS08sTUFBdEMsU0FBZ0RELFdBQWhELENBQU47QUFDRDtBQUNGLFNBVkQsTUFVTztBQUNMLGVBQUtmLFFBQUwsQ0FBY2lCLE9BQWQsQ0FBc0IsVUFBQ1gsU0FBRCxFQUFlO0FBQ25DLGdCQUFJWSxVQUFVSixNQUFkLENBRG1DLENBQ2I7QUFDdEJJLHVCQUFZSixXQUFXLEVBQVosR0FBa0JSLFVBQVVGLEVBQTVCLEdBQWlDZixZQUFZaUIsVUFBVUYsRUFBbEU7QUFDQUUsc0JBQVVPLGlCQUFWLENBQTRCVCxFQUE1QixFQUFnQ2MsT0FBaEMsRUFBeUNSLFFBQXpDO0FBQ0QsV0FKRDtBQUtEO0FBQ0Y7QUEvRWU7O0FBQUE7QUFBQSxJQUE4QlosVUFBOUI7QUFBQSxDQUFsQjs7a0JBa0ZlRCxTIiwiZmlsZSI6ImNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3Qgc2VwYXJhdG9yID0gJy8nO1xuXG5mdW5jdGlvbiBnZXRIZWFkKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoc2VwYXJhdG9yKVswXTtcbn1cblxuZnVuY3Rpb24gZ2V0VGFpbChwYXRoKSB7XG4gIGNvbnN0IHBhcnRzID0gcGF0aC5zcGxpdChzZXBhcmF0b3IpO1xuICBwYXJ0cy5zaGlmdCgpO1xuICByZXR1cm4gcGFydHMuam9pbihzZXBhcmF0b3IpO1xufVxuXG5jb25zdCBjb250YWluZXIgPSAoc3VwZXJjbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5lbGVtZW50cyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIHN1cmUgb2YgdGhhdCA/XG4gICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVycztcbiAgICBkZWxldGUgdGhpcy5fZ3JvdXBMaXN0ZW5lcnM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIG9uZSBvZiB0aGUgZ3JvdXAgY2hpbGRyZW4gYWNjb3JkaW5nIHRvIGl0cyBgaWRgLCBgbnVsbGAgb3RoZXJ3aXNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldEhlYWQoaWQpIHtcblxuICB9XG5cbiAgX2dldFRhaWwoaWQpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGNoaWxkIG9mIHRoZSBncm91cCByZWN1cnNpdmVseSBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGBpZGAsXG4gICAqIGBudWxsYCBvdGhlcndpc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRDb21wb25lbnQoaWQpIHtcbiAgICBjb25zdCBoZWFkID0gZ2V0SGVhZChpZCk7XG5cbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5lbGVtZW50cykge1xuICAgICAgaWYgKGhlYWQgPT09IGNvbXBvbmVudC5pZCkge1xuICAgICAgICBpZiAoaGVhZCA9PT0gaWQpXG4gICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICAgICAgZWxzZSBpZiAoY29tcG9uZW50LnR5cGUgPSAnZ3JvdXAnKVxuICAgICAgICAgIHJldHVybiBjb21wb25lbnQuZ2V0Q29tcG9uZW50KGdldFRhaWwoaWQpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5kZWZpbmVkIGNvbXBvbmVudCAke2lkfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgVW5kZWZpbmVkIGNvbXBvbmVudCAke2lkfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBMaXN0ZW5lciBvbiBlYWNoIGNvbXBvbmVudHMgb2YgdGhlIGdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBQYXRoIHRvIGNvbXBvbmVudCBpZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBleGVjdXRlLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIoaWQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNhbGxiYWNrID0gaWQ7XG4gICAgICB0aGlzLl9hZGRHcm91cExpc3RlbmVyKCcnLCAnJywgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hZGRHcm91cExpc3RlbmVyKGlkLCAnJywgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfYWRkR3JvdXBMaXN0ZW5lcihpZCwgY2FsbElkLCBjYWxsYmFjaykge1xuICAgIGlmIChpZCkge1xuICAgICAgY29uc3QgY29tcG9uZW50SWQgPSBnZXRIZWFkKGlkKTtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNvbXBvbmVudElkKTtcblxuICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICBpZCA9IGdldFRhaWwoaWQpO1xuICAgICAgICBjb21wb25lbnQuX2FkZEdyb3VwTGlzdGVuZXIoaWQsIGNhbGxJZCwgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmRlZmluZWQgY29tcG9uZW50ICR7dGhpcy5yb290SWR9LyR7Y29tcG9uZW50SWR9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgIGxldCBfY2FsbElkID0gY2FsbElkOyAvLyBjcmVhdGUgYSBuZXcgYnJhbmNoZVxuICAgICAgICBfY2FsbElkICs9IChjYWxsSWQgPT09ICcnKSA/IGNvbXBvbmVudC5pZCA6IHNlcGFyYXRvciArIGNvbXBvbmVudC5pZDtcbiAgICAgICAgY29tcG9uZW50Ll9hZGRHcm91cExpc3RlbmVyKGlkLCBfY2FsbElkLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29udGFpbmVyO1xuIl19