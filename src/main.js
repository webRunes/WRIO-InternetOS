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

            <nav className="navbar navbar-wrioos navbar-fixed-top">
              <div className="container">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="#"><i className="material-icons">apps</i> Dashboard</a>
                </div>

                <div className="collapse navbar-collapse">
                  <ul className="nav navbar-nav navbar-right">
                    <li>
                      <a href="#">
                        <i className="material-icons">message</i> Messages
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="material-icons">account_circle</i> Profile
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            {/*<nav className="dashboard">
              <a className="navbar-brand" href="#"><i className="material-icons dp48">apps</i> Dashboard<div className="ripple-container"></div></a>
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#example-navbar-transparent">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </nav>*/}
            <div className="page-header header-filter cover-bg" data-parallax="true">
              <div className="cover col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
                  <nav className="navbar navbar-transparent">
                    <ul className="nav navbar-nav navbar-left">
                      <li>
                        <a href="#">Cover</a>
                      </li>
                      <li>
                        <a href="#">Offer</a>
                      </li>
                      <li>
                        <a href="#">Tutorial</a>
                      </li>
                    </ul>
                  </nav>
                  <div className="title">
                    <div className="title-text">
                      <h1>Cosmos</h1>
                      <h2>Cosmos: A Spacetime Odyssey is a 2014 American science documentary television series. The show is a follow-up to the 1980 television series ', which was presented by Carl Sagan on the Public Broadcasting Service and is considered a milestone for scientific documentaries.</h2>
                    </div>
                  </div>
                </div>
            </div>


            <div className={'row row-offcanvas row-offcanvas-right hidden'}>
              <CreateDomLeft list={plus} />
            </div>
            <div className="main col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">

              {/*<div className="row">
                  <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-0 col-lg-4">
                    <div className="card card-blog card-rotate">
                      <div className="rotating-card-container manual-flip">
                        <div className="card-image">
                          <div className="front">
                            <img className="img" src="http://demos.creative-tim.com/material-kit-pro/assets/img/examples/card-blog6.jpg" />
                            <div className="btn-container">
                              <button className="btn btn-white btn-fill btn-round btn-just-icon btn-rotate">
                                <i className="material-icons">refresh</i>
                                <div className="ripple-container"></div></button>
                            </div>
                            <div className="colored-shadow" style={{"backgroundImage": "url('http://demos.creative-tim.com/material-kit-pro/assets/img/examples/card-blog6.jpg'); opacity: 1;"}}></div>
                          </div>
                          <div className="back back-background" style={{"height": "220px","width": "330px", "backgroundImage": "url('http://demos.creative-tim.com/material-kit-pro/assets/img/examples/card-blog6.jpg');"}}>
                            <div className="card-content">
                              <h5 className="card-title">
                                Share this article...
                              </h5>
                              <p className="card-description">
                                You can share this article with your friends, family or on different networks...
                              </p>
                              <div className="footer text-center">
                                <a href="#" className="btn btn-just-icon btn-round btn-white btn-twitter">
                                  <i className="fa fa-twitter"></i>
                                </a>
                                <a href="#" className="btn btn-just-icon btn-round btn-white btn-pinterest">
                                  <i className="fa fa-pinterest"></i>
                                </a>
                                <a href="#" className="btn btn-just-icon btn-round btn-white btn-facebook">
                                  <i className="fa fa-facebook"></i>
                                </a>
                              </div>
                              <button className="btn btn-white btn-simple btn-rotate">
                                <i className="material-icons">refresh</i> Back...
                                <div className="ripple-container"></div></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-content">
                        <p>Manual Rotating Card. Fix height</p>
                      </div>
                    </div>

                  </div>
                  <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-0 col-lg-4">
                    <div className="card card-blog">
                      <div className="card-image">
                        <img className="img" src="http://demos.creative-tim.com/material-kit-pro/assets/img/examples/blog6.jpg" />
                        <div style={{"backgroundImage": "url(http://demos.creative-tim.com/material-kit-pro/assets/img/examples/blog6.jpg');"}}></div>
                      </div>
                      <div className="card-content">
                        <h5>
                          Autodesk looks to future of 3D printing with Project Escher
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-0 col-lg-4">
                    <div className="card card-blog">
                      <div className="card-image">
                        <img className="img" src="http://demos.creative-tim.com/material-kit-pro/assets/img/examples/blog5.jpg" />
                        <div className="colored-shadow" style={{"backgroundImage": "url(http://demos.creative-tim.com/material-kit-pro/assets/img/examples/blog5.jpg');"}}></div><div className="ripple-container"></div></div>
                      <div className="card-content">
                        <h5>
                          Lyft launching cross-platform service this week
                        </h5>
                      </div>
                    </div>
                  </div>
                  </div>

              <CreateDomRight data={data} />*/}

              <div className="card card-nav-tabs">
                <div className="header header-primary tmpfix">
                  <div className="nav-tabs-navigation">
                    <div className="nav-tabs-wrapper">
                      <ul className="nav nav-tabs" data-tabs="tabs">
                        <li className="active">
                          <a href="#profile" data-toggle="tab">
                            <i className="material-icons">face</i>
                            Read
                            <div className="ripple-container"></div></a>
                        </li>
                        <li>
                          <a href="#messages" data-toggle="tab">
                            <i className="material-icons">chat</i>
                            Collections
                          </a>
                        </li>
                        <li>
                          <a href="#settings" data-toggle="tab">
                            <i className="material-icons">build</i>
                            Opened
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <div className="tab-content text-center">
                    <div className="tab-pane active" id="profile">
                      <p> I will be the leader of a company that ends up being worth billions of dollars, because I got the answers. I understand culture. I am the nucleus. I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at. I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at. </p>
                    </div>
                    <div className="tab-pane" id="messages">
                      <p> I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at. I will be the leader of a company that ends up being worth billions of dollars, because I got the answers. I understand culture. I am the nucleus. I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at.</p>
                    </div>
                    <div className="tab-pane" id="settings">
                      <p>I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at. So when you get something that has the name Kanye West on it, it’s supposed to be pushing the furthest possibilities. I will be the leader of a company that ends up being worth billions of dollars, because I got the answers. I understand culture. I am the nucleus.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="page">
                {center}
              </div>
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
