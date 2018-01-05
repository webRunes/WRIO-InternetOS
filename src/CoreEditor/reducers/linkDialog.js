/**
 * Created by michbil on 16.07.17.
 */

import { combineReducers } from 'redux';
import { LINK_DIALOG_URL_CHANGE, LINK_DIALOG_OPEN, LINK_DIALOG_CLOSE } from '../actions/linkdialog';

const defaultState = {
  titleValue: '',
  urlValue: '',
  descValue: '',
  showDialog: false,
  previewBusy: false,
};

export function linkDialogReducer(state = defaultState, action) {
  switch (action.type) {
    case LINK_DIALOG_OPEN: {
      const {
        titleValue, urlValue, descValue, linkEntityKey,
      } = action;
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
    }

    case LINK_DIALOG_CLOSE:
      return { showDialog: false };

    default:
      return state;
  }
}

export default linkDialogReducer;
