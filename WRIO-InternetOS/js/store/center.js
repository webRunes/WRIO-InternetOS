var Reflux = require('reflux'),
    Actions = require('../actions/center');

module.exports = Reflux.createStore({
    listenables: Actions,
    onExternal: function (url) {
        this.trigger({
            type: 'external',
            url: url
        });
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
