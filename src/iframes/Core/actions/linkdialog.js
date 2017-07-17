
/* image dialog */

export const LINK_DIALOG_OPEN = 'LINK_DIALOG_OPEN';
export const LINK_DIALOG_CLOSE = 'LINK_DIALOG_CLOSE';
export const LINK_DIALOG_TITLE_CHANGE = 'LINK_DIALOG_TITLE_CHANGE';
export const LINK_DIALOG_DESC_CHANGE = 'LINK_DIALOG_DESC_CHANGE';
export const LINK_DIALOG_URL_CHANGE = 'LINK_DIALOG_URL_CHANGE';
export const REQUEST_PREVIEW = 'REQUEST_PREVIEW';

export function openLinkDialog(titleValue, urlValue, descValue,linkEntityKey=null) {
    return {
        type: LINK_DIALOG_OPEN,
        titleValue,
        urlValue,
        descValue,
        linkEntityKey
    }
}

export function closeDialog() {
    return {
        type: LINK_DIALOG_CLOSE
    }
}

export const titleChange = (titleValue) => ({type:LINK_DIALOG_TITLE_CHANGE,titleValue});
export const urlChange = (urlValue) => ({type:LINK_DIALOG_URL_CHANGE,urlValue});
export const descChange = (descValue) => ({type:LINK_DIALOG_DESC_CHANGE,descValue});
