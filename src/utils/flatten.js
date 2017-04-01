// @flow

/**
 * Function for flattening a nested array.
 */
export default function flatten(array: Array<*>) {
  return array.reduce((acc, element) => {
    if (element instanceof Array) {
      flatten(element).forEach(e => acc.push(e));
    } else {
      acc.push(element);
    }
    return acc;
  }, []);
}
