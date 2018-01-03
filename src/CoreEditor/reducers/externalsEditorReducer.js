/**
 * Created by michbil on 16.07.17.
 */

import {
  LIST_ELEMENT_ADD,
  LIST_EDIT_START,
  LIST_ELEMENT_CHANGE,
  LIST_ELEMENT_DELETE,
} from '../actions/listEditorActions';

import { GOT_EXTERNAL } from 'base/actions/actions';
import { EXTERNAL_ADD, EXTERNAL_CHANGED } from 'CoreEditor/actions/externalsEditor';

import {
  findElementWithKey,
  replaceElementWithKey,
  mergeElementDataWithKey,
} from '../utils/reducerTools.js';

const defaultState = [];

export function externalsEditorReducer(state = defaultState, action) {
  switch (action.type) {
    case GOT_EXTERNAL: {
      const externals = [...state];
      externals[action.index] = action.url;
      return externals;
    }
    case EXTERNAL_CHANGED: {
      const externals = [...state];
      externals[action.index] = action.url;
      return externals;
    }
    case EXTERNAL_ADD:
      return [...state, ''];

    default:
      return state;
  }
}

export default externalsEditorReducer;
