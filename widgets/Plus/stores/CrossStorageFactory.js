/**
 * Created by michbil on 15.01.16.
 */

import {CrossStorageClient} from 'cross-storage';
import {Promise} from 'es6-promise';

var mockStorage = {};

export function setMock (m) {
    mockStorage = m;
}

class CrossStorageMock {
    constructor() {
       
    }
    onConnect() {
        return new Promise((resolve,reject) => {
            console.log("Mocking onConnect...");
            resolve();
        });
    }
    get (key) {
        var val = mockStorage[key];
        console.log("GET",key,val);
        return new Promise((resolve,reject) => {
            resolve(val);
        });
    }
    set (key,value) {
        console.log("SET",key,value);
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
            var host = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://wrioos.com/';
            this.cs =  new CrossStorageClient(host + 'Plus-WRIO-App/widget/storageHub.htm', {
                promise: Promise
            });
        }

    }

    getCrossStorage() {
        if (this.isInTest) {
            console.log("Mocking crossStorage");
            return new CrossStorageMock();
        } else {
            console.log("============================================Requesting cross storage copy!!!!!!");
           return this.cs;
        }
    }

}

export var CrossStorageFactory = new _CrossStorageFactory();
