require('babel-polyfill');
require('es6-symbol/implement'); // FOR IE support for of iterators

import React from 'react'
import ReactDOM from 'react-dom';
import App from "./app.js"
import LdJsonDocument from './core/jsonld/LdJsonDocument';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react'

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
if (module.hot) module.hot.accept('./app', () => render(App));
