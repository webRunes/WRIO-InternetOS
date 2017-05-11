/**
 * Created by michbil on 11.05.17.
 *
 * Routines for manipulating tabs data
 *
 */
import normURL from './normURL';
import {lastOrder,getNext} from './tools';

export const tabsHaveKey = (tabs,key) => {
    let present = false;
    let foundItem = null;
    Object.keys(tabs).forEach((item, i) => {
        if (normURL(item) === normURL(key)) {
            present = true;
            foundItem = item;
        }
    });
    return [present,tabs[foundItem]];
};

export const addPageToTabs = (inputTabs,newPage) => {
    const tab = newPage.tab,
        parentName = newPage.parent;
    const tabs = Object.assign({},inputTabs || {});
    if (tab.author && !newPage.noAuthor) {
        // create parent tab if not created before
        let author = tab.author;
        let [haveAuthor,parent] = tabsHaveKey(tabs,author);
        if (!haveAuthor) {
            parent = {
                name: parentName,
                url: author,
                order: lastOrder(tabs),
                children: {}
            };
        }

        parent.children = parent.children || {};

        //update child
        let key = tab.url;
        Object.keys(parent.children).forEach((item) => {
            if (normURL(item) === normURL(key)) {
                parent.children[item].active = true;
                key = undefined;
            }
        });
        if (key) {
            tab.order = lastOrder(parent.children);
            parent.children[key] = tab;
        }
        //parent.active = true;
        return Object.assign(tabs,{[author]:parent});
    } else {
        let key = tab.url;
        Object.keys(tabs).forEach((item) => {
            if (normURL(item) === normURL(key)) {
                tabs[item].active = true;
                key = undefined;
            }
        });
        if (key) {
            tab.order = lastOrder(tabs);
            return Object.assign(tabs,{[key]:tab});
        }
    }
    return tabs;
};

export const hasActive = (tabs) => {
    let hasActive = false;
    if (Object.keys(tabs).length) {
        Object.keys(tabs).forEach((name) => {
            if (tabs[name].active) {
                hasActive = true;
            } else {
                if (tabs[name].children) {
                    var children = tabs[name].children;
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
    return hasActive;
};

export const removeLastActive = (_tabs) => {
    const tabs = Object.assign({},_tabs);
    function rm (obj) {
        return Object.keys(obj).forEach((key) => {
            var o = obj[key];
            if (o && o.active !== undefined) {
                obj[key].active = false;
            }
            if (o && o.children) {
                rm(obj[key].children);
            }
        });
    }
    rm(tabs);
    return tabs;
};

/**
 * Deletes page elname from tabs inputTabs
 * @param inputTabs
 * @param listName
 * @param elName
 * @returns {*[]}
 */

export const deletePageFromTabs = (inputTabs, listName,elName) => {
    let tabs = Object.assign({},inputTabs);
    let next;
    if (elName === undefined) {
        next = getNext(tabs, listName);
        delete tabs[listName];
    } else {
        next = getNext(tabs[listName], elName);
        delete tabs[listName].children[elName];
        if (Object.keys(tabs[listName].children)
                .length === 0) {
            delete tabs[listName].children;
            tabs[listName].active = true;
        }
    }
    return [tabs,next];
};


/**
 * ?? modifies somehow pages with current url and replaces it with current url
 */
export const modifyCurrentUrl = (_tabs) => {
    const tabs = Object.assign({},_tabs);
    Object.keys(tabs).forEach((item) => {
        if (normURL(item) === normURL(window.location.href)) {
            var _tmp = tabs[item];
            _tmp.url = window.location.href;
            delete tabs[item];
            tabs[window.location.href] = _tmp;
        } else if (tabs[item].children) {
            Object.keys(tabs[item].children).forEach((child) => {
                if (normURL(child) === normURL(window.location.href)) {
                    var _tmp = tabs[item].children[child];
                    _tmp.url = window.location.href;
                    delete tabs[item].children[child];
                    tabs[item].children[window.location.href] = _tmp;
                }
            });
        }
    });
    return tabs;
};



