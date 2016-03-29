import assert from 'assert';
import should from 'should';
import {getNext} from '../src/widgets/Plus/utils/tools.js';


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
