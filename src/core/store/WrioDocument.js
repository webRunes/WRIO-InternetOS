/**
 * Created by michbil on 30.03.16.
 */
import {CrossStorageFactory} from './CrossStorageFactory.js';
import Reflux from 'reflux';
import WrioDocumentActions from "../actions/WrioDocument.js";
import getHttp from '../store/request.js';
import UrlMixin from '../mixins/UrlMixin';

var storage = CrossStorageFactory.getCrossStorage();

export default Reflux.createStore({
    listenables: WrioDocumentActions,

    init() {
      this.loading = false;
      this.lists = {};
      this.updateIndex = 0;
        this.updateHook = null;
    },

    // this hook is triggered after DOM redraw, to set article hash
    // it's needed because you can't set artcile hash before article is rendered

    onPostUpdateHook() {
        if (this.updateHook) {
            this.updateHook();
            this.updateHook = null;
        }
    },

    getListType() {
        return this.type;
    },

    getUrlSearch() {
        UrlMixin.searchToObject(this.url);
    },

    getData() {
        return this.data;
    },
    getUrl() {
        return this.url;
    },

    getId() {
        return this.id;
    },

    getLoading() {
        return this.loading;
    },

    getJsonLDProperty: function (field) {
        for (let section of this.mainPage) {
            const data = section.data[field];
            if (data) {
                return data;
            }
        }
        return null;
    },

    hasCommentId() {
        var comment = this.getJsonLDProperty('comment');
        return comment !== null;
    },


    hasArticle() {
        var r = false;
        this.data.forEach((e) => {
            if (e.getType() === 'Article') {
                r = true;
            }
        });
        return r;
    },

    setData(data,url,type) {
        this.url = url;
        this.data = data;
        this.id = null;
        if (!type) {
            this.type = UrlMixin.searchToObject(url).list;
            if (typeof this.type == 'string') {
                this.type = this.type.toLowerCase();
            }
        } else {
            this.type = type;
        }

    },

    _forceHash() {
        setTimeout(() => {
            const orig = window.location.hash;
            window.location.hash = orig + ' ';
            window.location.hash = orig;

        },100);
    },

    onLoadDocumentWithData(data,url) {
        this.mainPage = data; // backup core page
        this.setData(data,url);
        this.updateIndex++;
        this.trigger({'change':true});
        // Quick hack to make page jump to needed section after page have been edited
        this.updateHook = () => this._forceHash();
    },

    _setLoadingError() {
        this.loading = {error: "Cannot get page"};
        this.updateIndex++;
        this.trigger({'error':true});
        console.log("Error getting page");
    },

    _resetError() {
        this.updateIndex++;
        this.trigger({'error':false});
    },

    onLoadDocumentWithUrl(url, type) {
        this.loading = true;
        this.trigger({"loading":true});
        getHttp(url,(data) => {
            if (!data) {
                this._setLoadingError();
                this.data = {};
                return;
            }
            this.setData(data, url, type);
            this.loading = false;
            this.updateIndex++;
            this.trigger({'change':true});
        });
    },

    onLoadList(name,data) {
        this.lists[name.toLowerCase()] = data;
        this.updateIndex++;
      //  this.trigger({'change':'true'});
    },

    performPageTransaction(path) {
        history.pushState({},window.location.path,path);
        this.onUpdateUrl();
    },

    onUpdateUrl() {
        var obj = UrlMixin.searchToObject();
        this.url = window.location.href;
        this.updateIndex++;
        this.trigger({'urlChanged':obj});
    },


    getDocument() {
        return this.data;
    },

    getListItem(name) {
        return this.lists[name.toLowerCase()];
    },

    onChangeDocumentChapter(type,id) {
        this.data = this.mainPage;
        this.type = type;
        this.id = id;
        this.setData(this.data,'',type);
        //this.updateIndex++;
        this.trigger({'change':'true'});

    },

    getUpdateIndex() {
        return this.updateIndex;
    },

    // methods what was in the center.js store
    _setUrlWithParams: function(type, name, isRet) {
        var search = '?list=' + name,
            path = window.location.pathname + search;
        if (isRet) {
            return path;
        } else {
            window.history.pushState('page', 'params', path);
        }
        this.onUpdateUrl();
    },
    _setUrlWithHash: function(name, isRet) {
        window.history.pushState('page', 'params', window.location.pathname);
        window.location.hash = name;
        this.updateHook = () => this._forceHash();
        this.onUpdateUrl();
    },

    // this actions are called when browsing through the right menu

    onExternal: function(url, name, isRet, cb) {
        console.log("====OnEXTERNAL",name);
        var type = 'external';
        cb ? cb(this._setUrlWithParams(type, name, isRet)) : this._setUrlWithParams(type, name, isRet);
        getHttp(url, (data) => {
            this.onLoadList(name,data);
        });
    },
    onCover: function(url, init, isRet, cb) {
        console.log("====OnCOVER");
        var type = 'cover',
            name = 'Cover';
        if (!init) {
            cb ? cb(this._setUrlWithParams(type, name, isRet)) : this._setUrlWithParams(type, name, isRet);
        }
        //      WrioDocumentActions.loadDocumentWithUrl(url,type);
        getHttp(url, (data) => {
            this.onLoadList('cover',data);
        });

    },
    onArticle: function(id, hash, isRet) {
        this._resetError();
        console.log("====OnARTICLE");
        var type = 'article';
        this._setUrlWithHash(hash, isRet);
        this.onChangeDocumentChapter(type,id);
    }


});