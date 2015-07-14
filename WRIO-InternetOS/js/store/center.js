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
    onExternal: function (url) {
        this.getHttp(url, function (data) {
            this.trigger({
                type: 'external',
                data: data
            });
        }.bind(this));
    },
    onCover: function () {
        this.trigger({
            type: 'cover'
        });
    },
    onArticle: function (id) {
        this.trigger({
            type: 'article',
            id: id
        });
    }
});
