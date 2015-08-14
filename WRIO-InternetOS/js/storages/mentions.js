var Reflux = require('reflux'),
    Mention = require('./mention'),
    scripts = require('./scripts'),
    Actions = require('../actions/mentions'),
    merge = Mention.merge;

module.exports = Reflux.createStore({
    listenables: Actions,
    init: function () {
        scripts.listen(this.moveMentionsToElements);
    },
    moveMentionsToElements: function (data) {
        data.forEach(this.check);
        this.trigger(data);
    },
    check: function (json) {
        var mentions = json.mentions;
        if (mentions) {
            mentions = merge(mentions);
            mentions.forEach(function (m) {
                var mention = new Mention(m),
                    ok;
                ok = this.attachMentionToElement(mention, json);
                if (ok === false) {
                    mention.warn();
                }
            }, this);
        }
        if (json.hasPart) {
            json.hasPart.forEach(this.check);
        }
    },
    attachMentionToElement: function (mention, json) {
        var order = 0,
            i,
            keys = Object.keys(json);
        for (i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            if (['name', 'about'].indexOf(key) !== -1) {
                order += 1;
                if (mention.order === order) {
                    json[key] = mention.attach(json[key]);
                    return true;
                }
            } else if (key === 'articleBody') {
                var articleBody = json[key],
                    pos;
                if (order + articleBody.length >= mention.order) {
                    pos = mention.order - order - 1;
                    articleBody[pos] = mention.attach(
                        articleBody[pos]
                    );
                    return true;
                } else {
                    order += articleBody.length;
                }
            }
        }
        return false;
    }
});
