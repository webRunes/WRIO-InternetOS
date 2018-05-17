const
  isProfileUrl = require('./is_profile_url'),
  assert = require('assert');

describe('Profile link text should be rendered as "Profile", not id', () => {
  it('is profile url', () => {
    assert(
      isProfileUrl(
        'https://wr.io/995280022735/index.html'
      )
    )
  })
})
