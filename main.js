(function(){
    'use strict';

    //-----------------------------------------------
    window.webrunes = {};
    var lds = document.getElementsByTagName("script");
    window.webrunes.jsonlds = [];
    for(var i = 0; i < lds.length - 1; i++){
        window.webrunes.jsonlds.push(JSON.parse(lds[i].innerHTML));
    }
    //-----------------------------------------------
    //properties
    var importUrl = 'http://wrio.s3-website-us-east-1.amazonaws.com';
    var cssUrl = 'http://webrunes.github.io';
    var theme = '/Default-WRIO-Theme';
    var plusUrl = "http://webrunes.github.io/webRunes-WRIO-Hub/1WJyH1k7-list.html";

    //------------------ css, ico, jquery, bootstrap ---------------------------//
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

    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js';
    document.head.appendChild(script);

    //----------------------- import start --------------------------------------//
    //import Login
    var login = document.createElement('link');
    login.rel = 'import';
    login.href = importUrl + '/Login-WRIO-App/Widget/template.html';
    document.head.appendChild(login);

    //import Plus
    var plus = document.createElement('link');
    plus.rel = 'import';
    plus.href = importUrl + '/Plus-WRIO-App/Widget/template.html';
    document.head.appendChild(plus);

    //import titter
    var titter = document.createElement('link');
    titter.rel = 'import';
    titter.href = importUrl + '/Titter-WRIO-App/Widget/template.html';
    document.head.appendChild(titter);

    //import menu
    var menu = document.createElement('link');
    menu.rel = 'import';
    menu.href = importUrl + '/webRunes-WRIO-Hub/Widget/template.html';
    document.head.appendChild(menu);

    //import Article
    var article = document.createElement('link');
    article.rel = 'import';
    article.href = importUrl + '/Plus-WRIO-App/Widget/article.html';
    document.head.appendChild(article);

    //-------------------------------------------------------------------------------//
    //root container
    document.write('<div class="container-liquid">' +
        '<div class="row row-offcanvas row-offcanvas-right">' +
            '<div class="col-xs-12 col-sm-3 col-md-2"><div class="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu">'+
                '<div class="navbar-header"></div>' +
                '<div class="navbar-collapse in"><plus-widget url=' + plusUrl + '></plus-widget></div>' +
            '</div></div>' +
            '<div class="content col-xs-12 col-sm-5 col-md-7"><div class="margin">' +
                '<login-widget></login-widget><article-widget></article-widget><titter-widget></titter-widget>' +
            '</div></div>' +
            '<div class="col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas" id="sidebar"></div>' +
        '</div></div>');
})();

//right Menu
(function(){
    'use strict';

    var $titleMenu = document.createElement('h3');
    $titleMenu.innerText = 'Menu';
    var $menu = document.createElement('div');
    $menu.appendChild($titleMenu);

    var $ol = document.createElement('ol');
    var parts = window.webrunes.jsonlds[1].hasPart;
    for(var i = 0; i < parts.length; i++){
        var $li = document.createElement('li');
        var $a = document.createElement('a');
        $a.href = '#' + parts[i].name;
        $a.innerText = parts[i].name;
        $li.appendChild($a);
        $ol.appendChild($li);
    }

    $menu.appendChild($ol);
    document.getElementById('sidebar').appendChild($menu);
})();
