import BaseComponent from './BaseComponent';
import display from '../mixins/display';

const AudioContext = (window.AudioContext || window.webkitAudioContext);

/** @module basic-controllers */

const defaults = {
  label: 'Drag and drop audio files',
  labelProcess: 'process...',
  audioContext: null,
  container: null,
  callback: null,
};

/**
 * Drag and drop zone for audio files returning `AudioBuffer`s and/or JSON
 * descriptor data.
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
 *   callback: (results) => console.log(results),
 * });
 */
class DragAndDrop extends display(BaseComponent) {
  constructor(options) {
    super('drag-and-drop', defaults, options);

    this._value = null;

    if (!this.params.audioContext)
      this.params.audioContext = new AudioContext();

    super.initialize();
  }

  /**
   * Get the last results
   * @type {Object<String, AudioBuffer|JSON>}
   * @readonly
   */
  get value() {
    return this._value;
  }

  render() {
    const { label } = this.params;
    const content = `
      <div class="drop-zone">
        <p class="label">${label}</p>
      </div>
    `;

    this.$el = super.render();
    this.$el.innerHTML = content;
    this.$dropZone = this.$el.querySelector('.drop-zone');
    this.$label = this.$el.querySelector('.label');

    this._bindEvents();

    return this.$el;
  }

  _bindEvents() {
    this.$dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.$dropZone.classList.add('drag');
      e.dataTransfer.dropEffect = 'copy';
    }, false);

    this.$dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.$dropZone.classList.remove('drag');
    }, false);

    this.$dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      const audioFiles = files.filter((file) => {
        if (/^audio/.test(file.type)) {
          file.shortType = 'audio';
          return true;
        } else if (/json$/.test(file.type)) {
          file.shortType = 'json';
          return true;
        }

        return false;
      });

      const results = {};
      let counter = 0;

      this.$label.textContent = this.params.labelProcess;

      const testEnd = () => {
        counter += 1;

        if (counter === audioFiles.length) {
          this._value = results
          this.executeListeners(results);

          this.$dropZone.classList.remove('drag');
          this.$label.textContent = this.params.label;
        }
      }

      files.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          if (file.shortType === 'json') {
            results[file.name] = JSON.parse(e.target.result);
            testEnd();
          } else if (file.shortType === 'audio') {
            this.params.audioContext
              .decodeAudioData(e.target.result)
              .then((audioBuffer) => {
                results[file.name] = audioBuffer;
                testEnd();
              })
              .catch((err) => {
                results[file.name] = null;
                testEnd();
              });
          }
        }

        if (file.shortType === 'json')
          reader.readAsText(file);
        else if (file.shortType === 'audio')
          reader.readAsArrayBuffer(file);
      });
    }, false);
  }
}

export default DragAndDrop;
