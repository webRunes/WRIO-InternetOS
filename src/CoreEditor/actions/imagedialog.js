import request from 'superagent';
import { destroy } from 'redux-form';
/* image dialog */

import mkActions from '../actions/indexActions';

const { createNewImage, editImage } = mkActions('MAIN');

export const IMAGE_DIALOG_OPEN = 'IMAGE_DIALOG_OPEN';
export const IMAGE_DIALOG_CLOSE = 'IMAGE_DIALOG_CLOSE';
export const IMAGE_DIALOG_PREVIEW_START = 'IMAGE_DIALOG_PREVIEW_START';
export const IMAGE_DIALOG_PREVIEW_SUCCESS = 'IMAGE_DIALOG_PREVIEW_SUCCESS';
export const IMAGE_DIALOG_PREVIEW_FAILED = 'IMAGE_DIALOG_PREVIEW_FAILED';

export function openImageDialog(titleValue, urlValue, descValue, linkEntityKey = null) {
  return {
    type: IMAGE_DIALOG_OPEN,
    titleValue,
    urlValue,
    descValue,
    linkEntityKey,
  };
}

export const closeDialog = () => (dispatch) => {
  dispatch({
    type: IMAGE_DIALOG_CLOSE,
  });
  dispatch(destroy('imageDialog')); // destroy form manually
};

export const submitDialog = values => (dispatch, getState) => {
  const { linkEntityKey } = getState().imageDialog;
  if (linkEntityKey !== null) {
    dispatch(editImage(values.title, values.url, values.desc, linkEntityKey));
  } else {
    dispatch(createNewImage(values.title, values.url, values.desc));
  }

  dispatch(closeDialog());
};
