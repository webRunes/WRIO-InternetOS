import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata, getDefaultKeyBinding,  Modifier, convertToRaw} from 'draft-js';
import {createEditorState,createNewLink,createNewImage,removeEntity} from '../utils/entitytools'
import JSONDocument from '../JSONDocument.js';

export function extractHeader(state) {
    const editorState = state.editorState;
    const header = JSONDocument.getTitle(editorState.getCurrentContent());
    return {...state,header}
}

export function mkDoc(state,doc) {
   
    const contentBlocks = doc.toDraft();
    const mentions = doc.mentions;
    return extractHeader({...state,
        isFetching: false,
        document: doc,
        editorState: EditorState.moveFocusToEnd (createEditorState(contentBlocks,mentions,doc.images))
    });

}

