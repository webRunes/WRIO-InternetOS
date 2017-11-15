/**
 * Created by michbil on 16.07.17.
 */

import { combineReducers } from 'redux';
import {
  LINK_DIALOG_DESC_CHANGE,
  LINK_DIALOG_TITLE_CHANGE,
  LINK_DIALOG_URL_CHANGE,
  LINK_DIALOG_OPEN,
  LINK_DIALOG_CLOSE,
} from '../actions/linkdialog';

const defaultState = {
  titleValue: '',
  urlValue: '',
  descValue: '',
  showDialog: false,
  previewBusy: false,
};

export function linkDialogReducer(state = defaultState, action) {
  const {
    titleValue, urlValue, descValue, linkEntityKey,
  } = action;
  switch (action.type) {
    case LINK_DIALOG_OPEN:
      const ns = {
        ...state,
        showDialog: true,
        titleValue,
        urlValue,
        descValue,
        linkEntityKey,
      };
      console.log('OPEN', ns);
      return ns;

    case LINK_DIALOG_CLOSE:
      return { ...state, showDialog: false };
    case LINK_DIALOG_DESC_CHANGE:
      return { ...state, descValue };
    case LINK_DIALOG_TITLE_CHANGE:
      return { ...state, titleValue };
    case LINK_DIALOG_URL_CHANGE:
      return { ...state, urlValue };

    default:
      return state;
  }
}

export default linkDialogReducer;
