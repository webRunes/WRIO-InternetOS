/**
 * Created by Victor on 09.11.2015.
 */
'use strict';
var React = require('react'),
    Reflux = require('reflux'),
    className={className} = require('reflux'),
    ActionMenu = require('plus/js/actions/menu'),
    StoreMenu = require('plus/js/stores/menu');

class WindowDimensions extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width: false,
            height: false
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }
    updateDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        var hide = ('hide');
        ActionMenu.windowResize(this.state.width, this.state.height);
        return <span className={hide}>{this.state.width} x {this.state.height}</span>;
    }
}

module.exports = WindowDimensions;