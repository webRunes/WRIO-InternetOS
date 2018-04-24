import { combineReducers } from 'redux';
import LinkDialogReducer from './linkDialog';
import ImageDialogReducer from './imageDialog';
import TicketDialogReducer from './ticketDialog';
import coverDialogReducer from './coverDialogReducer';
import PostSettingsReducer from './publish';
import headerReducer from 'base/reducers/headerReducer';
import loginReducer from 'base/reducers/loginReducer';
import plusReducer from 'base/Plus/reducers/plusReducer';
import documentReducer from 'base/reducers/documentReducer';
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
