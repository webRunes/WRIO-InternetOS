/**
 * Created by michbil on 09.01.16.
 */

export function getServiceUrl(service) {
    var protocol = 'https://';
    var domain = process.env.DOMAIN;
    if (domain === 'wrioos.local') {
        protocol = window.location.protocol + '//';
    }
    if (process.env.NODE_ENV == 'development') {
        protocol = 'https:';
        if (service == 'core') {
            return 'http://core_d.wrioos.com:3033'
        }
        if (service == 'titter') {
            return 'http://titter_d.wrioos.com:3033'
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