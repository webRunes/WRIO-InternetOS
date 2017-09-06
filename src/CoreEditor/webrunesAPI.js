/**
 * Created by michbil on 10.05.16.
 */

import request from 'superagent';
const domain = () => process.env.DOMAIN;
const protocol = () => (process.env.NODE_ENV == 'development') ? 'https:' : ''

export function saveToS3(path,html) {
    const uri = protocol() + `//storage.${domain()}/api/save`
    console.log(uri)
    return request
        .post(uri)
        .withCredentials()
        .set('Accept', 'application/json')
        .send({
            'url': path,
            'bodyData': html
        });
}


export function deleteFromS3(path) {
        return request
            .post(protocol()+`//storage.${domain()}/api/delete`)
            .withCredentials()
            .set('Accept', 'application/json')
            .send({
                'url': path,
            });
}

export function getWidgetID(url) {
    const uri = protocol()+`//titter.${domain()}/obtain_widget_id?query=${url}`
    return request
            .get(uri)
            .withCredentials();
}

export function getRegistredUser() {
        return request
            .get(protocol()+`//login.${domain()}/api/get_profile`)
            .withCredentials();

}
