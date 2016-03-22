import assert from 'assert';
import should from 'should';
import {setMock} from '../WRIO-InternetOS/js/store/CrossStorageFactory.js';
import JsonLDStore from '../widgets/Plus/stores/jsonld.js';
import jsdom from 'jsdom';

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
        },
    }
};



var FAKE_DOM_HTML = `
<html>
<body>
</body>
</html>
`;

function setupFakeDOM() {
    if (typeof document !== 'undefined') {
        return;
    }

    global.document = jsdom.jsdom(FAKE_DOM_HTML);
    global.window = document.defaultView;
    global.navigator = window.navigator;
}

setupFakeDOM();



describe('jsonld store test', () => {
    before(() => {});

    it("Should create jsonld store, and get plus from crossStorage", (done) => {
       var store = JsonLDStore;
       setMock(mockval);
       store.init();
       setTimeout(() => {
           console.log("DATA:",store.data);
           should(store.data).equal(mockval.plus);
           done();
       },1000);

    });
});

