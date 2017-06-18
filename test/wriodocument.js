/**
 * Created by michbil on 21.09.16.
 */

import request from 'supertest';
import assert from 'assert';
import should from 'should';
import LdJsonManager from '../src/core/jsonld/scripts.js';
import fixtures from './fixtures/index.js'
import WrioDocumentActions from '../src/core/actions/WrioDocument.js';
import WrioDocumentStore from '../src/core/store/WrioDocument.js';
require('./fakeDom.js');

function wrapFixture(scripts) {
    return scripts.map((s) => {
        return {
            textContent: JSON.stringify(s),
            type: 'application/ld+json'
        }
    } )
}

var docScripts;


let s;
describe('mention test', () => {
    before(() => {
        let fix = wrapFixture(fixtures);
        let manager = new LdJsonManager(fix);
        s = new WrioDocumentStore();
        docScripts = manager.getBlocks();
        global.window = {location:{hash:"",href:"webrunes.com"}};// TODO: make explicit passing of window.location
        WrioDocumentActions.loadDocumentWithData.trigger(docScripts,'https://wrioos.com');
    });

    it("Shoud correctly decode document", () => {
        docScripts.length.should.be.equal(2);
    });

    it("Shoud  be able to properly extract document comment id", () => {
        docScripts.length.should.be.equal(2);
        console.log(s.state.toc);
        s.state.toc.covers.length.should.be.equal(2);
        s.getJsonLDProperty('comment').should.be.equal('746095521694089216');
        s.hasCommentId().should.be.true();
        s.hasArticle().should.be.true();
    });

});