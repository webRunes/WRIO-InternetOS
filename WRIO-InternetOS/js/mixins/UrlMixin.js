var UrlMixin = {
    getUrlParams: () => {
        return window.location.search.substring(1);
    },
    getAliasByType: (type) => {
        return {
            cover: 'Cover',
            external: 'Blog'
        }[type];
    },
    searchToObject: () => {
        var pairs = window.location.search.substring(1).split('&'),
            obj = {},
            pair,
            i;

        for ( i in pairs ) {
            if ( pairs[i] === '' ) {
                continue;
            }
            pair = pairs[i].split('=');
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return obj;
    },
    parseUrl: (url) => {
        var parser = document.createElement('a');
        parser.href = url;
        return parser;
    },
    collectUrl: (parsedUrl) => { return parsedUrl.href; },
    getCurrentProtocol: () => {
        return window.location.protocol;
    }
};

export default UrlMixin;
