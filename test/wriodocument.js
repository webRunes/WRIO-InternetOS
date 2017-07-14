/**
 * Created by michbil on 21.09.16.
 */

import request from 'supertest';
import assert from 'assert';
import should from 'should';
import LdJsonDocument from '../src/base/jsonld/LdJsonDocument.js';
import fixtures from './fixtures/index.js'
import WrioDocumentActions from '../src/base/actions/WrioDocument.js';
import WrioDocumentStore from '../src/base/store/WrioDocument.js';
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

/*
let s,doc;
describe('mention test', () => {
    before(() => {
        let fix = wrapFixture(fixtures);
        doc = new LdJsonDocument(fix);
        s = new WrioDocumentStore();
        global.window = {location:{hash:"",href:"webrunes.com"}};// TODO: make explicit passing of window.location
        WrioDocumentActions.loadDocumentWithData.trigger(doc,'https://wrioos.com');
    });

    it("Shoud correctly decode document", () => {
        doc.getJsonLDProperty('comment').should.be.equal('746095521694089216');
        doc.hasCommentId().should.be.true();
        doc.hasArticle().should.be.true();
    });

    it("Shoud  be able to properly extract document comment id", () => {
        console.log(s.state.toc);
        s.state.toc.covers.length.should.be.equal(2);

    });

});*/