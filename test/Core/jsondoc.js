/**
 * Created by michbil on 13.05.16.
 */
import request from 'supertest';
import assert from 'assert';
import should from 'should';
import JSONDocument from '../../src/iframes/Core/js/JSONDocument.js';
import fs from 'fs';
import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata} from 'draft-js';
import CoreEditor from '../../src/iframes/Core/js/CoreEditor.js';
import React from 'react';

var doc;

describe('LS+JSON tests test', () => {
    before(() => {
        var file = fs.readFileSync('./test/testjson.json').toString();
        var json = JSON.parse(file);
        doc = new JSONDocument(json);
    });
    it("Should be able to compile document to draft and decompile back to json", () => {
        doc.toDraft();

      /*  let core = <CoreEditor doc={doc} />;
        console.log(core);
        let editorState =core.getEditorState(doc.contentBlocks,doc.mentions);
        doc.draftToJson(editorState);
        console.log(doc.json);*/

    })
});