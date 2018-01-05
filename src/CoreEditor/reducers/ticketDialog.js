/**
 * Created by michbil on 16.07.17.
 */

import {
  TICKET_DIALOG_OPEN,
  TICKET_DIALOG_CLOSE,
  TICKET_DIALOG_PREVIEW_START,
  TICKET_DIALOG_PREVIEW_FAILED,
  TICKET_DIALOG_PREVIEW_SUCCESS,
} from '../actions/ticketdialog';

const defaultState = {
  titleValue: '',
  urlValue: '',
  descValue: '',
  showDialog: false,
  previewBusy: false,
};

export function imageDialogReducer(state = defaultState, action) {
  const {
    titleValue, urlValue, descValue, image, linkEntityKey,
  } = action;
  switch (action.type) {
    case TICKET_DIALOG_OPEN:
      return {
        ...state,
        showDialog: true,
        titleValue,
        urlValue,
        descValue,
        image,
        linkEntityKey,
      };
    case TICKET_DIALOG_PREVIEW_START:
      return { ...state, previewBusy: true };
    case TICKET_DIALOG_PREVIEW_SUCCESS:
    case TICKET_DIALOG_PREVIEW_FAILED:
      return { ...state, previewBusy: false };
    case TICKET_DIALOG_CLOSE:
      return { showDialog: false };

    default:
      return state;
  }
}

export default imageDialogReducer;
