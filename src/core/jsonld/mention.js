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

        this.original = opts;

        this.name = opts.name;
        this.url = opts.url;

        var hash = this._coming_soon(this.url);
        if (hash) {
            this.hash = hash;
        }
        var cutUrl = this.url.split('\''),
            positions = cutUrl[2].replace(':', '').split(',');
        this.linkWord = cutUrl[1];
        this.newUrl = cutUrl[0] + this.name.replace(/\s/g, '-');
        this.order = Number(positions[0]);
        this.start = Number(positions[1]);

        try {
            this.external = positions[2] == 'external';
            this.extra = positions[3]; // additional optional field for the language
            this.externalUrl = cutUrl[0].replace('?','');
        } catch (e) {
            this.external = false;
        }

    }

    _coming_soon(url) {
      if (url) {
          if (url.match(/#\?/)) {
             return true;
          }
      }

    }

    static sortMentions(mentions) {
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
                    external: this.external,
                    externalUrl: this.externalUrl,
                    extra: this.extra,
                    hash: this.hash
                },
                after: after
            };
        } else {
            //console.warn("Wrong linkword ",toReplace," in ",this.original);
        }
        return {
            before: paragraphText
        };
    }

    attachBullet(paragraphText) {

        if (Mention.isBulletItem(paragraphText)) {
            var r = this.attach(Mention.skipAsterisk(paragraphText));
            r.bullet = true;
            return r;
        } else {
            return this.attach(paragraphText);
        }


    }

    /* functions for processing asterisks in mentions (for the lists) */
    static isBulletItem(str) {
        if (typeof str === "string") {
            return str.match(/^\*/m);
        }
        return false;
    }

    static skipAsterisk(str) {
        if (typeof str === "string") {
            return str.replace(/^\*/m, ' ');
        }
        return str;
    }

}

export default Mention;