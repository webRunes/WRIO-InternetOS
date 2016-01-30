/**
 * Created by michbil on 26.01.16.
 */

import Reflux from 'reflux';
import WindowActions from '../actions/WindowActions.js';
import {getServiceUrl,getDomain} from '../servicelocator.js';

var domain = getDomain();

module.exports = Reflux.createStore({

    init() {

        window.addEventListener('message', function (e) {
            var message = e.data;
            try {
                var msg = JSON.parse(message);
            } catch (e) {
                console.log("Error parsing the message");
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
                WindowActions.loginMessage.trigger(msg);
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

