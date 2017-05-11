/**
 * Created by michbil on 11.05.17.
 */

import {
    addPageToTabs,
    hasActive,
    removeLastActive,
    deletePageFromTabs,
    modifyCurrentUrl} from '../src/widgets/Plus/utils/tabTools.js';


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
}