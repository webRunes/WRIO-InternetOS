import mkActions from '../actions/indexActions';
import { destroy } from 'redux-form';

const { createNewLink, editLink, removeEntity } = mkActions('MAIN');
/* link dialog actions */

export const LINK_DIALOG_OPEN = 'LINK_DIALOG_OPEN';
export const LINK_DIALOG_CLOSE = 'LINK_DIALOG_CLOSE';
export const REQUEST_PREVIEW = 'REQUEST_PREVIEW';

export function openLinkDialog(titleValue, urlValue, descValue, linkEntityKey = null) {
  return {
    type: LINK_DIALOG_OPEN,
    titleValue,
    urlValue,
    descValue,
    linkEntityKey,
  };
}

export const closeDialog = () => (dispatch) => {
  dispatch({
    type: LINK_DIALOG_CLOSE,
  });
  dispatch(destroy('linkDialog')); // destroy form manually
};

export const submitDialog = values => (dispatch, getState) => {
  const { linkEntityKey } = getState().linkDialog;
  if (linkEntityKey !== null) {
    dispatch(editLink(values.title, values.url, values.desc, linkEntityKey));
  } else {
    dispatch(createNewLink(values.title, values.url, values.desc));
  }

  dispatch(closeDialog());
};
