const
  request = require('superagent'),
  html2list = require('./html2list'),
  intentCount = 3,
  getMyList = (wrioID, times, cb) =>
    request('GET', 'https://s3.amazonaws.com/wr.io/' + wrioID + '/list.html')
      .end((err, data) =>
        err
          ? times
            ? setInterval(() => getMyList(wrioID, times - 1, cb), 100)
            : cb(err)
          : cb(null, html2list(data.text))
      );

module.exports = (wrioID, cb) =>
  getMyList(wrioID, intentCount, cb);
