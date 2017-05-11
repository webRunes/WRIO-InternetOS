import assert from 'assert';
import should from 'should';
import {
    addPageToTabs,
    hasActive,
    removeLastActive,
    deletePageFromTabs,
    modifyCurrentUrl} from '../src/widgets/Plus/utils/tabTools.js';


const buggy = {
    "value": {
        "http://wrioos.local/hub/3.html#": {
            "name": "3",
            "url": "http://wrioos.local/hub/3.html#",
            "author": "http://wr.io/122942999005/?wr.io=122942999005",
            "active": false,
            "order": 0
        },
        "//vsauce.wr.io": {
            "name": "Vsauce",
            "url": "//vsauce.wr.io",
            "author": "https://wr.io/474365383130/?wr.io=474365383130",
            "active": false,
            "order": 3
        },
        "//webrunes.com": {"name": "webRunes", "url": "//webrunes.com", "author": "", "active": false, "order": 4},
        "http://wrioos.local/hub/2.html#": {
            "name": "3",
            "url": "http://wrioos.local/hub/2.html#",
            "author": "http://wr.io/848825910709/?wr.io=848825910709",
            "active": false,
            "order": 2
        },
        "https://wr.io/474365383130/?wr.io=474365383130#": {
            "name": "Michael Stevens",
            "url": "https://wr.io/474365383130/?wr.io=474365383130#",
            "order": 1,
            "children": {
                "http://wrioos.local/hub/vsauce.html#": {
                    "name": "Vsauce",
                    "url": "http://wrioos.local/hub/vsauce.html#",
                    "author": "https://wr.io/474365383130/?wr.io=474365383130",
                    "active": false,
                    "order": 0
                }
            },
            "active": false
        },
        "//wrioos.local/hub/vsauce.html": {
            "name": "Vsauce",
            "url": "//wrioos.local/hub/vsauce.html",
            "author": "https://wr.io/474365383130/?wr.io=474365383130",
            "active": true,
            "order": 5
        }
    }
}

const testPlus = {
    "//wrioos.local/hub/1.html": {
        "name": "Untitled1",
        "url": "//wrioos.local/hub/1.html",
        "author": "https://wr.io/558153389649/?wr.io=558153389649",
        "active": false,
        "order": 0
    },
    "https://wr.io/474365383130/?wr.io=474365383130": {
        "name": "Michael Stevens",
        "url": "https://wr.io/474365383130/?wr.io=474365383130",
        "order": 4,
        "active": false,
        "children": {
            "http://wrioos.local/hub/vsauce.html#Vsauce_is...": {
                "name": "Vsauce",
                "url": "http://wrioos.local/hub/vsauce.html#Vsauce_is...",
                "author": "https://wr.io/474365383130/?wr.io=474365383130",
                "active": false,
                "order": 0
            }
        }
    },
    "//wrioos.local/hub/3.html": {
        "name": "3",
        "url": "//wrioos.local/hub/3.html",
        "author": "http://wr.io/122942999005/?wr.io=122942999005",
        "active": true,
        "order": 5
    },
    "//webrunes.com": {"name": "webRunes", "url": "//webrunes.com", "author": "", "active": false, "order": 6},
    "//vsauce.wr.io": {
        "name": "Vsauce",
        "url": "//vsauce.wr.io",
        "author": "https://wr.io/474365383130/?wr.io=474365383130",
        "active": false,
        "order": 7
    }
};


describe('Plus tab utils testing', () => {
    before(() => {
    });

    it("Should hasactive(testPlus)", ()=> {
        hasActive(testPlus).should.equal(true);
    });

    it("Should reset all active flags", () => {

        testPlus["//wrioos.local/hub/3.html"].active.should.equal(true);
        const _tabs = removeLastActive(testPlus);
        _tabs["//wrioos.local/hub/3.html"].active.should.equal(false);
        hasActive(testPlus).should.equal(true); // testPlus should be unmodified by removeLastActive
        hasActive(_tabs).should.equal(false);
    });

    it("Should delete tab successfully", () => {
        const testList = "//wrioos.local/hub/3.html";
        testPlus.should.have.property(testList);
        const _tabs = deletePageFromTabs(testList);
        testPlus.should.have.property(testList); // make shure testPlus is not modified
        _tabs.should.not.have.property(testList);
        // try to delete child
        const testParent = "https://wr.io/474365383130/?wr.io=474365383130";
        const testChild = "http://wrioos.local/hub/vsauce.html#Vsauce_is...";
        testPlus[testParent].children.should.have.property(testChild);
        const __tabs = deletePageFromTabs(testPlus, testParent, testChild);
        testPlus[testParent].children.should.have.property(testChild);
        console.log(__tabs[testParent]);
        //__tabs[testParent].should.not.have.property("children");
    });
});
