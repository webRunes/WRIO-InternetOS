/**
 * Created by michbil on 05.03.17.
 */

import {getCookie,getLoginUrl,getWebgoldUrl} from './utils.js';

export function openAuthPopup() {
    var loginUrl = getLoginUrl();
    var callbackurl = "//" + window.location.host + '/callback';
    window.open(loginUrl + '/authapi?callback=' + encodeURIComponent(callbackurl), "Login", "height=500,width=700");
}

export function logoff() {
    $.ajax('/logoff').success(function (res) {
        location.reload();
    });
}

export function checkLoggedIn() {
    console.log(document.cookie);
    if (!getCookie('sid')) {
        openAuthPopup();
    } else {
        console.log("Cookie exists, aborting");
    }

}