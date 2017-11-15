import {
  ADD_COVER,
  REPLACE_COVERS,
  SELECT_COVER,
  PRESS_COVER_BUTTON,
  GOT_EXTERNAL,
} from '../actions/actions.js';
import LdJsonDocument from 'base/jsonld/LdJsonDocument';
import { replaceSpaces } from 'base/mixins/UrlMixin';
import ImageObject from 'base/jsonld/entities/ImageObject';
import ItemList from 'base/jsonld/entities/ItemList';

/**
 * Store that state of covers carousel
 */

type ReducerState = {
  covers: Array<ItemList>,
  images: Array<ImageObject>,
  selected: number,
};

const defaultState: ReducerState = {
  covers: [],
  externals: [],
  images: [],
  selected: 0,
};

function reducer(state: ReducerState = defaultState, action) {
  switch (action.type) {
    case ADD_COVER: {
      const imageIndex = state.images.length;
      const coverList: Object = {
        // Merge two objects(some sort of crazy legacy hack) TODO: figure out it and remove
        ...action.coverObj,
        ...action.coverDoc.getBlocks()[0],
      };
      const images: Array<ImageObject> = coverList.children;
      coverList.carouselIndexes = images.map((img, i) => imageIndex + i); // save Carousel indexes for future use
      const covers = state.covers;
      return {
        ...state,
        covers: [...state.covers, coverList],
        images: [...state.images, ...images],
      }; // Merge two objects
    }
    case REPLACE_COVERS: {
      const imageIndex = 0;
      const covers = action.covers.getBlocks()[0];
      const img: Array<ImageObject> = covers.children;
      covers.carouselIndexes = img.map((x, i) => imageIndex + i); // save Carousel indexes for future use
      return {
        ...state,
        covers: [covers],
        images: [...img],
      }; // Merge two objects
    }

    case GOT_EXTERNAL:
      return {
        ...state,
        externals: [...state.externals, action.lists],
      };

    case SELECT_COVER:
      return {
        ...state,
        selected: action.index,
      };
      break;
    case PRESS_COVER_BUTTON:
      return {
        ...state,
        selected: action.cover.carouselIndexes[0],
      };
    default:
      return state;
  }
}

export default reducer;
