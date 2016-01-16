<<<<<<< HEAD
var React = require('react'),
    ReactDOM = require('react-dom'),
    Showdown = require('showdown'),
    converter = new Showdown.Converter(),
    CreateDomLeft = require('./js/components/CreateDomLeft'),
    CreateDomRight = require('./js/components/CreateDomRight'),
    CreateDomCenter = require('./js/components/CreateDomCenter'),
    WindowDimensions = require('./js/components/WindowDimensions'),
    scripts = require('./js/jsonld/scripts'),
    domready = require('domready');
=======
import React from 'react';
import ReactDOM from 'react-dom';
import Showdown from 'showdown';
import CreateDomLeft from './js/components/CreateDomLeft';
import CreateDomRight from './js/components/CreateDomRight';
import CreateDomCenter from './js/components/CreateDomCenter';
import WindowDimensions  from './js/components/WindowDimensions';
import scripts from './js/jsonld/scripts';
import domready from 'domready';
>>>>>>> 3f7dcf6253b3ce993b443f94be240125f806efeb

var converter = new Showdown.Converter();

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // hide preloader
        document.getElementById('preloader') ? document.getElementById('preloader').style.display = 'none' : true;
    }
    render() {
        return (
            <div className={'row row-offcanvas row-offcanvas-right '}>
                <CreateDomLeft />
                <CreateDomCenter converter={converter} data={this.props.data} />
                <CreateDomRight data={this.props.data} />
                <WindowDimensions />
            </div>
        );
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

domready(() =>{
    var container = createContainer();
    var domnode = document.body.appendChild(container);
    var docScripts = scripts(document.getElementsByTagName('script'));
    ReactDOM.render(<Main data={docScripts} />, domnode);
});
