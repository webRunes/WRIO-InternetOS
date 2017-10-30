import request from 'superagent';
import JSONDocument from '../JSONDocument';
import { replaceCovers } from 'base/actions/actions';
/* image dialog */

export const COVER_DIALOG_OPEN = 'COVER_DIALOG_OPEN';
export const COVER_DIALOG_CLOSE = 'COVER_DIALOG_CLOSE';

export function openCoverDialog(cover) {
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

export function saveCovers(editorState, imageUrl) {
  return (dispatch) => {
    const doc = new JSONDocument();
    doc.createArticle('', '', '');
    const content = editorState.getCurrentContent();
    console.log(content);
    const jsn = doc.draftToJson(content);
    const coverElement = makeCoverElement(imageUrl, jsn.name, jsn.articleBody, jsn.mentions);
    const cover = wrapCovers([coverElement]);
    console.log(cover);
    dispatch(replaceCovers(new JSONDocument([cover])));
    dispatch(closeCoverDialog());
  };
}

const coversTemplate = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Covers for my blog',
  itemListElement: [],
};

function makeCoverElement(url, name, text, mentions) {
  return {
    '@type': 'ImageObject',
    contentUrl: url,
    name,
    text,
    mentions,
  };
}
function wrapCovers(covers) {
  return {
    ...coversTemplate,
    itemListElement: covers,
  };
}
