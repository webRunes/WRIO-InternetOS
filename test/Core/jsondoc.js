/**
 * Created by michbil on 13.05.16.
 */
import request from 'supertest';
import assert from 'assert';
import expect from 'expect';
import JSONDocument from '../../src/iframes/Core/JSONDocument.js';
import fs from 'fs';
import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata} from 'draft-js';
import React from 'react';
import path from 'path'
import reducer from '../../src/iframes/Core/reducers/index'
import {receiveDocument,
    createNewDocument,
    createNewImage,
    createNewLink} from '../../src/iframes/Core/actions/index'

import {openLinkDialog,closeDialog} from '../../src/iframes/Core/actions/linkdialog'
import {openImageDialog,closeDialog as closeDialogImg} from '../../src/iframes/Core/actions/imagedialog'

var doc;
var file = fs.readFileSync(path.join(__dirname,'./testjson.json')).toString();
var json = JSON.parse(file);

describe('LS+JSON tests test', () => {
    before(() => {
    });

    it('Should be able to import document and convert it back to JSON', () => {
        const s1 = reducer(undefined,{});
        console.log(s1);
        expect(s1.document.isFetching).toEqual(true);
        const s2 = reducer(s1,receiveDocument(json));
        console.dir(s2);
        expect(s2.document.isFetching).toEqual(false);
        expect(typeof  s2.document.document).toEqual("object");

        const JSON = s2.document.document.draftToJson(s2.document.editorState.getCurrentContent());
        expect(JSON.name).toEqual('webRunes');
        console.log(JSON);

    });

    it('should be able to create new document, import image and convert it to JSON', () => {
       const s1 = reducer(undefined,createNewDocument('1234567890'));
        console.log(s1);
        let s2 = reducer(s1,createNewImage("Hello",'https://sample.host/catty1.jpg',"image 1"));
        s2 = reducer(s2,createNewImage("Hello",'https://sample.host/catty2.jpg',"image 2"));
        s2 = reducer(s2,createNewLink("Link",'https://sample.host/catty.html',"link"));

        const JSON = s2.document.document.draftToJson(s2.document.editorState.getCurrentContent());
        console.log(JSON);
        expect(JSON.author).toEqual('https://wr.io/1234567890/?wr.io=1234567890')
    });

    it('should be able to open link dialog',() => {
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

    it('should be able to open image dialog',() => {
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