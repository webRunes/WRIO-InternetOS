import processJsonLDmentions from './mentions';

function LdJsonFactory(json,order) {
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

function sortMentions(mentions) {
    return sortByOrder(mentions, [function (m) {
        var mention = MentionFactory(m);
        return mention.order;
    }, function (m) {
        var mention = MentionFactory(m);
        return mention.start;
    }, function (m) {
        return m["@type"];
    }], ['asc', 'asc', 'desc']);
}

function MentionFactory(m) {
    switch (m["@type"]) {
        case "ImageObject":
            return new Image(m) ;
        default:
            return new Mention(m);
    }
}



class LdJsonObject {
    constructor(json,order) {
        this.data = json;
        this.children = [];
        this.mentions = [];
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
        let element = LdJsonFactory(part,order);
        this.children.push(element);
        this.processJsonLDmentions(part, order);
    }


    /* function reads JSON+LD mentions and attaches them to the JSONLD */
    processJsonLDmentions (json, order) {

        let mentions = json.mentions;
        let images = json.image;

        if (mentions) {
            mentions = sortMentions(mentions);
            mentions.forEach(function(m) {
                var mention = getMentionObject(m);
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

    attachMentionToElement  (mention, order) {
        let json = this.data;
        order = order || 0;

        for (let key of Object.keys(json)) {
            if (['name', 'about'].indexOf(key) !== -1) {
                order ++;
                if (mention.order === order) {
                    json.m = json.m || {};
                    json.m[key] = json.m[key] || [];
                    let mentionEl = mention.attach(json[key]);
                    json.m[key] = json.m[key].concat(mentionEl);
                    return true;
                }
            } else if (key === 'articleBody') { // to process articles
                let articleBody = json[key];
                if (order + articleBody.length >= mention.order) {
                    let pos = mention.order - order - 1;
                    json.m = json.m || {};
                    json.m[key] = json.m[key] || [];
                    json.m[key][pos] = json.m[key][pos] || [];
                    let mentionEl = mention.attach(articleBody[pos]);
                    json.m[key][pos] = json.m[key][pos].concat(mentionEl);
                    return true;
                } else {
                    //order += articleBody.length;
                }
            } else if (key=='text') {  // to process covers
                var text = json[key],
                    pos;
                if (order + text.length >= mention.order) {
                    pos = mention.order - order - 1;
                    json.m = json.m || {};
                    json.m[key] = json.m[key] || [];
                    json.m[key][pos] = json.m[key][pos] || [];
                    json.m[key][pos] = json.m[key][pos].concat(
                        mention.attachBullet(
                            text[pos]
                        )
                    );
                    return true;
                }
            }
        }
        return false;
    };

    render() {

    }
}

class Article extends LdJsonObject {
    constructor(json) {
        super(json);
    }

}

class ItemList extends LdJsonObject {
    constructor(json,order) {
        super(json);

        if (json.itemListElement) {
            json.itemListElement.forEach((part) => this.addChild(part,order));
        }


    }
}

class ImageObject extends LdJsonObject {
    constructor(json) {
        super(json);
        if (json.image && typeof json.image === "object") {
            let images = json.image;
            images.forEach((i) => {
                this.mentions.push(i);
            });
        }
    }
}

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
        return this.data.forEach(function(jsn) {
            let f = LdJsonFactory(jsn);
            console.log(f);
            return f;
        });
    }
    getBlocks() {
        return this.blocks;
    }
}



// this functions gets LD+JSON script array(got from html document) parses it and attaches mentions to the text
export default LdJsonManager;

