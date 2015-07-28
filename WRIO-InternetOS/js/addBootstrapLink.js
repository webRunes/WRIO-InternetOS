var cssUrl = require('./global').cssUrl,
    theme = require('./global').theme;

module.exports = function (cb) {
    var css = [
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
            cssUrl + theme + '/css/webrunes.css'
        ],
        count = css.length,
        counter = function () {
            count -= 1;
            if (count === 0) {
                cb();
            }
        },
        e;
    css.forEach(function (href) {
        var link;
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = counter;
        document.head.appendChild(link);
    });
    e = document.createElement('link');
    e.rel = 'shortcut icon';
    e.href = cssUrl + theme + '/ico/favicon.ico';
    document.head.appendChild(e);

    var js = [];


    js.forEach(function (src) {
        var script;
        script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', src);
        document.body.appendChild(script);
    });
};
