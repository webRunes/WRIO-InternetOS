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
    setUrlWithParams: function(params) {
        var search = '?' + params,
            path = window.location.pathname + search;
        window.history.pushState('page2', 'Title', path);
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
        this.setUrlWithParams(type);
        this.trigger({
            type: type,
            id: id
        });
    }
});
