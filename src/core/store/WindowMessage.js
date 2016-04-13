/**
 * Created by michbil on 26.01.16.
 */

import Reflux from 'reflux';
import WindowActions from '../actions/WindowActions.js';
import {getServiceUrl,getDomain} from '../servicelocator.js';

var domain = getDomain();

var loginMessage = false;

module.exports = Reflux.createStore({


    onResetLogin() {
        loginMessage = false;
    },

    init() {

        this.listenTo(WindowActions.resetLogin,this.onResetLogin);

        window.addEventListener('message', function (e) {
            var message = e.data;

            console.log("WINDOW MESSAGE++++++++++++++++++++++++++",e.data);
            try {
                var msg = JSON.parse(message);
            } catch (e) {
               // console.log("Error parsing the message");
                return;
            }

            var httpChecker = new RegExp('^(http|https)://titter.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                WindowActions.titterMessage.trigger(msg);
            }

            httpChecker = new RegExp('^(http|https)://core.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                WindowActions.coreMessage.trigger(msg);
            }
            httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                if (msg.login === "success") {
                    console.log("Requesting page reload");
                    document.getElementById('loginbuttoniframe').contentWindow.postMessage('reload', getServiceUrl('login'));
                    loginMessage = false;
                }

                if (msg.profile) {
                    if (!loginMessage) {
                        loginMessage = true;
                        WindowActions.loginMessage.trigger(msg); // leave only one profile message
                    }
                } else {
                    WindowActions.loginMessage.trigger(msg); // leave only one profile message
                }



            }
            httpChecker = new RegExp('^(http|https)://webgold.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                WindowActions.webGoldMessage.trigger(msg);
            }
            httpChecker = new RegExp('^(http|https)://chess.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                WindowActions.chessMessage.trigger(msg);
            }

        });

    }

});

