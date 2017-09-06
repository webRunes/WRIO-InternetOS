/* @flow */
import {CrossStorageFactory} from '../utils/CrossStorageFactory.js';
// $FlowFixMe
import Reflux from 'reflux';
import CoverActions from "../actions/CoverActions.js";
import LdJsonDocument from '../jsonld/LdJsonDocument'
import {replaceSpaces} from '../mixins/UrlMixin'
import ImageObject from '../jsonld/entities/ImageObject'
import ItemList from '../jsonld/entities/ItemList'

/**
 * Store that state of covers carousel
 */

class CoverStore extends Reflux.Store {

    state: {
        covers: Array<ItemList>,
        images: Array<ImageObject>,
        selected: number
    };

    constructor() {
        super();
        this.listenables = CoverActions;
        this.state = {
            covers: [],
            images: [],
            selected: 0
        }
    }

    onAddCover(coverObj : Object, coverDoc : LdJsonDocument) {
        const imageIndex = this.state.images.length ;
        const coverList : Object = Object.assign(coverObj,coverDoc.getBlocks()[0]);
        const images : ImageObject = coverList.children;
        coverList.carouselIndexes = images.map((img,i) => imageIndex + i); // save Carousel indexes for future use
        let covers = this.state.covers;
        this.state.covers.push(coverList); // Merge two objects
        this.setState({covers, images:this.state.images.concat(images)});
    }
    onSelectCover(index : number) {
        this.setState({selected: index})
    }
    onPressCoverButton(cover : Object) {
        this.setState({selected: cover.carouselIndexes[0]}); // pick first image from cover
    }
}

export default CoverStore;