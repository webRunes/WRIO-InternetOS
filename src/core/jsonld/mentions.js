import Mention from './mention';
import Image from './image';

var merge = Mention.merge,
    mentions = undefined,
    images = undefined;

var attachMentionToElement = function(mention, json, order) {
    order = order || 0;
    var i,
        keys = Object.keys(json);
    for (i = 0; i < keys.length; i += 1) {
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
        } else if (key === 'articleBody') {
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
        }
    }
    return false;
};

var check = function(json, order) {
    mentions = json.mentions || mentions;
    images = json.image || images;
    if (json.image && typeof json.image === "object") {
        mentions = mentions ? mentions : [];
        images.forEach((i) => {
            mentions.push(i);
        });
    }
    if (mentions) {
        mentions = merge(mentions);
        mentions.forEach(function(m) {
            var mention = m["@type"] === "ImageObject" ? new Image(m) : new Mention(m),
                ok;
            if (mention.order > (order || 0)) {
                ok = attachMentionToElement(mention, json, order);
            }
            if (ok === false) {
                mention.warn();
            }
        }, this);
    }
    if (json.hasPart) {
        var order = json.articleBody.length + 2;
        json.hasPart.forEach((part, i) => {
            if (i > 0) {
                order += json.hasPart[i-1].articleBody ? json.hasPart[i-1].articleBody.length + 1 : 1;
            }
            check(part, order);
        });
    }
};
export default check;
