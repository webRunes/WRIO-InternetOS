import assert from 'assert';
import should from 'should';
import {setMock} from '../../utils/CrossStorageFactory.js';
import PlusStore from './PlusStore.js';

var mockval = {
    "plus":{
        "webrunes.com": {
            "name": "webRunes",
            "url": "webrunes.com",
            "order": 0
        },
        "wrioos.com": {
            "name": "WRIO OS",
            "url": "wrioos.com",
            "order": 1
        },
        "webrunes.com/blog.htm": {
            "name": "Blogs",
            "url": "webrunes.com/blog.htm",
            "author": "webrunes.com",
            "order": 2,
            "active": true
        }
    }
};




import WindowActions from "../../actions/WindowActions"
import {
    addPageToTabs,
    hasActive,
    removeLastActive,
    deletePageFromTabs,
    normalizeTabs,
    saveCurrentUrlToPlus} from '../utils/tabTools.js';


describe('jsonld store test', () => {

    it("Should create jsonld store, and get plus from crossStorage", (done) => {
       var store = PlusStore;
       setMock(mockval);
       store.init();
       WindowActions.loginMessage({wrioID:'558153389649',temporary:false,profile: {}}); // fake got wrio id request
       setTimeout(() => {
           //console.log("DATA:",store.data);
           //should(store.data).deepEqual(normalizeTabs(mockval.plus));
           done();
       },1000);

    });
});

