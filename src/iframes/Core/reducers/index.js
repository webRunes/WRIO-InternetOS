import { combineReducers } from 'redux'
import {
    REQUEST_DOCUMENT,
    RECEIVE_DOCUMENT,
    RECEIVE_USER_DATA,
    CREATE_DOCUMENT,
    GOT_ERROR,
    CREATE_NEW_IMAGE,
    CREATE_NEW_LINK,
    EDITOR_CHANGED,
    REMOVE_ENTITY
} from '../actions/index'
import JSONDocument from '../JSONDocument.js';
import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata, getDefaultKeyBinding,  Modifier, convertToRaw} from 'draft-js';
import {createEditorState,createNewLink,createNewImage,removeEntity} from '../utils/entitytools'
import LinkDialogReducer from './linkDialog'
import ImageDialogReducer from './imageDialog'

const defaultState = {
    document: null,
    isFetching: true,
    error: "",
    header: "",
    editorState: null
};

export function document(state = defaultState, action) {
    console.log("got action", action);
    switch (action.type) {
        case RECEIVE_USER_DATA:
            return {...state,userData: action.data};
        case CREATE_DOCUMENT:
            const newDoc = new JSONDocument();
            newDoc.createArticle(action.author, "");
            return mkDoc(state,newDoc);
        case REQUEST_DOCUMENT:
            return {...state,isFetching:true};
        case GOT_ERROR:
            return {...state,isFetching: false,error: action.error};
        case RECEIVE_DOCUMENT:
            const doc =  new JSONDocument(action.document);
            return mkDoc(state,doc);
        case EDITOR_CHANGED:
            const editorState = action.editorState;
            const header = JSONDocument.getTitle(editorState.getCurrentContent());
           /* if (header != this.oldHeader) { // makeItWork
                WrioActions.headerChanged(header);
            }
            this.oldHeader = header;*/
            return {...state,editorState: editorState,header: header};
        case CREATE_NEW_IMAGE:
            return {...state, editorState: createNewImage(state.editorState,action.title,action.url,action.desc)};
        case CREATE_NEW_LINK:
            return {...state, editorState: createNewLink(state.editorState,action.title,action.url,action.desc)};
        case REMOVE_ENTITY:
            return {...state, editorState: removeEntity(state.editorState,action.key)};
        default:
            return state
    }
}

const rootReducer = combineReducers({
    document,
    imageDialog: ImageDialogReducer,
    linkDialog: LinkDialogReducer,
});

export default rootReducer;

function mkDoc(state,doc) {
    doc.toDraft();
    const contentBlocks = doc.contentBlocks;
    const mentions = doc.mentions;
    return {...state,
        isFetching: false,
        document: doc,
        editorState: EditorState.moveFocusToEnd (createEditorState(contentBlocks,mentions,doc.images))
    };

}

