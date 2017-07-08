/**
 * Created by michbil on 23.05.17.
 */

import request from 'superagent';
import {getDomain} from '../servicelocator.js'

export function isSafari() {
    var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
    if ((is_chrome)&&(is_safari)) {is_safari=false;}
    return is_safari
}

const domain = getDomain();
async function getPlus(data) {
    return request
        .get(`//storage.${domain}/api/plusData`)
        .set('Accept', 'application/json')
        .send({
            'data': data
        });
}


async function persistPlus(data) {
   return request
        .post(`//storage.${domain}/api/plusData`)
        .set('Accept', 'application/json')
        .send({
            'data': data
        });
}


export class SafariStorage {

    constructor() {
        this.data = null;
    }

    async onConnect() {

    }

    async get(key) {
        var data = await getPlus();
        return data.key;
    }

    async set(key,data) {
        var val = this.get(key);
        val[key] = data;
        await persistPlus(val);
    }
    async del() {
        console.log("Not implemented")
    }

}
