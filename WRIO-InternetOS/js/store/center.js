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
    setUrlWithoutParams: function() {
        window.history.pushState('page', 'params', window.location.pathname);
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
    onCover: function () {
        var type = 'cover',
            name = 'Cover';
        this.setUrlWithParams(type, name);
        this.trigger({
            type: type
        });
    },
    onArticle: function (id) {
        var type = 'article';
        this.setUrlWithoutParams();
        this.trigger({
            type: type,
            id: id
        });
    }
});
