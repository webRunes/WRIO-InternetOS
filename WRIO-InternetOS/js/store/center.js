var Reflux = require('reflux'),
    Actions = require('../actions/center'),
    request = require('superagent'),
    scripts = require('../jsonld/scripts');


module.exports = Reflux.createStore({
    listenables: Actions,
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
    getAliasByType: function(type) {
        return {
            cover: 'Cover',
            external: 'Blog'
        }[type];
    },
    setUrlWithParams: function(type) {
        var search = '?list=' + this.getAliasByType(type),
            path = window.location.pathname + search;
        window.history.pushState('page', 'params', path);
    },
    setUrlWithoutParams: function() {
        window.history.pushState('page', 'params', window.location.pathname);
    },
    onExternal: function (url) {
        var type = 'external';
        this.setUrlWithParams(type);
        this.getHttp(url, function (data) {
            this.trigger({
                type: type,
                data: data
            });
        }.bind(this));
    },
    onCover: function () {
        var type = 'cover';
        this.setUrlWithParams(type);
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
