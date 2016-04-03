/**
 * Created by michbil on 30.03.16.
 */
import {CrossStorageFactory} from './CrossStorageFactory.js';
import Reflux from 'reflux';
import WrioDocumentActions from "../actions/WrioDocument.js";
import StoreLD from '../store/center.js';
import UrlMixin from '../mixins/UrlMixin';

var storage = CrossStorageFactory.getCrossStorage();

export default Reflux.createStore({
    listenables: WrioDocumentActions,

    constructor() {
      this.loading = false;
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

    getLoading() {
        return this.loading;
    },

    hasArticle() {
        this.data.forEach((e) => {
            if (e['@type'] !== 'Article') {
                return true;
            }
        });
        return false;
    },

    setData(data,url) {
        this.url = url;
        this.data = data;
        this.type = UrlMixin.searchToObject(url).list;
        if (typeof this.type == 'string') {
            this.type = this.type.toLowerCase;
        }
    },

    onLoadDocumentWithData(data,url) {
        this.setData(data,url);
        this.trigger({'change':true});
    },

    onLoadDocumentWithUrl(url) {
        this.loading = true;
        this.trigger({"loading":true});
        StoreLD.getHttp(url,(data) => {
            if (data === []) {
                this.loading = {error: "Cannot get page"};
                return;
            }
            this.setData(data,url);
            this.loading = false;
            this.trigger({'change':true});
        });
    },

    getDocument() {
        return this.data;
    }

});