const
  getServiceUrl = require('../../servicelocator').getServiceUrl;

module.exports = url =>
  getServiceUrl('core') + '/edit?article=' + url
