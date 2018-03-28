const
  getServiceUrl = require('../../../base/servicelocator').getServiceUrl;

module.exports = myList =>
  Boolean(myList && myList.length) && myList.map(o =>
    Object({
      url: getServiceUrl('core') + '/edit?article=' + o.url,
      name: o.name
    })
  )
