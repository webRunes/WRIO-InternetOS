/* @flow */
/**
 * Created by michbil on 22.06.17.
 */

import {replaceSpaces} from '../mixins/UrlMixin';
import LdJsonObject from '../jsonld/entities/LdJsonObject'
import LdJsonDocument from '../jsonld/LdJsonDocument'

export class MenuItem {
    name: string;
    url: string;
    active: boolean;

    constructor(name: string,url: string, active: boolean) {
        this.name =name;
        this.url = url;
        this.active = active;
    }
}

class ListItem extends MenuItem {
    segueUrl : string;
    constructor(name: string,url: string, active:boolean) {
        super (name,url,active);
        this.segueUrl = `?list=${replaceSpaces(name)}`;
    }
}


function isCover(o: Object) : boolean {
    return o.url && (typeof o.url === 'string') && (o.url.indexOf('?cover') === o.url.length - 6); // TODO: maybe regexp would be better, huh?
}

const hashEquals = (location: Object) => (itemHash : string) : boolean => {
    var currentHash = location.hash.substring(1);
    return replaceSpaces(itemHash) === currentHash;
};

/**
 * Simple stub function that wraps list of strings into MenuItem class 
 * @param {*} list 
 */
export function fromList(list : Array<string>) {
    return list.map(str => new MenuItem(str,'#'+str,false));
}

export default class TableOfContents  {
    coverItems : Array<MenuItem>;
    articleItems : Array<MenuItem>;
    externalItems: Array<MenuItem>;
    listName: string;

    processItem(item: Object, superitem: Object) {
        if (isCover(item)) {
            var isActive = this.listName === item.name.toLowerCase();
            if (this.listName === superitem.name) {
                this.coverItems.push(new ListItem(superitem.name,superitem.url,isActive));
            } else {
                this.coverItems.push(new ListItem(item.name,item.url,isActive));
            }
        } else {
            var isActive = this.listName === item.name.toLowerCase();
            this.externalItems.push(new ListItem(item.name,item.url,isActive));
        }
    }


    getArticleItems(location: Object, listName? : string, articleChapters : Array<LdJsonObject>,isActiveFirstArticle : boolean) : Array<Array<MenuItem>> {
        const hashEq : Function = hashEquals(location);

        this.coverItems= [];
        this.articleItems = [];
        this.externalItems = [];

        if (typeof listName == "string") {
            this.listName = listName.toLowerCase();
            if (this.listName) {
                isActiveFirstArticle = false; // if we have ?list=cover parameter in command line, don't highlight first article
            }
        }
        var add = (currentItem) => {

            if (currentItem.hasElementOfType("Article")) {
                var isActive = hashEq(currentItem.data.name) || isActiveFirstArticle;
                isActiveFirstArticle = false;
                this.articleItems.push(new MenuItem(
                    currentItem.data.name,
                    '#'+replaceSpaces(currentItem.data.name)
                    ,isActive));
            } else if (currentItem.getType() === 'ItemList') {
                if (!currentItem.hasElementOfType('ItemList')) {
                    this.processItem(currentItem.data, currentItem.data);
                } else {
                    currentItem.children.forEach((item) => this.processItem(item.data, currentItem.data), this);
                }
            }
            if (currentItem.hasPart()) { // recursively process all article parts
                currentItem.children.forEach(add, this);
            }
        };
        const withComments = articleChapters.concat([new LdJsonObject({"@type":"Article",name: "Comments"})]); // add fake element for comments section
        withComments.forEach(add);
        return [this.coverItems,this.articleItems,this.externalItems];
    }
}
