require('babel-polyfill');
require('es6-symbol/implement'); // FOR IE support for of iterators

/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux'
import CreateDomLeft from './core/components/CreateDomLeft';
import CreateDomRight from './core/components/CreateDomRight';
import {CreateDomCenter, TransactionsCenter, PresaleCenter, ChessCenter, CoreCreateCenter, WebGoldCenter} from './core/components/CreateDomCenter';
import {getServiceUrl,getDomain} from './core/servicelocator.js';
import sendHeight  from './core/components/WindowDimensions';
import LdJsonManager from './core/jsonld/scripts';
import WindowActionStore from './core/store/WindowMessage.js';
import UrlMixin from './core/mixins/UrlMixin.js';
import Lockup from './core/components/Lockup.js';
import {Plus,Users} from "./widgets/Plus/Plus";
//import { Router, Route, Link } from 'react-router';
import WrioDocumentActions from './core/actions/WrioDocument.js';
import WrioDocumentStore from './core/store/WrioDocument.js';
import UIActions from './core/actions/UI.js';

import CoverHeader from './core/material-components/CoverHeader'

const ArticleTabs = () => {
    return (<div className="header header-primary">
        <div className="nav-tabs-navigation">
            <div className="nav-tabs-wrapper">
                <ul className="nav nav-tabs" data-tabs="tabs">
                    <li className="active">
                        <a href="#home" data-toggle="tab">
                            Home
                            <div className="ripple-container"></div>
                        </a>
                    </li>
                    <li>
                        <a href="#collections" data-toggle="tab">
                            Collections
                            <div className="ripple-container"></div>
                        </a>
                    </li>
                    <li>
                        <a href="#read_later" data-toggle="tab">
                            Read later <label>4</label>
                            <div className="ripple-container"></div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>);
};


const RightNav = () => {
    return ( <div className="right-nav">
        <a href="#" className="btn btn-just-icon btn-simple btn-default btn-lg"><i className="material-icons dp_big">highlight_off</i></a>
        <a href="#" className="hidden btn btn-just-icon btn-simple btn-default btn-lg"><i className="material-icons dp_big">bookmark</i></a>
        <a href="#" className="hidden btn btn-just-icon btn-simple btn-default btn-lg"><i className="material-icons dp_big">share</i></a>
    </div>);
};

const NewUI = ({center,plus,data,coverData}) => {
    return (
        <div>
            <RightNav />
            <CoverHeader coverData={coverData} />
            <div className={'hidden row row-offcanvas row-offcanvas-right'}>
                <CreateDomLeft list={plus} />
            </div>
            <div className="col-sm-3">
                { /* <CreateDomRight data={data} */ }
            </div>
            <div className="main col-xs-12 col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-0 col-lg-9">
                <div className="card card-nav-tabs">
                    <ArticleTabs />
                    <div className="card-content">
                        <div className="tab-content">
                            <div className="tab-pane active" id="home">
                                {center}
                            </div>
                            <div className="tab-pane" id="collections">
                                <p>Lists</p>
                            </div>
                            <div className="tab-pane" id="opened">
                                <p>Opened</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default class Main extends Reflux.Component {
    constructor() {
        super();
        this.state = {
            url:  UrlMixin.searchToObject(),
            data: null
        }
        this.store = WrioDocumentStore;
    }

    componentDidMount() {
        // hide preloader
        sendHeight();
        const preloader = document.getElementById('preloader');
        preloader ? preloader.style.display = 'none' : true;
    }

    render() {

        if (this.state.url.start && (window.location.origin === getServiceUrl('chess'))) {
            return this.renderWithCenter(<ChessCenter  data={this.state.data} />);
        }

        if (this.state.url.transactions) {
           return this.renderWithCenter(<TransactionsCenter  data={this.state.data}/>);
        }

        if (this.state.url.presale && (window.location.hostname.startsWith('webgold.wrioos.') || window.location.hostname.startsWith('wrioos.local'))) {
            return this.renderWithCenter(<PresaleCenter  data={this.state.data}/>);
        }

        if (this.state.url.create) {
            return this.renderWithCenter(<CoreCreateCenter data={this.state.data} />);
        }

        if (this.state.url.add_funds) {
            return this.renderWithCenter(<WebGoldCenter data={this.state.data} />);
        }


        return this.renderWithCenter(<CreateDomCenter data={this.state.data} />);
    }

    renderWithCenter(center,plus) {
        plus = plus || (<Plus />);
        let data = this.state.mainPage;
        let coverData = this.state.covers;

        return (<NewUI plus={plus}
                       data={data}
                       center={center}
                       coverData={coverData}
        />)}

}

Main.propTypes = {

};

function createContainer() : HTMLElement {
    var d = document.createElement('div');
    d.id = 'content';
    d.className = 'container-liquid';
    return d;
}

let container = createContainer();
if (document.body) {
    let domnode = document.body.appendChild(container);
    let manager = new LdJsonManager(document.getElementsByTagName('script'));
    let docScripts = manager.getBlocks();
    WrioDocumentActions.loadDocumentWithData.trigger(docScripts,window.location.href);
    ReactDOM.render(<Main />, domnode);
}

