import {ADD_COVER, SELECT_COVER, PRESS_COVER_BUTTON} from "../actions/coverActions.js";
import LdJsonDocument from 'base/jsonld/LdJsonDocument'
import {replaceSpaces} from 'base/mixins/UrlMixin'
import ImageObject from 'base/jsonld/entities/ImageObject'
import ItemList from 'base/jsonld/entities/ItemList'

/**
 * Store that state of covers carousel
 */

type ReducerState = {
    covers: Array<ItemList>,
    images: Array<ImageObject>,
    selected: number
}

const defaultState : ReducerState =  {
    covers: [],
    images: [],
    selected: 0
}



function reducer(state : ReducerState = defaultState,action) {
    switch(action.type) {
        case ADD_COVER:
            const imageIndex = state.images.length ;
            const coverList : Object = {
                ...action.coverObj,
                ...actions.coverDoc.getBlocks()[0]
            };
            const images : Array<ImageObject> = coverList.children;
            coverList.carouselIndexes = images.map((img,i) => imageIndex + i); // save Carousel indexes for future use
            let covers = state.covers;
            return {
                ...state,
                covers:[...state.covers,coverList],
                images:[...state.images,images]
            }; // Merge two objects
    
        case SELECT_COVER: 
            return {
                ...state,
                selected: action.index
            }
        break;
        case PRESS_COVER_BUTTON:
            return {
                ...state,
                selected: action.cover.carouselIndexes[0]
            }
        default:
            return state;
    }
}

export default reducer;