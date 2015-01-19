
var webrunes = webrunes || {};

(function(){
    'use strict';

    //json-ld
    var lds = document.getElementsByTagName("script");
    webrunes.jsonlds = [];
    for(var i = 0; i < lds.length - 1; i++){
        webrunes.jsonlds.push(JSON.parse(lds[i].innerHTML));
    }

    //properties
    var importUrl = 'http://wrio.s3-website-us-east-1.amazonaws.com';
    var cssUrl = 'http://webrunes.github.io';
    var theme = '/Default-WRIO-Theme';
    webrunes.plusUrl = "http://webrunes.github.io/webRunes-WRIO-Hub/1WJyH1k7-list.html";

    //DOM elements
    var boxHeadL, boxL, boxC, boxR;

    //add css, ico, js
    var addBootstrapLink = function(){
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
    };
    //add Import
    var addImportLink = function(){
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
        menu.href = importUrl + '/Plus-WRIO-App/Widget/menu.html';
        document.head.appendChild(menu);

        //import Article
        var article = document.createElement('link');
        article.rel = 'import';
        article.href = importUrl + '/Plus-WRIO-App/Widget/article.html';
        document.head.appendChild(article);
    };
    //add DOM
    var createDom = function(){
        var container = document.createElement('div');
        container.className  = 'container-liquid';
        document.body.appendChild(container);
        //childroot container
        var childroot = document.createElement('div');
        childroot.className  = 'row row-offcanvas row-offcanvas-right';
        container.appendChild(childroot);
        //leftbox container -------------------------------------------
        var leftbox = document.createElement('div');
        leftbox.className  = 'col-xs-12 col-sm-3 col-md-2';
        childroot.appendChild(leftbox);
        var navbar = document.createElement('div');
        navbar.className  = 'navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu';
        leftbox.appendChild(navbar);
        boxHeadL = document.createElement('div');
        boxHeadL.className  = 'navbar-header';
        navbar.appendChild(boxHeadL);
        boxL = document.createElement('div');
        boxL.className  = 'navbar-collapse in';
        navbar.appendChild(boxL);
        //centerbox container ------------------------------------------
        var centerbox = document.createElement('div');
        centerbox.className  = 'content col-xs-12 col-sm-5 col-md-7';
        childroot.appendChild(centerbox);
        boxC = document.createElement('div');
        boxC.className  = 'margin';
        centerbox.appendChild(boxC);
        //rightbox container -------------------------------------------
        var rightbox = document.createElement('div');
        rightbox.className  = 'col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas';
        rightbox.id = 'sidebar';
        childroot.appendChild(rightbox);
        boxR = document.createElement('div');
        boxR.className = 'sidebar-margin';
        rightbox.appendChild(boxR);

        var script = document.createElement('script');
        script.src = cssUrl + theme + '/js/offcanvas.js';
        document.body.appendChild(script);
    };
    //add dom elements
    var addPlus = function(el){
        var pluswidget = document.createElement('plus-widget');
        el.appendChild(pluswidget);
    };
    var addLogin = function(el){
        var loginwidget = document.createElement('login-widget');
        el.appendChild(loginwidget);
    };
    var addArticle = function(el){
        var articlewidget = document.createElement('article-widget');
        el.appendChild(articlewidget);
    };
    var addTitter = function(el){
        var titterwidget = document.createElement('titter-widget');
        el.appendChild(titterwidget);
    };
    var addMenu = function(el){
        var menuwidget = document.createElement('menu-widget');
        el.appendChild(menuwidget);
    };

    //init
    var init = function(){
        addBootstrapLink();
        addImportLink();
        createDom();

        //plus
        addPlus(boxL);
        //login
        addLogin(boxC);
        //article
        addArticle(boxC);
        //titter
        addTitter(boxC);
        //menu
        addMenu(boxR);
    };
    init();
})();
