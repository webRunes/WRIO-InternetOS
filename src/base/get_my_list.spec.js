const
  getMyList = require('./get_my_list'),
  wrioID = '101144381240';

describe('Get list.html for user with wrioID', () => {
  it('user wrioID has list.html and it could be load by getMyList()', done => {
    getMyList(wrioID, (err, list) => {
      done(list.length >= 1
        ? undefined
        : err
      )
    })
  })
})
