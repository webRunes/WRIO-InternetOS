/**
 * Created by michbil on 13.09.16.
 */

import LdJsonObject from './LdJsonObject.js';
import sortByOrder from 'lodash.sortbyorder';
import _ from 'lodash';


export default class Article extends LdJsonObject {
    constructor(json,order,parent) {
        super(json,order,parent);
    }

    getBody() {
        this.data.articleBody = this.data.articleBody || [];
        const body =  this.data.articleBody.map( (item, i) => {
            if (this.mappedMent.articleBody && this.mappedMent.articleBody[i]) {
                return this.mappedMent.articleBody[i].render(i);
            } else {
                return item;
            }
        });
        return body;
    }

}
