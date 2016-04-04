import sortByOrder from 'lodash.sortbyorder';
import Image from './image';

var Mention = function(opts) {
    // Example:
    //{
    //    "@type": "Article",
    //    "name": "First url title",
    //    "about": "Text inside the ticket popup.",
    //    "url": "http://webrunes.com/blog.htm?'dolor sit amet':1,104"
    //},
    this.name = opts.name;
    this.url = opts.url;
    var cutUrl = this.url.split('\''),
        positions = cutUrl[2].replace(':', '').split(',');
    this.linkWord = cutUrl[1];
    this.newUrl = cutUrl[0] + this.name.replace(/\s/g, '-');
    this.order = Number(positions[0]);
    this.start = Number(positions[1]);
};

Mention.merge = function(mentions) {
    return sortByOrder(mentions, [function(m) {
        var mention = m["@type"] === "ImageObject" ? new Image(m) : new Mention(m);
        return mention.order;
    }, function(m) {
        var mention = m["@type"] === "ImageObject" ? new Image(m) : new Mention(m);
        return mention.start;
    }, function(m) {
        return m["@type"];
    }], ['asc', 'asc', 'desc']);
};

Mention.prototype.warn = function(text) {
    text = text || 'Wrong mention: ' + this.url;
    //console.warn(text);
};

Mention.prototype.attach = function(s) {
    var before = s.substr(0, this.start),
        toReplace = s.substr(this.start, this.linkWord.length),
        after = s.substring(this.start + this.linkWord.length, s.length);
    if (toReplace === this.linkWord) {
        return {
            before: before,
            link: {
                text: toReplace,
                url: this.newUrl
            },
            after: after
        };
    }
    this.warn();
    return {
        before: s
    };
};

module.exports = Mention;
