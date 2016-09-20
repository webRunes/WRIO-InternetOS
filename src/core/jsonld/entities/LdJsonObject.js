/**
 * Created by michbil on 13.09.16.
 */

import sortByOrder from 'lodash.sortbyorder';
import Mention, {MappedMention} from '../mention';
import Image from '../image';
import _ from 'lodash';

var Article, ItemList, ImageObject;

export default class LdJsonObject {

    // factory method to genereate new mention objects
    static MentionFactory(m) {
        switch (m["@type"]) {
            case "ImageObject":
                return new Image(m) ;
            default:
                return new Mention(m);
        }
    }
    // factroy method to generate new LdJson objects according to its contents
    static LdJsonFactory(json,order) {

        Article = Article || require('./Article.js').default;
        ItemList = ItemList || require('./ItemList.js').default;
        ImageObject = ImageObject || require('./ImageObject.js').default;

        var type = json['@type'];
        if (type) {
            switch (type) {
                case 'Article':
                    return new Article(json,order);
                case 'ItemList':
                    return new ItemList(json,order);
                case "ImageObject":
                    return new ImageObject(json,order);
            }
        }
    }


    sortMentions(mentions) {
        return sortByOrder(mentions, [function (m) {
            var mention = LdJsonObject.MentionFactory(m);
            return mention.order;
        }, function (m) {
            var mention = LdJsonObject.MentionFactory(m);
            return mention.start;
        }, function (m) {
            return m["@type"];
        }], ['asc', 'asc', 'desc']);
    }

    constructor(json,order) {
        this.data = json;
        this.children = [];
        this.mentions = json.mentions;
        this.mappedMent = {}; // mapped mentions will be placed here
        this.mentionCursor = {}; // mapped mentions will be placed here

        this.processJsonLDmentions(json, order);

        if (json.hasPart) { // process mentions for all the parts
            var order = json.articleBody.length + 2;
            json.hasPart.forEach((part, i) => {
                if (i > 0) {
                    order += json.hasPart[i-1].articleBody ? json.hasPart[i-1].articleBody.length + 1 : 1;
                }
                this.addChild(part,order);
            });
        }

    }

    addChild(part,order) {
        let element = LdJsonObject.LdJsonFactory(part,order);
        this.children.push(element);
    }


    /* function reads JSON+LD mentions and attaches them to the JSONLD */
    processJsonLDmentions (json, order) {

        let mentions = this.mentions;

        if (mentions) {
            mentions = this.sortMentions(mentions);
            mentions.forEach(function(m) {
                var mention = LdJsonObject.MentionFactory(m);
                if (mention.order > (order || 0)) {
                    var ok = this.attachMentionToElement(mention, order);
                    if (!ok) {
                        mention.warn();
                    }
                }
            }, this);
        }
    };

    hasPart() {
        return this.data.hasPart;
    }

    getType() {
        return this.data['@type'];
    }

    getMentions() {
        return this.data.mentions;
    }

    hasElementOfType(type) {
        return this.data['@type'] === type || _.chain(this.data.itemListElement)
                .pluck('@type')
                .contains(type)
                .value();
    }

    /* dummy function to create mention entries

     if pos is specified saves value as array entry  this.mappedMent[key][arrayPos]
     or this.mappedMent[key]

     */
    _touchMentionKey(key,value,mention,arrayPos) {

        if (arrayPos !== undefined) {
            this.mappedMent[key] = this.mappedMent[key] || [];
            this.mappedMent[key][arrayPos] = this.mappedMent[key][arrayPos] || new MappedMention(value);
            this.mappedMent[key][arrayPos].applyMention(mention);
        } else {
            this.mappedMent[key] = this.mappedMent[key] || new MappedMention(value);
            this.mappedMent[key].applyMention(mention);
        }
    }




    attachMentionToElement  (mention, order) {
        let json = this.data;
        order = order || 0;

        for (let key of Object.keys(json)) {
            if (['name', 'about'].indexOf(key) !== -1) {
                order ++;
                if (mention.order === order) {
                    this._touchMentionKey(key,json[key],mention);
                    return true;
                }
            } else if (key === 'articleBody') { // to process articles
                let articleBody = json[key];
                if (order + articleBody.length >= mention.order) {
                    let pos = mention.order - order - 1;
                    this._touchMentionKey(key,articleBody[pos],mention,pos);
                    return true;
                }
            } else if (key=='text') {  // to process covers
                var text = json[key],
                    pos;
                if (order + text.length >= mention.order) {
                    pos = mention.order - order - 1;
                    this._touchMentionKey(key, text[pos], mention, pos);
                    return true;
                }
            }
        }
        return false;
    };

    getKey(block) {
        if (this.mappedMent[block]) {
            return this.mappedMent[block].render()
        } else {
            return this.data[block];
        }
    }

    render() {

    }

    childMentionCount() {
        let count = 0;
        for (let child in this.children) {
            count += child.mentions.length();
        }
        return count;
    }

}
