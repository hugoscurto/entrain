import BaseComponent from './BaseComponent';
import display from '../mixins/display';
import * as elements from '../utils/elements';

/** @module basic-controllers */

const defaults = {
  label: '&nbsp;',
  min: 0,
  max: 1,
  step: 0.01,
  default: 0,
  container: null,
  callback: null,
};

/**
 * Number Box controller
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Number} [config.min=0] - Minimum value.
 * @param {Number} [config.max=1] - Maximum value.
 * @param {Number} [config.step=0.01] - Step between consecutive values.
 * @param {Number} [config.default=0] - Default value.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const numberBox = new controllers.NumberBox({
 *   label: 'My Number Box',
 *   min: 0,
 *   max: 10,
 *   step: 0.1,
 *   default: 5,
 *   container: '#container',
 *   callback: (value) => console.log(value),
 * });
 */
class NumberBox extends display(BaseComponent) {
  // legend, min = 0, max = 1, step = 0.01, defaultValue = 0, $container = null, callback = null
  constructor(config) {
    super('number-box', defaults, config);

    this._value = this.params.default;
    this._isIntStep = (this.params.step % 1 === 0);

    super.initialize();
  }

  /**
   * Current value of the controller.
   *
   * @type {Number}
   */
  get value() {
    return this._value;
  }

  set value(value) {
    // use $number element min, max and step system
    this.$number.value = value;
    value = this.$number.value;
    value = this._isIntStep ? parseInt(value, 10) : parseFloat(value);
    this._value = value;
  }

  /** @private */
  render() {
    const { label, min, max, step } = this.params;
    const content = `
      <span class="label">${label}</span>
      <div class="inner-wrapper">
        ${elements.arrowLeft}
        <input class="number" type="number" min="${min}" max="${max}" step="${step}" value="${this._value}" />
        ${elements.arrowRight}
      </div>
    `;

    this.$el = super.render();
    this.$el.classList.add('align-small');
    this.$el.innerHTML = content;

    this.$prev = this.$el.querySelector('.arrow-left');
    this.$next = this.$el.querySelector('.arrow-right');
    this.$number = this.$el.querySelector('input[type="number"]');

    this._bindEvents();

    return this.$el;
  }

  /** @private */
  _bindEvents() {
    this.$prev.addEventListener('click', (e) => {
      const step = this.params.step;
      const decimals = step.toString().split('.')[1];
      const exp = decimals ? decimals.length : 0;
      const mult = Math.pow(10, exp);

      const intValue = Math.floor(this._value * mult + 0.5);
      const intStep = Math.floor(step * mult + 0.5);
      const value = (intValue - intStep) / mult;

      this._propagate(value);
    }, false);

    this.$next.addEventListener('click', (e) => {
      const step = this.params.step;
      const decimals = step.toString().split('.')[1];
      const exp = decimals ? decimals.length : 0;
      const mult = Math.pow(10, exp);

      const intValue = Math.floor(this._value * mult + 0.5);
      const intStep = Math.floor(step * mult + 0.5);
      const value = (intValue + intStep) / mult;

      this._propagate(value);
    }, false);

    this.$number.addEventListener('change', (e) => {
      let value = this.$number.value;
      value = this._isIntStep ? parseInt(value, 10) : parseFloat(value);
      value = Math.min(this.params.max, Math.max(this.params.min, value));

      this._propagate(value);
    }, false);
  }

  /** @private */
  _propagate(value) {
    if (value === this._value) { return; }

    this._value = value;
    this.$number.value = value;

    this.executeListeners(this._value);
  }
}

export default NumberBox;
