import assert from 'assert';
import should from 'should';
import {getNext} from '../Plus-WRIO-App/stores/tools.js';


describe('tools test', () => {
    before(() => {});

    it("Shoud return undefined", () => {
        const data = {
            test: {
                active: false
            }
        };
        var ret = getNext(data, 'test');
        should.not.exist(ret);
    });
});
