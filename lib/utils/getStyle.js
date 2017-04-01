"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getStyle;


/**
 * Get style of the given properties
 */
function getStyle(element, properties) {
  var cssStyleDeclaration = window.getComputedStyle(element);
  return properties.reduce(function (acc, property) {
    acc[property] = cssStyleDeclaration.getPropertyValue(property);
    return acc;
  }, {});
}
//# sourceMappingURL=getStyle.js.map