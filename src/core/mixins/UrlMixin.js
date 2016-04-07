var UrlMixin  = {
    getUrlParams() {
        return window.location.search.substring(1);
    },

    getAliasByType (type) {
        return {
            cover: 'Cover',
            external: 'Blog'
        }[type];
    },
    searchToObject (url) {

        if (url) {
            url = this.parseUrl(url).search;
        } else {
            url = window.location.search;
        }
        var pairs = url.substring(1).split('&'),
            obj = {};

        for (var i in pairs ) {
            if ( pairs[i] === '' ) {
                continue;
            }
            var pair = pairs[i].split('=');
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return obj;
    },
    parseUrl (url) {
        var parser = document.createElement('a');
        parser.href = url;
        return parser;
    },
    collectUrl  (parsedUrl)
    {
        return parsedUrl.href;
    },
    getCurrentProtocol () {
        return window.location.protocol;
    },
    fixUrlProtocol(url) {
        if (!url) {
            return;
        }
        var separatorPosition = url.indexOf('//');
        if (separatorPosition !== -1) {
            url = url.substring(separatorPosition + 2, url.length);
        }
        return '//' + url;
    },
    compareProfileUrls(url1,url2) {
        var url1P = this.parseUrl(url1);
        var url2P = this.parseUrl(url2);

        // compare hosts and paths, ignore search

        if (url1P.host === url2P.host && (url1P.pathname == url2P.pathname)) {
            return true;
        }

        return false;

    }
};

export default UrlMixin;
