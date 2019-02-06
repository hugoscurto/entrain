import * as styles from '../utils/styles';

/** @module basic-controllers */

// default theme
let theme = 'light';
// set of the instanciated controllers
const controllers = new Set();


/**
 * Change the theme of the controllers, currently 3 themes are available:
 *  - `'light'` (default)
 *  - `'grey'`
 *  - `'dark'`
 *
 * @param {String} theme - Name of the theme.
 */
export function setTheme(value) {
  controllers.forEach((controller) => controller.$el.classList.remove(theme));
  theme = value;
  controllers.forEach((controller) => controller.$el.classList.add(theme));
}

/**
 * display mixin - components with DOM
 * @private
 */
const display = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);

    // insert styles and listen window resize when the first controller is created
    if (controllers.size === 0) {
      styles.insertStyleSheet();

      window.addEventListener('resize', function() {
        controllers.forEach((controller) => controller.resize());
      });
    }

    controllers.add(this);
  }

  initialize() {
    let $container = this.params.container;

    if ($container) {
      // css selector
      if (typeof $container === 'string') {
        $container = document.querySelector($container);
      // group
      } else if ($container.$container) {
        // this.group = $container;
        $container.elements.add(this);
        $container = $container.$container;
      }

      $container.appendChild(this.render());
      setTimeout(() => this.resize(), 0);
    }
  }

  /** @private */
  render() {
    this.$el = document.createElement('div');
    this.$el.classList.add(styles.ns, theme, this.type);

    return this.$el;
  }

  /** @private */
  resize() {
    const boundingRect = this.$el.getBoundingClientRect();
    const width = boundingRect.width;
    const method = width > 600 ? 'remove' : 'add';

    this.$el.classList[method]('small');
  }
}

export default display;
