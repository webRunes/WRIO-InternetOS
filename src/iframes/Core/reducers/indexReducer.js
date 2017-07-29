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
} from '../actions/indexActions'
import JSONDocument from '../JSONDocument.js';
import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata, getDefaultKeyBinding,  Modifier, convertToRaw} from 'draft-js';
import {createEditorState,createNewLink,createNewImage,removeEntity} from '../utils/entitytools'
import LinkDialogReducer from './linkDialog'
import ImageDialogReducer from './imageDialog'
import PostSettingsReducer from './publish'
import {mkDoc,extractHeader} from './docUtils'

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
            return extractHeader({...state,editorState: editorState});
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

const combinedReducer = combineReducers({
    document,
    publish: PostSettingsReducer,
    imageDialog: ImageDialogReducer,
    linkDialog: LinkDialogReducer,
});

/**
 * Inject header to the publish reducer
 * @param state
 * @param action
 * @returns {*}
 */
function crossSliceReducer(state, action) {
    switch(action.type) {
        case "CREATE_DOCUMENT" :
        case "RECEIVE_DOCUMENT":
        case "EDITOR_CHANGED":
            const docState =  document(state.document, action); // inject header to the action hack
            const modAction = action;
            modAction.header = docState.header;
            return {
                document : docState,
                publish : PostSettingsReducer(state.publish, modAction),
                imageDialog : ImageDialogReducer(state.imageDialog, action),
                linkDialog: LinkDialogReducer(state.linkDialog,action)
            }

        default : return state;
    }
}

function rootReducer(state, action) {
    const intermediateState = combinedReducer(state, action);
    const finalState = crossSliceReducer(intermediateState, action);
    return finalState;
}

export default rootReducer;
