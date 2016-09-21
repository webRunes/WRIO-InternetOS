import LdJsonObject from './LdJsonObject.js';
import _ from 'lodash';


export default  class ItemList extends LdJsonObject {
    constructor(json,order) {
        super(json);
        if (json.itemListElement) {
            json.itemListElement.forEach((part) => this.addChild(part,order));
        }
    }

}
