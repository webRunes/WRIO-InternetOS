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

    hasArticle() {
        var r = false;
        this.data.forEach((e) => {
            if (e['@type'] !== 'Article') {
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

    onLoadDocumentWithData(data,url) {
        this.mainPage = data; // backup core page
        this.setData(data,url);
        this.trigger({'change':true});
    },

    onLoadDocumentWithUrl(url, type) {
        this.loading = true;
        this.trigger({"loading":true});
        getHttp(url,(data) => {
            if (data === null) {
                this.loading = {error: "Cannot get page"};
                this.trigger({'error':true});
                this.data = {};
                console.log("Error getting page");
                return;
            }
            this.setData(data, url, type);
            this.loading = false;
            this.trigger({'change':true});
        });
    },

    onLoadList(name,data) {
        this.lists[name.toLowerCase()] = data;
        this.trigger({'change':'true'});
    },

    performPageTransaction(path) {
        history.pushState({},window.location.path,path);
        this.onUpdateUrl();
    },

    onUpdateUrl() {
        var obj = UrlMixin.searchToObject();
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
        this.trigger({'change':'true'});
    }

});