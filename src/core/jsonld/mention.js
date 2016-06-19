import sortByOrder from 'lodash.sortbyorder';
import Image from './image';


class Mention {

    /*
        Creates mention from the mention LD+JSON
     */

    constructor(opts) {
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

        try {
            this.external = positions[2] == 'external';
        } catch (e) {
            this.external = false;
        };

    }

    static merge(mentions) {
        return sortByOrder(mentions, [function (m) {
            var mention = m["@type"] === "ImageObject" ? new Image(m) : new Mention(m);
            return mention.order;
        }, function (m) {
            var mention = m["@type"] === "ImageObject" ? new Image(m) : new Mention(m);
            return mention.start;
        }, function (m) {
            return m["@type"];
        }], ['asc', 'asc', 'desc']);
    }

    warn(text) {
        text = text || 'Wrong mention: ' + this.url;
      //  console.warn(text);
    }

    attach(paragraphText) {
        var before = paragraphText.substr(0, this.start),
            toReplace = paragraphText.substr(this.start, this.linkWord.length),
            after = paragraphText.substring(this.start + this.linkWord.length, paragraphText.length);
        if (toReplace === this.linkWord) {
            return {
                before: before,
                link: {
                    text: toReplace,
                    url: this.newUrl,
                    external: this.external
                },
                after: after
            };
        }
        return {
            before: paragraphText
        };
    }
}

export default Mention;