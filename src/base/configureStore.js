import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers/rootReducer.js';
import { loginMessage } from 'base/actions/WindowMessage';
import * as actions from 'base/actions/actions';
import { getPlusData } from 'base/Plus/actions/PlusActions';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const loggerMiddleware = createLogger();

const dispatchLoginMessages = function dispatchLoginMessages(store) {
  store.dispatch(getPlusData());
  loginMessage
    .filter(msg => !!msg && !!msg.profile)
    .distinct()
    .subscribe((msg) => {
      const action = actions.loginMessage(msg);
      store.dispatch(action);
    });
};

export default function configureStore(preloadedState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware)),
  );
  dispatchLoginMessages(store);
  return store;
}
