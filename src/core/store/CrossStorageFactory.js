/**
 * Created by michbil on 15.01.16.
 */

import {CrossStorageClient} from 'cross-storage';
import {isSafari,SafariStorage} from './SafariStorage.js';

var mockStorage = {};

export function setMock (m) {
    mockStorage = m;
}

class CrossStorageMock {
    constructor() {
       
    }
    onConnect() {
        return new Promise((resolve,reject) => {
            //console.log("Mocking onConnect...");
            resolve();
        });
    }
    get (key) {
        var val = mockStorage[key];
        //console.log("GET",key,val);
        return new Promise((resolve,reject) => {
            resolve(val);
        });
    }
    set (key,value) {
        //console.log("SET",key,value);
        mockStorage[key] = value;
    }
    del (key,value) {
        delete mockStorage[key];
    }

}

class _CrossStorageFactory {

    constructor () {
        this.isInTest = typeof global.it === 'function';
        if (!this.isInTest) {
            if /*(isSafari())*/(true) {
                console.warn("Safari cross storage emulation mode is on");
                this.cs = new SafariStorage();
            } else {
                var host = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://wrioos.com/';
                this.cs =  new CrossStorageClient(host + 'Plus-WRIO-App/widget/storageHub.html', {
                    promise: Promise
                });
            }

        }

    }

    getCrossStorage() {
        return this.isInTest ? new CrossStorageMock() : this.cs;
    }

}

export var CrossStorageFactory = new _CrossStorageFactory();
