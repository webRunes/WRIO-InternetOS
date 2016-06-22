require('babel-polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import Showdown from 'showdown';
import CreateDomLeft from './core/components/CreateDomLeft';
import CreateDomRight from './core/components/CreateDomRight';
import {CreateDomCenter, TransactionsCenter, ChessCenter, CoreCreateCenter, WebGoldCenter} from './core/components/CreateDomCenter';
import {getServiceUrl,getDomain} from './core/servicelocator.js';
import sendHeight  from './core/components/WindowDimensions';
import scripts from './core/jsonld/scripts';
import domready from 'domready';
import WindowActionStore from './core/store/WindowMessage.js';
import UrlMixin from './core/mixins/UrlMixin.js';
import Lockup from './core/components/Lockup.js';
import CenterActions from './core/actions/center';
import {Plus,Users} from "./widgets/Plus/Plus";
//import { Router, Route, Link } from 'react-router';
import WrioDocumentActions from './core/actions/WrioDocument.js';
import WrioDocumentStore from './core/store/WrioDocument.js';

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
        CenterActions.showLockup.listen((data) => {
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

        console.log("Doc changed called",doc);


        this.setState({
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
            <div className={'row row-offcanvas row-offcanvas-right '}>
                <CreateDomLeft list={plus} />
                {center}
                <CreateDomRight data={data} />
            </div>);
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
    var container = createContainer();
    var domnode = document.body.appendChild(container);
    var docScripts = scripts(document.getElementsByTagName('script'));
    WrioDocumentActions.loadDocumentWithData.trigger(docScripts,window.location.href);
    ReactDOM.render(<Main />, domnode);
//});
