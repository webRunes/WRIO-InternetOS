/**
 * Created by michbil on 13.09.16.
 */

import LdJsonObject from './LdJsonObject.js';
import Image from '../image';

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
}
