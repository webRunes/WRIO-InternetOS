/* @flow */
/**
 * Created by michbil on 30.03.16.
 */
import {CrossStorageFactory} from './CrossStorageFactory.js';
import Reflux from 'reflux';
import WrioDocumentActions from "../actions/WrioDocument.js";
import getHttp from '../store/request.js';
import UrlMixin from '../mixins/UrlMixin';
import LdJsonObject from '../jsonld/entities/LdJsonObject'



/**
 * Store that handles state of entire WRIO-document
 */

class WrioDocument extends Reflux.Store {

    data: Array<LdJsonObject>;
    mainPage: Array<LdJsonObject>;
    type: string;
    url: string;
    lists: {[string]: Object};

    constructor () {
        super();
        this.listenables = WrioDocumentActions
        this.loading = false;
        this.lists = {};
        this.updateHook = null;
        this.state = {
            mainPage: [],
            covers: {},
            externals: {},
            toc: {
                covers: [],
                chapters: [],
                external: []
            }
        }
    }

    /**
     * Called upon initial loading of the page
     * extracts incoming JSON+LD table of contents
     * and fetchs external lists too
     * @param data
     * @param url
     */

    onLoadDocumentWithData(data: Array<LdJsonObject>, url : string) {
        this.mainPage = data; // backup core page
        this.setData(data, url);
        // Quick hack to make page jump to needed section after page have been edited
        this.updateHook = () => this._forceHash();
        this.extractPageNavigation(data);
        this.setState({mainPage: data});
    }

    extractPageNavigation(data: Array<LdJsonObject>) {
        const toc = new TableOfContents();
        const [coverItems,articleItems,externalItems] = toc.getArticleItems(window.location,this.type,data);
        this.setState({toc: {
            covers: coverItems,
            chapters: articleItems,
            external: externalItems
        }});
    }

    // this hook is triggered after DOM redraw, to set article hash
    // it's needed because you can't set artcile hash before article is rendered

    onPostUpdateHook() {
        if (this.updateHook) {
            this.updateHook();
            this.updateHook = null;
        }
    }


    getUrlSearch() {
        UrlMixin.searchToObject(this.url);
    }

    getData() {
        return this.data;
    }

    getUrl() {
        return this.url;
    }



    getJsonLDProperty (field: string) {
        let ret = null;
        this.mainPage.forEach((section : LdJsonObject) => {
            const data = section.data[field];
            if (data) {
                ret = data;
            }
        });
        return ret;
    }

    hasCommentId() {
        var comment = this.getJsonLDProperty('comment');
        return comment !== null;
    }


    hasArticle() {
        var r = false;
        this.data.forEach((e : LdJsonObject) => {
            if (e.getType() === 'Article') {
                r = true;
            }
        });
        return r;
    }

    setData(data: Array<LdJsonObject>, url:string, type?: string) {
        this.url = url;
        this.data = data;
        if (!type) {
            this.type = UrlMixin.searchToObject(url).list;
            if (typeof this.type == 'string') {
                this.type = this.type.toLowerCase();
            }
        } else {
            this.type = type;
        }

    }

    _forceHash() {
        setTimeout(() => {
            const orig = window.location.hash;
            window.location.hash = orig + ' ';
            window.location.hash = orig;

        },100);
    }


    _setLoadingError() {
        this.loading = {error: "Cannot get page"};
        this.trigger({'error':true});
        console.log("Error getting page");
    }

    _resetError() {
        this.trigger({'error':false});
    }

    onLoadDocumentWithUrl(url: string, type: string) {
        this.loading = true;
        this.trigger({"loading":true});
        getHttp(url,(data) => {
            if (!data) {
                this._setLoadingError();
                this.data = [];
                return;
            }
            this.setData(data, url, type);
            this.loading = false;
            this.trigger({'change':true});
        });
    }

    onLoadList(name: string,data: Object, type?: string) {
        this.lists[name.toLowerCase()] = {
            "data": data,
            "type": type
        };
        this.trigger({'change':'true'});
    }

    performPageTransaction(path: string) {
        history.pushState({},window.location.path,path);
        this.onUpdateUrl();
    }

    onUpdateUrl() {
        var obj = UrlMixin.searchToObject();
        this.url = window.location.href;
        this.trigger({'urlChanged':obj});
    }


    getDocument() {
        return this.data;
    }

    getListItem(name: string) {
        return this.lists[name.toLowerCase()];
    }

    onChangeDocumentChapter(type : string, id: string) {
        this.data = this.mainPage;
        this.type = type;
        this.setData(this.data,'',type);
        this.trigger({'change':'true'});

    }


    // methods what was in the center.js store
    _setUrlWithParams (type: string, name : string, isRet: boolean) {
        // TODO type have no meaning in current realization
        var search = '?list=' + name,
            path = window.location.pathname + search;
        if (isRet) {
            return path;
        } else {
            window.history.pushState('page', 'params', path);
        }
        this.onUpdateUrl();
    }

    _setUrlWithHash (name:string, isRet: boolean) {
        window.history.pushState('page', 'params', window.location.pathname);
        window.location.hash = name;
        this.updateHook = () => this._forceHash();
        this.onUpdateUrl();
    }

    // this actions are called when browsing through the right menu

    onExternal (url: string, name: string, isRet : boolean, cb: Function) {
        console.log("====OnEXTERNAL",name);
        var type = 'external';
        cb ? cb(this._setUrlWithParams(type, name, isRet)) : this._setUrlWithParams(type, name, isRet);
    }

    onCover (url: string, name: string, init: boolean, isRet: boolean) {
        console.log("====OnCOVER");
        if (!init) {
            this._setUrlWithParams('cover', name, isRet);
        }
    }
    onArticle (id: string, hash: string, isRet: boolean) {
        this._resetError();
        console.log("====OnARTICLE");
        var type = 'article';
        this._setUrlWithHash(hash, isRet);
        this.onChangeDocumentChapter(type,id);
    }

};



function isCover(o: Object) : boolean {
    return o.url && (typeof o.url === 'string') && (o.url.indexOf('?cover') === o.url.length - 6); // TODO: maybe regexp would be better, huh?
}

const hashEquals = (location: Object) => (itemHash : string) : boolean => {
    var currentHash = location.hash.substring(1);
    return replaceSpaces(itemHash) === currentHash;
};

// TODO: move to utils somewhere !!!!
export function replaceSpaces(str : string) : string {
    if (typeof str === "string") {
        return str.replace(/ /g, '_');
    } else {
        return str;
    }
}

class MenuItem {
    name: string;
    url: string;
    active: boolean;

    constructor(name: string,url: string, active: boolean) {
        this.name =name;
        this.url = url;
        this.active = active;
    }
}

class TableOfContents  {
    coverItems : Array<MenuItem>;
    articleItems : Array<MenuItem>;
    externalItems: Array<MenuItem>;
    listName: string;

    processItem(item: Object, superitem: Object) {
        if (isCover(item)) {
            var isActive = this.listName === item.name.toLowerCase();
            if (this.listName === superitem.name) {
                this.coverItems.push(new MenuItem(superitem.name,superitem.url,isActive));
            } else {
                this.coverItems.push(new MenuItem(item.name,item.url,isActive));
            }
        } else {
            var isActive = this.listName === item.name.toLowerCase();
            this.externalItems.push(new MenuItem(item.name,item.url,isActive));
        }
    }


    getArticleItems(location: Object, listName? : string, data : Array<LdJsonObject>) : Array<mixed> {
        const hashEq : Function = hashEquals(location);
        let isActiveFirstArticle : boolean = true;

        this.coverItems= [];
        this.articleItems = [];
        this.externalItems = [];

        if (typeof listName == "string") {
            this.listName = listName.toLowerCase();
            if (this.listName) {
                isActiveFirstArticle = false; // if we have ?list=cover parameter in command line, don't highlight first article
            }
        }
        var add = (currentItem) => {

            if (currentItem.hasElementOfType("Article")) {
                var isActive = hashEq(currentItem.data.name) || isActiveFirstArticle;
                isActiveFirstArticle = false;
                this.articleItems.push(new MenuItem(
                    currentItem.data.name,
                    '#'+replaceSpaces(currentItem.data.name)
                    ,isActive));
            } else if (currentItem.getType() === 'ItemList') {
                if (!currentItem.hasElementOfType('ItemList')) {
                    this.processItem(currentItem.data, currentItem.data);
                } else {
                    currentItem.children.forEach((item) => this.processItem(item.data, currentItem.data), this);
                }
            }
            if (currentItem.hasPart()) { // recursively process all article parts
                currentItem.children.forEach(add, this);
            }
        };
        data.forEach(add);
        return [this.coverItems,this.articleItems,this.externalItems];
    }
}

export default WrioDocument;