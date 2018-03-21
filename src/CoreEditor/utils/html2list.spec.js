const
  html2list = require('./html2list'),
  assert = require('assert');

describe('Parse HTML to list of links', () => {
  it('1 link', () => {
    const
      list = html2list('<html><body><a href="wrioos.com">WRIOOS</a></body></html>');

    assert(list[0].name === 'WRIOOS');
    assert(list[0].url === 'wrioos.com');
  })

  it('2 links', () => {
    const
      list = html2list('<html><body><a href="ya.ru">Yandex</a><a href="google.com">Google</a></body></html>');

    assert(list[0].name === 'Yandex');
    assert(list[0].url === 'ya.ru');
    assert(list[1].name === 'Google');
    assert(list[1].url === 'google.com');
  })

})
