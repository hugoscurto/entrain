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
class SelectButtons extends display(BaseComponent) {
  constructor(config) {
    super('select-buttons', defaults, config);

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
    const index = this.params.options.indexOf(value);

    if (index !== -1)
      this.index = index;
  }

  /**
   * Current option index.
   * @type {Number}
   */
  get index() {
    this._index;
  }

  set index(index) {
    if (index < 0 || index > this._maxIndex) return;

    this._value = this.params.options[index];
    this._index = index;
    this._highlightBtn(this._index);
  }

  /** @private */
  render() {
    const { options, label } = this.params;
    const content = `
      <span class="label">${label}</span>
      <div class="inner-wrapper">
        ${elements.arrowLeft}
        ${options.map((option, index) => {
          return `
            <button class="btn" data-index="${index}" data-value="${option}">
              ${option}
            </button>`;
        }).join('')}
        ${elements.arrowRight}
      </div>
    `;

    this.$el = super.render(this.type);
    this.$el.innerHTML = content;

    this.$prev = this.$el.querySelector('.arrow-left');
    this.$next = this.$el.querySelector('.arrow-right');
    this.$btns = Array.from(this.$el.querySelectorAll('.btn'));

    this._highlightBtn(this._index);
    this._bindEvents();

    return this.$el;
  }

  /** @private */
  _bindEvents() {
    this.$prev.addEventListener('click', () => {
      const index = this._index - 1;
      this._propagate(index);
    });

    this.$next.addEventListener('click', () => {
      const index = this._index + 1;
      this._propagate(index);
    });

    this.$btns.forEach(($btn, index) => {
      $btn.addEventListener('click', (e) => {
        e.preventDefault();
        this._propagate(index);
      });
    });
  }

  /** @private */
  _propagate(index) {
    if (index < 0 || index > this._maxIndex) return;

    this._index = index;
    this._value = this.params.options[index];
    this._highlightBtn(this._index);

    this.executeListeners(this._value, this._index);
  }

  /** @private */
  _highlightBtn(activeIndex) {
    this.$btns.forEach(($btn, index) => {
      $btn.classList.remove('active');

      if (activeIndex === index) {
        $btn.classList.add('active');
      }
    });
  }
}

export default SelectButtons;
