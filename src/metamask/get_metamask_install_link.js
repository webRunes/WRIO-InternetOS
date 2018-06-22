const { detect } = require('detect-browser');
const extentionLinks = require('./extention_links');

module.exports = () =>
  extentionLinks[detect().name] || 'https://metamask.io/'
