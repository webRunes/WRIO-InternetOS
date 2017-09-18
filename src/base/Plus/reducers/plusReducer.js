import actions from 'base/actions/actions'
import normURL,{isPlusUrl,getPlusUrl} from '../utils/normURL';
import * as PlusActions from '../actions/PlusActions.js';
import {getJsonldsByUrl,getJsonldsByUrlPromised,lastOrder,getNext} from '../utils/tools';
import {CrossStorageFactory} from '../../utils/CrossStorageFactory.js';

import {
    addPageToTabs,
    getActiveElement,
    deletePageFromTabs,
    normalizeTabs,
    saveCurrentUrlToPlus} from '../utils/tabTools.js';

const storage = CrossStorageFactory.getCrossStorage();



/**
 * Extracts current page information from the DOM
 * TODO: avoid direct DOM manipulation, need to pass this to the DOM
 * @returns {*}
 */

const extractCurrentPageInformation = () => {
    var scripts = document.getElementsByTagName('script'),
        i,
        json,
        result;
    for (i = 0; i < scripts.length; i += 1) {
        if (scripts[i].type === 'application/ld+json') {
            json = undefined;
            try {
                json = JSON.parse(scripts[i].textContent);
            } catch (exception) {
                json = undefined;
                console.error('Your json-ld not valid: ' + exception);
            }
            if ((typeof json === 'object') && (json['@type'] === 'ItemList')) {
                result = {
                    name: json.name,
                    url: normURL(window.location.href),
                    fullUrl: window.location.href,
                    author: json.author,
                    active: true
                };
            }

            if ((typeof json === 'object') && (json['@type'] === 'Article')) {
                result = {
                    name: json.name,
                    url: normURL(window.location.href),
                    fullUrl: window.location.href,
                    author: json.author,
                    active: true
                };
                break;
            }
        }
    }
    return result;
};


function getActiveTab(data) {
    var hasActive, childActive=[];
    const getChildren = (data) => {
        if (typeof data == 'object') {
            return Object.values(data);
        } else {
            return []
        }
    }
    if (data) {
        Object.keys(data).forEach((name) => {
            if (data[name].active) {
                hasActive = true;
                childActive = getChildren(data[name].children);
                console.log("Active plus branch", data[name])
            }
        });

    }
    return childActive;
}



const oldActions = [
    'create',
    'read',
    'update',
    'del',
    'closeTab',
    'plusActive',
    'clickLink',
    'gotWrioID'
];

function isPlusActive(wrioID) {
    return isPlusUrl(window.location.href,wrioID);
}

const defaultState = {
    plusTabs: {},
    readItLater: []
}

function checkHaveEverything(state) {
    if ((state.authorData || state.noAuthor) && state.plusData) {
        const _tabs = importPlusState(state.plusData,!isPlusActive(state.wrioID),state.authorData); // don't add current page to tabs if plus active
        delete state.plusData;
        return {
            ...state,
            plusTabs: _tabs,
            readItLater: getActiveTab(_tabs)
        }
    }
    return state;
}

export default function plusReducer(state = defaultState,action) {
    console.log("ST",state)
    let _state;
    switch(action.type) {
        case "GET_AUTHOR_DATA":
            _state = checkHaveEverything({...state,authorData: action.authorData,noAuthor:action.noAuthor});
            return _state;
        case PlusActions.GOT_PLUS_DATA:
            _state = checkHaveEverything({...state,plusData: action.plus,wrioID: action.wrioID})
            return _state;
        default:
            return state;
    }
    return state;

}

function importPlusState(data, addCurrent,author) {
    const _norm = normalizeTabs(data);
    let params = createCurrentPage(author);
    if (params && addCurrent) {
        const newData = addPageToTabs(_norm,params);
        persistPlusDataToLocalStorage(newData);
        return newData;
    } else {
        return _norm;
    }
}

async function persistPlusDataToLocalStorage(data) {
    await storage.onConnect();
    await storage.set('plus', data);
}




function createCurrentPageParent (page : Object,author: LdJsonDocument) {
    console.log("CCPT",page,author)
    if(!page.author || page.author == 'unknown' || !author ) {
        return  {
            tab: page,
            noAuthor: true
        };
    } else {
        return {
            tab: page,
            parent: author.getJsonLDProperty('author')
        };

    }
}

function createCurrentPage (author) {
    let pageData = extractCurrentPageInformation();
    if (pageData) {
        if (pageData.author && typeof pageData.author === 'string' && (normURL(pageData.author) !== normURL(pageData.url))) {
            return createCurrentPageParent(pageData,author);
        } else {
            return {
                tab: pageData,
                noAuthor: true
            };
        }
    }

}

async function onDel (listName, elName) {
    const [newdata,next,wasActive] = deletePageFromTabs(this.data,listName,elName);


    await this.persistPlusDataToLocalStorage(newdata);
    this.data = newdata;
    this.setState(this.data);

    if (wasActive) {
        window.location.href  = next ? next : getPlusUrl(this.id);
    }
}

function onCloseTab() {
    const [listName,elName] = getActiveElement(this.data);
    if (listName) {
        this.onDel(listName,elName)
    } else {
        console.error("Cannot find current tab while closing tab!")
    }
}


async function onClickLink(data) {

    console.log("Link clicked",data);

    if (data.children && data.children.length > 0) {

        return;
    }


    if (window.localStorage) {
        localStorage.setItem('tabScrollPosition', document.getElementById('tabScrollPosition').scrollTop);
    }


    try {
        await storage.onConnect();
        const _plus = saveCurrentUrlToPlus(this.data);
        this.persistPlusDataToLocalStorage(_plus);
        window.location = data.fullUrl || data.url;
    } catch (e) {
        console.log("Error during gotoUrl", e);
        debugger;
    }
}
