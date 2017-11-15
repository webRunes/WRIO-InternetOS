import LdJsonDocument from './LdJsonDocument';
import getFixture from 'CoreEditor/fixtures/fixture.js';

const json = getFixture('testjson');

test('should be able to create document from json, and getProperty from it', () => {
  const doc = new LdJsonDocument(json);
  console.log(doc);
  expect(doc.getProperty('author')).toEqual('');
});

test('getElementOfType and setElementOfType shold give consistent results', () => {
  const doc = new LdJsonDocument(json);
  doc.setElementOfType('Article', {
    '@type': 'Article',
    author: 'michael',
  });
  expect(doc.getProperty('author')).toEqual('michael');
});
