var Reflux = require('reflux'),
    Actions = require('../actions/scripts');

module.exports = Reflux.createStore({
    listenables: Actions,
    init: function () {
        if (this.data) {
            return;
        }
        var scripts = document.getElementsByTagName('script'),
            i;
        this.data = [];
        for (i = 0; i < scripts.length; i += 1) {
            if (scripts[i].type === 'application/ld+json') {
                this.data.push(JSON.parse(scripts[i].innerHTML));
            }
        }
    },
    onRead: function() {
        if (this.data === undefined) {
            this.init();
        }
        this.trigger(this.data);
    }
});
