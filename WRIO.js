
var webrunes = webrunes || {};

(function(){
    'use strict';

    //properties
    var importUrl = 'http://wrio.s3-website-us-east-1.amazonaws.com';
    var cssUrl = 'http://webrunes.github.io';
    var theme = '/Default-WRIO-Theme';
    webrunes.plusUrl = "http://webrunes.github.io/webRunes-WRIO-Hub/1WJyH1k7-list.htm";

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
        login.href = importUrl + '/Login-WRIO-App/widget/login.htm';
        document.head.appendChild(login);

        //import Plus
        var plus = document.createElement('link');
        plus.rel = 'import';
        plus.href = importUrl + '/Plus-WRIO-App/widget/plus.htm';
        document.head.appendChild(plus);

        //import titter
        var titter = document.createElement('link');
        titter.rel = 'import';
        titter.href = importUrl + '/Titter-WRIO-App/widget/titter.htm';
        document.head.appendChild(titter);

        //import Menu
        var menu = document.createElement('link');
        menu.rel = 'import';
        menu.href = importUrl + '/Default-WRIO-Theme/widget/menu.htm';
        document.head.appendChild(menu);

        //import Article
        var article = document.createElement('link');
        article.rel = 'import';
        article.href = importUrl + '/Default-WRIO-Theme/widget/article.htm';
        document.head.appendChild(article);

        //import Cover
        var cover = document.createElement('link');
        cover.rel = 'import';
        cover.href = importUrl + '/Default-WRIO-Theme/widget/cover.htm';
        document.head.appendChild(cover);

        //import Person
        var person = document.createElement('link');
        person.rel = 'import';
        person.href = importUrl + '/Default-WRIO-Theme/widget/person.htm';
        document.head.appendChild(person);

        //import ItemList
        var itemList = document.createElement('link');
        itemList.rel = 'import';
        itemList.href = importUrl + '/Default-WRIO-Theme/widget/itemList.htm';
        document.head.appendChild(itemList);
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
    var addTitter = function(el){
        var titterwidget = document.createElement('titter-widget');
        el.appendChild(titterwidget);
    };
    var addMenu = function(el){
        var menuwidget = document.createElement('menu-widget');
        el.appendChild(menuwidget);
    };
    var addArticle = function(el){
        var articlewidget = document.createElement('article-widget');
        el.appendChild(articlewidget);
    };
    var addCover = function(el){
        var coverwidget = document.createElement('cover-widget');
        el.appendChild(coverwidget);
    };
    var addPerson = function(el){
        var personwidget = document.createElement('person-widget');
        el.appendChild(personwidget);
    };
    var addItemList = function(el){
        var itemListwidget = document.createElement('itemlist-widget');
        el.appendChild(itemListwidget);
    };

    var getCurrentJsonLd = function(){
        //get current json-ld
        var lds = document.getElementsByTagName("script");
        webrunes.jsonlds = [];
        for(var i = 0; i < lds.length - 1; i++){
            webrunes.jsonlds.push(JSON.parse(lds[i].innerHTML));
        }
    };

    //init
    var init = function(){
        //get current json-ld
        getCurrentJsonLd();
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
        //cover
        addCover(boxC);
        //person
        addPerson(boxC);
        //item list
        addItemList(boxR);
    };
    init();
})();
