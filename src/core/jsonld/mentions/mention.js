import AbstractMention from './abstractMention.js';
import React from 'react';


var globalMention=0;
var globalCursor=0;

/* Class that translates paragraph text and mentions into react code */

export class MappedMention {
    constructor(text) {
        this.before = [];
        this.after = text;
        this.pos = 0;
    }

    applyMention(m) {
        const start = m.start - this.pos;
        if (start < 0) {
            console.warn ("Wrong start offset ",start,"for mention",m);
            return;
        }

        const before = this.after.substr(0, start),
            toReplace = this.after.substr(start, m.linkWord.length),
            after = this.after.substring(start + m.linkWord.length, this.after.length);

        const beforeLength = before.length + toReplace.length;



        if (m.linkWord != toReplace) {
            console.warn(`WARING: misplaced mention ${m.url} found word '${toReplace}' instead`);
        } else {
            m.text = m.linkWord;
            this.after = after;
            this.pos += beforeLength;
            this.before = this.before.concat([before,m]);
        }

    }

    render(key) {
        return (<span key={key}>
        {
            this.before.map((mention,key) => {
                if (mention instanceof AbstractMention) {
                    return mention.render(key);
                } else {
                    return <span key={key}> {mention} </span>;
                }
            })
        } {this.after}
         </span>);
    }
}

/* Mention inside cover, need special treatment */

export class MappedCoverMention extends MappedMention {

    applyMention(m) {
        // TODO fix this
        if (Mention.isBulletItem(this.after)) {
            this.after = Mention.skipAsterisk(this.after);
            this.bullet = true;
        }
        super.applyMention(m);

    }
}


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

        this.className = "link";
        this.name = opts.name;
        this.url = opts.url;

        var hash = this._coming_soon(this.url);
        if (hash) {
            this.hash = hash;
        }
        var cutUrl = this.url.split('\''),
            positions = cutUrl[2].replace(':', '').split(',');
        this.linkWord = cutUrl[1];
        this.linkUrl = cutUrl[0].replace(/\?$/g,'') ; //+ this.name.replace(/\s/g, '-');
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

    setCursor(paragraphText) {
        globalCursor[paragraphText] = this.end;
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

     render (key) {
         var ext = "";
         var linkUrl = this.linkUrl;
         var target, color;
         if (this.external) {
             ext = (<sup ><span className="glyphicon glyphicon-new-window"></span>{this.extra}</sup>);
             target = "_blank";
             linkUrl = this.externalUrl;

         } else {
             if (this.hash) {
                 color = 'coming-soon';
             }
         }
         return (<span  key={key}>
        <a href={linkUrl} target={target} className={color}>{this.text}</a>
             {ext}
        </span>);
     }



}

export default Mention;