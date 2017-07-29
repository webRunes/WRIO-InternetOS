/* @flow */
import {Entity} from 'draft-js';
import {saveToS3,getWidgetID} from '../webrunesAPI.js';

export const DESC_CHANGED = "DESC_CHANGED";
export const FILENAME_CHANGED = 'FILENAME_CHANGED';
export const HEADER_CHANGED = 'HEADER_CHANGED';

export const PUBLISH_DOCUMENT = 'PUBLISH_DOCUMENT';
export const PUBLISH_FINISH =  'PUBLISH_FINISH';
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT';
export const ENABLE_COMMENTS = 'ENABLE_COMMENTS';

export const GOT_URLPARAMS = 'GOT_URLPARAMS';
export const RECEIVE_USER_DATA = 'RECEIVE_USER_DATA';




export function _ss(state) {
    if (!state) {
        return enableComments(false);
    }
    return (dispatch,state) => {
        console.log("getCommentid started");
        dispatch(requestCommentId());
        getWidgetID(url).then((id)=> {
            console.log("Get widget id succeded", id);
            dispatch(receiveCommentId(id))
        }).catch((e) => {
            console.log("Failed to obtain widget ID");
            dispatch({type:COMMENTID_ERROR});
        });
    }

}


export function gotUrlParams(createMode : boolean,editURL : ?string, editPath: ?string) {
    return {
        type:GOT_URLPARAMS,
        createMode,
        editURL,
        editPath
    }
}

export function publishDocument() {
    return async (dispatch : Function,getState : Function) => {
        dispatch({"type":PUBLISH_DOCUMENT});
        try {
        const state : Object = getState();
        console.log(state);
        const {document,editorState} = state.document;
        let commentId : string = document.getCommentID();
        const {commentsEnabled,savePath,saveUrl,saveSource} = state.publish;
        console.log(document);
        if (commentsEnabled && commentId == "") {
            commentId = await getWidgetID(saveUrl);
            console.log("Get widget id succeded", commentId);
        }
        if (!commentsEnabled) {
            commentId = ""
        }
        
        const res = document.draftToHtml(editorState.getCurrentContent(), document.getA,commentId);
        let {json, html} = res;
        const saveRes = await saveToS3(savePath,html);

        dispatch({"type":PUBLISH_FINISH});
        // post parent follow URL
        parent.postMessage(JSON.stringify({ 
         "followLink": saveUrl
        }), "*");
        } catch (err) {
            console.error("Caught error during publish",err);
             dispatch({"type":"GOT_ERROR"});
        }
    }
}

export function deleteDocument() {
    return (dispatch : Function,getState : Function) => {
        console.log(getState());
    }
}

export function enableComments(state : boolean) {
    return {
        type: ENABLE_COMMENTS,
        state
    }
}


export function descChanged(text : string) {
    return {
        type:DESC_CHANGED,
        text
    }
}


export function filenameChanged(text : string) {
    return {
        type:FILENAME_CHANGED,
        text
    }
}


const saveAction = async (editorState, author, saveRelativePath, commentID,doc,description,saveAbs) => {
    doc.setAbout(description);
    

    WrioActions.busy(false);
    
    return true;

};

const saveAsAction = async (editorState, author,commentID,doc, description) => {
    doc.setAbout(description);
    const res = doc.draftToHtml(editorState.getCurrentContent(), author, commentID);
    let json = doc.getElementOfType('Article');
    let html = res.html;
    let fileName = (json.name === '' ? 'untitled' : json.name.split(' ').join('_')) + '.html';
    saveAs(fileName,html);
    return true;

};

const destroyClickedLink = (event) => {
    document.body.removeChild(event.target);
};

function saveAs(fileName,html) {
    let ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
        ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
        ieEDGE = navigator.userAgent.match(/Edge/g),
        ieVer = (ie ? parseInt(ie[1]) : (ie11 ? 11 : -1));
    if (ie || ie11 || ieEDGE) {
        if (ieVer > 9 || ieEDGE) {
            var textFileAsBlob = new Blob([html], {
                type: 'text/plain'
            });
            window.navigator.msSaveBlob(textFileAsBlob, fileName);
        } else {
            console.log("IE v.10 or higher required");
            return;
        }
    } else {
        var downloadLink = document.createElement("a");
        downloadLink.download = fileName;
        downloadLink.innerHTML = "My Hidden Link";
        window.URL = window.URL || window.webkitURL;
        textFileAsBlob = new Blob([html], {
            type: 'text/plain'
        });
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedLink.bind(this);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
}


/**
 * Pulish file to store
 * @param action 'save' or 'saveas'
 * @param storageRelativePath relative path to the user's directory
 * @param url - absolute save path, needed for widget url creation
 * @param desc - description of the document
 */
async function _publish(action,storageRelativePath,url,desc) {
    console.log(storageRelativePath,desc);

    const saveAction = (commentId) => SaveActions.execSave(
        this.state.editorState,
        action,
        storageRelativePath,
        this.state.author,
        commentId,
        this.state.doc,
        desc,
        url
    );

    const doSave = (id) => saveAction(id).then(()=>{
        WrioActions.busy(false);
        this.setState({error: false});
    }).catch((err)=> {
        WrioActions.busy(false);
        this.setState({error: true});
        console.log(err);
    });

    let commentID = this.state.commentID;
    if (this.state.commentID) { // don't request comment id, if it already stored in the document
        if (!WrioStore.areCommentsEnabled()) {
            commentID = ''; // delete comment id if comments not enabled
        }
        doSave(commentID);
    } else {
        WrioActions.busy(true);
        WrioStore.requestCommentId(url,(err,id) => {
            doSave(id);
        });
    }



}

/**
 * Deletes current document
 */

function _deleteDocument(storageRelativePath) {
    WrioActions.busy(true);
    deleteFromS3(storageRelativePath).then((res)=>{
        WrioActions.busy(false);
        this.setState({
            error: false
        });
        parent.postMessage(JSON.stringify({
            "followLink": `https://wr.io/${WrioStore.getWrioID()}/Plus-WRIO-App/index.html`
        }), "*");
    }).catch((err)=>{
        WrioActions.busy(false);
        this.setState({
            error: true
        });
        console.log(err);
    });
}
