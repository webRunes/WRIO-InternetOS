var Reflux = require('reflux'),
    Actions = require('./actions/scripts');

module.exports = Reflux.createStore({
    listenables: Actions,
    init: function () {
        var scripts = document.getElementsByTagName('script'),
            i;
        this.data = this.data || [];
        for (i = 0; i < scripts.length; i += 1) {
            if (scripts[i].type === 'application/ld+json') {
                this.data.push(JSON.parse(scripts[i].innerHTML));
            }
        }
    },
    getInitialState: function () {
        return this.data || [];
    },
    onRead: function() {
        this.trigger(this.data);
    }
});
