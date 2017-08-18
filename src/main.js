require('babel-polyfill');
require('es6-symbol/implement'); // FOR IE support for of iterators

import React from 'react'
import ReactDOM from 'react-dom';
import App from "./base/containers/app.js"
import LdJsonDocument from './base/jsonld/LdJsonDocument';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react'
import WindowMessage from './base/store/WindowMessage' // it's not unused import! required to initiialize window message bus


function createContainer() : HTMLElement {
    var d = document.createElement('div');
    d.id = 'content';
    d.className = 'container-liquid';
    return d;
}

let container = createContainer();
let domnode = document.body.appendChild(container);

const render = () =>
    ReactDOM.render(
        (<AppContainer errorReporter={Redbox}>
        <App />
    </AppContainer>), domnode);
render();
if (module.hot) module.hot.accept('./base/containers/app', () => render(App));
