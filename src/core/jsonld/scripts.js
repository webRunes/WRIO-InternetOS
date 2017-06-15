import sortByOrder from 'lodash.sortbyorder';
import Mention, {MappedMention} from './mentions/mention';
import Image from './mentions/image';

import LdJsonObject from './entities/LdJsonObject.js';


/* Loaded class, takes <scripts> from the document, parses them and applies mentions */

class LdJsonManager {
    constructor(scripts) {
        this.data = this.parseScripts(scripts);
        this.blocks =  this.mapMentions();
    }
    parseScripts(scripts) {
        let  data = [];
        scripts = [].slice.call(scripts); // to convert HtmlCollection to the Array, to adress issues on the IE and mobile Safari
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
    mapMentions() {
        const r =  this.data.map(function(jsn) {
            return LdJsonObject.LdJsonFactory(jsn);
        });
        return r;
    }

    getBlocks() {
        return this.blocks;
    }
}

// this functions gets LD+JSON script array(got from html document) parses it and attaches mentions to the text
export default LdJsonManager;
