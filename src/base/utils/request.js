/* @flow */
// $FlowFixMe
import request from 'superagent'
import {fixUrlProtocol} from '../mixins/UrlMixin'
import LdJsonDocument from '../jsonld/LdJsonDocument'
import LdJsonObject from '../jsonld/entities/LdJsonObject'


function convertScript(result : Object) : LdJsonDocument {
    var e = document.createElement('div');
    e.innerHTML = result.text;
    return new LdJsonDocument(e.getElementsByTagName('script'));
}


async function tryCrossoriginRequest(url : string) : Promise<Object> {
    console.log("Trying to reach URL via CORS ",url);
    if (url.indexOf('?') >=0) {
        url = url.substring(0, url.indexOf('?'));
    }
    url = 'https://crossorigin.me/'+url;
    return await request.get(url);
}


function alternateProtocol() : ?string {
    var currentProtocol = window.location.protocol;
    return (currentProtocol == "http:") ? "https:" : null;
}


/**
 * Tries do download remote LD+JSON page, supports both allbacks and promises
 * @param url
 * @param cb
 * @returns {Promise.<Array.<LdJsonObject>>}
 */
export default async function getHttp (url : string) : Promise<LdJsonDocument> {

    if (!url) {
        throw new Error("Assertion, no url specified");
    }

    let result = [];
    try {
        console.warn("Getting LD+JSON document from ",url,"to see graph https://wrioos.com/jsonld-vis/view/?"+url);
        result = await request.get(fixUrlProtocol(url)).redirects(1);
    } catch (err) {
        try {
            const prot = alternateProtocol();
            if (!prot) {
                console.log(err);
                result = await tryCrossoriginRequest(url);
            } else {
                result = await request.get(prot + fixUrlProtocol(url)).redirects(1);
            }
        } catch (err) {
            console.log(err);
            result = await tryCrossoriginRequest(url);
        }
    }

    if (typeof result === 'object') {
        return convertScript(result || []);
    } else {
        throw new Error('Got wrong response from the serever');
    }

}

