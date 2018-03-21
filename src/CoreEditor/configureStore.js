import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers/indexReducer.js';
import * as actions from 'base/actions/actions';
import { loginMessage } from 'base/actions/WindowMessage';
import { getPlusData } from 'base/Plus/actions/PlusActions';
import { createEpicMiddleware } from 'redux-observable';
import Epics from './epics';
const getMyList = require('./utils/get_my_list');

const loggerMiddleware = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// TODO: this is actually epic reinvented, move to epics
const dispatchLoginMessages = function dispatchLoginMessages(store) {
  store.dispatch(getPlusData());
  loginMessage
    .filter(msg => !!msg && !!msg.profile)
    .distinct()
    .subscribe((msg) => {
      store.dispatch(actions.loginMessage(msg));

      getMyList(msg.profile.id, (err, list) =>
        err
          ? console.log(err)
          : store.dispatch(actions.myListReady(list))
      );
    });
};

const epicMiddleware = createEpicMiddleware(Epics);
let init = false;

export default function configureStore(preloadedState) {
  if (init) return; // to prevent mulitiple creation when using HMR
  init = true;
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(epicMiddleware, thunkMiddleware, loggerMiddleware)),
  );
  dispatchLoginMessages(store);
  return store;
}
