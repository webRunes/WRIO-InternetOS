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

    //import login
    var login = document.createElement('link');
    login.rel = 'import';
    login.href = 'http://wrio.s3-website-us-east-1.amazonaws.com/Login-WRIO-App/Widget/template.html';
    login.onload = function(){
        document.getElementById('profile-accordion').innerHTML = login.import.querySelector('body').innerHTML;
    };
    document.head.appendChild(login);

    //import plus
    var plus = document.createElement('link');
    plus.rel = 'import';
    plus.href = 'http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/Widget/template.html';
    plus.onload = function(){
        document.getElementById('nav-accordion').innerHTML = plus.import.querySelector('body').innerHTML;
    };
    document.head.appendChild(plus);

    //import navbar header
    var navbar_header = document.createElement('link');
    navbar_header.rel = 'import';
    navbar_header.href = 'http://wrio.s3-website-us-east-1.amazonaws.com/template.html';
    navbar_header.onload = function(){
        document.getElementById('navbar-header1').innerHTML = navbar_header.import.querySelector('body').innerHTML;
    };
    document.head.appendChild(navbar_header);

    //root container
    document.write('<div class="container-liquid">' +
        '<div class="row row-offcanvas row-offcanvas-right">' +
            '<div class="col-xs-12 col-sm-3 col-md-2"><div class="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu">'+
                '<div class="navbar-header" id="navbar-header1"></div>' +
                '<div class="navbar-collapse in"><ul class="nav navbar-nav" id="nav-accordion"></ul></div>' +
            '</div></div>' +
            '<div class="content col-xs-12 col-sm-5 col-md-7"><div class="margin">' +
                '<ul class="info nav nav-pills nav-stacked" id="profile-accordion"></ul>' +
            '</div></div>' +
            '<div class="col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas" id="sidebar">' +
            '</div>' +
        '</div></div>');
})();