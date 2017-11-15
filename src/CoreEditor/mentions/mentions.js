import { Mention, merge } from "./mention";

let mentions = null;

const attachMentionToElement = (mention, json, order = 0) => {
  let tmp = {};
  for (let key in json) {
    if (["name", "about"].indexOf(key) !== -1) {
      order++;
      if (mention.order === order) {
        json.m = json.m || {};
        json.m[key] = json.m[key] || [];
        json.m[key].push(mention.attach(json[key]));
        return true;
      }
    } else if (key === "articleBody") {
      let articleBody = json[key],
        pos;
      if (order + articleBody.length >= mention.order) {
        pos = mention.order - order - 1;
        let _mention = mention.attach(articleBody[pos]);
        if (_mention) {
          json.m = json.m || {};
          json.m[key] = json.m[key] || [];
          json.m[key][pos] = json.m[key][pos] || [];
          json.m[key][pos].push(_mention);
        }
        return true;
      }
    }
  }
  return false;
};

const check = (json, order) => {
  mentions = json.mentions || mentions;
  if (mentions) {
    mentions = merge(mentions);
    mentions.forEach(m => {
      var mention = new Mention(m),
        ok;
      if (mention.order > (order || 0)) {
        ok = attachMentionToElement(mention, json, order);
      }
      if (ok === false) {
        mention.warn();
      }
    }, this);
  }
  if (json.hasPart) {
    var order = json.articleBody.length + 2;
    json.hasPart.forEach((part, i) => {
      if (i > 0) {
        order += json.hasPart[i - 1].articleBody
          ? json.hasPart[i - 1].articleBody.length + 1
          : 1;
      }
      check(part, order);
    });
  }
};

export { check };
