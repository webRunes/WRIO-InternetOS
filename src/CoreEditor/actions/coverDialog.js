import request from 'superagent';
import LdJsonDocument from 'base/jsonld/LdJsonDocument.js';
import DraftExporter from '../DraftExporter';
import DraftToJSON from '../DraftConverters/cover/DraftToJSON';
import { replaceCovers } from 'base/actions/actions';
import { publishCover } from './publishActions';

export const COVER_DIALOG_IMAGE_URL_CHANGED = 'COVER_DIALOG_IMAGE_URL_CHANGED';
export const COVER_DIALOG_OPEN = 'COVER_DIALOG_OPEN';
export const COVER_DIALOG_CLOSE = 'COVER_DIALOG_CLOSE';
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

const coverTemplate = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Covers for my blog',
  itemListElement: []
};

export function saveCovers() {
  return (dispatch, getState) => {
    const { tabs } = getState().coverDialog;
    const coverDocument = new LdJsonDocument([coverTemplate]);
    const exporter = new DraftExporter(coverDocument);
    const data = tabs.map(el => ({
      // go through all tabs and extract image and contentState
      contentState: el.editorState.getCurrentContent(),
      image: el.imageUrl,
    }));

    const html = exporter.coverDraftToHtml(data);
    dispatch(replaceCovers(coverDocument));
    dispatch(publishCover(html));
    dispatch(closeCoverDialog());
  };
}
