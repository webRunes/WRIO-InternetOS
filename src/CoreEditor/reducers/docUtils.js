import {
  CompositeDecorator,
  ContentState,
  SelectionState,
  Editor,
  EditorState,
  Entity,
  RichUtils,
  CharacterMetadata,
  getDefaultKeyBinding,
  Modifier,
  convertToRaw,
} from 'draft-js';
import {
  createEditorState,
  createNewLink,
  createNewImage,
  removeEntity,
  extractTableOfContents,
} from '../utils/entitytools';
import { getTitle } from '../DraftExporter.js';
import JSONToDraft from '../DraftConverters/article/JSONToDraft';
import { image } from 'superagent/lib/node/parsers';
import { ListItem } from 'base/utils/tocnavigation';

export function extractHeader(state) {
  const { editorState } = state;
  const header = getTitle(editorState.getCurrentContent());
  const chapters = extractTableOfContents(editorState).map(e => new ListItem(e, 'url'));
  const toc = { chapters, covers: [], external: [] };
  return { ...state, header, toc };
}

export function extractHeaderFromCover(state) {
  const { editorState } = state.tab;
  const header = getTitle(editorState.getCurrentContent());
  const chapters = extractTableOfContents(editorState).map(e => new ListItem(e, 'url'));
  const toc = { chapters, covers: [], external: [] };
  return { ...state, header, toc };
}

export function mkDoc(state, doc, importFN = JSONToDraft) {
  if (doc.isList()) {
    return { ...state, isList: true, document: doc };
  }
  const draftParams = importFN(doc);
  const newState = extractHeader({
    ...state,
    isFetching: false,
    document: doc,
    editorState: EditorState.moveFocusToEnd(createEditorState(draftParams)),
  });
  return newState;
}
