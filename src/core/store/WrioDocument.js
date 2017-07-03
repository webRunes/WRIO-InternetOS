/* @flow */
/**
 * Created by michbil on 30.03.16.
 */
import {CrossStorageFactory} from './CrossStorageFactory.js';
// $FlowFixMe
import Reflux from 'reflux';
import WrioDocumentActions from "../actions/WrioDocument.js";
import UIActions from "../actions/UI"
import getHttp from '../store/request.js';
import UrlMixin from '../mixins/UrlMixin';
import LdJsonObject from '../jsonld/entities/LdJsonObject'
import LdJsonDocument from '../jsonld/LdJsonDocument'
import TableOfContents from './tocnavigation'
import {replaceSpaces} from '../mixins/UrlMixin'



/**
 * Store that handles state of entire WRIO-document
 */

class WrioDocument extends Reflux.Store {

    state: {
        editAllowed : boolean,
        mainPage: LdJsonDocument;
        lists: Array<LdJsonDocument>,
        toc : Object;
        url: string;
    };

    constructor () {
        super();
        this.listenables = WrioDocumentActions;
        this.updateHook = null;
        this.state = {
            editAllowed: false,
            lists: [],
            url: window.location.href,
            // $FlowFixMe
            mainPage: null,
            toc: {
                covers: [],
                chapters: [],
                external: []
            }
        }
    }

    /**
     * Called upon initial loading of the page
     * extracts incoming JSON+LD table of contents
     * and fetchs external lists too
     * @param data
     * @param url
     */

    onLoadDocumentWithData(data: LdJsonDocument, url : string) {
        // Quick hack to make page jump to needed section after page have been edited
        this.updateHook = () => this._forceHash();

        const toc = this.extractPageNavigation(data);
        this.setState({mainPage: data,url,toc});

        toc.covers.map(async (cover : Object) => {
            console.log(cover);
            if (cover.url) {
                try {
                    const doc : LdJsonDocument = await getHttp(cover.url);
                    let lists = this.state.lists;
                    lists.push(Object.assign(cover, {data: doc.getBlocks()[0],type:'cover'}));
                    this.setState({lists});
                } catch (err) {
                    console.log(`Unable to download cover ${cover.url}`);
                    return;
                }

            }
        });

        toc.external.map(async (externalDoc : Object) => {
            console.log(externalDoc);
            if (externalDoc.url) {
                try {
                    const doc : LdJsonDocument = await getHttp(externalDoc.url);
                    let lists = this.state.lists;
                    lists.push(Object.assign(externalDoc, {data: doc.getBlocks()[0],type:'external'}));
                    this.setState({lists});
                } catch (err) {
                    console.log(`Unable to download external ${externalDoc.url}`);
                    return;
                }

            }
        });
    }

    extractPageNavigation(data: LdJsonDocument) {
        const toc = new TableOfContents();
        const [coverItems,articleItems,externalItems] = toc.getArticleItems(window.location,this.type,data.getBlocks());
        return {
            covers: coverItems,
            chapters: articleItems,
            external: externalItems
        };
    }

    // this hook is triggered after DOM redraw, to set article hash
    // it's needed because you can't set artcile hash before article is rendered

    onPostUpdateHook() {
        if (this.updateHook) {
            this.updateHook();
            this.updateHook = null;
        }
    }


    _forceHash() {
        setTimeout(() => {
            const orig = window.location.hash;
            window.location.hash = orig + ' ';
            window.location.hash = orig;

        },100);
    }


    performPageTransaction(path: string) {
        history.pushState({},window.location.path,path);
    }




   // getListItem(name: string) {
    //    return this.state.lists[name.toLowerCase()];
   // }



    // methods what was in the center.js store
    _setUrlWithParams (type: string, name : string, isRet: boolean) {
        // TODO type have no meaning in current realization
        var search = '?list=' + name,
            path = window.location.pathname + search;
        if (isRet) {
            return path;
        } else {
            window.history.pushState('page', 'params', path);
        }
    }

    _setUrlWithHash (name:string, isRet: boolean) {
        window.history.pushState('page', 'params', window.location.pathname);
        window.location.hash = name;
        const toc = this.extractPageNavigation(this.state.mainPage);
        this.setState({toc});

        this.updateHook = () => this._forceHash();
    }

    // this actions are called when browsing through the right menu

    onExternal (url: string, name: string, isRet : boolean, cb: Function) {
        console.log("====OnEXTERNAL",name);
        var type = 'external';
        cb ? cb(this._setUrlWithParams(type, name, isRet)) : this._setUrlWithParams(type, name, isRet);
    }

    onCover (url: string, name: string, init: boolean, isRet: boolean) {
        console.log("====OnCOVER");
        if (!init) {
            this._setUrlWithParams('cover', name, isRet);
        }
    }
    onArticle (id: string, hash: string, isRet: boolean) {
        console.log("====OnARTICLE");
        var type = 'article';
        this._setUrlWithHash(hash, isRet);
    }

    isEditingRemotePage() : boolean {
        const urlParams = UrlMixin.searchToObject(this.state.url);
        return urlParams.edit && urlParams.edit !== 'undefined';
    }


    // Listen to the login iframe messages

    async onGotProfileUrl(profileUrl : Object) {
        const _author = await this.getAuthor();
        console.log('Checking if editing allowed: ', profileUrl, _author);
        if (UrlMixin.compareProfileUrls(profileUrl,_author)) {
            this.setState({editAllowed: true})
        }
    }


    async getAuthor() {
        const urlParams = UrlMixin.searchToObject(this.state.url);
        if (this.isEditingRemotePage()) {
            var url = this.formatUrl(urlParams.edit);
            const doc: LdJsonDocument = await getHttp(url);
            return doc.getJsonLDProperty('author');
        } else {
            let author = this.mainPage.getJsonLDProperty('author');
            return author;
        }
    }

};


export default WrioDocument;