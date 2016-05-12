var importUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://wrioos.com/',
    theme,cssUrl;

if (process.env.NODE_ENV === 'development') {
    cssUrl = 'http://localhost:3000/';
    theme = 'Default-WRIO-Theme';
} else {
    cssUrl = '//default.wrioos.com/';
    theme = "";
}

if (process.env.NODE_ENV === 'dockerdev') {
    console.log("Docker production ENV detected");
    importUrl = cssUrl = 'http://wrioos.local/';
    theme = 'Default-WRIO-Theme';
}

var themeImportUrl = importUrl + theme + '/widget/';

module.exports = {
    importUrl: importUrl,
    cssUrl: cssUrl,
    theme: theme,
    themeImportUrl: themeImportUrl,
    isAirticlelist: false
};
