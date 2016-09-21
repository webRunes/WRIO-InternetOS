import request from 'superagent';
import {fixUrlProtocol} from '../mixins/UrlMixin';
import LdJsonManager from '../jsonld/scripts';

function getScript(result) {
    var e = document.createElement('div');
    e.innerHTML = result.text;
    var manager = new LdJsonManager(e.getElementsByTagName('script'));
    return manager.getBlocks();
}


function tryCors(url,cb) {
    console.log("Trying to reach URL via CORS ",url);
    if (url.indexOf('?') >=0) {
        url = url.substring(0, url.indexOf('?'));
    }
    url = 'https://crossorigin.me/'+url;
    request.get(
        url,
        (err, result) => {
            if (!err && (typeof result === 'object')) {
                console.log("CORS proxy request succeeded");
                result = getScript(result);
                cb.call(this, result || []);
            } else {
                cb.call(this,null);
            }

        }
    );
}

// All http requests are made in 3 sequential steps, page is tried to be accessed with current // protocol,
// if failed  1- then with alternate protocol
// else trying


export default function getHttp(url, cb) {
    console.warn("Getting LD+JSON document from ",url,"to see graph https://wrioos.com/jsonld-vis/view/?"+url);
    var strippedUrl = fixUrlProtocol(url);

    if (!url) {
        return console.log("Assertion, no url specified");
    }

    request.get(
        strippedUrl,
        (err, result) => {
            if (!err && (typeof result === 'object')) {
                result = getScript(result);
                cb.call(this, result || []);
            } else {
                getDifferentProtocol(url,cb);
            }

        }
    );
}

function alternateProtocol() {
    var currentProtocol = window.location.protocol;
    if (currentProtocol == "http:") {
        return "https:";
    }
    if (currentProtocol == "https:") {
        return "http:";
    }
    return "https:";
}

function getDifferentProtocol (url, cb) {
    var strippedUrl = alternateProtocol() + fixUrlProtocol(url);

    if (!url) {
        return console.log("Assertion, no url specified");
    }

    request.get(
        strippedUrl,
        (err, result) => {
            if (!err && (typeof result === 'object')) {
                result = getScript(result);
                cb.call(this, result || []);
            } else {
                tryCors(url,cb);
            }

        }
    );
}
