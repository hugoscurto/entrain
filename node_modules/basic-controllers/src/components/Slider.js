import BaseComponent from './BaseComponent';
import display from '../mixins/display';
import * as guiComponents from 'gui-components';

/** @module basic-controllers */

const defaults = {
  label: '&nbsp;',
  min: 0,
  max: 1,
  step: 0.01,
  default: 0,
  unit: '',
  size: 'medium',
  container: null,
  callback: null,
}

/**
 * Slider controller.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Number} [config.min=0] - Minimum value.
 * @param {Number} [config.max=1] - Maximum value.
 * @param {Number} [config.step=0.01] - Step between consecutive values.
 * @param {Number} [config.default=0] - Default value.
 * @param {String} [config.unit=''] - Unit of the value.
 * @param {'small'|'medium'|'large'} [config.size='medium'] - Size of the
 *  slider.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const slider = new controllers.Slider({
 *   label: 'My Slider',
 *   min: 20,
 *   max: 1000,
 *   step: 1,
 *   default: 537,
 *   unit: 'Hz',
 *   size: 'large',
 *   container: '#container',
 *   callback: (value) => console.log(value),
 * });
 */
class Slider extends display(BaseComponent) {
  constructor(config) {
    super('slider', defaults, config);

    this._value = this.params.default;
    this._onSliderChange = this._onSliderChange.bind(this);

    super.initialize();
  }

  /**
   * Current value.
   * @type {Number}
   */
  set value(value) {
    this._value = value;

    if (this.$number && this.$range) {
      this.$number.value = this.value;
      this.slider.value = this.value;
    }
  }

  get value() {
    return this._value;
  }

  /** @private */
  render() {
    const { label, min, max, step, unit, size } = this.params;
    const content = `
      <span class="label">${label}</span>
      <div class="inner-wrapper">
        <div class="range"></div>
        <div class="number-wrapper">
          <input type="number" class="number" min="${min}" max="${max}" step="${step}" value="${this._value}" />
          <span class="unit">${unit}</span>
        </div>
      </div>`;

    this.$el = super.render(this.type);
    this.$el.innerHTML = content;
    this.$el.classList.add(`slider-${size}`);

    this.$range = this.$el.querySelector('.range');
    this.$number = this.$el.querySelector(`input[type="number"]`);

    this.slider = new guiComponents.Slider({
      container: this.$range,
      callback: this._onSliderChange,
      min: min,
      max: max,
      step: step,
      default: this._value,
      foregroundColor: '#ababab',
    });

    this._bindEvents();

    return this.$el;
  }

  /** @private */
  resize() {
    super.resize();

    const { width, height } = this.$range.getBoundingClientRect();
    this.slider.resize(width, height);
  }

  /** @private */
  _bindEvents() {
    this.$number.addEventListener('change', () => {
      const value = parseFloat(this.$number.value);
      // the slider propagates the value
      this.slider.value = value;
      this._value = value;
    }, false);
  }

  /** @private */
  _onSliderChange(value) {
    this.$number.value = value;
    this._value = value;

    this.executeListeners(this._value);
  }
}

export default Slider;
