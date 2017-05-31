require('babel-polyfill');
require('es6-symbol/implement'); // FOR IE support for of iterators
import React from 'react';
import ReactDOM from 'react-dom';
import Showdown from 'showdown';
import CreateDomLeft from './core/components/CreateDomLeft';
import CreateDomRight from './core/components/CreateDomRight';
import {CreateDomCenter, TransactionsCenter, PresaleCenter, ChessCenter, CoreCreateCenter, WebGoldCenter} from './core/components/CreateDomCenter';
import {getServiceUrl,getDomain} from './core/servicelocator.js';
import sendHeight  from './core/components/WindowDimensions';
import LdJsonManager from './core/jsonld/scripts';
import domready from 'domready';
import WindowActionStore from './core/store/WindowMessage.js';
import UrlMixin from './core/mixins/UrlMixin.js';
import Lockup from './core/components/Lockup.js';
import {Plus,Users} from "./widgets/Plus/Plus";
//import { Router, Route, Link } from 'react-router';
import WrioDocumentActions from './core/actions/WrioDocument.js';
import WrioDocumentStore from './core/store/WrioDocument.js';
import UIActions from './core/actions/UI.js';

/*
import Perf from 'react-addons-perf';
window.Perf = Perf;
Perf.start();*/

var converter = new Showdown.Converter();

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url:  UrlMixin.searchToObject(),
            showLockup: false,
            data: WrioDocumentStore.getDocument()
        };
    }

    listener () {
        UIActions.showLockup.listen((data) => {
            this.setState({
                showLockup:data
            });
        });
        this.wrioStore = WrioDocumentStore.listen(this.onDocumentChange.bind(this));

    }

    componentDidMount() {
        // hide preloader
        this.listener();
        sendHeight();
        document.getElementById('preloader') ? document.getElementById('preloader').style.display = 'none' : true;
    }

    componentWillUnmount() {
        this.wrioStore();
    }

    onDocumentChange(doc) {
        this.setState({
           url:  UrlMixin.searchToObject(),
           changed: true
        });
    }

    render() {

        if (this.state.url.start && (window.location.origin === getServiceUrl('chess'))) {
            return this.renderWithCenter(<ChessCenter converter={converter} data={this.state.data} />);
        }

        if (this.state.url.transactions) {
           return this.renderWithCenter(<TransactionsCenter converter={converter} data={this.state.data}/>);
        }

        if (this.state.url.presale && (window.location.hostname.startsWith('webgold.wrioos.') || window.location.hostname.startsWith('wrioos.local'))) {
            return this.renderWithCenter(<PresaleCenter converter={converter} data={this.state.data}/>);
        }

        if (this.state.url.create) {
            return this.renderWithCenter(<CoreCreateCenter converter={converter} data={this.state.data} />);
        }

        if (this.state.url.add_funds) {
            return this.renderWithCenter(<WebGoldCenter converter={converter} data={this.state.data} />);
        }

        if (this.state.showLockup) {
            return this.renderWithCenter(<Lockup data={this.state.data}/>, <Users />);
        }

        return this.renderWithCenter(<CreateDomCenter converter={converter} data={this.state.data} />);
    }

    renderWithCenter(center,plus) {
        var plus = plus || (<Plus />);
        var data = WrioDocumentStore.getData();
        return (
          <div>

            <div className="header header-filter cover-bg hidden-xs">
              <div className="container">
                <div className="row">
                  <div className="title col-xs-12 col-sm-5 col-md-6 col-lg-4">
                    <h1>Cosmos</h1>
                    <h4>Cosmos: A Spacetime Odyssey is a 2014 American science documentary television series. The show is a follow-up to the 1980 television series ', which was presented by Carl Sagan on the Public Broadcasting Service and is considered a milestone for scientific documentaries.</h4>
                  </div>
                </div>
              </div>

              <div className={'row row-offcanvas row-offcanvas-right hidden'}>
                <CreateDomLeft list={plus} />
              </div>
              {center}
              <CreateDomRight data={data} />
            </div>
          </div>
            );
            }

            }

            Main.propTypes = {

            };

            function createContainer() {
              var d = document.createElement('div');
    d.id = 'content';
    d.className = 'container-liquid';
    return d;
}

//domready(() =>{
    let container = createContainer();
    let domnode = document.body.appendChild(container);
    let manager = new LdJsonManager(document.getElementsByTagName('script'));
    let docScripts = manager.getBlocks();
    WrioDocumentActions.loadDocumentWithData.trigger(docScripts,window.location.href);
    ReactDOM.render(<Main />, domnode);
//});
