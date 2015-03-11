var wrio = {};
(function(){
    'use strict';

    //properties
    var importUrl = 'https://wrio.s3.amazonaws.com';
    var cssUrl = 'http://webrunes.github.io';
    var theme = '/Default-WRIO-Theme';
    wrio.plusUrl = '';
    wrio.coverUrl = '';
    wrio.page = '';
    wrio.hash = '';
    wrio.storageKey = 'plusLdModel';

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

        var storageScript = document.createElement('script');
        storageScript.type = "text/javascript";
        storageScript.onload = function () {
            updatePlusStorage();
        };
        storageScript.src = importUrl + '/Plus-WRIO-App/public/scripts/client.js';
        document.head.appendChild(storageScript);
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
        //var menu = document.createElement('link');
        //menu.rel = 'import';
        //menu.href = importUrl + '/Default-WRIO-Theme/widget/menu.htm';
        //document.head.appendChild(menu);

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
    var addCoverWidget = function(el){
        //import Cover
        //var cover = document.createElement('link');
        //cover.rel = 'import';
        //cover.href = importUrl + '/Default-WRIO-Theme/widget/cover.htm';
        //document.head.appendChild(cover);
        //
        //addCoverElement(el);
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
    var getCurrentWidget = function(){
        var hash = window.location.hash;
        if(hash){
            wrio.hash = window.location.hash.replace('#', '');
        }
    };
    var prepareJsonLd = function(){
        wrio.jsons = [];
        var scripts = document.getElementsByTagName("script");
        for(var i = 0; i < scripts.length - 1; i++){
	        try{
		        var model = JSON.parse(scripts[i].innerHTML);
                wrio.jsons.push(model);

	        }catch(err){
		        Console.log(err);
	        }
        }
    };
    var prepareWidgetModels = function(){
        wrio.widgetmodels = {};
        for(var i = 0; i < wrio.jsons.length; i++){
            var widgetType = wrio.jsons[i]['@type'];
            if(widgetType != 'ItemList'){
                wrio.widgetmodels[widgetType] = wrio.jsons[i];
                addMenulinks(widgetType, wrio.jsons[i]);
            }else{
                var items = wrio.jsons[i].itemListElement;
                if(items){
                    for(var j = 0; j < items.length; j++){
                        var index = items[j].url.indexOf('?cover');
                        if(index > 0) {
                            addMenulinks('Cover', items[j]);
                        }else{
                            wrio.widgetmodels['ItemList'] = wrio.jsons[i];
                            addMenulinks('ItemList', items[j]);
                            break;
                        }
                    }
                }
            }
            checkCurrentPage();
        }
    };
    var checkCurrentPage = function(){
        if(!wrio.page){
            if(wrio.widgetmodels.Article) wrio.page = 'Article';
            else if(wrio.widgetmodels.Person) wrio.page = 'Person';
        }
    };
	var addMenulinks = function(name, model){
        if(name == 'Article') addArticleLink(model);
        else if(name == 'Person') addPersonalLink(model);
        else if(name == 'Cover') addCoverLink(model);
        else if(name == 'ItemList') addItemListLink(model);
	};
    var addArticleLink = function(model){
        if(model.name) addItemListToMenu('#' + model.name, model.name, 'Article');
        if(model.hasPart){
            for(var i = 0; i < model.hasPart.length; i++){
                addItemListToMenu('#' + model.hasPart[i].name, model.hasPart[i].name, 'Article');
                if(wrio.hash == model.hasPart[i].name) wrio.page = 'Article';
            }
        }
    };
    var addPersonalLink = function(model){
        if(model.name) addItemListToMenu('#' + model.name, model.name, 'Person');
        if(model.hasPart){
            for(var i = 0; i < model.hasPart.length; i++){
                addItemListToMenu('#' + model.hasPart[i].name, model.hasPart[i].name, 'Person');
                if(wrio.hash == model.hasPart[i].name) wrio.page = 'Person';
            }
        }
    };
    var addCoverLink = function(model){
        addItemListToMenu('#' + model.name, model.name, 'Cover');
        if(wrio.hash == 'Cover') wrio.page = 'Cover';
    };
    var addItemListLink = function(model){
        addItemListToMenu('#' + model.name, model.name, 'ItemList');
        if(wrio.hash == model.name) wrio.page = 'ItemList';
    };
    var addItemListToMenu = function(url, name, own){
        var li = document.createElement('li');

        if(own == 'ItemList') {
	        li.onclick = function () {
		        var $article = document.getElementById('article-article-id');
		        var $person = document.getElementById('article-person-id');
		        var $itemlist = document.getElementById('itemlist-container-id');
		        var $cover = document.getElementById('cover-container-id');
                var $titter = document.getElementById('titter-id');
                if($titter) $titter.style.display = 'none';
	            if($article) $article.style.display = 'none';
		        if($person) $person.style.display = 'none';
	            if($itemlist) $itemlist.style.display = 'block';
		        if($cover) $cover.style.display = 'none';
	        }
        } else if(own == 'Article'){
	        li.onclick = function (){
		        var $article = document.getElementById('article-article-id');
		        var $person = document.getElementById('article-person-id');
		        var $itemlist = document.getElementById('itemlist-container-id');
		        var $cover = document.getElementById('cover-container-id');
                var $titter = document.getElementById('titter-id');
                if($titter) $titter.style.display = 'block';
		        if($article) $article.style.display = 'block';
		        if($person) $person.style.display = 'none';
		        if($itemlist) $itemlist.style.display = 'none';
		        if($cover) $cover.style.display = 'none';
	        }
        } else if(own == 'Person'){
	        li.onclick = function (){
		        var $article = document.getElementById('article-article-id');
		        var $person = document.getElementById('article-person-id');
		        var $itemlist = document.getElementById('itemlist-container-id');
		        var $cover = document.getElementById('cover-container-id');
                var $titter = document.getElementById('titter-id');
                if($titter) $titter.style.display = 'block';
		        if($article) $article.style.display = 'none';
		        if($person) $person.style.display = 'block';
		        if($itemlist) $itemlist.style.display = 'none';
		        if($cover) $cover.style.display = 'none';
	        }
        } else if(own == 'Cover'){
	        li.onclick = function (){
		        var $article = document.getElementById('article-article-id');
		        var $person = document.getElementById('article-person-id');
		        var $itemlist = document.getElementById('itemlist-container-id');
		        var $cover = document.getElementById('cover-container-id');
                //if(!$cover) addCoverWidget(boxC);
                var $titter = document.getElementById('titter-id');
                if($titter) $titter.style.display = 'none';
		        if($article) $article.style.display = 'none';
		        if($person) $person.style.display = 'none';
		        if($itemlist) $itemlist.style.display = 'none';
		        if($cover) $cover.style.display = 'block';
	        }
        }
        var a = document.createElement('a');
        a.href = url;
        a.innerText = name;
        li.appendChild(a);
        boxRitem.appendChild(li);
    };
    var getCoverUrl = function(){
        for(var i = 0; i < wrio.jsons.length; i++){
            if(wrio.coverUrl) break;
            var widgetType = wrio.jsons[i]['@type'];
            if(widgetType == 'ItemList'){
                var items = wrio.jsons[i].itemListElement;
                if(items){
                    for(var j = 0; j < items.length; j++){
                        var index = items[j].url.indexOf('?cover');
                        if(index > 0) {
                            wrio.coverUrl = items[j].url.substring(0, items[j].url.indexOf('?cover'));
                            break;
                        }
                    }
                }
            }
        }
    };

    var updatePlusStorage = function () {
        // browser address url
        var href = window.location.origin + window.location.pathname;
        var storage = new CrossStorageClient(importUrl + '/Plus-WRIO-App/widget/plus.htm');

        if (typeof CrossStorageClient === 'function'){
            storage.onConnect().then(function () {
                return storage.get(wrio.storageKey);
            }).then(function (model) {
                if (model) {
                    return model;
                }
                else {
                    return {
                        "@context": "http://schema.org",
                        "@type": ["ItemList"],
                        "name": "My Plus List",
                        "itemList": []
                    };
                }
            }).then(function (model) {
                var urlExists = false;

                if (model.itemList) {
                    model.itemList.forEach(function (element) {
                        if (element.url && element.url === href) {
                            urlExists = true;
                        }
                    });
                }

                if (!urlExists) {
                    model.itemList.push(
                        {
                            "@type": "Article",
                            "inLanguage": "en-US",
                            "name": "New Article",
                            "about": "New Article from " + href,
                            "image": "",
                            "url": href
                        });
                    return storage.set(wrio.storageKey, model);
                }
                return model;
            }).catch(function (err) {
                console.log(err);
            }).then(function() {
                storage.close();
            });
        }
    };

    //init
    var init = function(){
        getCurrentWidget();
        prepareJsonLd();
        getCoverUrl();
        addBootstrapLink();
        addImportLink();
        createDom();
        prepareWidgetModels();

        //plus
        if(wrio.widgetmodels.Plus) addPlusElement(boxL);

        //center Container
        addLoginElement(boxC);
        if(wrio.widgetmodels.Article) addArticleElement(boxC);
        if(wrio.widgetmodels.Person) addPersonElement(boxC);
        if(wrio.coverUrl) addCoverElement(boxC);
        if(wrio.widgetmodels.ItemList) addItemListElement(boxC);
        addTitterElement(boxC);
    };
    init();
})();
