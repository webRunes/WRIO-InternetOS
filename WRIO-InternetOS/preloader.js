var code =
        '<div id="preloader" class="preloader-wrapper loading" style="height: 100%; display: block; margin: 0;">' +
            '<div class="preloader" style="position: fixed; top: 0; z-index: 9999; min-height: 600px; width: 100%; height: 100%; display: table; vertical-align: middle;">' +
                '<div class="container" style="position: relative; vertical-align: middle; display: table-cell; height: 260px; text-align: center;">' +
                    '<h1 style="font-family: BebasNeue,sans-serif; color: #eee; font-size: 32px; text-transform: uppercase; text-shadow: 2px 2px 4px #000; -webkit-font-smoothing: antialiased;">webRunes webgate</h1>' +
                    '<p style="font-family: sans-serif;  color: #eee; font-size: 11px; font-weight: bold; text-transform: uppercase;">Alpha stage, certain issues and slow connection may be expected</p>' +
                    '<div class="inner" style="margin: 128px auto 0; width: 140px; height: 260px;">' +
                        '<div class="preloader-logo">' + '</div>' +
                        '<div class="progress progress-striped active" style="height: 6px; margin: 20px 0;">' +
                            '<div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="background-color: #0088cc !important; width: 100% !important;">' + '</div>' +
                        '</div>' +
                        '<p style="font-family: sans-serif;  color: #eee; font-size: 11px; font-weight: bold; text-transform: uppercase;">Loading... please wait</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>',
    favicon,
    head = document.getElementsByTagName('head')[0],
    notSupportedBrowsers = [];

var cssUrl = require('./js/global').cssUrl,
    theme = require('./js/global').theme,
    css = [
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
        cssUrl + theme + '/css/webrunes.css'
    ],
    count = css.length,
    loading;
loading = document.createElement('link');
loading.rel = 'stylesheet';
loading.href = cssUrl + theme + '/css/loading.css';
head.appendChild(loading);

window.document.body.style.heigth = '100%';
window.document.body.style.margin = 0;
document.documentElement.style.heigth = '100%';
document.documentElement.style.margin = 0;
window.document.body.innerHTML += code;

var BrowserDetection = {
    init: function(){
        if(notSupportedBrowsers == null || notSupportedBrowsers.length < 1){
            notSupportedBrowsers = this.defaultNotSupportedBrowsers;
        }

        this.detectBrowser();
        this.detectOS();

        if(this.browser == '' || this.browser == 'Unknown' || this.os == '' || this.os == 'Unknown' || this.browserVersion == '' || this.browserVersion == 0){
            return;
        }

        var oldBrowser = false;
        for(var i = 0; i < notSupportedBrowsers.length; i++){
            if(notSupportedBrowsers[i].os == 'Any' || notSupportedBrowsers[i].os == this.os){
                if(notSupportedBrowsers[i].browser == 'Any' || notSupportedBrowsers[i].browser == this.browser){
                    if(notSupportedBrowsers[i].version == 'Any' || this.browserVersion <= parseFloat(notSupportedBrowsers[i].version)){
                        oldBrowser = true;
                        break;
                    }
                }
            }
        }

        if(oldBrowser){
            this.displayNotice();
        }else{
            return false;
        }
    },
    displayNotice: function(){
        this.writeNoticeCode();
    },
    writeNoticeCode: function(){
        var code =
            '<div id="outdated">' +
            '<div class="outer">' +
            '<div class="container">' +
            '<div class="inner inner-info">' +
            '<div class="warning">' +
            '<strong>Warning!</strong> You are using an outdated browser that we do not support. <br /> Please download and install the latest version of your preferred browser' +
            '<div>' +
            '<a href="http://www.mozilla-europe.org/" target="_blank">' +
            '<img src="http://webrunes.github.io/Default-WRIO-Theme/img/browser_firefox.png" /><div>Mozilla Firefox</div></a>' +
            '<a href="http://www.google.com/chrome/" target="_blank">' +
            '<img src="http://webrunes.github.io/Default-WRIO-Theme/img/browser_chrome.png" /><div>Google Chrome</div></a>' +
            '<a href="http://windows.microsoft.com/en-US/internet-explorer/downloads/ie" target="_blank">' +
            '<img src="http://webrunes.github.io/Default-WRIO-Theme/img//browser_ie.png" /><div>Internet Explorer</div></a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        window.document.body.innerHTML += code;
        document.getElementById('outdated').style.display = 'block';
    },
    detectBrowser: function(){
        this.browser = '';
        this.browserVersion = 0;

        if(/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
            this.browser = 'Opera';
        } else if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
            this.browser = 'MSIE';
        } else if(/Navigator[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
            this.browser = 'Netscape';
        } else if(/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
            this.browser = 'Chrome';
        } else if(/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
            this.browser = 'Safari';
            /Version[\/\s](\d+\.\d+)/.test(navigator.userAgent);
            this.browserVersion = new Number(RegExp.$1);
        } else if(/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
            this.browser = 'Firefox';
        }

        if(this.browser == ''){
            this.browser = 'Unknown';
        } else if(this.browserVersion == 0) {
            this.browserVersion = parseFloat(new Number(RegExp.$1));
        }
    },
    detectOS: function(){
        for(var i = 0; i < this.operatingSystems.length; i++){
            if(this.operatingSystems[i].searchString.indexOf(this.operatingSystems[i].subStr) != -1){
                this.os = this.operatingSystems[i].name;
                return;
            }
        }

        this.os = 'Unknown';
    },
    //	Variables
    noticeHeight: 0,
    browser: '',
    os: '',
    browserVersion: '',
    operatingSystems: [
        { 'searchString': navigator.platform, 'name': 'Windows', 'subStr': 'Win' },
        { 'searchString': navigator.platform, 'name': 'Mac', 'subStr': 'Mac' },
        { 'searchString': navigator.platform, 'name': 'Linux', 'subStr': 'Linux' },
        { 'searchString': navigator.userAgent, 'name': 'iPhone', 'subStr': 'iPhone/iPod' }
    ],
    defaultNotSupportedBrowsers: [
        {'os': 'Any', 'browser': 'MSIE', 'version': 6},
        {'os': 'Any', 'browser': 'MSIE', 'version': 7},
        {'os': 'Any', 'browser': 'MSIE', 'version': 8},
        {'os': 'Any', 'browser': 'MSIE', 'version': 9}
    ]
};
if(!BrowserDetection.init()){

    for(var i = 0; i < count; i++){
        var link;
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = css[i];
        head.appendChild(link);
    }

    var ti = setInterval(function() {
        if (document.styleSheets.length > css.length) {
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', './WRIO-InternetOS/main.js');
            document.body.appendChild(script);
            clearInterval(ti);
        }
    }, 10);

    favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    favicon.href = cssUrl + theme + '/ico/favicon.ico';
    head.appendChild(favicon);
}else{
    document.getElementById('preloader').style.display = 'none';
}