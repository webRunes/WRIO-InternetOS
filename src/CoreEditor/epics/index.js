import { combineEpics } from 'redux-observable';
import imagePreview from './imagePreview';

export default combineEpics(imagePreview);
