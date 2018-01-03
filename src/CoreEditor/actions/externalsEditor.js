export const EXTERNAL_CHANGED = 'EXTERNAL_CHANGED';
export const EXTERNAL_ADD = 'EXTERNAL_ADD';

export function externalChanged(index, url) {
  return {
    type: EXTERNAL_CHANGED,
    url,
    index,
  };
}

export function externalAdd() {
  return {
    type: EXTERNAL_ADD,
  };
}
