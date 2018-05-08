import sortBy from "lodash.sortby";

class Mention {
  constructor(mention) {
    let { name, url } = mention,
      cutUrl = url.split("'"),
      positions = cutUrl[2].replace(":", "").split(",");
    this.linkWord = cutUrl[1];
    this.url = `${cutUrl[0]}${name.replace(/\s/g, "-")}`;
    this.block = Number(positions[0]);
    this.start = Number(positions[1]);
    this.end = this.start + this.linkWord.length;
  }
}

const fixUrlProtocol = url => {
  if (!url) {
    return;
  } else if (location.origin === 'file://') {
    // return url;
  }
  var separatorPosition = url.indexOf("//");
  if (separatorPosition !== -1) {
    url = url.substring(separatorPosition + 2, url.length);
  }
  return "//" + url;
};

class Image {
  constructor(opts) {
    this.name = opts.name;
    this.description = opts.description;
    this.url = opts.contentUrl;
    var cutUrl = this.url.split("?"),
      positions = cutUrl[1].split(",");
    this.src = cutUrl[0];
    this.order = Number(positions[0]);
    this.start = Number(positions[1]);
    this.block = this.order;
  }
}

// factory method to genereate new mention objects
const MentionFactory = m => {
  switch (m["@type"]) {
    case "ImageObject":
      return new Image(m);
    default:
      return new Mention(m);
  }
};

const merge = mentions => sortBy(mentions, m => new Mention(m).order);

const extractMentions = mentions => mentions.map(MentionFactory);

export { merge, extractMentions, Mention, MentionFactory };
