require('babel/polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import Showdown from 'showdown';
import CreateDomLeft from './js/components/CreateDomLeft';
import CreateDomRight from './js/components/CreateDomRight';
import {CreateDomCenter, TransactionsCenter, ChessCenter, CoreCreateCenter, WebGoldCenter} from './js/components/CreateDomCenter';
import {getServiceUrl,getDomain} from './js/servicelocator.js';
import WindowDimensions  from './js/components/WindowDimensions';
import scripts from './js/jsonld/scripts';
import domready from 'domready';
import WindowActionStore from './js/store/WindowMessage.js';
import UrlMixin from './js/mixins/UrlMixin.js';
import Lockup from './js/components/Lockup.js';
import CenterActions from './js/actions/center';

var converter = new Showdown.Converter();

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.url = UrlMixin.searchToObject();
        this.state = {
            showLockup: false
        };
    }

    listener () {
        CenterActions.showLockup.listen((data) => {
            this.setState({
                showLockup:data
            });
        });
    }

    componentDidMount() {
        // hide preloader
        this.listener();
        document.getElementById('preloader') ? document.getElementById('preloader').style.display = 'none' : true;
    }
    render() {

        if (this.url.start && (window.location.origin === getServiceUrl('chess'))) {
            return this.renderWithCenter(<ChessCenter converter={converter} data={this.props.data} />);
        }

        if (this.url.transactions) {
           return this.renderWithCenter(<TransactionsCenter converter={converter} data={this.props.data}/>);
        }

        if (this.url.create) {
            return this.renderWithCenter(<CoreCreateCenter converter={converter} data={this.props.data} />);
        }

        if (this.url.add_funds) {
            return this.renderWithCenter(<WebGoldCenter converter={converter} data={this.props.data} />);
        }

        if (this.state.showLockup) {
            return this.renderWithCenter(<Lockup />);
        }

        return this.renderWithCenter(<CreateDomCenter converter={converter} data={this.props.data} />);
    }

    renderWithCenter(center) {
        return (
            <div className={'row row-offcanvas row-offcanvas-right '}>
                <CreateDomLeft />
                {center}
                <CreateDomRight data={this.props.data} />
            </div>);
    }
}

Main.propTypes = {
    data: React.PropTypes.array.isRequired
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
    ReactDOM.render(<Main data={docScripts} />, domnode);
//});
