export function findElementWithKey(elements, elementKey) {
  return elements.filter(e => e.key === elementKey)[0];
}

export const replaceElementWithKey = (elements, element, key) =>
  elements.map(el => (el.key === key ? element : el));

export const mergeElementDataWithKey = (elements, data, key) =>
  elements.map(el => (el.key === key ? { ...el, ...data } : el));
