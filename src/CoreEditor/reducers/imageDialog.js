/**
 * Created by michbil on 16.07.17.
 */

import {
  IMAGE_DIALOG_OPEN,
  IMAGE_DIALOG_CLOSE,
  IMAGE_DIALOG_PREVIEW_START,
  IMAGE_DIALOG_PREVIEW_FAILED,
  IMAGE_DIALOG_PREVIEW_SUCCESS,
} from '../actions/imagedialog';

const defaultState = {
  titleValue: '',
  urlValue: '',
  descValue: '',
  showDialog: false,
  previewBusy: false,
};

export function imageDialogReducer(state = defaultState, action) {
  const {
    titleValue, urlValue, descValue, linkEntityKey,
  } = action;
  switch (action.type) {
    case IMAGE_DIALOG_OPEN:
      return {
        ...state,
        showDialog: true,
        titleValue,
        urlValue,
        descValue,
        linkEntityKey,
      };
    case IMAGE_DIALOG_PREVIEW_START:
      return { ...state, previewBusy: true };
    case IMAGE_DIALOG_PREVIEW_SUCCESS:
    case IMAGE_DIALOG_PREVIEW_FAILED:
      return { ...state, previewBusy: false };
    case IMAGE_DIALOG_CLOSE:
      return { showDialog: false };

    default:
      return state;
  }
}

export default imageDialogReducer;
