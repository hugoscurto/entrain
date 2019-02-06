import BaseComponent from './BaseComponent';
import display from '../mixins/display';
import * as elements from '../utils/elements';

/** @module basic-controllers */

const defaults = {
  label: '&nbsp;',
  options: null,
  default: null,
  container: null,
  callback: null,
}

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
class SelectList extends display(BaseComponent) {
  constructor(config) {
    super('select-list', defaults, config);

    if (!Array.isArray(this.params.options))
      throw new Error('TriggerButton: Invalid option "options"');

    this._value = this.params.default;

    const options = this.params.options;
    const index = options.indexOf(this._value);
    this._index = index === -1 ? 0 : index;
    this._maxIndex = options.length - 1;

    super.initialize();
  }

  /**
   * Current value.
   * @type {String}
   */
  get value() {
    return this._value;
  }

  set value(value) {
    this.$select.value = value;
    this._value = value;
    this._index = this.params.options.indexOf(value);
  }

  /**
   * Current option index.
   * @type {Number}
   */
  get index() {
    return this._index;
  }

  set index(index) {
    if (index < 0 || index > this._maxIndex) return;
    this.value = this.params.options[index];
  }

  /** @private */
  render() {
    const { label, options } = this.params;
    const content = `
      <span class="label">${label}</span>
      <div class="inner-wrapper">
        ${elements.arrowLeft}
        <select>
        ${options.map((option, index) => {
          return `<option value="${option}">${option}</option>`;
        }).join('')}
        <select>
        ${elements.arrowRight}
      </div>
    `;

    this.$el = super.render(this.type);
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
  _bindEvents() {
    this.$prev.addEventListener('click', () => {
      const index = this._index - 1;
      this._propagate(index);
    }, false);

    this.$next.addEventListener('click', () => {
      const index = this._index + 1;
      this._propagate(index);
    }, false);

    this.$select.addEventListener('change', () => {
      const value = this.$select.value;
      const index = this.params.options.indexOf(value);
      this._propagate(index);
    });
  }

  /** @private */
  _propagate(index) {
    if (index < 0 || index > this._maxIndex) return;

    const value = this.params.options[index];
    this._index = index;
    this._value = value;
    this.$select.value = value;

    this.executeListeners(this._value, this._index);
  }
}

export default SelectList;
