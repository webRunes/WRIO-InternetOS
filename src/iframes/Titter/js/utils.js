/**
 * Created by michbil on 05.03.17.
 */

// Return cookie as "name". "undefined" is a default name
export function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function getLoginUrl() {

    var host = window.location.host;
    host = host.replace('titter.', 'login.');
    return "//" + host;

}

export function getWebgoldUrl() {

    var host = window.location.host;
    host = host.replace('titter.', 'webgold.');
    return "//" + host;

}

window.goAddFunds = () => {
    parent.postMessage(JSON.stringify({"goAddFunds":true}), "*");
};


export function loadDraft() {
    if (window.localStorage['draft']) {
        document.getElementById('IDtweet_title').value = window.localStorage['draft_title'];
        document.getElementById('comment').value = window.localStorage['draft'];
        window.localStorage.removeItem('draft_title');
        window.localStorage.removeItem('draft');
    }


}

export function saveDraft() {
    var text = document.getElementById('comment').value;
    var title = document.getElementById('IDtweet_title').value;
    console.log(title);
    window.localStorage['draft'] = text;
    window.localStorage['draft_title'] = title;
}


export const delay = (time) => new Promise((resolve,reject) => setTimeout(resolve,time));

