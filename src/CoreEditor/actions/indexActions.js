import getHttp from 'base/utils/request';

import { getRegistredUser, getWidgetID } from '../webrunesAPI.js';
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import { loadDocumentWithData } from 'base/actions/actions';
import { Entity } from 'draft-js';
import { getTitle } from '../DraftExporter.js';

const RECEIVE_USER_DATA = 'RECEIVE_USER_DATA';
export const receiveUserData = function receiveUserData(data) {
  return {
    type: RECEIVE_USER_DATA,
    data,
  };
};

// use factory fuction for specific editorname, because we can have multiple editors in one document
export default function createActionsForEditor(editorName) {
  const REQUEST_DOCUMENT = `${editorName}REQUEST_DOCUMENT`;
  const RECEIVE_DOCUMENT = `${editorName}RECEIVE_DOCUMENT`;

  const CREATE_DOCUMENT = `${editorName}CREATE_DOCUMENT`;

  const GOT_ERROR = `${editorName}GOT_ERROR`;
  const EDITOR_CHANGED = `${editorName}EDITOR_CHANGED`;
  const CREATE_NEW_LINK = `${editorName}CREATE_NEW_LINK`;
  const CREATE_NEW_IMAGE = `${editorName}CREATE_NEW_IMAGE`;
  const REMOVE_ENTITY = `${editorName}REMOVE_ENTIRY`;
  const EDIT_LINK = `${editorName}EDIT_ENTITY`;
  const EDIT_IMAGE = `${editorName}EDIT_IMAGE`;

  const exports = {
    REQUEST_DOCUMENT,
    RECEIVE_DOCUMENT,
    RECEIVE_USER_DATA,
    CREATE_DOCUMENT,
    GOT_ERROR,
    EDITOR_CHANGED,
    CREATE_NEW_LINK,
    CREATE_NEW_IMAGE,
    REMOVE_ENTITY,
    EDIT_LINK,
    EDIT_IMAGE,
  };

  exports.requestDocument = function requestDocument() {
    return {
      type: REQUEST_DOCUMENT,
    };
  };

  exports.receiveDocument = function receiveDocument(data) {
    return {
      type: 'GOT_JSON_LD_DOCUMENT',
      data, // duplicate to fix wierd problems, FIXME
      document: data,
    };
  };

  exports.gotError = function gotError(error) {
    return {
      type: GOT_ERROR,
      error,
    };
  };

  exports.fetchDocument = url => async (dispatch) => {
    console.log(url);
    dispatch(exports.requestDocument());
    try {
      const { data } = await getHttp(url);
      const doc = new LdJsonDocument(data);

      if (doc.isList()) {
        dispatch(loadDocumentWithData(doc, url));
        // dispatch(loadList(doc, url));
        return;
      }
      const about = doc.getElementOfType('Article').about || '';
      dispatch({ type: 'DESC_CHANGED', text: about });
      const comment = doc.getProperty('comment');
      if (comment) {
        dispatch({ type: 'ENABLE_COMMENTS', state: true });
      }
      // dispatch(receiveDocument(doc))
      dispatch(loadDocumentWithData(doc, url));
    } catch (err) {
      dispatch(exports.gotError(err));
      console.error('Error during download of source document', err);
    }
  };

  exports.fetchUserData = function fetchUserData() {
    return dispatch =>
      getRegistredUser()
        .then((user) => {
          const data = user.body;
          dispatch(receiveUserData({ wrioID: data.id }));
        })
        .catch((e) => {
          console.error('Error obtaining user data', e.stack);
          dispatch(exports.gotError('User not registred'));
        });
  };

  exports.createNewDocument = function createNewDocument(author) {
    return {
      type: CREATE_DOCUMENT,
      author,
    };
  };

  exports.editorChanged = function editorChanged(editorState) {
    return {
      type: EDITOR_CHANGED,
      editorState,
    };
  };

  exports.mainEditorChanged = editorState => (dispatch) => {
    const cs = editorState.getCurrentContent();
    const header = getTitle(cs);
    dispatch({ type: 'HEADER_CHANGED', header });
    return dispatch(exports.editorChanged(editorState));
  };

  exports.createNewLink = function createNewLink(title, url, desc) {
    return {
      type: CREATE_NEW_LINK,
      title,
      url,
      desc,
    };
  };

  exports.createNewImage = function createNewImage(title, url, desc) {
    return {
      type: CREATE_NEW_IMAGE,
      title,
      url,
      desc,
    };
  };

  exports.removeEntity = function removeEntity(key) {
    return {
      type: CREATE_NEW_IMAGE,
      key,
    };
  };

  exports.editLink = function editLink(titleValue, urlValue, descValue, linkEntityKey) {
    Entity.mergeData(linkEntityKey, {
      linkTitle: titleValue,
      linkUrl: urlValue,
      linkDesc: descValue,
    });
    // editorFocus();
    return { type: EDIT_IMAGE };
  };

  exports.editImage = function editImage(title, src, description, linkEntityKey) {
    Entity.mergeData(linkEntityKey, {
      src,
      title,
      description,
    });
    // editorFocus();
    return { type: EDIT_LINK };
  };
  return exports;
}
