/**
 * Created by michbil on 16.07.17.
 */

import { combineReducers } from 'redux';
import {
  LINK_DIALOG_URL_CHANGE,
  LINK_DIALOG_OPEN,
  LINK_DIALOG_CLOSE,
  LINK_DIALOG_REMOVE,
  LINK_DIALOG_SUBMIT
} from '../actions/linkdialog';

const defaultState = {
  titleValue: '',
  urlValue: '',
  descValue: '',
  showDialog: false,
  previewBusy: false,
};

export function linkDialogReducer(state = defaultState, action) {
  switch (action.type) {
    case LINK_DIALOG_OPEN:
      return {
        ...state,
        showDialog: true,
        titleValue: action.titleValue,
        urlValue: action.urlValue,
        descValue: action.descValue,
        linkEntityKey: action.linkEntityKey
      }
    case LINK_DIALOG_CLOSE:
      return {
        ...state,
        showDialog: false
      }
    case LINK_DIALOG_REMOVE:
      return defaultState
    case LINK_DIALOG_SUBMIT:
      return {
        ...state,
        showDialog: false,
        urlValue: action.urlValue
      }

    default:
      return state;
  }
}

export default linkDialogReducer;
