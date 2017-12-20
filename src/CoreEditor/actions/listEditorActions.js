import getHttp from 'base/utils/request';
import { ValidURL } from '../utils/url';
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import { loadDocumentWithData } from 'base/actions/actions';

export const DOWNLOAD_PREVIEW_START = 'DOWNLOAD_PREVIEW_START';
export const DOWNLOAD_PREVIEW_SUCCESS = 'DOWNLOAD_PREVIEW_SUCCESS';
export const DOWNLOAD_PREVIEW_FAILURE = 'DOWNLOAD_PREVIEW_FAILURE';

export const LIST_ELEMENT_ADD = 'LIST_ELEMENT_ADD';
export const LIST_ELEMENT_DELETE = 'LIST_ELEMENT_DELETE';
export const LIST_ELEMENT_CHANGE = 'LIST_ELEMENT_CHANGE';
export const LIST_EDIT_START = 'LIST_EDIT_START';

export const mk = (e, data, key) => ({ data, key, type: e });

export const addElement = data => mk(LIST_ELEMENT_ADD, data);
export const changeElement = (data, key) => mk(LIST_ELEMENT_CHANGE, data, key);

export const fetchPreview = (url, key) => async (dispatch) => {
  const validUrl = ValidURL(url);
  console.log(url, validUrl);
  if (validUrl === null) {
    dispatch(mk(DOWNLOAD_PREVIEW_FAILURE));
    return;
  }
  dispatch(mk(DOWNLOAD_PREVIEW_START, null, key));
  try {
    const { data } = await getHttp(url);
    const doc = new LdJsonDocument(data);
    const about = doc.getElementOfType('Article').about || '';
    const name = doc.getElementOfType('Article').name || '';
    dispatch({
      type: DOWNLOAD_PREVIEW_SUCCESS,
      data: { name, about },
      key,
    });
  } catch (e) {
    dispatch(mk(DOWNLOAD_PREVIEW_FAILURE));
  }
};
