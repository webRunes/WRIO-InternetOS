var Reflux = require('reflux'),
    Actions = require('../actions/center'),
    request = require('superagent'),
    UrlMixin = require('../mixins/UrlMixin'),
    scripts = require('../jsonld/scripts');


module.exports = Reflux.createStore({
    listenables: Actions,
    mixins: [UrlMixin],

    fixUrlProtocol: function (url) {
        var parsedUrl = this.parseUrl(url);
        if ((this.getCurrentProtocol() === 'https:') && (parsedUrl.protocol === "http:")) {
            parsedUrl.protocol = 'https:'; // let's try to get requested resource by https instead of http, if current protocol is https
            url = this.collectUrl(parsedUrl);
        }
        return url;
    },

    getHttp: function (url, cb) {
        url = this.fixUrlProtocol(url);
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
    setUrlWithParams: function(type, name) {
        var search = '?list=' + name,
            path = window.location.pathname + search;
        window.history.pushState('page', 'params', path);
    },
    setUrlWithHash: function(name) {
        window.history.pushState('page', 'params', window.location.pathname);
        window.location.hash = name;
    },
    onExternal: function(url, name) {
        var type = 'external';
        this.setUrlWithParams(type, name);
        this.getHttp(url, (data) => {
            this.trigger({
                type: type,
                data: data
            });
        });
    },
    onCover: function(url, init) {
        var type = 'cover',
            name = 'Cover';
        if (!init) {
            this.setUrlWithParams(type, name);
        }
        this.getHttp(url, (data) => {
            this.trigger({
                type: type,
                data: data
            });
        });
    },
    onArticle: function(id) {
        var type = 'article';
        this.setUrlWithHash(id);
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
