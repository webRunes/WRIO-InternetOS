import request from 'supertest';
import assert from 'assert';
import should from 'should';
import Mention from '../WRIO-InternetOS/js/jsonld/mention.js';


describe('mention test', () => {
   before(() => {

   });
    it("Shoud determine correct mention start and order", () => {
        var mention = new Mention({
            "@type": "Article",
            "name": "First url title",
            "about": "Text inside the ticket popup.",
            "url": "http://webrunes.com/blog.htm?'dolor sit amet':3,104"
        })
        mention.start.should.be.equal(104);
        mention.order.should.be.equal(3);

    })
});