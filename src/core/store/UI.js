import Reflux from 'reflux';
import Actions from '../actions/center';
import getHttp from './request.js';
import UrlMixin from '../mixins/UrlMixin';
import scripts from '../jsonld/scripts';
import {fixUrlProtocol} from '../mixins/UrlMixin';
import WrioDocumentActions from '../actions/WrioDocument.js';

const useCorsProxy = true;

module.exports = Reflux.createStore({
    listenables: Actions,
    mixins: [UrlMixin],

    onSwitchToEditMode: function() {
        this.trigger({
            editMode: true
        });
    },
    onShowLockup: function(state) {
        this.lockupShown = state;
    }


});