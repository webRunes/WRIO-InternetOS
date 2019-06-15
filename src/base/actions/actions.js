/* @flow */
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import TableOfContents, { MenuItem, extractPageNavigation } from 'base/utils/tocnavigation';
import getHttp from 'base/utils/request';
import { requestHashUpdate } from 'base/actions/hashUpdateHook';
const firstRoute = require('./first_route');
const setUrlWithHash = require('../utils/set_url_with_hash');

export const ADD_COVER = 'ADD_COVER';
export const REPLACE_COVERS = 'REPLACE_COVERS';
export const SELECT_COVER = 'SELECT_COVER';
export const PRESS_COVER_BUTTON = 'PRESS_COVER_BUTTON';
export const GOT_JSON_LD_DOCUMENT = 'GOT_JSON_LD_DOCUMENT';
export const DOWNLOADED_EXTERNAL = 'DOWNLOADED_EXTERNAL';
export const GOT_EXTERNAL = 'GOT_EXTERNAL';
export const GOT_FEED = 'GOT_FEED';
export const LOGIN_MESSAGE = 'LOGIN_MESSAGE';
export const MY_LIST_READY = 'MY_LIST_READY';
export const TAB_CLICK = 'TAB_CLICK';
export const NAVIGATE_ARTICLE_HASH = 'NAVIGATE_ARTICLE_HASH';
export const GET_AUTHOR_DATA = 'GET_AUTHOR_DATA';

export function addCover(coverObj: Object, coverDoc: LdJsonDocument) {
  return {
    type: ADD_COVER,
    coverObj,
    coverDoc,
  };
}

export function replaceCovers(covers: LdJsonDocument) {
  return {
    type: REPLACE_COVERS,
    covers,
  };
}

export function selectCover(cover) {
  return {
    type: SELECT_COVER,
    cover,
  };
}

export function pressCoverButton(cover: Object) {
  return {
    type: PRESS_COVER_BUTTON,
    cover,
  };
}

export const loginMessage = (msg: Object) => ({
  type: LOGIN_MESSAGE,
  msg,
});

export function tabClick(tabKey) {
  return {
    type: TAB_CLICK,
    tabKey,
  };
}

export function gotExternal(index: number, url, lists: LdJsonDocument) {
  return {
    type: GOT_EXTERNAL,
    lists,
    url,
    index,
  };
}

export function gotFeed(url, feed: LdJsonDocument) {
  return {
    type: GOT_FEED,
    payload: {
    feed,
    url
    },
  };
}

export function gotJSON_LD_Document(data: LdJsonDocument, url: string, toc: TableOfContents) {
  return (dispatch) => {
    dispatch({
      type: GOT_JSON_LD_DOCUMENT,
      data,
      url,
      toc,
    });
    const author = data && data.getProperty('author');
    if (author) {
      dispatch(getAuthor(author));
    } else {
      dispatch({
        // dispatch with undefined, so we know that page has no author
        type: GET_AUTHOR_DATA,
        noAuthor: true,
      });
    }
  };
}

export function getAuthor(author: string) {
  return async (dispatch: Function) => {
    try {
      const remoteDocument = await getHttp(author);
      dispatch({
        type: GET_AUTHOR_DATA,
        authorData: remoteDocument,
      });
    } catch (e) {
      dispatch({ type: 'ERROR_NO_AUTHOR' });
    }
  };
}

export const loadExternal = (index: number, url: string) => async (dispatch: Function) => {
  if (url) {
    try {
      const doc: LdJsonDocument = await getHttp(url);
      dispatch(gotExternal(index, url, doc));
    } catch (err) {
      console.log('Unable to download external $(url}');
    }
  }
};

export const loadFeed = (url: string) => async (dispatch: Function) => {
  if (url) {
    try {
      const doc: LdJsonDocument = await getHttp(url);
      dispatch(gotFeed(url, doc));
    } catch (err) {
      console.log('Unable to download feed $(url}');
    }
  }
};

export function loadDocumentWithData(data: LdJsonDocument, url: string) {
  return (dispatch: Function) => {
    const firstActive = firstRoute();
    const toc = extractPageNavigation(data, firstActive);
    dispatch(gotJSON_LD_Document(data, url, toc));

    toc.covers.map(async (cover: Object) => {
      if (cover.url) {
        try {
          const doc: LdJsonDocument = await getHttp(cover.url);
          dispatch(addCover(cover, doc));
        } catch (err) {
          console.log(`Unable to download cover ${cover.url}`);
        }
      }
    });

    if(toc.external.length) {
    dispatch(loadExternal(0,toc.external[0].url));
    dispatch(loadFeed(toc.external[1].url));
    }
  };
}

export function navigateArticleHash(hash: string) {
  setUrlWithHash(hash);
  return {
    type: NAVIGATE_ARTICLE_HASH,
    hash,
  };
}