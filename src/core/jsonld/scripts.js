import sortByOrder from 'lodash.sortbyorder';
import Mention, {MappedMention} from './mention';
import Image from './image';
import _ from 'lodash';

import LdJsonObject from './entities/LdJsonObject.js';


class LdJsonManager {
    constructor(scripts) {
        this.data = this.parseScripts(scripts);
        this.blocks =  this.mapMentions()
    }
    parseScripts(scripts) {
        let  data = [];
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

