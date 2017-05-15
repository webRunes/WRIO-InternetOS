import assert from 'assert';
import should from 'should';
import {
    addPageToTabs,
    hasActive,
    removeLastActive,
    deletePageFromTabs,
    normalizeTabs,
    saveCurrentUrlToPlus} from '../src/widgets/Plus/utils/tabTools.js';


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
};

const nonNormalized = {
    "//wrioos.local/hub/stevhub.html": {
        "name": "Michael Bilenko",
        "url": "//wrioos.local/hub/stevhub.html",
        "order": 6,
        "children": {
            "//wrioos.local/hub/2.html": {
                "name": "3",
                "url": "//wrioos.local/hub/2.html",
                "author": "http://wrioos.local/hub/stevhub.html",
                "active": false,
                "order": 0
            }
        },
        "active": false
    },
    "http://wrioos.local/hub/stevhub.html": {
        "name": "Michael Bilenko",
        "url": "//wrioos.local/hub/stevhub.html",
        "order": 6,
        "children": {
            "//wrioos.local/hub/2.html": {
                "name": "3",
                "url": "//wrioos.local/hub/2.html",
                "author": "http://wrioos.local/hub/stevhub.html",
                "active": false,
                "order": 0
            }
        },
        "active": false
    },
    "//webrunes.com": {"name": "webRunes", "url": "//webrunes.com", "author": "", "active": false, "order": 4},
    "//wr.io/474365383130": {
        "name": "Michael Stevens",
        "url": "//wr.io/474365383130",
        "order": 1,
        "children": {
            "//vsauce.wr.io": {
                "name": "Vsauce",
                "url": "//vsauce.wr.io",
                "author": "https://wr.io/474365383130/?wr.io=474365383130",
                "active": false,
                "order": 1
            },
            "//wr.io/474365383130/Untitled": {
                "name": "Untitled",
                "url": "//wr.io/474365383130/Untitled",
                "author": "https://wr.io/474365383130/?wr.io=474365383130",
                "active": false,
                "order": 2
            }
        },
        "active": false
    },
    "https://wr.io/474365383130/?wr.io=474365383130": {
        "name": "Michael Stevens",
        "url": "//wr.io/474365383130",
        "order": 1,
        "children": {
            "//vsauce.wr.io": {
                "name": "Vsauce",
                "url": "//vsauce.wr.io",
                "author": "https://wr.io/474365383130/?wr.io=474365383130",
                "active": true,
                "order": 1
            },
            "//wr.io/474365383130/Untitled": {
                "name": "Untitled",
                "url": "//wr.io/474365383130/Untitled",
                "author": "https://wr.io/474365383130/?wr.io=474365383130",
                "active": false,
                "order": 2
            }
        },
        "active": false
    }
};


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

const vsauseNotJoined = {
    "//wr.io/474365383130": {
        "name": "Michael Stevens",
        "url": "//wr.io/474365383130",
        "active": false,
        "order": 0,
        "children": {
            "//vsauce.wr.io": {
                "name": "Vsauce",
                "url": "//vsauce.wr.io",
                "author": "//wr.io/474365383130",
                "active": false,
                "order": 0
            }
        }
    },
    "//dp.wr.io": {
        "name": "Физика от Побединского",
        "url": "//dp.wr.io",
        "author": "",
        "active": false,
        "order": 1
    },
    "//vsauce.wr.io": {
        "name": "Vsauce",
        "url": "//vsauce.wr.io",
        "author": "//wr.io/474365383130",
        "active": false,
        "order": 2
    },
    "//login.wrioos.local": {
        "name": "Login",
        "url": "//login.wrioos.local",
        "author": "",
        "active": false,
        "order": 3
    },
    "//titter.wrioos.local": {
        "name": "Titter",
        "url": "//titter.wrioos.local",
        "author": "",
        "active": false,
        "order": 4
    },
    "//webgold.wrioos.local": {
        "name": "webGold (WRG)",
        "url": "//webgold.wrioos.local",
        "author": "",
        "active": false,
        "order": 5
    },
    "//storage.wrioos.local": {
        "name": "Storage",
        "url": "//storage.wrioos.local",
        "author": "",
        "active": true,
        "order": 6
    }
};

const msOnly = {
    "//wr.io/474365383130": {
        "name": "Michael Stevens",
        "url": "//wr.io/474365383130",
        "active": false,
        "order": 0,
        "children": {
            "//vsauce.wr.io": {
                "name": "Vsauce",
                "url": "//vsauce.wr.io",
                "author": "//wr.io/474365383130",
                "active": false,
                "order": 0
            }
        }
    }
}

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
        let [_tabs, next, wasActive] = deletePageFromTabs(testPlus,testList);
        testPlus.should.have.property(testList); // make shure testPlus is not modified
        _tabs.should.not.have.property(testList);
        // try to delete child
        const testParent = "https://wr.io/474365383130/?wr.io=474365383130";
        const testChild = "http://wrioos.local/hub/vsauce.html#Vsauce_is...";
        testPlus[testParent].children.should.have.property(testChild);
        let [__tabs,__next,__wasActive] = deletePageFromTabs(testPlus, testParent, testChild);
        testPlus[testParent].children.should.have.property(testChild);
        __tabs[testParent].should.not.have.property("children");
    });

    it("should normilize input data", () => {
        const res = normalizeTabs(nonNormalized);

       // console.log(JSON.stringify(res,null,4));
    })

    it("should join tabs correctly", ()=> {
        const res = normalizeTabs(vsauseNotJoined);

         console.log(JSON.stringify(res,null,4));
    });
});
