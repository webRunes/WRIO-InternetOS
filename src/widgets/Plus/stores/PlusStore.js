import Reflux from 'reflux';
import normURL,{isPlusUrl,getPlusUrl} from '../utils/normURL';
import PlusActions from '../actions/PlusActions.js';
import ActionMenu from '../actions/menu';
import {getJsonldsByUrl,getJsonldsByUrlPromised,lastOrder,getNext} from '../utils/tools';
import {CrossStorageFactory} from '../../../core/utils/CrossStorageFactory.js';
import WrioDocumentStore from '../../../core/store/WrioDocument.js';
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

export default Reflux.createStore({
    listenables: PlusActions,
    /**
     * Get inital plus data from localStorage
     */
     async init () {

    },

    async onGotWrioID(wrioID) {
        console.log("GWR",wrioID);
        if (this.id) {
            return;
        }
        await storage.onConnect();
        this.id = wrioID;
        console.log("PLUS store got wrioID",this.id);
        await this.initState();
    },

    async initState() {

        const plus = await storage.get('plus') || {};
        this.importPlusState(plus,!this.isPlusActive()); // don't add current page to tabs if plus active
    },

    getInitialState: function() {
        return this.data;
    },

    async persistPlusDataToLocalStorage(data) {
        await storage.onConnect();
      //  await storage.del('plus');
        await storage.set('plus', data);
    },

    /**
     * Adds current page to plus tabs
     */

    async importPlusState(data, addCurrent) {
        const _norm = normalizeTabs(data);
        let params = await this.createCurrentPage();
        if (params && addCurrent) {
            const newData = addPageToTabs(_norm,params);
            await this.persistPlusDataToLocalStorage(newData);
            this.data = newData;
        } else {
            this.data = _norm;
        }
        this.setState(this.data);

    },

    setState(data) {

        const d = {plusTabs:data, readItLater: getActiveTab(data)};
        console.log(d);
        this.trigger(d);
    },

    isPlusActive() {
        return isPlusUrl(window.location.href,this.id);
    },

    /**
     * This function adds current page to the plus tabs hierarchy depending on plusActive flag
     */



    async createCurrentPageParent (page) {
        if(!page.author || page.author == 'unknown') {
            return  {
                tab: page,
                noAuthor: true
            };
        } else {
            let jsons = await getJsonldsByUrlPromised(page.author);
            if (jsons && jsons.length !== 0) {
                var j, name;
                for (j = 0; j < jsons.length; j += 1) {
                    if (jsons[j]['@type'] === 'Article') {
                        name = jsons[j].name;
                        j = jsons.length;
                    }
                }
                if (!name) {
                    console.warn('plus: author [' + page.author + '] do not have type Article');
                }
                return {
                    tab: page,
                    parent: name
                };
            } else {
                return {
                    tab: page,
                    noAuthor: true
                };
            }

        }
    },
    async createCurrentPage () {
        let pageData = extractCurrentPageInformation();
        if (pageData) {
            if (pageData.author && typeof pageData.author === 'string' && (normURL(pageData.author) !== normURL(pageData.url))) {
                return await this.createCurrentPageParent(pageData);
            } else {
               return {
                    tab: pageData,
                    noAuthor: true
                };
            }
        }

    },

    /* =========================
    Action handlers
     ============================*/

    onRead: function() {
       console.warn("Dummy onRead call, all data manipulation moved to init() function");
    },

    async onDel (listName, elName) {
        const [newdata,next,wasActive] = deletePageFromTabs(this.data,listName,elName);


        await this.persistPlusDataToLocalStorage(newdata);
        this.data = newdata;
        this.setState(this.data);

        if (wasActive) {
            window.location.href  = next ? next : getPlusUrl(this.id);
        }
    },

    onCloseTab() {
        const [listName,elName] = getActiveElement(this.data);
        if (listName) {
            this.onDel(listName,elName)
        } else {
            console.error("Cannot find current tab while closing tab!")
        }
    },


    async onClickLink(data) {

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
    },

    /*                     */

    storageGetKey(key, cb){
        storage.onConnect().then(function () {
            return storage.get(key);
        }).then(function (res) {
            if(res){
                cb(key);
            }else{
                cb(false);
            }
        });
    },

    storageSetKey(key,value){
        storage.onConnect().then(function () {
            storage.set(key, value);
        });
    }


});
