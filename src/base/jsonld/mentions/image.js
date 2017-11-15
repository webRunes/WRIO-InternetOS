import { fixUrlProtocol } from "../../mixins/UrlMixin";
import AbstractMention from "./abstractMention.js";
import React from "react";

class Image extends AbstractMention {
  constructor(opts) {
    super(opts);
    this.name = opts.name;
    this.description = opts.description;
    this.url = opts.contentUrl;
    var cutUrl = this.url.split("?"),
      positions = cutUrl[1].split(",");
    this.src = fixUrlProtocol(cutUrl[0]);
    this.order = Number(positions[0]);
    this.start = Number(positions[1]);
  }

  warn(text) {
    text = text || "Not Found: " + this.url;
  }

  attach(s) {
    var before = s.substr(0, this.start),
      after = s.substring(this.start, s.length);
    return [before, this, after];
  }

  renderParagraphs(paragraphs) {
    return paragraphs.map((p, key) => {
      return <p key={key}>{p}</p>;
    });
  }

  render() {
    let figcaption;
    if (this.name) {
      let desc =
        typeof this.description == "object"
          ? this.renderParagraphs(this.description)
          : this.description;
      figcaption = (
        <figcaption className="callout figure-details">
          <h5>{this.name}</h5>
          <p>{desc}</p>
        </figcaption>
      );
    }
    return (
      <figure>
        <img style={{ width: "100%" }} src={this.src} />
        {figcaption}
      </figure>
    );
  }
}

export default Image;
