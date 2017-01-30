import request from 'supertest';
import assert from 'assert';
import should from 'should';
import LdJsonObject from '../src/core/jsonld/entities/LdJsonObject';

const fixture = {
    "@context": "https://schema.org",
    "@type": "Article",
    "inLanguage": "En",
    "keywords": "",
    "author": "https://wr.io/848825910709/?wr.io=848825910709",
    "editor": "",
    "name": "Untitled",
    "about": "",
    "articleBody": [
        " ",
        ""
    ],
    "hasPart": [
        {
            "@type": "SocialMediaPosting",
            "sharedContent": {
                "@type": "WebPage",
                "headline": "",
                "about": "",
                "url": "https://www.youtube.com/watch?v=9GTB4oGLSz4"
            }
        }
    ],
    "mentions": [],
    "comment": "",
    "image": []
};

describe('mention test', () => {
    before(() => {
    });

    it("Shoud correctly evaluate type of JSON-LD object", () => {
        const obj = new LdJsonObject(fixture,0,0);
        obj.hasElementOfType("Article").should.be.true();
        obj.hasElementOfType("Social").should.be.false()
    });


});