import { combineReducers } from 'redux';
import mkActions from '../actions/indexActions';
import JSONDocument from '../JSONDocument.js';
import {
  createEditorState,
  createNewLink,
  createNewImage,
  removeEntity,
  extractTableOfContents,
} from '../utils/entitytools';
import LinkDialogReducer from './linkDialog';
import ImageDialogReducer from './imageDialog';
import coverDialogReducer from './coverDialogReducer';
import PostSettingsReducer from './publish';
import { mkDoc, extractHeader } from './docUtils';
import headerReducer from 'base/reducers/headerReducer';
import loginReducer from 'base/reducers/loginReducer';
import documentReducer from 'base/reducers/documentReducer';
import { GOT_JSON_LD_DOCUMENT } from 'base/actions/actions';
import { reducer as formReducer } from 'redux-form';
import EditorReducer from './editorReducer';

const defaultState = {
  document: null,
  isFetching: true,
  error: '',
  header: '',
  editorState: null,
};

const editorDocumentReducer = EditorReducer('MAIN', defaultState);

const combinedReducer = combineReducers({
  editorDocument: editorDocumentReducer,
  document: documentReducer,
  header: headerReducer,
  login: loginReducer,
  publish: PostSettingsReducer,
  imageDialog: ImageDialogReducer,
  linkDialog: LinkDialogReducer,
  coverDialog: coverDialogReducer,
  form: formReducer,
});

/**
 * Inject header to the publish reducer
 * @param state
 * @param action
 * @returns {*}
 */
function crossSliceReducer(state, action) {
  switch (action.type) {
    case 'CREATE_DOCUMENT':
    case 'GOT_JSON_LD_DOCUMENT':
    case 'EDITOR_CHANGED': {
      const docState = state.editorDocument;
      const modAction = action;
      modAction.header = docState.header;
      return {
        ...state,
        publish: PostSettingsReducer(state.publish, modAction),
      };
    }
    default:
      return state;
  }
}

function rootReducer(state, action) {
  const intermediateState = combinedReducer(state, action);
  const finalState = crossSliceReducer(intermediateState, action);
  return finalState;
}

export default rootReducer;
