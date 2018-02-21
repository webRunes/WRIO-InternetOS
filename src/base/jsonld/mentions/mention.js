/* @flow */
import AbstractMention from "./abstractMention.js";
import React from "react";

/* Class that translates paragraph text and mentions into react code */

export class MappedMention {
  bullet: boolean; // bullet flag for the text
  before: Array<mixed>;
  after: string;
  pos: number;

  constructor(text: string) {
    this.before = [];
    this.after = text;
    this.pos = 0;
  }

  applyMention(m: Mention) {
    const start = m.start - this.pos;
    if (start < 0) {
      console.warn("Wrong start offset ", start, "for mention", m);
      return;
    }

    const before = this.after.substr(0, start),
      toReplace = this.after.substr(start, m.linkWord.length),
      after = this.after.substring(
        start + m.linkWord.length,
        this.after.length
      );

    const beforeLength = before.length + toReplace.length;

    if (m.linkWord != toReplace) {
      console.warn(
        `WARING: misplaced mention ${m.url} found word '${toReplace}' instead`
      );
    } else {
      m.text = m.linkWord;
      this.after = after;
      this.pos += beforeLength;
      this.before = this.before.concat([before, m]);
    }
  }

  render(key: string) {
    return (
      <span key={key}>
        {this.before.map((mention, key) => {
          if (mention instanceof AbstractMention) {
            return mention.render(key);
          } else {
            return <span key={key}> {mention} </span>;
          }
        })}
        {this.after}
      </span>
    );
  }
}

/* Mention inside cover, need special treatment */

export class MappedCoverMention extends MappedMention {
  applyMention(m: Mention) {
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

  className: string;
  name: string;
  url: string;
  hash: boolean; // hash flag, for links, marked as coming soon
  linkWord: string;
  linkUrl: string;
  order: number;
  start: number;

  constructor(opts: Object) {
    // Example:
    //{
    //    "@type": "Article",
    //    "name": "First url title",
    //    "about": "Text inside the ticket popup.",
    //    "url": "http://webrunes.com/blog.htm?'dolor sit amet':1,104"
    //},

    // TODO replace with regexp (.+)\?\'(.+)\':([0-9]+),([0-9]+)
    super(opts);

    this.className = "link";
    this.name = opts.name;
    this.url = opts.url;

    this.hash = this._coming_soon(this.url);

    let cutUrl = this.url.split("'"),
      positions = cutUrl[2].replace(":", "").split(",");
    this.linkWord = cutUrl[1];
    this.linkUrl = cutUrl[0].replace(/\?$/g, ""); //+ this.name.replace(/\s/g, '-');
    this.order = Number(positions[0]);
    this.start = Number(positions[1]);

    try {
      this.external = positions[2] == "external"; // external means link will be open in new window
      this.extra = positions[3]; // additional optional field for the language
      this.externalUrl = cutUrl[0].replace("?", "");
    } catch (e) {
      this.external = false;
    }
  }

  _coming_soon(url: string): boolean {
    if (url) {
      if (url.match(/#\?/)) {
        return true;
      }
    }
    return false;
  }

  /* functions for processing asterisks in mentions (for the lists) */
  static isBulletItem(str: string): boolean {
    if (typeof str === "string") {
      return !!str.match(/^\*/m);
    }
    return false;
  }

  static skipAsterisk(str: string): string {
    if (typeof str === "string") {
      return str.replace(/^\*/m, " ");
    }
    return str;
  }

  render(key: string) {
    var ext = "";
    var linkUrl = this.linkUrl;
    var target, color;
    if (this.external || this.extra) {
      ext = (
        <sup>
          {this.external && <span className="glyphicon glyphicon-new-window" />}
          {this.extra}
        </sup>
      );
      target = "_blank";
      linkUrl = this.externalUrl;
    } else {
      if (this.hash) {
        color = "coming-soon";
      }
    }
    return (
      <span key={key}>
        <a href={linkUrl} target={target} className={color}>
          {this.text}
        </a>
        {ext}
      </span>
    );
  }
}

export default Mention;
