/**
 * Created by michbil on 25.06.17.
 */

/* @flow */

import React from 'react';
import Reflux from 'reflux'
import {CreateDomCenter, TransactionsCenter, PresaleCenter, ChessCenter, CoreCreateCenter, WebGoldCenter} from './core/components/CreateDomCenter';
import ArticleTableOfContents from './core/material-components/ArticleNavgiation'
import {getServiceUrl,getDomain} from './core/servicelocator.js';
import LdJsonDocument from './core/jsonld/LdJsonDocument';
import UrlMixin from './core/mixins/UrlMixin.js';
import {Plus} from "./widgets/Plus/Plus";
import WrioDocumentActions from './core/actions/WrioDocument.js';
import WrioDocumentStore from './core/store/WrioDocument.js';

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

const NewUI = ({center, coverData, chapters}) => {
    return (
        <div>
            <RightNav />
            <CoverHeader coverData={coverData} />
            <div className="col-sm-3">
                  <ArticleTableOfContents articleItems={chapters} />
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

class Main extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state = {
            url:  UrlMixin.searchToObject(),
            mainPage : this.props.document
        };
        this.store = WrioDocumentStore;
    }

    propTypes: {
        document : LdJsonDocument
    };

    componentDidMount() {
        // hide preloader
        const preloader = document.getElementById('preloader');
        preloader ? preloader.style.display = 'none' : true;
        WrioDocumentActions.loadDocumentWithData.trigger(this.props.document,window.location.href);
    }


    render() {
        const url = this.props.url;

        if (this.state.url.start && (window.location.origin === getServiceUrl('chess'))) {
            return this.renderWithCenter(<ChessCenter  data={this.state.mainPage} url={url} />);
        }

        if (this.state.url.transactions) {
            return this.renderWithCenter(<TransactionsCenter  data={this.state.mainPage} url={url}/>);
        }

        if (this.state.url.presale && (window.location.hostname.startsWith('webgold.wrioos.') || window.location.hostname.startsWith('wrioos.local'))) {
            return this.renderWithCenter(<PresaleCenter  data={this.state.mainPage} url={url} />);
        }

        if (this.state.url.create) {
            return this.renderWithCenter(<CoreCreateCenter data={this.state.mainPage} url={url} />);
        }

        if (this.state.url.add_funds) {
            return this.renderWithCenter(<WebGoldCenter data={this.state.mainPage} url={url} />);
        }


        return this.renderWithCenter(<CreateDomCenter data={this.state.mainPage} url={url} />);
    }

    renderWithCenter(center) {
        let data : LdJsonDocument = this.state.mainPage;
        let coverData = this.state.lists;

        return (<NewUI
            chapters={this.state.toc.chapters}
            data={data}
            center={center}
            coverData={coverData}
        />)}

}


let doc = new LdJsonDocument(document.getElementsByTagName('script'));

export  default  class App extends React.Component {
    render () {
        return <Main document={doc}/>
    }
}