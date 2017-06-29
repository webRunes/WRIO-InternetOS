/* @flow */
import LdJsonObject from './entities/LdJsonObject.js';

/* Loaded class, takes <scripts> from the document, parses them and applies mentions */

type LdJsonObjects = Array<LdJsonObject>

class LdJsonDocument {
    blocks: LdJsonObjects;
    data: Array<Object>;

    constructor(scripts: HTMLCollection<HTMLScriptElement>) {
        this.data = this.parseScripts(scripts);
        this.blocks =  this.mapMentions();
    }
    parseScripts(scripts : HTMLCollection<HTMLScriptElement>) : Array<Object> {
        let  data :  Array<Object> = [];
        const scriptsArray : Array<HTMLElement> = [].slice.call(scripts); // to convert HtmlCollection to the Array, to address issues on the IE and mobile Safari
        for (let script of scripts) {
            if (script.type === 'application/ld+json') {
                let json = undefined;
                try {
                    json = JSON.parse(script.textContent);
                } catch (exception) {
                    json = undefined;
                    console.error('JSON-LD invalid: ' + exception);
                }
                if (typeof json === 'object') {
                    data.push(json);
                }
            }
        }
        return data;
    }
    mapMentions() : LdJsonObjects {
        return this.data.map((jsn) => LdJsonObject.LdJsonFactory(jsn));
    }

    getBlocks() : LdJsonObjects {
        return this.blocks;
    }

    getJsonLDProperty (field: string) {
        let ret = null;
        this.blocks.forEach((section : LdJsonObject) => {
            const data = section.data[field];
            if (data) {
                ret = data;
            }
        });
        return ret;
    }

    hasCommentId() {
        var comment = this.getJsonLDProperty('comment');
        return comment !== null;
    }


    hasArticle() : boolean {
       return this.getArticle() !== null;
    }

    getArticle() : ?LdJsonObject {
        var r = null;
        this.blocks.forEach((e : LdJsonObject) => {
            if (e.getType() === 'Article') {
                r = true;
            }
        });
        return r;
    }
}

// this functions gets LD+JSON script array(got from html document) parses it and attaches mentions to the text
export default LdJsonDocument;
