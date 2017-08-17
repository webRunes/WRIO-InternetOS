import assert from 'assert';
import should from 'should';
import {getNext} from './tools.js';


describe('tools test', () => {
    
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
