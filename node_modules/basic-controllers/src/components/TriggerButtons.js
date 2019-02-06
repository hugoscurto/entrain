import BaseComponent from './BaseComponent';
import display from '../mixins/display';

/** @module basic-controllers */

const defaults = {
  label: '&nbsp;',
  options: null,
  container: null,
  callback: null,
};

/**
 * List of buttons without state.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Array} [config.options=null] - Options for each button.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const triggerButtons = new controllers.TriggerButtons({
 *   label: 'My Trigger Buttons',
 *   options: ['value 1', 'value 2', 'value 3'],
 *   container: '#container',
 *   callback: (value, index) => console.log(value, index),
 * });
 */
class TriggerButtons extends display(BaseComponent) {
  constructor(config) {
    super('trigger-buttons', defaults, config);

    if (!Array.isArray(this.params.options))
      throw new Error('TriggerButton: Invalid option "options"');

    this._index = null;
    this._value = null;

    super.initialize();
  }

  /**
   * Last triggered button value.
   *
   * @readonly
   * @type {String}
   */
  get value() { return this._value; }

  /**
   * Last triggered button index.
   *
   * @readonly
   * @type {String}
   */
  get index() { return this._index; }

  /** @private */
  render() {
    const { label, options } = this.params;

    const content = `
      <span class="label">${label}</span>
      <div class="inner-wrapper">
        ${options.map((option, index) => {
          return `<a href="#" class="btn">${option}</a>`;
        }).join('')}
      </div>`;

    this.$el = super.render();
    this.$el.innerHTML = content;

    this.$buttons = Array.from(this.$el.querySelectorAll('.btn'));
    this._bindEvents();

    return this.$el;
  }

  /** @private */
  _bindEvents() {
    this.$buttons.forEach(($btn, index) => {
      const value = this.params.options[index];

      $btn.addEventListener('click', (e) => {
        e.preventDefault();

        this._value = value;
        this._index = index;

        this.executeListeners(value, index);
      });
    });
  }
}

export default TriggerButtons;
