/**
 * Created by michbil on 13.09.16.
 */

import LdJsonObject from "./LdJsonObject.js";
import sortByOrder from "lodash.sortbyorder";
import Image from "../mentions/image.js";

export default class Article extends LdJsonObject {
  constructor(json, order, root) {
    super(json, order, root);
  }

  getBody() {
    this.data.articleBody = this.data.articleBody || [];
    let body = [];
    let i = 0;
    for (let item of this.data.articleBody) {
      if (this.mappedMent.articleBody && this.mappedMent.articleBody[i]) {
        let m = this.mappedMent.articleBody[i];
        body.push(m.render(i));
        if (m instanceof Image) {
          // do not replace text if we are dealing with images
          // TODO may cause problems in cases, when replaced text contains mentions too
          body.push(item);
        }
      } else {
        body.push(
          item.length
            ? item
            : (<br/>)
        );
      }
      i++;
    }
    return body;
  }
}
