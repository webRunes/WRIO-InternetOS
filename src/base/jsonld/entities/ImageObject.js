/**
 * Created by michbil on 13.09.16.
 */

import React from 'react';
import LdJsonObject from "./LdJsonObject.js";
import Image from "../mentions/image";
import mention from "../mentions/mention.js";

export default class ImageObject extends LdJsonObject {
  constructor(json, order, root) {
    super(json, order, root);
  }

  getCoverItems() {
    return this.data.text.map((item, i) => {
      let appliedMention = {};
      if (this.mappedMent.text && this.mappedMent.text[i]) {
        appliedMention.text = this.mappedMent.text[i].render(i);
        appliedMention.bullet = this.mappedMent.text[i].bullet;
      } else {
        if (mention.isBulletItem(this.data.text[i])) {
          appliedMention.bullet = true;
          appliedMention.text = mention.skipAsterisk(item);
        } else {
          appliedMention.text = item === ''
            ? (<br/>)
            : item
        }
      }
      return appliedMention;
    });
  }
}
