import AbstractMention from './abstractMention.js';
import React from 'react';

class Mention extends AbstractMention {

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
        super(opts);


        this.name = opts.name;
        this.url = opts.url;

        var hash = this._coming_soon(this.url);
        if (hash) {
            this.hash = hash;
        }
        var cutUrl = this.url.split('\''),
            positions = cutUrl[2].replace(':', '').split(',');
        this.linkWord = cutUrl[1];
        this.linkUrl = cutUrl[0] + this.name.replace(/\s/g, '-');
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

    warn(text) {
        text = text || 'Wrong mention: ' + this.url;
      //  console.warn(text);
    }

    attach(paragraphText) {
        var before = paragraphText.substr(0, this.start),
            toReplace = paragraphText.substr(this.start, this.linkWord.length),
            after = paragraphText.substring(this.start + this.linkWord.length, paragraphText.length);

        this.text = toReplace;
        if (toReplace === this.linkWord) {
            return {
                before: before,
                obj: this,
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

     render () {
         var ext = "";
         var linkUrl = this.linkUurl;
         var target, color;
         if (this.external) {
             ext = (<sup><span className="glyphicon glyphicon-new-window"></span>{this.extra}</sup>);
             target = "_blank";
             linkUrl = this.externalUrl;

         } else {
             if (this.hash) {
                 color = 'coming-soon';
             }
         }
         return (<span>
        <a href={linkUrl} target={target} className={color}>{this.text}</a>
             {ext}
        </span>);
     }



}

export default Mention;