/**
 * Created by michbil on 09.01.16.
 */

export function getServiceUrl(service) {
    var protocol = 'https://';
    var domain = process.env.DOMAIN;
    if (domain === 'wrioos.local') {
        protocol = 'http://';
    }
    return protocol + service + "."+domain
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