// @flow
import mkActions from '../actions/indexActions';
import {
  createEditorState,
  createNewLink,
  createNewImage,
  removeEntity,
  extractTableOfContents,
} from '../utils/entitytools';
import { mkDoc, extractHeader } from './docUtils';
import { GOT_JSON_LD_DOCUMENT } from 'base/actions/actions';
import { reducer as formReducer } from 'redux-form';
import JSONDocument from 'base/jsonld/LdJsonDocument';
import { createArticleTemplate } from '../DraftExporter';

const defaultState = {
  document: null,
  isFetching: true,
  error: '',
  header: '',
  editorState: null,
};

const edtorDocumentReducer = (editorName: string) => (
  state: Object = defaultState,
  action: Object,
) => {
  const {
    REQUEST_DOCUMENT,
    CREATE_DOCUMENT,
    GOT_ERROR,
    CREATE_NEW_IMAGE,
    CREATE_NEW_LINK,
    EDITOR_CHANGED,
    REMOVE_ENTITY,
  } = mkActions(editorName);
  switch (action.type) {
    case CREATE_DOCUMENT: {
      const newDoc = new JSONDocument([createArticleTemplate(action.author, '')]);
      return mkDoc(state, newDoc);
    }
    case REQUEST_DOCUMENT:
      return { ...state, isFetching: true };
    case GOT_ERROR:
      return { ...state, isFetching: false, error: action.error };
    case GOT_JSON_LD_DOCUMENT: {
      if (editorName !== 'MAIN') {
        return state;
      }
      const doc = action.data;
      if (!doc) {
        throw new Error('Doc not supplied');
      }
      return mkDoc(state, doc);
    }

    case EDITOR_CHANGED: {
      const { editorState } = action;
      return extractHeader({ ...state, editorState });
    }
    case CREATE_NEW_IMAGE:
      return {
        ...state,
        editorState: createNewImage(state.editorState, action.url, action.desc, action.title),
      };
    case CREATE_NEW_LINK:
      return {
        ...state,
        editorState: createNewLink(state.editorState, action.url, action.desc, action.title),
      };
    case REMOVE_ENTITY:
      return { ...state, editorState: removeEntity(state.editorState, action.key) };
    default:
      return state;
  }
};

export default edtorDocumentReducer;
