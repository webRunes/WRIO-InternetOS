(function(){
    'use strict';

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css';
    document.head.appendChild(link);

    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'http://webrunes.github.io/Default-WRIO-Theme/css/webrunes.css';
    document.head.appendChild(link);

    link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.href = 'http://webrunes.github.io/Default-WRIO-Theme/ico/favicon.ico';
    document.head.appendChild(link);

    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js';
    document.head.appendChild(script);

    //import Login
    var login = document.createElement('link');
    login.rel = 'import';
    login.href = 'http://wrio.s3-website-us-east-1.amazonaws.com/Login-WRIO-App/Widget/template.html';
    document.head.appendChild(login);

    //import Plus
    var plus = document.createElement('link');
    plus.rel = 'import';
    plus.href = 'http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/Widget/template.html';
    document.head.appendChild(plus);

    //import menu header
    //var navbar_header = document.createElement('link');
    //navbar_header.rel = 'import';
    //navbar_header.href = 'http://wrio.s3-website-us-east-1.amazonaws.com/template.html';
    //document.head.appendChild(navbar_header);

    //import Article
    var article = document.createElement('link');
    article.rel = 'import';
    article.href = 'http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/Widget/article.html';
    document.head.appendChild(article);

    //-------------------
    var urlList = "http://webrunes.github.io/webRunes-WRIO-Hub/1WJyH1k7-list.html";
    //-------------------
    //root container
    document.write('<div class="container-liquid">' +
        '<div class="row row-offcanvas row-offcanvas-right">' +
            '<div class="col-xs-12 col-sm-3 col-md-2"><div class="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu">'+
                '<div class="navbar-header"></div>' +
                '<div class="navbar-collapse in"><plus-widget url=' + urlList + '></plus-widget></div>' +
            '</div></div>' +
            '<div class="content col-xs-12 col-sm-5 col-md-7"><div class="margin">' +
                '<login-widget></login-widget><article-widget></article-widget>' +
            '</div></div>' +
            '<div class="col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas" id="sidebar">' +
            '</div>' +
        '</div></div>');
})();
