/**
 * Created by michbil on 20.04.17.
 */
/**
 * Created by michbil on 26.04.16.
 */

import request from 'supertest';
import assert from 'assert';
import should from 'should';

import {sanitizePostUrl} from '../src/clientjs/urlutils.js';

describe('test url sanitization', () => {
    it("Shoud return correct filename", async () => {
       let testUrl = 'https://wr.io/474365383130/Mind_Field_(Ep_8)/#';
       let processed = sanitizePostUrl(testUrl);
       processed.should.be.eql('https://wr.io/474365383130/Mind_Field_(Ep_8)/index.html');

        testUrl = 'https://wr.io/474365383130/Mind_Field_(Ep_8)/';
        processed = sanitizePostUrl(testUrl);
        processed.should.be.eql('https://wr.io/474365383130/Mind_Field_(Ep_8)/index.html');

        testUrl = 'https://wr.io/474365383130/Mind_Field_(Ep_8)/index.html';
        processed = sanitizePostUrl(testUrl);
        processed.should.be.eql('https://wr.io/474365383130/Mind_Field_(Ep_8)/index.html');

        testUrl = 'https://wr.io/474365383130/Mind_Field_(Ep_8)/file.html#';
        processed = sanitizePostUrl(testUrl);
        processed.should.be.eql('https://wr.io/474365383130/Mind_Field_(Ep_8)/file.html');

        testUrl = 'https://wr.io/474365383130/';
        processed = sanitizePostUrl(testUrl);
        processed.should.be.eql('https://wr.io/474365383130/index.html');
    })
});