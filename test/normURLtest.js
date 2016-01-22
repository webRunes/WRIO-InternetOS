/**
 * Created by michbil on 15.01.16.
 */

import assert from 'assert';
import should from 'should';
import normURL from '../widgets/Plus/stores/normURL.js';


describe('URL normalizer test', () => {
    before(() => {});

    it("Should normalize URLs correctly", () => {

        var url = 'https://wrioos.com/index.htm';
        var normalized = normURL(url);
        should(normalized).equal('wrioos.com')

    });
});
