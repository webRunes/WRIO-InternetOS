import { createStore, applyMiddleware,compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/rootReducer.js'
import {loginMessage} from 'base/actions/WindowMessage'
import * as actions from 'base/actions/actions'
import {getPlusData} from 'base/Plus/actions/PlusActions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
    const store =  createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        ))
    )
    dispatchLoginMessages(store)
    return store;
}

function dispatchLoginMessages(store) {
    store.dispatch(getPlusData())
    loginMessage.
        filter((msg) => (!! msg) && (!! msg.profile)).
        distinct().
        subscribe(msg => {
            store.dispatch(actions.loginMessage(msg))
        });
}