import mkActions from './indexActions';
import { destroy } from 'redux-form';

const mainActions = mkActions('MAIN');
import * as coverActions from './coverActions';
/* link dialog actions */

export const LINK_DIALOG_OPEN = 'LINK_DIALOG_OPEN';
export const LINK_DIALOG_CLOSE = 'LINK_DIALOG_CLOSE';
export const LINK_DIALOG_SUBMIT = 'LINK_DIALOG_SUBMIT';
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
  const
    state = getState(),
    linkDialog = state.linkDialog,
    linkEntityKey = linkDialog.linkEntityKey,
    actions = state.coverDialog.showDialog
      ? coverActions
      : mainActions;

  dispatch({
    type: LINK_DIALOG_SUBMIT,
    urlValue: values.url
  });
  dispatch(
    linkEntityKey !== null
      ? actions.editLink(linkDialog.titleValue, values.url, linkDialog.descValue, linkEntityKey)
      : actions.createNewLink(linkDialog.titleValue, values.url, linkDialog.descValue)
  )
};
