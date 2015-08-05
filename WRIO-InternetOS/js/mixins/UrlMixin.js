var UrlMixin = {
    getUrlParams: function() {
        return window.location.search.substring(1);
    }
};

module.exports = UrlMixin;
