/**
 * Created by michbil on 11.05.17.
 *
 * Routines for manipulating tabs data
 *
 */
import normURL from './normURL';
import {lastOrder,getNext} from './tools';
import cloneDeep from 'lodash.clonedeep';


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

/**
 * Normalizes imported tabs from
 * @param _tabs
 * @returns {*}
 */
export const normalizeTabs = (_tabs) => {
   const tabs = cloneDeep(_tabs);
   function normalize(tabs,processChildren) {
       return Object.values(tabs).reduce((prev,item) => {
           if (!item.url) return;
           const newUrl = normURL(item.url);
           const tab = item;
           if (processChildren) {
               if (tab.children) {
                   tab.children = normalize(tab.children,processChildren,false);
               }
               if (prev[newUrl] && prev[newUrl].children) {
                   let children = prev[newUrl].children;
                   tab.children = Object.assign(children,tab.children);
               }
           }
           prev[newUrl] = {
               name: tab.name,
               url: normURL(tab.url),
               author: normURL(tab.author),
               active: false,
               order: tab.order,
               children: tab.children
           };
           return prev;
       },{});
   }
    return normalize(tabs,true);
};

export const addPageToTabs = (inputTabs,newPage) => {
    const tab = newPage.tab,
        parentName = newPage.parent;
    const tabs = cloneDeep(inputTabs || {});
    if (tab.author && !newPage.noAuthor) {
        // create parent tab if not created before
        let author = normURL(tab.author);
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
    let res = false;
    if (Object.keys(tabs).length) {
        Object.keys(tabs).forEach((name) => {
            if (tabs[name].active) {
                res = true;
            } else {
                if (tabs[name].children) {
                    var children = tabs[name].children;
                    Object.keys(children).forEach((childName) => {
                        if (children[childName].active) {
                            res = true;
                        }
                    });
                }
            }
        });
    }else{
        res = false;
    }
    return res;
};

export const removeLastActive = (_tabs) => {
    let tabs = cloneDeep(_tabs);
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
    let tabs = cloneDeep(inputTabs);
    let next;
    let wasActive;
    if (elName === undefined) {
        next = getNext(tabs, listName);
        wasActive = tabs[listName].active;
        delete tabs[listName];
    } else {
        next = getNext(tabs[listName], elName);
        wasActive = tabs[listName].children[elName].active;
        delete tabs[listName].children[elName];
        if (Object.keys(tabs[listName].children).length === 0) {
            delete tabs[listName].children;
            tabs[listName].active = true;
        }
    }
    return [tabs,next,wasActive];
};


/**
 * ?? modifies somehow pages with current url and replaces it with current url
 */
export const modifyCurrentUrl = (_tabs) => {
    const tabs = cloneDeep(_tabs);
    const href = normURL(window.location.href);
    Object.keys(tabs).forEach((item) => {
        if (normURL(item) === href) {
            var _tmp = tabs[item];
            _tmp.url = href;
            delete tabs[item];
            tabs[href] = _tmp;
        } else if (tabs[item].children) {
            Object.keys(tabs[item].children).forEach((child) => {
                if (normURL(child) === href) {
                    var _tmp = tabs[item].children[child];
                    _tmp.url = href;
                    delete tabs[item].children[child];
                    tabs[item].children[href] = _tmp;
                }
            });
        }
    });
    return tabs;
};



