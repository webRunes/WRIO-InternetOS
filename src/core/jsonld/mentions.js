import Mention from './mention';
import Image from './image';

var mentions = undefined,
    images = undefined;

/* Finds given mention in the text
*
* searches until finds mention.order chapter in the text and then searching to the corresponding word
*
* */
var attachMentionToElement = function(mention, json, order) {
    order = order || 0;
    var keys = Object.keys(json);

    for (var i = 0; i < keys.length; i += 1) {
        var key = keys[i];
        if (['name', 'about'].indexOf(key) !== -1) {
            order += 1;
            if (mention.order === order) {
                json.m = json.m || {};
                json.m[key] = json.m[key] || [];
                json.m[key].push(
                    mention.attach(json[key])
                );
                return true;
            }
        } else if (key === 'articleBody') { // to process articles
            var articleBody = json[key],
                pos;
            if (order + articleBody.length >= mention.order) {
                pos = mention.order - order - 1;
                json.m = json.m || {};
                json.m[key] = json.m[key] || [];
                json.m[key][pos] = json.m[key][pos] || [];
                json.m[key][pos].push(
                    mention.attach(
                        articleBody[pos]
                    )
                );
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
                json.m[key][pos].push(
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

/* function reads JSON+LD mentions and attaches them to the JSONLD */
var processJsonLDmentions = function(json, order) {
    mentions = json.mentions || mentions;
    images = json.image || images;
    if (json.image && typeof json.image === "object") {
        mentions = mentions ? mentions : [];
        images.forEach((i) => {
            mentions.push(i);
        });
    }

    if (json.type==="@")


    if (mentions) {
        mentions = Mention.sortMentions(mentions);
        mentions.forEach(function(m) {
            var mention = m["@type"] === "ImageObject" ? new Image(m) : new Mention(m);
            if (mention.order > (order || 0)) {
                var ok = attachMentionToElement(mention, json, order);
                if (!ok) {
                    mention.warn();
                }
            }
        }, this);
    }
    if (json.hasPart) { // process mentions for all the parts
        var order = json.articleBody.length + 2;
        json.hasPart.forEach((part, i) => {
            if (i > 0) {
                order += json.hasPart[i-1].articleBody ? json.hasPart[i-1].articleBody.length + 1 : 1;
            }
            processJsonLDmentions(part, order);
        });
    }

    if (json["@type"] == "ItemList") {
        if (json.itemListElement) {
            json.itemListElement.forEach((part) => processJsonLDmentions(part,order));
        }
    }
};
export default processJsonLDmentions;
