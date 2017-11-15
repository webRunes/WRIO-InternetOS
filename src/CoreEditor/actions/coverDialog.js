import request from 'superagent';
import LdJsonDocument from 'base/jsonld/LdJsonDocument.js';
import DraftExporter from '../DraftExporter';
import DraftToJSON from '../DraftConverters/cover/DraftToJSON';
import { replaceCovers } from 'base/actions/actions';
import { publishCover } from './publishActions';
/* image dialog */

export const COVER_DIALOG_OPEN = 'COVER_DIALOG_OPEN';
export const COVER_DIALOG_CLOSE = 'COVER_DIALOG_CLOSE';
const DEFAULT_COVER = 'https://webrunes.com/img/cover1.png';

const emptyCover = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Covers for my blog',
  itemListElement: [
    {
      '@type': 'ImageObject',
      contentUrl: DEFAULT_COVER,
      name: 'Cover',
      text: [' '],
    },
  ],
};

export function openCoverDialog(cover = emptyCover) {
  return {
    type: COVER_DIALOG_OPEN,
    cover,
  };
}

export function closeCoverDialog() {
  return {
    type: COVER_DIALOG_CLOSE,
  };
}
const coverTemplate = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Covers for my blog',
  itemListElement: [],
};

export function saveCovers(editorState, imageUrl) {
  return (dispatch) => {
    const coverDocument = new LdJsonDocument([coverTemplate]);
    const exporter = new DraftExporter(coverDocument);
    const html = exporter.coverDraftToHtml(editorState.getCurrentContent(), imageUrl);
    dispatch(replaceCovers(coverDocument));
    dispatch(publishCover(html));
    dispatch(closeCoverDialog());
  };
}
