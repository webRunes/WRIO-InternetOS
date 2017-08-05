
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {ContentBlock, CharacterMetadata} from 'draft-js';
import CommentSaver from './containers/CommentSaver.js';
import Root from './containers/Editor.js'
import {urlMatch as CommentSaverUrlMatch} from './containers/CommentSaver.js';


var domain = process.env.DOMAIN;


var oldHeight = 0;
window.frameReady = () => {
    let height = document.querySelector('#clientholder').clientHeight + 2;
    if (height != oldHeight) {
        oldHeight = height;
        console.log("Height ready");
        parent.postMessage(JSON.stringify({
            "coreHeight": height
        }), "*");
    }
};


// TODO switch to full routing there
ReactDom.render( CommentSaverUrlMatch() ? <CommentSaver /> : <Root /> , document.getElementById('clientholder'));
