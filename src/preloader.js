const { getResourcePath } = require('./base/global');
const { getServiceUrl } = require('./base/servicelocator');

const code = `<div id="preloader" class="preloader-wrapper loading" style="height: 100%; display: block; margin: 0;">
            <div class="preloader" style="position: fixed; top: 0; z-index: 9999; min-height: 600px; width: 100%; height: 100%; display: table; vertical-align: middle;">
                <div class="container" style="position: relative; vertical-align: middle; display: table-cell; height: 260px; text-align: center;">
                    <div class="inner" style="margin:128px auto 0;width:200px;height:260px">
                        <div class="preloader-logo"></div>
                        <div class="progress progress-striped active" style="height:6px;margin:20px 0">
                            <div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="background-color: #0088cc !important; width: 100% !important;"> </div>
                        </div>
                        <p style="font-family:'Roboto',sans-serif;color:#eee;font-size:11px;font-weight:bold;text-transform:uppercase">Loading... Please wait</p>
                    </div>
                </div>
            </div>
        </div>`;
const head = document.getElementsByTagName('head')[0];
let notSupportedBrowsers = ['MSIE', 'MSIE11'];

const css = [
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
  /* getResourcePath('/css/bootstrap-material-design.min.css'),
    getResourcePath('/css/webrunes.css'), Need to clear below as well */
  getResourcePath('/css/material-kit.min.css'),
  getResourcePath('/css/ripples.min.css'),
  getResourcePath('/css/vertical-nav.css'),
  getResourcePath('/css/wrioos.css'),
];

class BrowserDetection {
  constructor() {
    this.noticeHeight = 0;
    this.browser = '';
    this.os = '';
    this.browserVersion = '';
    this.operatingSystems = [
      {
        searchString: window.navigator.platform,
        name: 'Windows',
        subStr: 'Win',
      },
      { searchString: window.navigator.platform, name: 'Mac', subStr: 'Mac' },
      {
        searchString: window.navigator.platform,
        name: 'Linux',
        subStr: 'Linux',
      },
      {
        searchString: window.navigator.userAgent,
        name: 'iPhone',
        subStr: 'iPhone/iPod',
      },
    ];
    this.defaultNotSupportedBrowsers = [
      { os: 'Any', browser: 'MSIE', version: 6 },
      { os: 'Any', browser: 'MSIE', version: 7 },
      { os: 'Any', browser: 'MSIE', version: 8 },
      { os: 'Any', browser: 'MSIE', version: 9 },
    ];
    this.addDynamicTags();
  }

  addDynamicTags() {
    let mapBoxScript = document.createElement('script');
    mapBoxScript.setAttribute('src','https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.js');
    document.head.appendChild(mapBoxScript);
    document.head.innerHTML += "<link href='https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.css' rel='stylesheet' />"
  }
  init() {
    if (notSupportedBrowsers == null || notSupportedBrowsers.length < 1) {
      notSupportedBrowsers = this.defaultNotSupportedBrowsers;
    }

    this.detectBrowser();
    this.detectOS();

    if (
      this.browser === '' ||
      this.browser === 'Unknown' ||
      this.os === '' ||
      this.os === 'Unknown' ||
      this.browserVersion === '' ||
      this.browserVersion === 0
    ) {
      return;
    }

    let oldBrowser = false;
    for (let i = 0; i < notSupportedBrowsers.length; i++) {
      if (notSupportedBrowsers[i].os === 'Any' || notSupportedBrowsers[i].os === this.os) {
        if (
          notSupportedBrowsers[i].browser === 'Any' ||
          notSupportedBrowsers[i].browser === this.browser
        ) {
          if (
            notSupportedBrowsers[i].version === 'Any' ||
            this.browserVersion <= parseFloat(notSupportedBrowsers[i].version)
          ) {
            oldBrowser = true;
            break;
          }
        }
      }
    }
    if (oldBrowser) {
      this.writeNoticeCode();
      return true;
    }
    return false;
  }
  writeNoticeCode() {
    window.location.href = '//wrioos.com/old_browser.html';
  }
  detectBrowser() {
    this.browser = '';
    this.browserVersion = 0;

    if (/Opera[\/\s](\d+\.\d+)/.test(window.navigator.userAgent)) {
      this.browser = 'Opera';
    } else if (/MSIE (\d+\.\d+);/.test(window.navigator.userAgent)) {
      this.browser = 'MSIE';
    } else if (window.navigator.userAgent.match(/Trident.*rv\:11\./)) {
      this.browser = 'MSIE11';
      this.browserVersion = 11;
    } else if (/Navigator[\/\s](\d+\.\d+)/.test(window.navigator.userAgent)) {
      this.browser = 'Netscape';
    } else if (/Chrome[\/\s](\d+\.\d+)/.test(window.navigator.userAgent)) {
      this.browser = 'Chrome';
    } else if (/Safari[\/\s](\d+\.\d+)/.test(window.navigator.userAgent)) {
      this.browser = 'Safari';
      /Version[\/\s](\d+\.\d+)/.test(window.navigator.userAgent);
      this.browserVersion = Number(RegExp.$1);
    } else if (/Firefox[\/\s](\d+\.\d+)/.test(window.navigator.userAgent)) {
      this.browser = 'Firefox';
    }

    if (this.browser === '') {
      this.browser = 'Unknown';
    } else if (this.browserVersion === 0) {
      this.browserVersion = parseFloat(Number(RegExp.$1));
    }
  }

  detectOS() {
    for (let i = 0; i < this.operatingSystems.length; i++) {
      if (this.operatingSystems[i].searchString.indexOf(this.operatingSystems[i].subStr) !== -1) {
        this.os = this.operatingSystems[i].name;
        return;
      }
    }

    this.os = 'Unknown';
  }
}

const loading = document.createElement('link');
loading.rel = 'stylesheet';
loading.href = getResourcePath('/css/loading.css');
head.appendChild(loading);

window.document.body.style.heigth = '100%';
window.document.body.style.margin = 0;
document.documentElement.style.heigth = '100%';
document.documentElement.style.margin = 0;

if (window.localStorage && !window.localStorage.getItem('oldUser')) {
  window.localStorage.setItem('oldUser', true);
  window.document.body.innerHTML += code;
}

function decodeIncomingUrl() {
  const { href } = window.location;
  const decodedHref = decodeURIComponent(href);

  if (href !== decodedHref) {
    // window.location = decodedHref;
    window.history.pushState('', '', decodedHref);
    console.warn('Reencoded url', href, ' ', window.location.href);
  }
}

function loadScript(url, onload) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  script.onload = onload;
  document.body.appendChild(script);
}

function loadScripts() {
  decodeIncomingUrl();

  let prefix = location.origin === 'file://'
    ? 'https://wrioos.com'
    : '//wrioos.com';

  if (process.env.NODE_ENV === 'production') {
    prefix = '//wrioos.com';
  }
  if (process.env.NODE_ENV === 'development') {
    prefix = '//localhost:3033';
  }

  if (process.env.NODE_ENV === 'dockerdev') {
    prefix = '//localhost:3033';
  }

  loadScript(`${prefix}/common.js`, () => {
    loadScript(`${prefix}/main.js`);
  });
}

const detector = new BrowserDetection();

function createLoginIframe(headElement) {
  const prePingerIframe = document.createElement('iframe');
  prePingerIframe.src = `${getServiceUrl('login')}/buttons/twitter`;
  prePingerIframe.id = 'loginbuttoniframe';
  headElement.appendChild(prePingerIframe);
}

if (!detector.init()) {
  for (let i = 0; i < css.length; i++) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = css[i];
    head.appendChild(link);
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadScripts();
    console.log('DOM fully loaded and parsed');
  });

  const favicon = document.createElement('link');
  favicon.rel = 'shortcut icon';
  favicon.href = getResourcePath('/ico/favicon.ico');
  head.appendChild(favicon);

  createLoginIframe(head);
} else {
  document.getElementById('preloader').style.display = 'none';
}
