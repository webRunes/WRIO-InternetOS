import Reflux from 'reflux';
import Actions from '../actions/center';
import request from 'superagent';
import UrlMixin from '../mixins/UrlMixin';
import scripts from '../jsonld/scripts';
import {fixUrlProtocol} from '../mixins/UrlMixin';
import {WrioDocument} from './WrioDocument.js';

const useCorsProxy = true;

module.exports = Reflux.createStore({
    listenables: Actions,
    mixins: [UrlMixin],

    getScript(result) {
        var e = document.createElement('div');
        e.innerHTML = result.text;
        return scripts(e.getElementsByTagName('script'));
    },

    tryCors(url,cb) {
        console.log("Trying to reach URL via CORS ",url);
        url = 'https://crossorigin.me/'+url;
        request.get(
            url,
            (err, result) => {
                if (!err && (typeof result === 'object')) {
                   console.log("CORS proxy request succeeded");
                   result = this.getScript(result);
                }
                cb.call(this, result || []);
            }
        );
    },

    getHttp: function (url, cb) {
        var strippedUrl = fixUrlProtocol(url);

        request.get(
            strippedUrl,
            (err, result) => {
                if (!err && (typeof result === 'object')) {
                    result = this.getScript(result);
                    cb.call(this, result || []);
                } else {
                    this.tryCors(url,cb);
                }

            }
        );
    },
    setUrlWithParams: function(type, name, isRet) {
        var search = '?list=' + name,
            path = window.location.pathname + search;
        if (isRet) {
            return path;
        } else {
            window.history.pushState('page', 'params', path);
        }
    },
    setUrlWithHash: function(name, isRet) {
        if (isRet) {
            return window.location.pathname + '#' + name;
        } else {
            window.history.pushState('page', 'params', window.location.pathname);
            window.location.hash = name;
        }
    },
    onExternal: function(url, name, isRet, cb) {
        var type = 'external';
        cb ? cb(this.setUrlWithParams(type, name, isRet)) : this.setUrlWithParams(type, name, isRet);
        this.getHttp(url, (data) => {
            this.trigger({
                type: type,
                data: data
            });
        });
    },
    onCover: function(url, init, isRet, cb) {
        var type = 'cover',
            name = 'Cover';
        if (!init) {
            cb ? cb(this.setUrlWithParams(type, name, isRet)) : this.setUrlWithParams(type, name, isRet);
        }
        this.getHttp(url, (data) => {
            this.trigger({
                type: type,
                data: data
            });
        });
    },
    onArticle: function(id, isRet, cb) {
        var type = 'article';
        cb ? cb(this.setUrlWithHash(id, isRet)) : this.setUrlWithHash(id, isRet);
        this.trigger({
            type: type,
            id: id
        });
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
