/**
 * Created by michbil on 30.03.16.
 */
import {CrossStorageFactory} from './CrossStorageFactory.js';
import Reflux from 'reflux';
import WrioDocumentActions from "../actions/WrioDocument.js";
import CenterActions from "../actions/center.js";
import getHttp from '../store/request.js';
import UrlMixin from '../mixins/UrlMixin';

var storage = CrossStorageFactory.getCrossStorage();

export default Reflux.createStore({
    listenables: WrioDocumentActions,

    init() {
      this.loading = false;
      this.lists = {};
      this.updateIndex = 0;
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
            const data = section[field];
            if (data) {
                return data;
            }
        }
        return null;
    },

    hasCommentId() {
        var comment = this.getJsonLDProperty('comment');
        if (comment) return true;
    },


    hasArticle() {
        var r = false;
        this.data.forEach((e) => {
            //if (e.getType() === 'Article') {
            if (e['@type'] === 'Article') {
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
        this.updateIndex++;
        this.trigger({'change':true});
        // Quick hack to make page jump to needed section after page have been edited
        setTimeout(() => {
            const orig = window.location.hash;
            window.location.hash = orig + ' ';
            window.location.hash = orig;

        },500);
    },

    onLoadDocumentWithUrl(url, type) {
        this.loading = true;
        this.trigger({"loading":true});
        getHttp(url,(data) => {
            if (data === null) {
                this.loading = {error: "Cannot get page"};
                this.updateIndex++;
                this.trigger({'error':true});
                this.data = {};
                console.log("Error getting page");
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
      //  this.updateIndex++;
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
    }


});