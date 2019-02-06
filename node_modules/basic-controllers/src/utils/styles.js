import { name } from '../../package.json';
import styles from './styles-declarations.js';

export const ns = name;

const nsClass = `.${ns}`;
let _disabled = false;

export function disable() {
  _disabled = true;
}

export function insertStyleSheet() {
  if (_disabled) return;

  const $css = document.createElement('style');
  $css.setAttribute('data-namespace', ns);
  $css.type = 'text/css';

  if ($css.styleSheet)
    $css.styleSheet.cssText = styles;
  else
    $css.appendChild(document.createTextNode(styles));

  // insert before link or styles if exists
  const $link = document.head.querySelector('link');
  const $style = document.head.querySelector('style');

  if ($link)
    document.head.insertBefore($css, $link);
  else if ($style)
    document.head.insertBefore($css, $style);
  else
    document.head.appendChild($css);
}

