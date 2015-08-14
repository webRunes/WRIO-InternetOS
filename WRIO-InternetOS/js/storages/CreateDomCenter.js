var Reflux = require('reflux'),
    Actions = require('../actions/CreateDomCenter');

module.exports = Reflux.createStore({
    listenables: Actions,
    onShow: function (type) {
    	if (type === undefined) {
    		type = 'article';
    	}
        this.trigger(type);
    }
});
