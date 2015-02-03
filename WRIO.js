
var webrunes = webrunes || {};

(function(){
    'use strict';

    //properties
    var importUrl = 'http://wrio.s3-website-us-east-1.amazonaws.com';
    var cssUrl = 'http://webrunes.github.io';
    var theme = '/Default-WRIO-Theme';
    webrunes.plusUrl = "";

    //DOM elements
    var boxHeadL, boxL, boxC, boxR, boxRitem;

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
        //leftbox container
        createDomLeft(childroot);
        //centerbox container
        createDomCenter(childroot);
        //rightbox container
        createDomRight(childroot);

//        var script = document.createElement('script');
//        script.src = cssUrl + theme + '/js/offcanvas.js';
//        document.body.appendChild(script);
    };
    var createDomLeft = function(el){
        var leftbox = document.createElement('div');
        leftbox.className  = 'col-xs-12 col-sm-3 col-md-2';
        el.appendChild(leftbox);
        var navbar = document.createElement('div');
        navbar.className  = 'navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu';
        leftbox.appendChild(navbar);
        boxHeadL = document.createElement('div');
        boxHeadL.className  = 'navbar-header';
        navbar.appendChild(boxHeadL);
        boxL = document.createElement('div');
        boxL.className  = 'navbar-collapse in';
        navbar.appendChild(boxL);
    };
    var createDomCenter = function(el){
        var centerbox = document.createElement('div');
        centerbox.className  = 'content col-xs-12 col-sm-5 col-md-7';
        el.appendChild(centerbox);
        boxC = document.createElement('div');
        boxC.className  = 'margin';
        centerbox.appendChild(boxC);
    };
    var createDomRight = function(el){
        var rightbox = document.createElement('div');
        rightbox.className  = 'col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas';
        rightbox.id = 'sidebar';
        el.appendChild(rightbox);
        boxR = document.createElement('div');
        boxR.className = 'sidebar-margin';
        rightbox.appendChild(boxR);

        boxRitem = document.createElement('ul');
        boxRitem.className = 'nav nav-pills nav-stacked';
        boxR.appendChild(boxRitem);
    };
    //add dom elements
    var addPlusElement = function(el){
        var pluswidget = document.createElement('plus-widget');
        el.appendChild(pluswidget);
    };
    var addLoginElement = function(el){
        var loginwidget = document.createElement('login-widget');
        el.appendChild(loginwidget);
    };
    var addTitterElement = function(el){
        var titterwidget = document.createElement('titter-widget');
        el.appendChild(titterwidget);
    };
    var addMenuElement = function(el){
        var menuwidget = document.createElement('menu-widget');
        el.appendChild(menuwidget);
    };
    var addArticleElement = function(el){
        var articlewidget = document.createElement('article-widget');
        el.appendChild(articlewidget);
    };
    var addCoverElement = function(el){
        var coverwidget = document.createElement('cover-widget');
        el.appendChild(coverwidget);
    };
    var addPersonElement = function(el){
        var personwidget = document.createElement('person-widget');
        el.appendChild(personwidget);
    };
    var addItemListElement = function(el){
        var itemListwidget = document.createElement('itemlist-widget');
        el.appendChild(itemListwidget);
    };

    var getCurrentJsonLd = function(){
        //get current json-ld
        var lds = document.getElementsByTagName("script");
        webrunes.jsonlds = {};
        webrunes.boxs = [];
        for(var i = 0; i < lds.length - 1; i++){
            var jsonld = JSON.parse(lds[i].innerHTML);
            webrunes.boxs.push(jsonld);
            if(jsonld['@type']){
                webrunes.jsonlds[jsonld['@type']] = jsonld;
            }
        }
    };
    var addItemListToMenu = function(model){
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = model.url ? model.url : '#' + model.name;
        a.innerText = model.name;
        li.appendChild(a);
        boxRitem.appendChild(li);
    };

    //init
    var init = function(){
        //get current json-ld
        getCurrentJsonLd();
        addBootstrapLink();
        addImportLink();
        createDom();

        //left container
        //plus
        addPlusElement(boxL);

        //center Container
        //login
        addLoginElement(boxC);
        if(webrunes.jsonlds['Article']){
            //article
            addArticleElement(boxC);
        }else if(webrunes.jsonlds['Person']){
            //person
            addPersonElement(boxC);
        }else if(webrunes.jsonlds['Cover']){
            //cover
            addCoverElement(boxC);
        }
        //titter
        addTitterElement(boxC);

        //right container
        //item list
        for(var i = 0; i < webrunes.boxs.length; i++){
            if(webrunes.boxs[i]['@type'] == 'ItemList'){
                addItemListToMenu(webrunes.boxs[i]);
            }
            if(webrunes.boxs[i]['@type'] == 'Article' || webrunes.boxs[i]['@type'] == 'Person'){
                if(webrunes.boxs[i].hasPart){
                    for(var j = 0; j < webrunes.boxs[i].hasPart.length; j++){
                        addItemListToMenu(webrunes.boxs[i].hasPart[j]);
                    }
                }
            }
        }

    };
    init();
})();
