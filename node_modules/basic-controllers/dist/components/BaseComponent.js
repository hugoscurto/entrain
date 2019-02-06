"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @module basic-controller */

var typeCounters = {};

/**
 * Base class to create new controllers.
 *
 * @param {String} type - String describing the type of the controller.
 * @param {Object} defaults - Default parameters of the controller.
 * @param {Object} config - User defined configuration options.
 */

var BaseComponent = function () {
  function BaseComponent(type, defaults) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, BaseComponent);

    this.type = type;
    this.params = Object.assign({}, defaults, config);

    // handle id
    if (!typeCounters[type]) typeCounters[type] = 0;

    if (!this.params.id) {
      this.id = type + "-" + typeCounters[type];
      typeCounters[type] += 1;
    } else {
      this.id = this.params.id;
    }

    this._listeners = new Set();
    this._groupListeners = new Set();

    // register callback if given
    if (this.params.callback) this.addListener(this.params.callback);
  }

  /**
   * Add a listener to the controller.
   *
   * @param {Function} callback - Function to be applied when the controller
   *  state change.
   */


  _createClass(BaseComponent, [{
    key: "addListener",
    value: function addListener(callback) {
      this._listeners.add(callback);
    }

    /**
     * Called when a listener is added from a containing group.
     * @private
     */

  }, {
    key: "_addGroupListener",
    value: function _addGroupListener(id, callId, callback) {
      if (!callId) this.addListener(callback);else {
        this._groupListeners.add({ callId: callId, callback: callback });
      }
    }

    /**
     * Remove a listener from the controller.
     *
     * @param {Function} callback - Function to remove from the listeners.
     * @private
     * @todo - reexpose when `container` can override this method...
     */
    // removeListener(callback) {
    //   this._listeners.remove(callback);
    // }

    /** @private */

  }, {
    key: "executeListeners",
    value: function executeListeners() {
      for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }

      this._listeners.forEach(function (callback) {
        return callback.apply(undefined, values);
      });

      this._groupListeners.forEach(function (payload) {
        var callback = payload.callback,
            callId = payload.callId;

        callback.apply(undefined, [callId].concat(values));
      });
    }
  }]);

  return BaseComponent;
}();

exports.default = BaseComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VDb21wb25lbnQuanMiXSwibmFtZXMiOlsidHlwZUNvdW50ZXJzIiwiQmFzZUNvbXBvbmVudCIsInR5cGUiLCJkZWZhdWx0cyIsImNvbmZpZyIsInBhcmFtcyIsIk9iamVjdCIsImFzc2lnbiIsImlkIiwiX2xpc3RlbmVycyIsIlNldCIsIl9ncm91cExpc3RlbmVycyIsImNhbGxiYWNrIiwiYWRkTGlzdGVuZXIiLCJhZGQiLCJjYWxsSWQiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwicGF5bG9hZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztBQUVBLElBQU1BLGVBQWUsRUFBckI7O0FBRUE7Ozs7Ozs7O0lBT01DLGE7QUFDSix5QkFBWUMsSUFBWixFQUFrQkMsUUFBbEIsRUFBeUM7QUFBQSxRQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZDLFNBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtHLE1BQUwsR0FBY0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JKLFFBQWxCLEVBQTRCQyxNQUE1QixDQUFkOztBQUVBO0FBQ0EsUUFBSSxDQUFDSixhQUFhRSxJQUFiLENBQUwsRUFDRUYsYUFBYUUsSUFBYixJQUFxQixDQUFyQjs7QUFFRixRQUFJLENBQUMsS0FBS0csTUFBTCxDQUFZRyxFQUFqQixFQUFxQjtBQUNuQixXQUFLQSxFQUFMLEdBQWFOLElBQWIsU0FBcUJGLGFBQWFFLElBQWIsQ0FBckI7QUFDQUYsbUJBQWFFLElBQWIsS0FBc0IsQ0FBdEI7QUFDRCxLQUhELE1BR087QUFDTCxXQUFLTSxFQUFMLEdBQVUsS0FBS0gsTUFBTCxDQUFZRyxFQUF0QjtBQUNEOztBQUVELFNBQUtDLFVBQUwsR0FBa0IsSUFBSUMsR0FBSixFQUFsQjtBQUNBLFNBQUtDLGVBQUwsR0FBdUIsSUFBSUQsR0FBSixFQUF2Qjs7QUFFQTtBQUNBLFFBQUksS0FBS0wsTUFBTCxDQUFZTyxRQUFoQixFQUNFLEtBQUtDLFdBQUwsQ0FBaUIsS0FBS1IsTUFBTCxDQUFZTyxRQUE3QjtBQUNIOztBQUVEOzs7Ozs7Ozs7O2dDQU1ZQSxRLEVBQVU7QUFDcEIsV0FBS0gsVUFBTCxDQUFnQkssR0FBaEIsQ0FBb0JGLFFBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7c0NBSWtCSixFLEVBQUlPLE0sRUFBUUgsUSxFQUFVO0FBQ3RDLFVBQUksQ0FBQ0csTUFBTCxFQUNFLEtBQUtGLFdBQUwsQ0FBaUJELFFBQWpCLEVBREYsS0FFSztBQUNILGFBQUtELGVBQUwsQ0FBcUJHLEdBQXJCLENBQXlCLEVBQUVDLGNBQUYsRUFBVUgsa0JBQVYsRUFBekI7QUFDRDtBQUNGOztBQUVEOzs7Ozs7O0FBT0E7QUFDQTtBQUNBOztBQUVBOzs7O3VDQUM0QjtBQUFBLHdDQUFSSSxNQUFRO0FBQVJBLGNBQVE7QUFBQTs7QUFDMUIsV0FBS1AsVUFBTCxDQUFnQlEsT0FBaEIsQ0FBd0IsVUFBQ0wsUUFBRDtBQUFBLGVBQWNBLDBCQUFZSSxNQUFaLENBQWQ7QUFBQSxPQUF4Qjs7QUFFQSxXQUFLTCxlQUFMLENBQXFCTSxPQUFyQixDQUE2QixVQUFDQyxPQUFELEVBQWE7QUFBQSxZQUNoQ04sUUFEZ0MsR0FDWE0sT0FEVyxDQUNoQ04sUUFEZ0M7QUFBQSxZQUN0QkcsTUFEc0IsR0FDWEcsT0FEVyxDQUN0QkgsTUFEc0I7O0FBRXhDSCxtQ0FBU0csTUFBVCxTQUFvQkMsTUFBcEI7QUFDRCxPQUhEO0FBSUQ7Ozs7OztrQkFHWWYsYSIsImZpbGUiOiJCYXNlQ29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBtb2R1bGUgYmFzaWMtY29udHJvbGxlciAqL1xuXG5jb25zdCB0eXBlQ291bnRlcnMgPSB7fTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGNyZWF0ZSBuZXcgY29udHJvbGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBTdHJpbmcgZGVzY3JpYmluZyB0aGUgdHlwZSBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0cyAtIERlZmF1bHQgcGFyYW1ldGVycyBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBVc2VyIGRlZmluZWQgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICovXG5jbGFzcyBCYXNlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgZGVmYXVsdHMsIGNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgLy8gaGFuZGxlIGlkXG4gICAgaWYgKCF0eXBlQ291bnRlcnNbdHlwZV0pXG4gICAgICB0eXBlQ291bnRlcnNbdHlwZV0gPSAwO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5pZCkge1xuICAgICAgdGhpcy5pZCA9IGAke3R5cGV9LSR7dHlwZUNvdW50ZXJzW3R5cGVdfWA7XG4gICAgICB0eXBlQ291bnRlcnNbdHlwZV0gKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pZCA9IHRoaXMucGFyYW1zLmlkO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9ncm91cExpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIHJlZ2lzdGVyIGNhbGxiYWNrIGlmIGdpdmVuXG4gICAgaWYgKHRoaXMucGFyYW1zLmNhbGxiYWNrKVxuICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLnBhcmFtcy5jYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gdGhlIGNvbnRyb2xsZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gYmUgYXBwbGllZCB3aGVuIHRoZSBjb250cm9sbGVyXG4gICAqICBzdGF0ZSBjaGFuZ2UuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2xpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGEgbGlzdGVuZXIgaXMgYWRkZWQgZnJvbSBhIGNvbnRhaW5pbmcgZ3JvdXAuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkR3JvdXBMaXN0ZW5lcihpZCwgY2FsbElkLCBjYWxsYmFjaykge1xuICAgIGlmICghY2FsbElkKVxuICAgICAgdGhpcy5hZGRMaXN0ZW5lcihjYWxsYmFjayk7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLl9ncm91cExpc3RlbmVycy5hZGQoeyBjYWxsSWQsIGNhbGxiYWNrIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIHRoZSBjb250cm9sbGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIHJlbW92ZSBmcm9tIHRoZSBsaXN0ZW5lcnMuXG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIC0gcmVleHBvc2Ugd2hlbiBgY29udGFpbmVyYCBjYW4gb3ZlcnJpZGUgdGhpcyBtZXRob2QuLi5cbiAgICovXG4gIC8vIHJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gIC8vICAgdGhpcy5fbGlzdGVuZXJzLnJlbW92ZShjYWxsYmFjayk7XG4gIC8vIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZXhlY3V0ZUxpc3RlbmVycyguLi52YWx1ZXMpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKC4uLnZhbHVlcykpO1xuXG4gICAgdGhpcy5fZ3JvdXBMaXN0ZW5lcnMuZm9yRWFjaCgocGF5bG9hZCkgPT4ge1xuICAgICAgY29uc3QgeyBjYWxsYmFjaywgY2FsbElkIH0gPSBwYXlsb2FkO1xuICAgICAgY2FsbGJhY2soY2FsbElkLCAuLi52YWx1ZXMpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2VDb21wb25lbnQ7XG4iXX0=