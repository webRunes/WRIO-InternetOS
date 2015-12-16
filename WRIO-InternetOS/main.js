'use strict';
var React = require('react'),
    Showdown = require('showdown'),
    converter = new Showdown.Converter(),
    CreateDomLeft = require('./js/components/CreateDomLeft'),
    CreateDomRight = require('./js/components/CreateDomRight'),
    CreateDomCenter = require('./js/components/CreateDomCenter'),
    WindowDimensions = require('./js/components/WindowDimensions'),
    scripts = require('./js/jsonld/scripts'),
    domready = require('domready');

class Main extends React.Component {
    constructor(props) {
        super(props);
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

module.exports = Main;

domready(function (){
    React.render(
        <Main data={scripts(document.getElementsByTagName('script'))} />,
        document.body.appendChild((
            function (){
                var d = document.createElement('div');
                d.id = 'content';
                d.className = 'container-liquid';
                return d;
            }()
        )), function (){
            document.getElementById('preloader') ? document.getElementById('preloader').style.display = 'none' : true;
        }
    );
});
