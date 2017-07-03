/* @flow */
import React from 'react';
// $FlowFixMe
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
import Tabs from './core/material-components/Tabs'


const RightNav = () => {
    return ( <div className="right-nav">
        <a href="#" className="btn btn-just-icon btn-simple btn-default btn-lg"><i className="material-icons dp_big">highlight_off</i></a>
        <a href="#" className="hidden btn btn-just-icon btn-simple btn-default btn-lg"><i className="material-icons dp_big">bookmark</i></a>
        <a href="#" className="hidden btn btn-just-icon btn-simple btn-default btn-lg"><i className="material-icons dp_big">share</i></a>
    </div>);
};

const NewUI = ({center, coverData, chapters, externals}) => {
    return (
        <div>
            <RightNav />
            <CoverHeader coverData={coverData} />
            <div className="col-sm-3">
                  <ArticleTableOfContents articleItems={chapters} />
            </div>
            <div className="main col-xs-12 col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-0 col-lg-9">
                    <Tabs center={center} externals={externals}/>
            </div>
        </div>
    );
};

class Main extends Reflux.Component {
    constructor(props) {
        super(props);
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
        const url : string = this.state.url;
        const urlDecoded = UrlMixin.searchToObject(url);

        if (urlDecoded.start && (window.location.origin === getServiceUrl('chess'))) {
            return this.renderWithCenter(<ChessCenter  data={this.props.document} url={url} />);
        }

        if (urlDecoded.transactions) {
            return this.renderWithCenter(<TransactionsCenter  data={this.props.document} url={url}/>);
        }

        if (urlDecoded.presale && (window.location.hostname.startsWith('webgold.wrioos.') ||
            window.location.hostname.startsWith('wrioos.local'))) {
            return this.renderWithCenter(<PresaleCenter  data={this.props.document} url={url} />);
        }

        if (urlDecoded.create) {
            return this.renderWithCenter(<CoreCreateCenter data={this.props.document} url={url} />);
        }

        if (urlDecoded.add_funds) {
            return this.renderWithCenter(<WebGoldCenter data={this.props.document} url={url} />);
        }


        return this.renderWithCenter(<CreateDomCenter data={this.props.document} url={url} profile={this.state.profile} />);
    }

    renderWithCenter(center) {
        let data : LdJsonDocument = this.props.document;
        let coverData = this.state.lists.filter(list => list.type == 'cover');
        let externals = this.state.lists.filter(list => list.type == 'external');

        return (<NewUI
            chapters={this.state.toc.chapters}
            data={data}
            center={center}
            coverData={coverData}
            externals={externals}
        />)}

}


let doc = new LdJsonDocument(document.getElementsByTagName('script'));

export  default  class App extends React.Component {
    render () {
        return <Main document={doc}/>
    }
}