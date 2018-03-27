const
  request = require('superagent'),
  html2list = require('./html2list');

module.exports = (wrioID, cb) =>
  request('GET', 'https://s3.amazonaws.com/wr.io/' + wrioID + '/list.html')
    .end((err, data) =>
      cb(err, html2list(data.text))
    )
