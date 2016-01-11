var importUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://wrioos.com/',
    cssUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://webrunes.github.io/',
    theme = 'Default-WRIO-Theme',
    themeImportUrl = importUrl + theme + '/widget/';

if (process.env.NODE_ENV === 'dockerdev') {
    importUrl = cssUrl = 'http://wrioos.local/';
    theme = 'Default-WRIO-Theme';
    themeImportUrl = importUrl + theme + '/widget/';
}

module.exports = {
    importUrl: importUrl,
    cssUrl: cssUrl,
    theme: theme,
    themeImportUrl: themeImportUrl,
    isAirticlelist: false
};
