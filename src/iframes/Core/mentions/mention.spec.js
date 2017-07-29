import request from 'supertest';
import assert from 'assert';
import should from 'should';
import {Mention,merge} from './mention.js';


var stdout_write = process.stdout._write,
    stderr_write = process.stderr._write;

process.stdout._write = stdout_write;
process.stderr._write = stderr_write;

describe('mention test', () => {
    before(() => {

    });
    it("Should determine correct mention start and order", () => {
        var mention = new Mention({
            "@type": "Article",
            "name": "First url title",
            "about": "Text inside the ticket popup.",
            "url": "https://webrunes.com/blog/?'dolor sit amet':3,104"
        })
        mention.start.should.be.equal(104);
        mention.block.should.be.equal(3);

    })
});