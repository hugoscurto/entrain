import BaseComponent from './BaseComponent';
import display from '../mixins/display';
import container from '../mixins/container';
import * as elements from '../utils/elements';

/** @module basic-controllers */

const defaults = {
  legend: '&nbsp;',
  default: 'opened',
  container: null,
};

/**
 * Group of controllers.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the group.
 * @param {'opened'|'closed'} [config.default='opened'] - Default state of the
 *  group.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * // create a group
 * const group = new controllers.Group({
 *   label: 'Group',
 *   default: 'opened',
 *   container: '#container'
 * });
 *
 * // insert controllers in the group
 * const groupSlider = new controllers.Slider({
 *   label: 'Group Slider',
 *   min: 20,
 *   max: 1000,
 *   step: 1,
 *   default: 200,
 *   unit: 'Hz',
 *   size: 'large',
 *   container: group,
 *   callback: (value) => console.log(value),
 * });
 *
 * const groupText = new controllers.Text({
 *   label: 'Group Text',
 *   default: 'text input',
 *   readonly: false,
 *   container: group,
 *   callback: (value) => console.log(value),
 * });
 */
class Group extends container(display(BaseComponent)) {
  constructor(config) {
    super('group', defaults, config);

    this._states = ['opened', 'closed'];

    if (this._states.indexOf(this.params.default) === -1)
      throw new Error(`Invalid state "${value}"`);

    this._state = this.params.default;

    super.initialize();
  }

  /**
   * State of the group (`'opened'` or `'closed'`).
   * @type {String}
   */
  get value() {
    return this.state;
  }

  set value(state) {
    this.state = state;
  }

  /**
   * Alias for `value`.
   * @type {String}
   */
  get state() {
    return this._state;
  }

  set state(value) {
    if (this._states.indexOf(value) === -1)
      throw new Error(`Invalid state "${value}"`);

    this.$el.classList.remove(this._state);
    this.$el.classList.add(value);

    this._state = value;
  }


  /** @private */
  render() {
    let content = `
      <div class="group-header">
        ${elements.smallArrowRight}
        ${elements.smallArrowBottom}
        <span class="label">${this.params.label}</span>
      </div>
      <div class="group-content"></div>
    `;

    this.$el = super.render();
    this.$el.innerHTML = content;
    this.$el.classList.add(this._state);

    this.$header = this.$el.querySelector('.group-header');
    this.$container = this.$el.querySelector('.group-content');

    this._bindEvents();

    return this.$el;
  }

  /** @private */
  _bindEvents() {
    this.$header.addEventListener('click', () => {
      const state = this._state === 'closed' ? 'opened' : 'closed';
      this.state = state;
    });
  }
}

export default Group;
