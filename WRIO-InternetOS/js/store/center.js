var Reflux = require('reflux'),
    Actions = require('../actions/center'),
    request = require('superagent'),
    UrlMixin = require('../mixins/UrlMixin'),
    scripts = require('../jsonld/scripts');

import {fixUrlProtocol} from '../mixins/UrlMixin';

module.exports = Reflux.createStore({
    listenables: Actions,
    mixins: [UrlMixin],
/*
    fixUrlProtocol: function (url) {
        var separatorPosition = url.indexOf('//');
        if (separatorPosition !== -1) {
            url = url.substring(separatorPosition + 2, url.length);
        }
        return '//' + url;
    },
*/
    getHttp: function (url, cb) {
        url = fixUrlProtocol(url);
        request.get(
            url,
            (err, result) => {
                if (!err && (typeof result === 'object')) {
                    var e = document.createElement('div');
                    e.innerHTML = result.text;
                    result = scripts(e.getElementsByTagName('script'));
                }
                cb.call(this, result || []);
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
    }
});
