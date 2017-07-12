/**
 * Created by michbil on 10.05.16.
 */

import request from 'superagent';
var domain = process.env.DOMAIN;
let protocol = '';
if (process.env.NODE_ENV == 'development') {
    protocol = 'https:'
}

export function saveToS3(path,html) {
    return new Promise((resolve,reject) => {
        request
            .post(protocol+`//storage.${domain}/api/save`)
            .withCredentials()
            .set('Accept', 'application/json')
            .send({
                'url': path,
                'bodyData': html
            })
            .then(({body})=> {
                resolve(body);
            }, (err)=> {
                reject(err);
            });
    });
}


export function deleteFromS3(path) {
    return new Promise((resolve,reject) => {
        request
            .post(protocol+`//storage.${domain}/api/delete`)
            .withCredentials()
            .set('Accept', 'application/json')
            .send({
                'url': path,
            })
            .then(({body})=> {
                resolve(body);
            }, (err)=> {
                reject(err);
            });
    });
}

export function getWidgetID(url) {
    return new Promise((resolve,reject) => {
        request
            .get(protocol+`//titter.${domain}/obtain_widget_id?query=${url}`)
            .withCredentials()
            .then(result=> {
                resolve(result.text);
            }, (err)=> {
                reject(err);
            });
    });
}

export function getRegistredUser() {
    return new Promise((resolve,reject) => {
        request
            .get(protocol+`//login.${domain}/api/get_profile`)
            .withCredentials()
            .then(({body})=> {
                console.log("Get_profile finish", body);
                resolve(body);
            }, (err)=> {
                reject(err);
            });
    });
}
