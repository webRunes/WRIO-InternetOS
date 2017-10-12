/**
 * Created by michbil on 13.05.16.
 */
import fs from 'fs';
import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata} from 'draft-js';
import React from 'react';
import path from 'path'
import reducer from './indexReducer'
import {receiveDocument,
    createNewDocument,
    createNewImage,
    createNewLink} from '../actions/indexActions'

import {openLinkDialog,closeDialog} from '../actions/linkdialog'
import {openImageDialog,closeDialog as closeDialogImg} from '../actions/imagedialog'
import LdJsonDocument from '../JSONDocument.js'

import getFixture from '../fixtures/fixture.js'
let json = getFixture('testjson');
var doc;
describe('LS+JSON tests test', () => {

    test('Should be able to import document and convert it back to JSON', () => {
        const s1 = reducer(undefined,{});
        console.log(s1);
        expect(s1.editorDocument.isFetching).toEqual(true);
        const s2 = reducer(s1,receiveDocument(new LdJsonDocument(json)));
        console.dir(s2);
        expect(s2.editorDocument.isFetching).toEqual(false);
        expect(typeof  s2.editorDocument.document).toEqual("object");

        const j = s2.editorDocument.document.draftToJson(s2.editorDocument.editorState.getCurrentContent());
        expect(j.name).toEqual('webRunes');
        console.log(j);

    });

    test('should be able to create new document, import image and convert it to JSON', () => {
       const s1 = reducer(undefined,createNewDocument('1234567890'));
        console.log(s1);
        let s2 = reducer(s1,createNewImage("Hello",'https://sample.host/catty1.jpg',"image 1"));
        s2 = reducer(s2,createNewImage("Hello",'https://sample.host/catty2.jpg',"image 2"));
        s2 = reducer(s2,createNewLink("Link",'https://sample.host/catty.html',"link"));

        const j = s2.editorDocument.document.draftToJson(s2.editorDocument.editorState.getCurrentContent());
        console.log(j);
        expect(j.author).toEqual('https://wr.io/1234567890/?wr.io=1234567890')
    });

    test('should be able to open link dialog',() => {
        const s1 = reducer(undefined,createNewDocument('1234567890'));
        expect(s1.linkDialog.showDialog).toEqual(false);
        expect(s1.imageDialog.showDialog).toEqual(false);
        const s2 = reducer(s1,openLinkDialog("title","",""));
        expect(s2.linkDialog.showDialog).toEqual(true);
        expect(s2.imageDialog.showDialog).toEqual(false);
        const s3 = reducer(s1,closeDialog());
        expect(s3.linkDialog.showDialog).toEqual(false);
        expect(s3.imageDialog.showDialog).toEqual(false);
    })

    test('should be able to open image dialog',() => {
        const s1 = reducer(undefined,createNewDocument('1234567890'));
        expect(s1.imageDialog.showDialog).toEqual(false);
        expect(s1.linkDialog.showDialog).toEqual(false);
        const s2 = reducer(s1,openImageDialog("title","",""));
        expect(s2.imageDialog.showDialog).toEqual(true);
        expect(s2.linkDialog.showDialog).toEqual(false);
        const s3 = reducer(s1,closeDialogImg());
        expect(s3.imageDialog.showDialog).toEqual(false);
        expect(s3.linkDialog.showDialog).toEqual(false);
    })
});