/* @flow */
import LdJsonDocument from 'base/jsonld/LdJsonDocument'
import TableOfContents,{MenuItem,extractPageNavigation} from 'base/utils/tocnavigation'
import getHttp from 'base/utils/request'
import {requestHashUpdate} from 'base/actions/hashUpdateHook'

export const ADD_COVER = "ADD_COVER"
export const SELECT_COVER = "SELECT_COVER"
export const PRESS_COVER_BUTTON = "PRESS_COVER_BUTTON"
export const GOT_JSON_LD_DOCUMENT = "GOT_JSON_LD_DOCUMENT"
export const DOWNLOADED_EXTERNAL =  "DOWNLOADED_EXTERNAL"
export const GOT_EXTERNAL = "GOT_EXTERNAL"
export const LOGIN_MESSAGE = "LOGIN_MESSAGE"
export const TAB_CLICK = "TAB_CLICK"
export const NAVIGATE_ARTICLE_HASH = "NAVIGATE_ARTICLE_HASH"

export function addCover(coverObj : Object, coverDoc : LdJsonDocument) {
    return {
        type: ADD_COVER,
        coverObj,
        coverDoc
    }
}


export function selectCover(index:number) {
    return {
        type: SELECT_COVER,
        index
    }
}

export function pressCoverButton(cover : Object) {
    return {
        type: PRESS_COVER_BUTTON,
        cover
    }
}

export const loginMessage = (msg : Object) => {
    return {
        type : LOGIN_MESSAGE,
        msg
    }
}

export function tabClick(tabKey) {
    return {
        type:TAB_CLICK,
        tabKey
    }
}


export function gotExternal(lists) {
    return {
        type: GOT_EXTERNAL,
        lists
    }
}
export function gotJSON_LD_Document(data: LdJsonDocument, url : string,toc : TableOfContents) {
    return {
        type: GOT_JSON_LD_DOCUMENT,
        data,
        url,
        toc
    }
}


export function loadDocumentWithData(data: LdJsonDocument, url : string) {
    return dispatch => {
        // Quick hack to make page jump to needed section after page have been edited
        requestHashUpdate();
        const toc = extractPageNavigation(data,true);
        dispatch(gotJSON_LD_Document(data, url, toc))
       
        toc.covers.map(async (cover : Object) => {
            if (cover.url) {
                try {
                    const doc : LdJsonDocument = await getHttp(cover.url);
                    dispatch(addCover(cover, doc));
                } catch (err) {
                    console.log(`Unable to download cover ${cover.url}`);
                    return;
                }
    
            }
        });
    
        toc.external.map(async (externalDoc : Object) => {
            console.log(externalDoc);
            if (externalDoc.url) {
                try {
                    const doc : LdJsonDocument = await getHttp(externalDoc.url);
                    let lists = this.state.lists;
                    lists.push(Object.assign(externalDoc, {data: doc.getBlocks()[0],type:'external'}));
                    dispatch(gotExternal(lists));
                } catch (err) {
                    console.log(`Unable to download external ${externalDoc.url}`);
                    return;
                }
    
            }
        });
    }
}
  
export function navigateArticleHash (hash: string) {
        var type = 'article';
        setUrlWithHash(hash);
        return {
            type:NAVIGATE_ARTICLE_HASH,
            hash
        }
    }
   

function setUrlWithHash (name:string) {
    window.history.pushState('page', 'params', window.location.pathname);
    window.location.hash = name;
    requestHashUpdate();
}
   