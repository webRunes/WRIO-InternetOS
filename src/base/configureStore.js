import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/rootReducer.js'
import {loginMessage} from 'base/actions/WindowMessage'
import * as actions from 'base/actions/actions'


const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
    const store =  createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    )
    dispatchLoginMessages(store)
    return store;
}

function dispatchLoginMessages(store) {
    loginMessage.
        filter((msg) => (!! msg) && (!! msg.profile)).
        distinct().
        subscribe(msg => {
            store.dispatch(actions.loginMessage(msg))
        });
}