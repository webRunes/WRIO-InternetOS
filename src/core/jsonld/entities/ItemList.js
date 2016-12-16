import LdJsonObject from './LdJsonObject.js';


export default  class ItemList extends LdJsonObject {
    constructor(json,order,root) {
        super(json,order,root);
        if (json.itemListElement) {
            json.itemListElement.forEach((part) => this.addChild(part,order));
        }
    }

}
