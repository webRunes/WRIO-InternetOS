var cutZone = function (url) {
    var separatorPosition = url.indexOf('//');
    if (separatorPosition !== -1) {
        url = url.substring(separatorPosition + 2, url.length);
    }
    return url;
};

var cutTail = function (url) {
    var separators = ['?', '#'];
    separators.forEach(function (separator) {
        var separatorPosition = url.indexOf(separator);
        if (separatorPosition !== -1) {
            url = url.substring(0, separatorPosition);
        }
    });
    return url;
};

var cutIndex = function (url) {
    return url.replace('/index.htm', '');
};

var cutLastSlash = function (url) {
    return url.replace(/\/+$/, '');
};

module.exports = function (url) {
    if ((typeof url === 'string') && (url.length > 0)) {
        [
            cutZone,
            cutTail,
            cutIndex,
            cutLastSlash
        ].forEach(function (rule) {
            url = rule(url);
        });
    }
    return url;
};
