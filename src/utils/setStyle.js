// @flow

/**
 * Set style to the element.
 */
export default function setStyle(element: HTMLElement, style: { [string]: string }) {
  Object.keys(style).forEach(key => {
    element.style.setProperty(key, style[key]);
  });
}
