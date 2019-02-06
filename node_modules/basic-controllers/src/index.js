import * as _styles from './utils/styles';
export const styles = _styles;

/** @module basic-controllers */

// expose for plugins
import _BaseComponent from './components/BaseComponent';
export const BaseComponent = _BaseComponent;

// components
export { default as Group } from './components/Group';
export { default as DragAndDrop } from './components/DragAndDrop';
export { default as NumberBox } from './components/NumberBox';
export { default as SelectButtons } from './components/SelectButtons';
export { default as SelectList } from './components/SelectList';
export { default as Slider } from './components/Slider';
export { default as Text } from './components/Text';
export { default as Title } from './components/Title';
export { default as Toggle } from './components/Toggle';
export { default as TriggerButtons } from './components/TriggerButtons';

// factory
export { default as create } from './factory';
// display
export { setTheme  } from './mixins/display';

/**
 * Disable default styling (expect a broken ui)
 */
export function disableStyles() {
  _styles.disable();
};
