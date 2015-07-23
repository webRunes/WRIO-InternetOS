var Mention = require('./mention'),
    merge = Mention.merge;

var attachMentionToElement = function (mention, json) {
    var order = 0,
        i,
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
                order += articleBody.length;
            }
        }
    }
    return false;
};

var check = function (json) {
    var mentions = json.mentions;
    if (mentions) {
        mentions = merge(mentions);
        mentions.forEach(function (m) {
            var mention = new Mention(m),
                ok;
            ok = attachMentionToElement(mention, json);
            if (ok === false) {
                mention.warn();
            }
        }, this);
    }
    if (json.hasPart) {
        json.hasPart.forEach(check);
    }
};

module.exports = check;
