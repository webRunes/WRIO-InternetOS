/**
 * Created by michbil on 15.07.17.
 */


export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT';
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT';
export const RECEIVE_USER_DATA = 'RECEIVE_USER_DATA';
export const CREATE_DOCUMENT = "CREATE_DOCUMENT";
export const GOT_ERROR = 'GOT_ERROR';
export const EDITOR_CHANGED = 'EDITOR_CHANGED';
export const CREATE_NEW_LINK = 'CREATE_NEW_LINK';
export const CREATE_NEW_IMAGE = 'CREATE_NEW_IMAGE';
export const REMOVE_ENTITY = 'REMOVE_LINK';
export const EDIT_LINK = 'REMOVE_LINK';
export const EDIT_IMAGE = 'REMOVE_LINK';

export const PUBLISH_DOCUMENT = 'PUBLISH_DOCUMENT';
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT';

import getHttp from '../../../base/utils/request';
import { getRegistredUser} from '../webrunesAPI.js';

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
    return dispatch => {
        dispatch(requestDocument());
        return getHttp(url)
            .then(doc => doc.data)
            .then(data => dispatch(receiveDocument(data)))
            .catch(err => dispatch(gotError(err)))
    }
}

export function fetchUserData() {
    return dispatch => {
        return getRegistredUser().then((user)=> dispatch(receiveUserData(user))
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

export function editImage(src,description,title,linkEntityKey) {
    Entity.mergeData(linkEntityKey, {
        src,
        title,
        description
    });
   // editorFocus();
   return {type:EDIT_LINK}

}

export function publishDocument() {
    return (dispatch,getState) => {
        console.log(getState());
    }
}

export function deleteDocument() {
    return (dispatch,getState) => {
        console.log(getState());
    }
}

