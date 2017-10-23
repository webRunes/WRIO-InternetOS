import request from 'superagent';
/* image dialog */

export const COVER_DIALOG_OPEN = 'COVER_DIALOG_OPEN';
export const COVER_DIALOG_CLOSE = 'COVER_DIALOG_CLOSE';

export function openCoverDialog() {
  return {
    type: COVER_DIALOG_OPEN,
  };
}

export function closeCoverDialog() {
  return {
    type: COVER_DIALOG_CLOSE,
  };
}
