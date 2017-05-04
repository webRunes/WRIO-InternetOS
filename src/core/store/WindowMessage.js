/**
 * Created by michbil on 26.01.16.
 */

import Reflux from 'reflux';
import WindowActions from '../actions/WindowActions.js';
import {getServiceUrl,getDomain} from '../servicelocator.js';

var domain = getDomain();



module.exports = Reflux.createStore({


    onResetLogin() {
    },

    parseMessage(e) {
        const message = e.data;
        if (this.debugMessages) {
            console.log("WINDOW MESSAGE++++++++++++++++++++++++++",e.data);
        }
        try {
            return JSON.parse(message);
        } catch (e) {
            return null;
        }
    },

    checkForService(name,e) {
        var httpChecker = new RegExp('^(http|https)://' + name + '.' + domain, 'i');
        return httpChecker.test(e.origin);
    },

    messageListener(e) {
        const msg = this.parseMessage(e);
        if (msg === null) {
            return;
        }

        if (this.checkForService('titter',e)) {
            if (msg.reload) {
                WindowActions.forceIframeReload.trigger();
            }
            WindowActions.titterMessage.trigger(msg);
        }
        if (this.checkForService('core',e)) {
            if (msg.reload) {
                window.location.reload();
            }
            WindowActions.coreMessage.trigger(msg);
        }
        if (this.checkForService('login',e)) {
            if (msg.login === "success") {
                console.log("Requesting page reload");
                document.getElementById('loginbuttoniframe').contentWindow.postMessage('reload', getServiceUrl('login'));
                WindowActions.forceIframeReload.trigger();
            }

            if (msg.profile) {
                WindowActions.loginMessage.trigger(msg); // leave only one profile message
                document.getElementById('loginbuttoniframe').contentWindow.postMessage('ack', getServiceUrl('login'));
            } else {
                WindowActions.loginMessage.trigger(msg); // leave only one profile message
            }
        }

        if (this.checkForService('webgold',e)) {
            if (msg.reload) {
                window.location.reload();
            }
            WindowActions.webGoldMessage.trigger(msg);
        }
        if (this.checkForService('chess',e)) {
            WindowActions.chessMessage.trigger(msg);
        }

    },

    init() {
        this.debugMessages = false;
        this.listenTo(WindowActions.resetLogin,this.onResetLogin);
        window.addEventListener('message', this.messageListener);
    }

});

