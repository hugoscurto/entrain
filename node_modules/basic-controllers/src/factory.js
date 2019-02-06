import BaseComponent from './components/BaseComponent';
import Group from './components/Group';
import NumberBox from './components/NumberBox';
import SelectButtons from './components/SelectButtons';
import SelectList from './components/SelectList';
import Slider from './components/Slider';
import Text from './components/Text';
import Title from './components/Title';
import Toggle from './components/Toggle';
import TriggerButtons from './components/TriggerButtons';

import container from './mixins/container';

// map type names to constructors
const typeCtorMap = {
  'group': Group,
  'number-box': NumberBox,
  'select-buttons': SelectButtons,
  'select-list': SelectList,
  'slider': Slider,
  'text': Text,
  'title': Title,
  'toggle': Toggle,
  'trigger-buttons': TriggerButtons,
};

const defaults = {
  container: 'body',
};

class Control extends container(BaseComponent) {
  constructor(config) {
    super('control', defaults, config);

    let $container = this.params.container;

    if (typeof $container === 'string')
      $container = document.querySelector($container);

    this.$container = $container;
  }
}

/** @module basic-controllers */

/**
 * Create a whole control surface from a json definition.
 *
 * @param {String|Element} container - Container of the controls.
 * @param {Object} - Definitions for the controls.
 * @return {Object} - A `Control` instance that behaves like a group without graphic.
 * @static
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const definitions = [
 *   {
 *     id: 'my-slider',
 *     type: 'slider',
 *     label: 'My Slider',
 *     size: 'large',
 *     min: 0,
 *     max: 1000,
 *     step: 1,
 *     default: 253,
 *   }, {
 *     id: 'my-group',
 *     type: 'group',
 *     label: 'Group',
 *     default: 'opened',
 *     elements: [
 *       {
 *         id: 'my-number',
 *         type: 'number-box',
 *         default: 0.4,
 *         min: -1,
 *         max: 1,
 *         step: 0.01,
 *       }
 *     ],
 *   }
 * ];
 *
 * const controls = controllers.create('#container', definitions);
 *
 * // add a listener on all the component inside `my-group`
 * controls.addListener('my-group', (id, value) => console.log(id, value));
 *
 * // retrieve the instance of `my-number`
 * const myNumber = controls.getComponent('my-group/my-number');
 */
function create(container, definitions) {

  function _parse(container, definitions) {
    definitions.forEach((def, index) => {
      const type = def.type;
      const ctor = typeCtorMap[type];
      const config = Object.assign({}, def);

      //
      config.container = container;
      delete config.type;

      const component = new ctor(config);

      if (type === 'group')
        _parse(component, config.elements);
    });
  };

  const _root = new Control({ container: container });
  _parse(_root, definitions);

  return _root;
}

export default create;
