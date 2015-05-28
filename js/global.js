var importUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'http://wrio.s3-website-us-east-1.amazonaws.com/',
    cssUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'http://webrunes.github.io/',
    theme = 'Default-WRIO-Theme',
    themeImportUrl = importUrl + theme + '/widget/';

module.exports = {
	importUrl: importUrl,
	cssUrl: cssUrl,
	theme: theme,
	themeImportUrl: themeImportUrl
};
