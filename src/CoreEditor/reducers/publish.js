import { combineReducers } from 'redux';
import mkActions from '../actions/indexActions';

const { RECEIVE_USER_DATA, EDITOR_CHANGED, CREATE_DOCUMENT, MY_LIST_READY } = mkActions('MAIN');
import {
  GOT_URLPARAMS,
  DESC_CHANGED,
  HEADER_CHANGED,
  FILENAME_CHANGED,
  ENABLE_COMMENTS,
  PUBLISH_DOCUMENT,
  PUBLISH_FINISH,
  PICK_SAVE_SOURCE,
  PUBLISH_COVER,
  GOT_ERROR,
} from '../actions/publishActions';
import JSONDocument from 'base/jsonld/LdJsonDocument';
import { GOT_JSON_LD_DOCUMENT } from 'base/actions/actions';
import { CREATE_MODE } from '../utils/url';

const defaultState = {
  editParams: {
    // initial parameters, got from iframe
    createMode: true,
    initEditURL: '',
    initEditPath: '',
  },
  description: '',
  commentsEnabled: false,
  filename: 'Untitled',
  savePath: '',
  saveURL: '',
  userStartedEditingFilename: false,
  saveSource: 'S3',
  saveUrl: '',
  myList: [],
  wrioID: null,
  busy: false,
};

const MAX_DESCR_LENGTH = 515;

export function publishReducer(state = defaultState, action) {
  console.log(action);
  const { createMode, initEditURL, initEditPath } = state.editParams;
  switch (action.type) {
    case GOT_URLPARAMS:
      // should be called first to init store
      return {
        ...state,
        editParams: {
          createMode: action.createMode,
          initEditURL: action.editURL,
          initEditPath: action.editPath,
        },
      };

    case RECEIVE_USER_DATA: {
      const _state = {
        ...state,
        wrioID: action.data.id,
        profile: action.data
      };

      if (_state.editParams.initEditPath && !createMode && _state.filename === '') {
        const fileName = _state.editParams.initEditPath.match(/(.+).index.html/)[1];
        return calcResultingPath(_state, fileName);
      }
      return calcResultingPath(_state, _state.filename);
    }
    case EDITOR_CHANGED:
    case GOT_JSON_LD_DOCUMENT:
    case CREATE_DOCUMENT:
      if (!action.header) {
        // action.header is injected from the document store from middleware
        return state;
      }
      if (!state.userStartedEditingFilename) {
        // sync
        return calcResultingPath(state, action.header);
      }
      return state;

    case DESC_CHANGED:
      return {
        ...state,
        description: action.text.substring(0, MAX_DESCR_LENGTH),
      };

    case ENABLE_COMMENTS:
      return { ...state, commentsEnabled: action.state };

    case FILENAME_CHANGED:
      if (!createMode) {
        return {
          ...state,
          filename: initEditPath,
          savePath: initEditPath,
          saveUrl: initEditURL,
        };
      }
      return {
        ...calcResultingPath(state, action.text),
        filename: action.text,
        userStartedEditingFilename: true,
      };

    case HEADER_CHANGED: // LISTEN TO THE CHANGE OF HEADER
      if (action.header && CREATE_MODE) {
        if (!state.userStartedEditingFilename) {
          return calcResultingPath(state, action.header);
        }
      }
      return state;
    case PUBLISH_DOCUMENT:
      return { ...state, busy: true };
    case PUBLISH_FINISH:
      return { ...state, busy: false };
    case GOT_ERROR:
      return { ...state, busy: false };
    case PICK_SAVE_SOURCE:
      return { ...state, saveSource: action.source };
    case PUBLISH_COVER:
      return { ...state, coverHtml: action.html, deleteCover: action.deleteCover };
    case MY_LIST_READY:
      return { ...state, myList: action.myList };
    default:
      return state;
  }
}

export const getSaveUrl = (wrioID, path) => `https://wr.io/${wrioID}/${path}`;

function prepFileName(name) {
  const res = name.replace(/ /g, '_');
  return `${res.substring(0, 120)}/index.html`;
}

function prepCoverName(name) {
  const res = name.replace(/ /g, '_');
  return `${res.substring(0, 120)}/cover/cover.html`;
}

/**
 * Helper function, calculates resulting path when header of the page changed
 * @param state
 * @param filename
 * @returns {{savePath, saveUrl}}
 */
function calcResultingPath(state, filename) {
  const path = prepFileName(filename);
  const coverFileName = prepCoverName(filename);
  const { createMode, initEditPath, initEditURL } = state.editParams;
  return {
    ...state,
    filename,
    coverFileName,
    coverSavePath: `${getSaveUrl(state.wrioID, coverFileName)}?cover`,
    savePath: createMode ? path : initEditPath, // fallback to predefined path if we just editing file
    saveUrl: createMode ? getSaveUrl(state.wrioID, path) : initEditURL,
  };
}

export default publishReducer;
