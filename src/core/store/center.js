import Reflux from 'reflux';
import Actions from '../actions/center';
import getHttp from './request.js';
import UrlMixin from '../mixins/UrlMixin';
import scripts from '../jsonld/scripts';
import {fixUrlProtocol} from '../mixins/UrlMixin';
import WrioDocumentActions from '../actions/WrioDocument.js';

const useCorsProxy = true;

module.exports = Reflux.createStore({
    listenables: Actions,
    mixins: [UrlMixin],

    getHttp(url,cb) {
        getHttp(url,cb);
    },

    setUrlWithParams: function(type, name, isRet) {
        var search = '?list=' + name,
            path = window.location.pathname + search;
        if (isRet) {
            return path;
        } else {
            window.history.pushState('page', 'params', path);
        }
        WrioDocumentActions.updateUrl();
    },
    setUrlWithHash: function(name, isRet) {
        if (isRet) {
            return window.location.pathname + '#' + name;
        } else {
            window.history.pushState('page', 'params', window.location.pathname);
            window.location.hash = name;
        }
        WrioDocumentActions.updateUrl();
    },
    onExternal: function(url, name, isRet, cb) {
        console.log("====OnEXTERNAL",name);
        var type = 'external';
        cb ? cb(this.setUrlWithParams(type, name, isRet)) : this.setUrlWithParams(type, name, isRet);
        this.getHttp(url, (data) => {
            WrioDocumentActions.loadList(name,data);
        });
    },
    onCover: function(url, init, isRet, cb) {
        console.log("====OnCOVER");
        var type = 'cover',
            name = 'Cover';
        if (!init) {
            cb ? cb(this.setUrlWithParams(type, name, isRet)) : this.setUrlWithParams(type, name, isRet);
        }
  //      WrioDocumentActions.loadDocumentWithUrl(url,type);
        this.getHttp(url, (data) => {
            WrioDocumentActions.loadList('cover',data);
        });

    },
    onArticle: function(id, isRet, cb) {
        console.log("====OnARTICLE");
        var type = 'article';
        cb ? cb(this.setUrlWithHash(id, isRet)) : this.setUrlWithHash(id, isRet);
        WrioDocumentActions.changeDocumentChapter.trigger(type,id);
    },
    onSwitchToEditMode: function() {
        this.trigger({
            editMode: true
        });
    },
    onShowLockup: function(state) {
        this.lockupShown = state;
    }
});
