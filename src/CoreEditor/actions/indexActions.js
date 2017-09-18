import getHttp from 'base/utils/request';

import { getRegistredUser,getWidgetID} from '../webrunesAPI.js';
import JSONDocument from '../JSONDocument'


export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT';
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT';
export const RECEIVE_USER_DATA = 'RECEIVE_USER_DATA';
export const CREATE_DOCUMENT = "CREATE_DOCUMENT";

export const GOT_ERROR = 'GOT_ERROR';
export const EDITOR_CHANGED = 'EDITOR_CHANGED';
export const CREATE_NEW_LINK = 'CREATE_NEW_LINK';
export const CREATE_NEW_IMAGE = 'CREATE_NEW_IMAGE';
export const REMOVE_ENTITY = 'REMOVE_ENTIRY';
export const EDIT_LINK = 'EDIT_ENTITY';
export const EDIT_IMAGE = 'EDIT_IMAGE';



export function requestDocument() {
    return {
        type: REQUEST_DOCUMENT,
    }
}

export function receiveDocument(document) {
    return {
        type: RECEIVE_DOCUMENT,
        document
    }
}

export function receiveUserData(data) {
    return {
        type: RECEIVE_USER_DATA,
        data
    }
}

function gotError(error) {
    return {
        type: GOT_ERROR,
        error
    }
}

export function fetchDocument(url) {
    return (dispatch,state) => {
        console.log(url)
        dispatch(requestDocument());
        getHttp(url)
            .then(doc => doc.data)
            .then(data => {
                const doc = new JSONDocument(data);
                const about = doc.getElementOfType('Article').about || "";
                dispatch({type: "DESC_CHANGED", text: about});
                dispatch(receiveDocument(doc))
            })
            .catch(err => {
                dispatch(gotError(err));
                console.error("Error during download of source document",err);
            }
        )
    }
}

export function fetchUserData() {
    return dispatch => {
        return getRegistredUser().then((user)=>  {
            const data = user.body;
            dispatch(receiveUserData({wrioID: data.id}));
            }
        ).catch((e)=> {
            console.error("Error obtaining user data", e.stack);
            dispatch(gotError("User not registred"))
        });
    }
}

export function createNewDocument(author) {
    return {
        type: CREATE_DOCUMENT,
        author
    }
}

export function editorChanged(state) {

    return {
        type: EDITOR_CHANGED,
        editorState: state,
    }
}

export function createNewLink(title,url,desc) {
    return {
        type: CREATE_NEW_LINK,
        title,
        url,
        desc
    }
}

export function createNewImage(title,url,desc) {
    return {
        type: CREATE_NEW_IMAGE,
        title,
        url,
        desc
    }
}

export function removeEntity(key) {
    return {
        type: CREATE_NEW_IMAGE,
        key
    }
}

import {Entity} from 'draft-js'


// Move these to actions!
export function editLink(titleValue,urlValue,descValue,linkEntityKey) {
    Entity.mergeData(linkEntityKey, {
        linkTitle: titleValue,
        linkUrl: urlValue,
        linkDesc: descValue
    });
    //editorFocus();
    return {type:EDIT_IMAGE}

}

export function editImage(title,src,description,linkEntityKey) {
    Entity.mergeData(linkEntityKey, {
        src,
        title,
        description
    });
   // editorFocus();
   return {type:EDIT_LINK}

}
