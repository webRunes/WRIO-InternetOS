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
import TicketDialogReducer from './ticketDialog';
import coverDialogReducer from './coverDialogReducer';
import PostSettingsReducer from './publish';
import { mkDoc, extractHeader } from './docUtils';
import headerReducer from 'base/reducers/headerReducer';
import loginReducer from 'base/reducers/loginReducer';
import plusReducer from 'base/Plus/reducers/plusReducer';
import documentReducer from 'base/reducers/documentReducer';
import { GOT_JSON_LD_DOCUMENT } from 'base/actions/actions';
import { reducer as formReducer } from 'redux-form';
import EditorReducer from './editorReducer';
import ListEditorReducer from './listEditorReducer';
import ExternalsEditorReducer from './externalsEditorReducer';

const editorDocumentReducer = EditorReducer('MAIN');

const combinedReducer = combineReducers({
  editorDocument: editorDocumentReducer,
  document: documentReducer,
  header: headerReducer,
  login: loginReducer,
  plusReducer: plusReducer,
  publish: PostSettingsReducer,
  imageDialog: ImageDialogReducer,
  linkDialog: LinkDialogReducer,
  ticketDialog: TicketDialogReducer,
  coverDialog: coverDialogReducer,
  form: formReducer,
  listEditor: ListEditorReducer,
  externalsEditor: ExternalsEditorReducer,
});

export default combinedReducer;
