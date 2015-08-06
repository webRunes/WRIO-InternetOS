var UrlMixin = {
    getUrlParams: function() {
        return window.location.search.substring(1);
    },
    getAliasByType: function(type) {
        return {
            cover: 'Cover',
            external: 'Blog'
        }[type];
    },
    searchToObject: function() {
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
    }


};

module.exports = UrlMixin;
