/**
 * Created by michbil on 13.09.16.
 */

import LdJsonObject from './LdJsonObject.js';
import Image from '../image';
import mention from '../mention.js';

import _ from 'lodash';

export default class ImageObject extends LdJsonObject {
    constructor(json) {
        super(json);
        if (json.image && typeof json.image === "object") {
            let images = json.image;
            images.forEach((i) => {
                this.mentions.push(i);
            });
        }
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
                }
                appliedMention.text = mention.skipAsterisk(this.data.text[i]);
            }
            return appliedMention;
        });
    }

}
