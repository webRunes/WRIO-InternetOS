import request from 'superagent';
import { destroy } from 'redux-form';
/* image dialog */

import mkActions from '../actions/indexActions';

const { createNewTicket, editTicket } = mkActions('MAIN');

export const TICKET_DIALOG_OPEN = 'TICKET_DIALOG_OPEN';
export const TICKET_DIALOG_CLOSE = 'TICKET_DIALOG_CLOSE';
export const TICKET_DIALOG_PREVIEW_START = 'TICKET_DIALOG_PREVIEW_START';
export const TICKET_DIALOG_PREVIEW_SUCCESS = 'TICKET_DIALOG_PREVIEW_SUCCESS';
export const TICKET_DIALOG_PREVIEW_FAILED = 'TICKET_DIALOG_PREVIEW_FAILED';

export function openTicketDialog(titleValue, urlValue, descValue, image, linkEntityKey = null) {
  return {
    type: TICKET_DIALOG_OPEN,
    titleValue,
    urlValue,
    descValue,
    image,
    linkEntityKey,
  };
}

export const closeDialog = () => (dispatch) => {
  dispatch({
    type: TICKET_DIALOG_CLOSE,
  });
  dispatch(destroy('ticketDialog')); // destroy form manually
};

export const submitDialog = values => (dispatch, getState) => {
  const { linkEntityKey } = getState().ticketDialog;
  if (linkEntityKey !== null) {
    dispatch(editTicket(values.title, values.url, values.description, values.image, linkEntityKey));
  } else {
    dispatch(createNewTicket(values.title, values.url, values.description, values.image));
  }

  dispatch(closeDialog());
};
