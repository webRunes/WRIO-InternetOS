/**
 * Created by michbil on 13.05.16.
 */
import fs from 'fs';
import React from 'react';
import path from 'path';
import reducer from './indexReducer';
import mkActions from '../actions/indexActions';
import { openLinkDialog, closeDialog } from '../actions/linkdialog';
import { openImageDialog, closeDialog as closeDialogImg } from '../actions/imagedialog';
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import JSONToDraft from '../DraftConverters/article/JSONToDraft';
import DraftToJSON from '../DraftConverters/article/DraftToJSON';

import getFixture from '../fixtures/fixture.js';

const {
  receiveDocument, createNewDocument, createNewImage, createNewLink,
} = mkActions('MAIN');

const json = getFixture('testjson');

let doc;
describe('LS+JSON reducer integrational test', () => {
  test('Should be able to import document and convert it back to JSON', () => {
    const s1 = reducer(undefined, {});
    const doc = new LdJsonDocument(json);
    expect(s1.editorDocument.isFetching).toEqual(true);
    const s2 = reducer(s1, receiveDocument(doc));
    expect(s2.editorDocument.isFetching).toEqual(false);
    expect(typeof s2.editorDocument.document).toEqual('object');

    const content = s2.editorDocument.editorState.getCurrentContent();
    const j = DraftToJSON(content, doc);
    expect(j.name).toEqual('webRunes');
    console.log('RESULTING JSON', j);
  });

  test('should be able to create new document, import image and convert it to JSON', () => {
    const s1 = reducer(undefined, createNewDocument('1234567890'));
    console.log('S1', s1.editorDocument);
    let s2 = reducer(s1, createNewImage('Hello', 'https://sample.host/catty1.jpg', 'image 1'));
    s2 = reducer(s2, createNewImage('Hello', 'https://sample.host/catty2.jpg', 'image 2'));
    s2 = reducer(s2, createNewLink('Link', 'https://sample.host/catty.html', 'link'));
    console.log('S2', s2.editorDocument);
    const j = DraftToJSON(
      s2.editorDocument.editorState.getCurrentContent(),
      s2.editorDocument.document,
    );
    console.log(j);
    expect(j.author).toEqual('https://wr.io/1234567890/?wr.io=1234567890');
  });

  test('should be able to open link dialog', () => {
    const s1 = reducer(undefined, createNewDocument('1234567890'));
    expect(s1.linkDialog.showDialog).toEqual(false);
    expect(s1.imageDialog.showDialog).toEqual(false);
    const s2 = reducer(s1, openLinkDialog('title', '', ''));
    expect(s2.linkDialog.showDialog).toEqual(true);
    expect(s2.imageDialog.showDialog).toEqual(false);
    const s3 = reducer(s1, closeDialog());
    expect(s3.linkDialog.showDialog).toEqual(false);
    expect(s3.imageDialog.showDialog).toEqual(false);
  });

  test('should be able to open image dialog', () => {
    const s1 = reducer(undefined, createNewDocument('1234567890'));
    expect(s1.imageDialog.showDialog).toEqual(false);
    expect(s1.linkDialog.showDialog).toEqual(false);
    const s2 = reducer(s1, openImageDialog('title', '', ''));
    expect(s2.imageDialog.showDialog).toEqual(true);
    expect(s2.linkDialog.showDialog).toEqual(false);
    const s3 = reducer(s1, closeDialogImg());
    expect(s3.imageDialog.showDialog).toEqual(false);
    expect(s3.linkDialog.showDialog).toEqual(false);
  });
});
