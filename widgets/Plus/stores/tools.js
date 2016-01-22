var sortBy = require('lodash.sortby'),
    request = require('superagent');

module.exports.lastOrder = function (x) {
    var keys = Object.keys(x),
        max = (keys.length === 0) ? 0 : x[keys[0]].order,
        i;
    for (i = 1; i < keys.length; i += 1) {
        var order = x[keys[i]].order;
        if (order > max) {
            max = order;
        }
    }
    return max;
};

module.exports.getNext = function (data, current) {
    var obj = data.children || data;
    if (!obj[current].active) {
        return undefined;
    }
    var children = sortBy(
        Object.keys(obj).map(function (name) {
            return obj[name];
        }),
        'order'
    ),
        i,
        child,
        next;
    for (i = 0; i < children.length; i += 1) {
        child = children[i];
        if (child.url === current) {
            break;
        }
    }
    next = children[i - 1] || children[i + 1];
    return next ? next.url : data.url;
};

module.exports.getJsonldsByUrl = function (url, cb) {
    var self = this;
    request.get(
        url,
        function (err, result) {
            if (!err && (typeof result === 'object')) {
                var e = document.createElement('div');
                e.innerHTML = result.text;
                result = Array.prototype.filter.call(e.getElementsByTagName('script'), function (el) {
                    return el.type === 'application/ld+json';
                }).map(function (el) {
                    var json;
                    try {
                        json = JSON.parse(el.textContent);
                    } catch (exception) {
                        console.error('Requested json-ld from ' + url + ' not valid: ' + exception);
                    }
                    return json;
                }).filter(function (json) {
                    return typeof json === 'object';
                });
            }
            cb.call(self, result || []);
        }
    );
};
