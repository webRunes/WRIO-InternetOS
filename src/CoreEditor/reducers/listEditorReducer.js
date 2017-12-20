/**
 * Created by michbil on 16.07.17.
 */

import {
  LIST_ELEMENT_ADD,
  LIST_EDIT_START,
  LIST_ELEMENT_CHANGE,
  LIST_ELEMENT_DELETE,
  DOWNLOAD_PREVIEW_SUCCESS,
  DOWNLOAD_PREVIEW_START,
  DOWNLOAD_PREVIEW_FAILURE,
} from '../actions/listEditorActions';

const defaultState = null;

function findElementWithKey(elements, elementKey) {
  return elements.filter(e => e.key === elementKey)[0];
}

const replaceElementWithKey = (elements, element, key) =>
  elements.map(el => (el.key === key ? element : el));

const mergeElementDataWithKey = (elements, data, key) =>
  elements.map(el => (el.key === key ? { ...el, ...data } : el));

let i = 0;

const importJsonList = jsonList =>
  jsonList.blocks[0].children.map(el => ({ ...el.data, key: i++ }));

export function coverDialogReducer(state = defaultState, action) {
  switch (action.type) {
    case 'NEW_LIST': {
      return [];
    }
    case 'GOT_JSON_LD_DOCUMENT': {
      console.log(action.data.isList());
      if (action.data && action.data.isList()) {
        return importJsonList(action.data);
      }
      return state;
    }
    case LIST_ELEMENT_ADD: {
      return [...state, { ...action.data, key: i++ }];
    }
    case LIST_ELEMENT_CHANGE: {
      return mergeElementDataWithKey(state, action.data, action.key);
    }
    case DOWNLOAD_PREVIEW_START: {
      return mergeElementDataWithKey(state, { loading: true }, action.key);
    }
    case DOWNLOAD_PREVIEW_FAILURE: {
      return mergeElementDataWithKey(state, { loading: false }, action.key);
    }
    case DOWNLOAD_PREVIEW_SUCCESS: {
      return mergeElementDataWithKey(state, { ...action.data, loading: false }, action.key);
    }

    case LIST_ELEMENT_DELETE:
      return state;
    default:
      return state;
  }
}

export default coverDialogReducer;
