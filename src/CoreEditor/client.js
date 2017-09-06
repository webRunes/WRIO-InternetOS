
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {ContentBlock, CharacterMetadata} from 'draft-js';
import CommentSaver from './containers/CommentSaver.js';
import EditorWithGUI from './containers/EditorWithGUI.js'
import {urlMatch as CommentSaverUrlMatch} from './containers/CommentSaver.js';
import { Provider } from 'react-redux'
import configureStore from './configureStore'


const store = configureStore();
var domain = process.env.DOMAIN;



const Root = () => {
    return (<Provider store={store}>
            <EditorWithGUI />
        </Provider>)
};

window.frameReady = () => console.warn("Unneeded frameReady");

// TODO switch to full routing there
ReactDom.render( CommentSaverUrlMatch() ? <CommentSaver /> : <Root /> , document.getElementById('clientholder'));




export default Root