var cssUrl = require('./js/global').cssUrl,
    theme = require('./js/global').theme,
    code = '<div id="preloader" class="preloader-wrapper loading"> <div class="preloader"> <div class="container"> <h1>webRunes webgate</h1> <p>Alpha stage, certain issues and slow connection may be expected</p> <div class="inner"> <div class="preloader-logo"></div> <div class="progress progress-striped active"> <div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div> </div><p>Loading... please wait</p> </div>  </div> </div> </div>',
    css = [
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
        cssUrl + theme + '/css/webrunes.css',
    ],
    count = css.length,
    favicon,
    head = document.getElementsByTagName('head')[0],
    notSupportedBrowsers = [],
    BrowserDetection = {
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



var link;
link = document.createElement('link');
link.rel = 'stylesheet';
link.href = cssUrl + theme + '/css/old_browser.css';
head.appendChild(link);

favicon = document.createElement('link');
favicon.rel = 'shortcut icon';
favicon.href = cssUrl + theme + '/ico/favicon.ico';
head.appendChild(favicon);

window.document.body.innerHTML += code;

if(!BrowserDetection.init()){
    for(var i = 0; i < count; i++){
        var link;
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = css[i];
        head.appendChild(link);
    }
    var script;
    script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'WRIO-InternetOS/main.js');
    document.body.appendChild(script);

    var main = require('./main');
}else{
    document.getElementById('preloader').style.display = 'none';
}