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

var AudioContext = window.AudioContext || window.webkitAudioContext;

/** @module basic-controllers */

var defaults = {
  label: 'Drag and drop audio files',
  labelProcess: 'process...',
  audioContext: null,
  container: null,
  callback: null
};

/**
 * Drag and drop zone for audio files returning `AudioBuffer`s
 *
 * @param {Object} config - Override default parameters.
 * @param {String} [config.label='Drag and drop audio files'] - Label of the
 *  controller.
 * @param {String} [config.labelProcess='process...'] - Label of the controller
 *  while audio files are decoded.
 * @param {AudioContext} [config.audioContext=null] - Optionnal audio context
 *  to use in order to decode audio files.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const dragAndDrop = new controllers.DragAndDrop({
 *   container: '#container',
 *   callback: (audioFiles) => console.log(audioFiles),
 * });
 */

var DragAndDrop = function (_display) {
  _inherits(DragAndDrop, _display);

  function DragAndDrop(options) {
    _classCallCheck(this, DragAndDrop);

    var _this = _possibleConstructorReturn(this, (DragAndDrop.__proto__ || Object.getPrototypeOf(DragAndDrop)).call(this, 'drag-and-drop', defaults, options));

    _this._value = null;

    if (!_this.params.audioContext) _this.params.audioContext = new AudioContext();

    _get(DragAndDrop.prototype.__proto__ || Object.getPrototypeOf(DragAndDrop.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Get the last decoded `AudioBuffer`s
   * @type {Array<AudioBuffer>}
   * @readonly
   */


  _createClass(DragAndDrop, [{
    key: 'render',
    value: function render() {
      var label = this.params.label;

      var content = '\n      <div class="drop-zone">\n        <p class="label">' + label + '</p>\n      </div>\n    ';

      this.$el = _get(DragAndDrop.prototype.__proto__ || Object.getPrototypeOf(DragAndDrop.prototype), 'render', this).call(this);
      this.$el.innerHTML = content;
      this.$dropZone = this.$el.querySelector('.drop-zone');
      this.$label = this.$el.querySelector('.label');

      this._bindEvents();

      return this.$el;
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();

        _this2.$dropZone.classList.add('drag');
        e.dataTransfer.dropEffect = 'copy';
      }, false);

      this.$dropZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();

        _this2.$dropZone.classList.remove('drag');
      }, false);

      this.$dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var files = Array.from(e.dataTransfer.files);
        var audioFiles = files.filter(function (file) {
          return file.type.match(/^audio/);
        });
        var buffers = new Array(audioFiles.length);
        var counter = 0;

        _this2.$label.textContent = _this2.params.labelProcess;

        files.forEach(function (file, index) {
          var reader = new FileReader();

          reader.onload = function (e) {
            _this2.params.audioContext.decodeAudioData(e.target.result).then(function (audioBuffer) {
              buffers[index] = audioBuffer;
              counter += 1;

              if (counter === audioFiles.length) {
                _this2.executeListeners(buffers);
                _this2.$dropZone.classList.remove('drag');
                _this2.$label.textContent = _this2.params.label;
              }
            }).catch(function (err) {
              buffers[index] = undefined;
              counter += 1;

              if (counter === audioFiles.length) {
                _this2.executeListeners(buffers);
                _this2.$dropZone.classList.remove('drag');
                _this2.$label.textContent = _this2.params.label;
              }
            });
          };

          reader.readAsArrayBuffer(file);
        });
      }, false);
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    }
  }]);

  return DragAndDrop;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = DragAndDrop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyYWdBbmREcm9wLmpzIl0sIm5hbWVzIjpbIkF1ZGlvQ29udGV4dCIsIndpbmRvdyIsIndlYmtpdEF1ZGlvQ29udGV4dCIsImRlZmF1bHRzIiwibGFiZWwiLCJsYWJlbFByb2Nlc3MiLCJhdWRpb0NvbnRleHQiLCJjb250YWluZXIiLCJjYWxsYmFjayIsIkRyYWdBbmREcm9wIiwib3B0aW9ucyIsIl92YWx1ZSIsInBhcmFtcyIsImNvbnRlbnQiLCIkZWwiLCJpbm5lckhUTUwiLCIkZHJvcFpvbmUiLCJxdWVyeVNlbGVjdG9yIiwiJGxhYmVsIiwiX2JpbmRFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiY2xhc3NMaXN0IiwiYWRkIiwiZGF0YVRyYW5zZmVyIiwiZHJvcEVmZmVjdCIsInJlbW92ZSIsImZpbGVzIiwiQXJyYXkiLCJmcm9tIiwiYXVkaW9GaWxlcyIsImZpbHRlciIsImZpbGUiLCJ0eXBlIiwibWF0Y2giLCJidWZmZXJzIiwibGVuZ3RoIiwiY291bnRlciIsInRleHRDb250ZW50IiwiZm9yRWFjaCIsImluZGV4IiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImRlY29kZUF1ZGlvRGF0YSIsInRhcmdldCIsInJlc3VsdCIsInRoZW4iLCJhdWRpb0J1ZmZlciIsImV4ZWN1dGVMaXN0ZW5lcnMiLCJjYXRjaCIsImVyciIsInVuZGVmaW5lZCIsInJlYWRBc0FycmF5QnVmZmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsZUFBZ0JDLE9BQU9ELFlBQVAsSUFBdUJDLE9BQU9DLGtCQUFwRDs7QUFFQTs7QUFFQSxJQUFNQyxXQUFXO0FBQ2ZDLFNBQU8sMkJBRFE7QUFFZkMsZ0JBQWMsWUFGQztBQUdmQyxnQkFBYyxJQUhDO0FBSWZDLGFBQVcsSUFKSTtBQUtmQyxZQUFVO0FBTEssQ0FBakI7O0FBUUE7Ozs7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QUwsQ0FBWVIsS0FBdEM7QUFDRDtBQUNGLGFBWEgsRUFZR2dELEtBWkgsQ0FZUyxVQUFDQyxHQUFELEVBQVM7QUFDZGhCLHNCQUFRSyxLQUFSLElBQWlCWSxTQUFqQjtBQUNBZix5QkFBVyxDQUFYOztBQUVBLGtCQUFJQSxZQUFZUCxXQUFXTSxNQUEzQixFQUFtQztBQUNqQyx1QkFBS2EsZ0JBQUwsQ0FBc0JkLE9BQXRCO0FBQ0EsdUJBQUtyQixTQUFMLENBQWVRLFNBQWYsQ0FBeUJJLE1BQXpCLENBQWdDLE1BQWhDO0FBQ0EsdUJBQUtWLE1BQUwsQ0FBWXNCLFdBQVosR0FBMEIsT0FBSzVCLE1BQUwsQ0FBWVIsS0FBdEM7QUFDRDtBQUNGLGFBckJIO0FBc0JELFdBdkJEOztBQXlCQXVDLGlCQUFPWSxpQkFBUCxDQUF5QnJCLElBQXpCO0FBQ0QsU0E3QkQ7QUE4QkQsT0F6Q0QsRUF5Q0csS0F6Q0g7QUEwQ0Q7Ozt3QkFoRlc7QUFDVixhQUFPLEtBQUt2QixNQUFaO0FBQ0Q7Ozs7RUFuQnVCLCtDOztrQkFvR1hGLFciLCJmaWxlIjoiRHJhZ0FuZERyb3AuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSAnLi4vbWl4aW5zL2Rpc3BsYXknO1xuXG5jb25zdCBBdWRpb0NvbnRleHQgPSAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KTtcblxuLyoqIEBtb2R1bGUgYmFzaWMtY29udHJvbGxlcnMgKi9cblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGxhYmVsOiAnRHJhZyBhbmQgZHJvcCBhdWRpbyBmaWxlcycsXG4gIGxhYmVsUHJvY2VzczogJ3Byb2Nlc3MuLi4nLFxuICBhdWRpb0NvbnRleHQ6IG51bGwsXG4gIGNvbnRhaW5lcjogbnVsbCxcbiAgY2FsbGJhY2s6IG51bGwsXG59O1xuXG4vKipcbiAqIERyYWcgYW5kIGRyb3Agem9uZSBmb3IgYXVkaW8gZmlsZXMgcmV0dXJuaW5nIGBBdWRpb0J1ZmZlcmBzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbY29uZmlnLmxhYmVsPSdEcmFnIGFuZCBkcm9wIGF1ZGlvIGZpbGVzJ10gLSBMYWJlbCBvZiB0aGVcbiAqICBjb250cm9sbGVyLlxuICogQHBhcmFtIHtTdHJpbmd9IFtjb25maWcubGFiZWxQcm9jZXNzPSdwcm9jZXNzLi4uJ10gLSBMYWJlbCBvZiB0aGUgY29udHJvbGxlclxuICogIHdoaWxlIGF1ZGlvIGZpbGVzIGFyZSBkZWNvZGVkLlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IFtjb25maWcuYXVkaW9Db250ZXh0PW51bGxdIC0gT3B0aW9ubmFsIGF1ZGlvIGNvbnRleHRcbiAqICB0byB1c2UgaW4gb3JkZXIgdG8gZGVjb2RlIGF1ZGlvIGZpbGVzLlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxiYXNpYy1jb250cm9sbGVyfkdyb3VwfSBbY29uZmlnLmNvbnRhaW5lcj1udWxsXSAtXG4gKiAgQ29udGFpbmVyIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbmZpZy5jYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlXG4gKiAgdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udHJvbGxlcnMnO1xuICpcbiAqIGNvbnN0IGRyYWdBbmREcm9wID0gbmV3IGNvbnRyb2xsZXJzLkRyYWdBbmREcm9wKHtcbiAqICAgY29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gKiAgIGNhbGxiYWNrOiAoYXVkaW9GaWxlcykgPT4gY29uc29sZS5sb2coYXVkaW9GaWxlcyksXG4gKiB9KTtcbiAqL1xuY2xhc3MgRHJhZ0FuZERyb3AgZXh0ZW5kcyBkaXNwbGF5KEJhc2VDb21wb25lbnQpIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCdkcmFnLWFuZC1kcm9wJywgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fdmFsdWUgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHQpXG4gICAgICB0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG5cbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBsYXN0IGRlY29kZWQgYEF1ZGlvQnVmZmVyYHNcbiAgICogQHR5cGUge0FycmF5PEF1ZGlvQnVmZmVyPn1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IHRoaXMucGFyYW1zO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgXG4gICAgICA8ZGl2IGNsYXNzPVwiZHJvcC16b25lXCI+XG4gICAgICAgIDxwIGNsYXNzPVwibGFiZWxcIj4ke2xhYmVsfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcigpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgdGhpcy4kZHJvcFpvbmUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuZHJvcC16b25lJyk7XG4gICAgdGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuJGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMuJGRyb3Bab25lLmNsYXNzTGlzdC5hZGQoJ2RyYWcnKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnY29weSc7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdGhpcy4kZHJvcFpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMuJGRyb3Bab25lLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWcnKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLiRkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRhdGFUcmFuc2Zlci5maWxlcyk7XG4gICAgICBjb25zdCBhdWRpb0ZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnR5cGUubWF0Y2goL15hdWRpby8pKTtcbiAgICAgIGNvbnN0IGJ1ZmZlcnMgPSBuZXcgQXJyYXkoYXVkaW9GaWxlcy5sZW5ndGgpO1xuICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgICB0aGlzLiRsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMucGFyYW1zLmxhYmVsUHJvY2VzcztcblxuICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICByZWFkZXIub25sb2FkID0gKGUpID0+IHtcbiAgICAgICAgICB0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHRcbiAgICAgICAgICAgIC5kZWNvZGVBdWRpb0RhdGEoZS50YXJnZXQucmVzdWx0KVxuICAgICAgICAgICAgLnRoZW4oKGF1ZGlvQnVmZmVyKSA9PiB7XG4gICAgICAgICAgICAgIGJ1ZmZlcnNbaW5kZXhdID0gYXVkaW9CdWZmZXI7XG4gICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcblxuICAgICAgICAgICAgICBpZiAoY291bnRlciA9PT0gYXVkaW9GaWxlcy5sZW5ndGgpwqB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlTGlzdGVuZXJzKGJ1ZmZlcnMpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGRyb3Bab25lLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMucGFyYW1zLmxhYmVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgYnVmZmVyc1tpbmRleF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcblxuICAgICAgICAgICAgICBpZiAoY291bnRlciA9PT0gYXVkaW9GaWxlcy5sZW5ndGgpwqB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlTGlzdGVuZXJzKGJ1ZmZlcnMpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGRyb3Bab25lLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMucGFyYW1zLmxhYmVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTtcbiAgICAgIH0pO1xuICAgIH0sIGZhbHNlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEcmFnQW5kRHJvcDtcbiJdfQ==