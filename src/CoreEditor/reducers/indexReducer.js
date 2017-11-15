import { combineReducers } from 'redux';
import mkActions from '../actions/indexActions';
import JSONDocument from 'base/jsonld/LdJsonDocument';
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

const editorDocumentReducer = EditorReducer('MAIN');

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


export default combinedReducer;
