// @flow

/**
 * Get style of the given properties
 */
export default function getStyle(element: HTMLElement, properties: string[]): { [string]: string } {
  const cssStyleDeclaration = window.getComputedStyle(element);
  return properties.reduce((acc, property) => {
    acc[property] = cssStyleDeclaration.getPropertyValue(property);
    return acc;
  }, {});
}
