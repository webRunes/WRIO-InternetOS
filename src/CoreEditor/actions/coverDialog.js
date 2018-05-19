import request from 'superagent';
import LdJsonDocument from 'base/jsonld/LdJsonDocument.js';
import DraftExporter from '../DraftExporter';
import DraftToJSON from '../DraftConverters/cover/DraftToJSON';
import { replaceCovers } from 'base/actions/actions';
import { publishCover } from './publishActions';

export const COVER_DIALOG_IMAGE_URL_CHANGED = 'COVER_DIALOG_IMAGE_URL_CHANGED';
export const COVER_DIALOG_OPEN = 'COVER_DIALOG_OPEN';
export const COVER_DIALOG_CLOSE = 'COVER_DIALOG_CLOSE';
export const COVER_DIALOG_SUBMIT = 'COVER_DIALOG_SUBMIT';

export const COVER_TAB_CHANGE = 'COVER_TAB_CHANGE';
export const COVER_NEW_TAB = 'COVER_NEW_TAB';
export const COVER_DELETE_TAB = 'COVER_DELETE_TAB';

export function coverDialogImageUrlChanged(url) {
  return {
    type: COVER_DIALOG_IMAGE_URL_CHANGED,
    url: url
  }
}
export function newCover() {
  return {
    type: COVER_NEW_TAB
  }
}

export function coverTabChange(tabKey) {
  return {
    type: COVER_TAB_CHANGE,
    tabKey
  }
}

export function coverTabDelete(tabKey) {
  return {
    type: COVER_DELETE_TAB,
    tabKey
  }
}

export function openCoverDialog() {
  return {
    type: COVER_DIALOG_OPEN
  }
}

export function closeCoverDialog() {
  return {
    type: COVER_DIALOG_CLOSE
  }
}

export function submitCoverDialog() {
  return {
    type: COVER_DIALOG_SUBMIT
  }
}


const coverTemplate = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Covers for my blog',
  itemListElement: []
};

export function saveCovers() {
  return (dispatch, getState) => {
    const { coverDialog } = getState();
    const { tabs, submit } = coverDialog;
    const deleteCover = !submit;
    const coverDocument = new LdJsonDocument([coverTemplate]);
    const exporter = new DraftExporter(coverDocument);
    const data = tabs.map(tab => ({
      // go through all tabs and extract image and contentState
      contentState: tab.editorState.getCurrentContent(),
      contentUrl: tab.imageUrl,
    }));

    const html = exporter.coverDraftToHtml(data);
    dispatch(publishCover(html, deleteCover));
  };
}
