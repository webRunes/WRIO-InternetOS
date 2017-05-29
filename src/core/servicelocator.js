/**
 * Created by michbil on 09.01.16.
 */

export function getServiceUrl(service) {
    var protocol = 'https://';
    var domain = process.env.DOMAIN;
    if (domain === 'wrioos.local') {
        protocol = window.location.protocol + '//';
    }
    var domain = process.env.DOMAIN;
    var protocol = process.env.NODE_ENV == 'development' ? 'https:' : window.location.protocol;
    if (process.env.NODE_ENV == 'development') {
        if (service == 'core') {
            return 'http://core_d.wrioos.com'
        }
        if (service == 'titter') {
            return 'http://titter_d.wrioos.com'
        }
    }
    return protocol + "//" + service + "." + domain;
}

export function getDomain() {
    var domain = '';

    if (process.env.DOMAIN == undefined) {
        domain = 'wrioos.com';
    } else {
        domain = process.env.DOMAIN;
    }
    return domain;
}

export function getTitterIframe() {

}


export function getCoreIframe() {

}