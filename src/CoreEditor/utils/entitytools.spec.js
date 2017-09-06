import {mkDoc} from '../reducers/docUtils'
import * as EntityTools from './entitytools'
import getFixture from '../fixtures/fixture.js'
import JSONDocument from '../JSONDocument'
let json = getFixture('social');

/**
 * The goal of this test is to make import of documents without extra spaces or newlines
 */
test('Should IMPORT document with social media entity without extra newlines', () => {
    const doc = new JSONDocument(json);
    const {editorState}  = mkDoc({},doc);
    const blockMap = editorState.getCurrentContent().getBlockMap()
    blockMap.forEach((block,key)=> {
        console.log(`blockk ${key} type: ${block.type} text: <<<${block.text}>>>`)
    })
})

test('Should extract table of contents correctly', () => {
     const doc = new JSONDocument(json);
    const {editorState}  = mkDoc({},doc);
    const toc = EntityTools.extractTableOfContents(editorState);
    expect(toc).toEqual(['Untitledsd']) 
})