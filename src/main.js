require('babel-polyfill');
require('es6-symbol/implement'); // FOR IE support for of iterators

import React from 'react'
import ReactDOM from 'react-dom';
import App from "./base/containers/app.js"
import LdJsonDocument from './base/jsonld/LdJsonDocument';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react'
import WindowMessage from './base/actions/WindowMessage' // it's not unused import! required to initiialize window message bus
import configureStore from './base/configureStore'
import { Provider } from 'react-redux'

function createContainer() : HTMLElement {
    var d = document.createElement('div');
    d.id = 'content';
    d.className = 'container-liquid';
    return d;
}

let container = createContainer();
let domnode = document.body.appendChild(container);


const store = configureStore();

const render = () =>
    ReactDOM.render(
        (<AppContainer errorReporter={Redbox}>
            <Provider store={store}>
                 <App />
            </Provider>
    </AppContainer>), domnode);
render();

if (module.hot) module.hot.accept('./base/containers/app', () => {
    console.log("HOT damnit")
    return render(App)
});
