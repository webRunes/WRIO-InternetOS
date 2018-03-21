const
  getServiceUrl = require('../../servicelocator').getServiceUrl;

module.exports = myList =>
  Boolean(myList && myList.length) && myList.map(o =>
    Object({
      url: getServiceUrl('core') + '/edit?article=' + o.url,
      name: o.name
    })
  )
