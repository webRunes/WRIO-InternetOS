var Reflux = require('reflux'),
    Actions = require('../actions/scripts');

module.exports = Reflux.createStore({
    listenables: Actions,
    init: function () {
        if (this.data) {
            return;
        }
        var scripts = document.getElementsByTagName('script'),
            i,
            json;
        this.data = [];
        for (i = 0; i < scripts.length; i += 1) {
            if (scripts[i].type === 'application/ld+json') {
                json = undefined;
                try {
                    json = JSON.parse(scripts[i].textContent);
                } catch (exception) {
                    json = undefined;
                    console.error('Your json-ld not valid: ' + exception);
                }
                if (typeof json === 'object') {
                    this.data.push(json);
                }
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
