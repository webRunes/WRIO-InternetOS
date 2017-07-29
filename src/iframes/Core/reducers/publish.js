import { combineReducers } from 'redux'
import {RECEIVE_USER_DATA} from '../actions/indexActions'
import {
    GOT_URLPARAMS,
    DESC_CHANGED,
    HEADER_CHANGED,
    FILENAME_CHANGED,
    ENABLE_COMMENTS
} from '../actions/publishActions'
import {EDITOR_CHANGED,CREATE_DOCUMENT,RECEIVE_DOCUMENT} from '../actions/indexActions'
import JSONDocument from '../JSONDocument'

const defaultState =  {
    editParams: { // initial parameters, got from iframe
        createMode: true,
        initEditURL:'',
        initEditPath:''
    },
    description: "",
    commentsEnabled: false,
    filename:"",
    savePath: '',
    saveURL: '',
    userStartedEditingFilename: false,
    saveSource: "S3",
    saveUrl:"",
    wrioID: null,
    busy:false
};


export function publishReducer(state = defaultState, action) {
    console.log(action);
    const {createMode,initEditURL,initEditPath} = state.editParams;
    switch (action.type) {
        case GOT_URLPARAMS: // should be called first to init store
            return {...state,
                editParams: {
                createMode: action.createMode,
                initEditURL:    action.editURL,
                initEditPath :  action.editPath
            }};

        case EDITOR_CHANGED:
        case RECEIVE_DOCUMENT:
        case CREATE_DOCUMENT:
            if (!action.header) { // action.header is injected from the document store from middleware
                return state;
            }
            if (!state.userStartedEditingFilename) { // sync
                return calcResultingPath(state,action.header)
            } else {
                return state;
            }
        case RECEIVE_USER_DATA:
            return {...state,wrioID: action.data.wrioID};

        case DESC_CHANGED:
            return {...state,description: action.text};
        case FILENAME_CHANGED:
            if (!createMode) {
                return {...state,
                    filename: initEditPath,
                    savePath:initEditPath,
                    saveUrl: initEditURL
                }
            } else {
                return {...calcResultingPath(state,action.text),
                    filename: action.text,
                    userStartedEditingFilename: true,
                };
            }
           
        case HEADER_CHANGED: // LISTEN TO THE CHANGE OF HEADER
            if (action.header && CREATE_MODE) {
                if (!state.userStartedEditingFilename) {
                    return calcResultingPath(state,action.header);
                }
            }
            return state;
        default:
            return state
    }
}

/**
 * Helper function, calculates resulting path when header of the page changed
 * @param state
 * @param filename
 * @returns {{savePath, saveUrl}}
 */
function calcResultingPath(state,filename) {
    const path = prepFileName(filename);
    return {
        ...state,
        filename,
        savePath: path,
        saveUrl: getSaveUrl(state.wrioID,path)
    }
}


export const getSaveUrl = (wrioID,path) => (`https://wr.io/${wrioID}/${path}`);

function prepFileName(name) {
    let res = name.replace(/ /g,'_');
    return `${res.substring(0,120)}/index.html`;
}



export default publishReducer;
