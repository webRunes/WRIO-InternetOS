var Reflux = require('reflux'),
    Actions = require('../actions/center'),
    request = require('superagent'),
    UrlMixin = require('../mixins/UrlMixin'),
    scripts = require('../jsonld/scripts');


module.exports = Reflux.createStore({
    listenables: Actions,
    mixins: [UrlMixin],
    getHttp: function (url, cb) {
        var self = this;
        request.get(
            url,
            function (err, result) {
                if (!err && (typeof result === 'object')) {
                    var e = document.createElement('div');
                    e.innerHTML = result.text;
                    result = scripts(e.getElementsByTagName('script'));
                }
                cb.call(self, result || []);
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
    onExternal: function (url, name) {
        var type = 'external';
        this.setUrlWithParams(type, name);
        this.getHttp(url, function (data) {
            this.trigger({
                type: type,
                data: data
            });
        }.bind(this));
    },
    onCover: function (url, init) {
        var type = 'cover',
            name = 'Cover';
        if(!init) {
            this.setUrlWithParams(type, name);
        }
        this.getHttp(url, function (data) {
            this.trigger({
                type: type,
                data: data
            });
        }.bind(this));
    },
    onArticle: function (id) {
        var type = 'article';
        this.setUrlWithHash(id);
        this.trigger({
            type: type,
            id: id
        });
    }
});
