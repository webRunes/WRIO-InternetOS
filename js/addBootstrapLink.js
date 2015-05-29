var cssUrl = require('./global').cssUrl,
    theme = require('./global').theme;

module.exports = function () {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css';
    document.head.appendChild(link);
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl + theme + '/css/webrunes.css';
    document.head.appendChild(link);
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.href = cssUrl + theme + '/ico/favicon.ico';
    document.head.appendChild(link);
};
