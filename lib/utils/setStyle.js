"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setStyle;


/**
 * Set style to the element.
 */
function setStyle(element, style) {
  Object.keys(style).forEach(function (key) {
    element.style.setProperty(key, style[key]);
  });
}
//# sourceMappingURL=setStyle.js.map