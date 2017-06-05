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
    var development = host.match(/titter_d/);

    host = host.replace('titter.', 'webgold.');
    host = host.replace('titter_d.', 'webgold.');
    if (development) { // hack to use production protocol during frontend development
        return 'https://'+host;
    }
    return "//" + host;
}

export function getTitterUrl() {
    const proto = process.env.DOMAIN == 'wrioos.local' ? 'http' : 'https:';
    return `${proto}://titter.${process.env.DOMAIN}`;
}

window.goAddFunds = () => {
    parent.postMessage(JSON.stringify({"goAddFunds":true}), "*");
};
export function loadDraft() {
    if (window.localStorage['draft']) {
        const title = window.localStorage['draft_title'];
        const text= window.localStorage['draft'];
        window.localStorage.removeItem('draft_title');
        window.localStorage.removeItem('draft');
        return [title,text];
    } else {
        return ['',''];
    }
}

export function saveDraft(title,text) {
    window.localStorage['draft'] = text;
    window.localStorage['draft_title'] = title;
}


export const delay = (time) => new Promise((resolve,reject) => setTimeout(resolve,time));

