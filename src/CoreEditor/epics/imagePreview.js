import * as actions from '../actions/imagedialog.js';
import { ajax } from 'rxjs/observable/dom/ajax';
import { empty } from 'rxjs/Observable/empty';
import { Observable } from 'rxjs/Observable';
import {
  change, // The action creator
} from 'redux-form';
import imageDialog from '../reducers/imageDialog';

// return sequence of actions, first two are manipulating redux-form values, last one is changing busy flag
const dispatchFormActions = (title, description) =>
  Observable.concat(
    // Fire 2 actions, one after the other
    Observable.of(change('imageDialog', 'title', title)),
    Observable.of(change('imageDialog', 'description', description)),
    Observable.of({ type: actions.IMAGE_DIALOG_PREVIEW_SUCCESS }),
  );

// this function is used to pick correct action from redux-form action stream
const urlFieldSelector = action =>
  action.meta.form === 'imageDialog' && action.meta.field === 'url';

const getPreviewFromIframely = url =>
  ajax({
    url: `https://iframely.wrioos.com/iframely?url=${encodeURIComponent(url)}`,
    TYPE: 'GET',
    crossDomain: true,
  })
    .switchMap((response) => {
      const { description, title } = response.response.meta;
      return dispatchFormActions(title, description);
    })
    .catch(() => Observable.of({ type: actions.IMAGE_DIALOG_PREVIEW_FAILED }));

const imagePreviewEpic = action$ =>
  action$
    .ofType('@@redux-form/CHANGE')
    .filter(urlFieldSelector)
    .map(action => action.payload)
    .distinctUntilChanged()
    .debounceTime(250)
    .switchMap(url =>
      Observable.concat(
        Observable.of({ type: actions.IMAGE_DIALOG_PREVIEW_START }),
        getPreviewFromIframely(url),
      ));
//    .mapTo();

export default imagePreviewEpic;
