"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flatten;


/**
 * Function for flattening a nested array.
 */
function flatten(array) {
  return array.reduce(function (acc, element) {
    if (element instanceof Array) {
      flatten(element).forEach(function (e) {
        return acc.push(e);
      });
    } else {
      acc.push(element);
    }
    return acc;
  }, []);
}
//# sourceMappingURL=flatten.js.map