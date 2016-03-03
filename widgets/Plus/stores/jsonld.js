import Reflux from 'reflux';
import normURL from './normURL';
import Actions from '../actions/jsonld';
import ActionMenu from '../actions/menu';
import {getJsonldsByUrl,lastOrder,getNext} from './tools';
import {Promise} from 'es6-promise';
import {CrossStorageFactory} from './CrossStorageFactory.js';

var host = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://wrioos.com/',
    storage = CrossStorageFactory.getCrossStorage();

export default Reflux.createStore({
    listenables: Actions,
    getUrl: function() {
        var theme = 'Default-WRIO-Theme';
        return host + theme + '/widget/defaultList.htm';
    },
    init: function() {
        storage.onConnect()
            .then(() =>{
                return storage.get('plus');
            })
            .then((plus) => {
                this.data = plus || {};
                this.trigger(this.data);
            });
    },
    pending: 0,
    onData: function(params) {
        console.log('onData');
        var o = params.tab,
            parentName = params.parent,
            key;
        this.data = this.data || {};
        if (parentName) {
            key = o.author;
            if (this.data[key] === undefined) {
                this.data[key] = {
                    name: parentName,
                    url: key,
                    order: o.order
                };
            }
            if (this.data[key].children === undefined) {
                this.data[key].children = {};
            }
            this.data[key].children[normURL(o.url)] = o;
        } else {
            if (o.author) {
                console.warn('plus: author [' + o.author + '] do not have type Article');
            }
            key = normURL(o.url);
            this.data[key] = o;
        }
        this.pending -= 1;
        if (this.pending === 0) {
            storage.onConnect()
                .then(function() {
                    return storage.get('plus');
                })
                .then(function(res) {
                    if (JSON.stringify(res) !== JSON.stringify(this.data)) {
                        this.update();
                    }
                }.bind(this));
        }
    },
    onDataActive: function(params) {
        var o = params.tab,
            parentName = params.parent,
            key;
        this.data = this.data || {};
        if (o.author && !params.noAuthor) {
            //check parent
            key = o.author;
            Object.keys(this.data).forEach((item) => {
                if (normURL(item) === normURL(key)) {
                    key = undefined;
                }
            });
            if (key) {
                this.data[key] = {
                    name: parentName,
                    url: key,
                    order: lastOrder(this.data)
                };
            }
            key = o.author;
            var children;
            Object.keys(this.data).forEach((item) => {
                if (normURL(item) === normURL(key) && this.data[item].children) {
                    children = this.data[item].children;
                    key = undefined;
                }
            });
            if (key) {
                this.data[key].children = {};
                children = this.data[key].children;
            }
            //update child
            key = o.url;
            Object.keys(children).forEach((item) => {
                if (normURL(item) === normURL(key)) {
                    children[item].active = true;
                    key = undefined;
                }
            });
            if (key) {
                o.order = lastOrder(children);
                children[key] = o;
            }
        } else {
            key = o.url;
            Object.keys(this.data).forEach((item) => {
                if (normURL(item) === normURL(key)) {
                    this.data[item].active = true;
                    key = undefined;
                }
            });
            if (key) {
                o.order = lastOrder(this.data);
                this.data[key] = o;
            }
        }
    },
    update: function(cb) {
        storage.onConnect()
            .then(() => {
                storage.del('plus');
                storage.set('plus', this.data);
            })
            .then(cb);
    },
    onPlusActive: function(active, url, cb) {
        storage.onConnect()
            .then(() => {
                storage.del('plusActive');
                storage.set('plusActive', {
                    active: active,
                    url: url || normURL(window.location.href)
                });
                cb();
            });
    },
    merge: function() {
        this.removeLastActive(this.data);
        storage.onConnect()
            .then(() => {
                return storage.get('plusActive');
            })
            .then((plusActive) => {
                if (plusActive && plusActive.active) {
                    if (normURL(window.location.href) !== normURL(plusActive.url)) {
                        plusActive.active = false;
                        storage.del('plusActive');
                        storage.set('plusActive', plusActive);
                        this.addCurrentPage((params) => {
                            if (params) {
                                this.onDataActive(params);
                            }
                            this.update();
                            this.trigger(this.data);
                        });
                    }
                    this.update();
                    this.trigger(this.data);
                } else if (plusActive && !plusActive.active) {
                    if (normURL(window.location.href) === normURL(plusActive.url)) {
                        plusActive.active = true;
                        storage.del('plusActive');
                        storage.set('plusActive', plusActive);
                        this.update();
                        this.trigger(this.data);
                    }
                    this.addCurrentPage((params) => {
                        if (params) {
                            this.onDataActive(params);
                        }
                        this.update();
                        this.trigger(this.data);
                    });
                } else {
                    this.addCurrentPage((params) => {
                        if (params) {
                            this.onDataActive(params);
                        }
                        this.update();
                        this.trigger(this.data);
                    });
                }
            });
    },
    removeLastActive: function(obj) {
        Object.keys(obj)
            .forEach(function(key) {
                var o = obj[key];
                if (o && o.active !== undefined) {
                    obj[key].active = false;
                }
                if (o && o.children) {
                    this.removeLastActive(obj[key].children);
                }
            }, this);
    },
    createCurrentPage: function(cb) {
        var scripts = document.getElementsByTagName('script'),
            i,
            json,
            o;
        for (i = 0; i < scripts.length; i += 1) {
            if (scripts[i].type === 'application/ld+json') {
                json = undefined;
                try {
                    json = JSON.parse(scripts[i].textContent);
                } catch (exception) {
                    json = undefined;
                    console.error('Your json-ld not valid: ' + exception);
                }
                if ((typeof json === 'object') && (json['@type'] === 'ItemList')) {
                    o = {
                        name: json.name,
                        url: window.location.href,
                        author: json.author,
                        active: true
                    };
                }

                if ((typeof json === 'object') && (json['@type'] === 'Article')) {
                    o = {
                        name: json.name,
                        url: window.location.href,
                        author: json.author,
                        active: true
                    };
                    break;
                }
            }
        }
        cb.call(this, o);
    },
    addCurrentPageParent: function(o, cb) {
        getJsonldsByUrl(o.author, (jsons) => {
            if (jsons && jsons.length !== 0) {
                var j, name;
                for (j = 0; j < jsons.length; j += 1) {
                    if (jsons[j]['@type'] === 'Article') {
                        name = jsons[j].name;
                        j = jsons.length;
                    }
                }
                if (!name) {
                    console.warn('plus: author [' + o.author + '] do not have type Article');
                }
                cb.call(this, {
                    tab: o,
                    parent: name
                });
            } else {
                cb.call(this, {
                    tab: o,
                    noAuthor: true
                });
            }
        });
    },
    addCurrentPage: function(cb) {
        this.createCurrentPage((o) => {
            if (o) {
                var key = o.author;
                Object.keys(this.data).forEach((item, i) => {
                    if (normURL(item) === normURL(key)) {
                        key = undefined;
                    }
                });
                if (o.author && typeof o.author === 'string' && key && (normURL(o.author) !== normURL(o.url))) {
                    this.addCurrentPageParent(o, cb);
                } else {
                    cb.call(this, {
                        tab: o,
                        noAuthor: true
                    });
                }
            } else {
                cb.call(this);
            }
        });
    },
    filterItemList: function(jsons) {
        var items = [];
        if (jsons) {
            jsons.forEach(function(json) {
                if ((json.itemListElement !== undefined) && (json['@type'] === 'ItemList')) {
                    items = items.concat(json.itemListElement);
                }
            });
        }
        this.pending += items.length;
        this.core(items);
    },
    core: function(items) {
        items.forEach(function(o, order) {
            o = {
                name: o.name,
                url: normURL(o.url),
                author: normURL(o.author),
                order: order
            };
            var author = o.author;
            if (author) {
                getJsonldsByUrl(author, function(jsons) {
                    var j, name;
                    for (j = 0; j < jsons.length; j += 1) {
                        if (jsons[j]['@type'] === 'Article') {
                            name = jsons[j].name;
                            j = jsons.length;
                        }
                    }
                    this.onData({
                        tab: o,
                        parent: name
                    });
                }.bind(this));
            } else {
                this.onData({
                    tab: o
                });
            }
        }, this);
    },
    getInitialState: function() {
        return this.data;
    },
    onDel: function(listName, elName) {
        var next;
        if (elName === undefined) {
            next = getNext(this.data, listName);
            delete this.data[listName];
        } else {
            next = getNext(this.data[listName], elName);
            delete this.data[listName].children[elName];
            if (Object.keys(this.data[listName].children)
                .length === 0) {
                delete this.data[listName].children;
                this.data[listName].active = true;
            }
        }
        this.update(() => {
            if (next) {
                window.location = next;
            } else {
                storage.onConnect()
                    .then(() => {
                        return storage.get('plus');
                    })
                    .then((plus) => {
                        var hasActive = false;
                        if (Object.keys(plus).length) {
                            Object.keys(plus).forEach((name) => {
                                if (plus[name].active) {
                                    hasActive = true;
                                } else {
                                    if (plus[name].children) {
                                        var children = plus[name].children;
                                        Object.keys(children).forEach((childName) => {
                                            if (children[childName].active) {
                                                hasActive = true;
                                            }
                                        });
                                    }
                                }
                            });
                        }else{
                            hasActive = false;
                        }

                        if(!hasActive){
                            return storage.get('plusActive');
                        }else{
                            return false;
                        }
                    })
                    .then((plusActive) => {
                        if(plusActive){
                            window.location = plusActive.url;
                        }else{
                            ActionMenu.refresh();
                        }
                     })
                    .catch(() => {
                        this.trigger(this.data);
                    });
            }
        });
    },
    haveData: function() {
        return ((this.data !== null) && (typeof this.data === 'object'));
    },
    onRead: function() {
        if (this.haveData() && (this.pending === 0)) {
            this.merge();
        } else {
            var i = setInterval(function() {
                if (this.haveData() && (this.pending === 0)) {
                    clearInterval(i);
                    this.merge();
                }
            }.bind(this), 100);
        }
    },


    hideAlertWarning(id, cb){
        var info = id + ' close warning alert';
        storage.onConnect().then(function () {
            return storage.get(info);
        }).then(function (res) {
            if(res){
                cb(true);
            }else{
                cb(false);
            }
        });
    },

    hideAlertWelcome(id, cb){
        var info = id + ' close welcome alert';
        storage.onConnect().then(function () {
            return storage.get(info);
        }).then(function (res) {
            if(res){
                cb(true);
            }else{
                cb(false);
            }
        });
    },

    hideAlertWarningByClick(id){
        var info = id + ' close warning alert';
        storage.onConnect().then(function () {
            storage.set(info, true);
        });
    },

    hideAlertWelcomeByClick(id){
        var info = id + ' close welcome alert';
        storage.onConnect().then(function () {
            storage.set(info, true);
        });
    },



});
