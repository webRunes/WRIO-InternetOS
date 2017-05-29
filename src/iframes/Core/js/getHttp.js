/**
 * Created by michbil on 13.04.16.
 */
import request from 'superagent';
import {scripts} from './mentions/scripts.js';

const getScript = (result)=> {
    let e = document.createElement('div');
    e.innerHTML = result.text;
    return scripts(e.getElementsByTagName('script'));
};

const fixUrlProtocol = (url)=> {
    if (!url) {
        return null;
    } else {
        let separatorPosition = url.indexOf('//');
        if (separatorPosition !== -1) {
            url = url.substring(separatorPosition + 2, url.length);
        }
        return '//' + url;
    }
};

const tryCors = (url)=>
    new Promise((resolve, reject)=> {
        console.log("Trying to reach URL via CORS ", url);
        if (url.indexOf('?') >= 0) {
            url = url.substring(0, url.indexOf('?'));
        }
        url = `https://crossorigin.me/${url}`;
        request.get(
            url,
            (err, result = []) => {
                if (!err && (typeof result === 'object')) {
                    console.log("CORS proxy request succeeded");
                    result = getScript(result);
                    if(result instanceof Array && result.length >= 0) {
                        resolve(result);
                    } else {
                        reject('empty');
                    }
                } else {
                    reject(err);
                }
            }
        );
    });


// All http requests are made in 3 sequential steps, page is tried to be accessed with current // protocol,
// if failed - then with alternate protocol
// else trying

const getHttp = (url)=>
    new Promise((resolve, reject)=> {
        let strippedUrl = fixUrlProtocol(url);
        if (!url) {
            reject("Assertion, no url specified");
            console.error("Assertion, no url specified");
        } else {
            request.get(
                strippedUrl,
                (err, result = [])=> {
                    if (!err && (typeof result === 'object')) {
                        result = getScript(result);
                        if(result instanceof Array && result.length >= 0) {
                            resolve(result);
                        } else {
                            reject('empty');
                        }
                    } else {
                        getDifferentProtocol(url).then(resolve).catch(reject);
                    }
                }
            );
        }
    });

const alternateProtocol = ()=>
    (window.location.protocol == 'https:') ? "http:" : "https:";

let getDifferentProtocol = (url)=>
    new Promise((resolve, reject)=> {
        let strippedUrl = `${alternateProtocol()}${fixUrlProtocol(url)}`;
        if (!url) {
            reject("Assertion, no url specified");
            console.error("Assertion, no url specified");
        } else {
            request.get(
                strippedUrl,
                (err, result = [])=> {
                    if (!err && (typeof result === 'object')) {
                        result = getScript(result);
                        resolve(result);
                    } else {
                        tryCors(url).then(resolve).catch(reject);
                    }
                }
            );
        }
    });

export default getHttp;
