'use strict';
var React = require('react'),
    Plus = require('plus'),
    Reflux = require('reflux'),
    classNames = require('classnames'),
    ActionMenu = require('plus/js/actions/menu'),
    StoreMenu = require('plus/js/stores/menu'),
    themeImportUrl = require('../global').themeImportUrl;

class CreateDomLeft extends React.Component{

    constructor (props) {
        super(props);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.showSidebar = this.showSidebar.bind(this);
        this.toggleMenuByClick = this.toggleMenuByClick.bind(this);
        this.showSidebarByClick = this.showSidebarByClick.bind(this);
        this.state = {
            toggleMenu: false,
            showSidebar: false
        };
    }
    componentDidMount() {
        this.unsubscribe = StoreMenu.listenTo(ActionMenu.toggleMenu, this.toggleMenu);
        this.unsubscribe = StoreMenu.listenTo(ActionMenu.showSidebar, this.showSidebar);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    toggleMenu(data){
        this.setState({
            toggleMenu: data
        });
    }

    showSidebar(data){
        this.setState({
            showSidebar: data
        });
    }

    toggleMenuByClick(){
        this.setState({
            toggleMenu: !this.hasClass(React.findDOMNode(this.refs.toggleMenu), 'active')
        });
        ActionMenu.toggleMenu(!this.hasClass(React.findDOMNode(this.refs.toggleMenu), 'active'));
    }

    showSidebarByClick(){
        this.setState({
            showSidebar: !this.hasClass(React.findDOMNode(this.refs.showSidebar), 'active')
        });
        ActionMenu.showSidebar(!this.hasClass(React.findDOMNode(this.refs.showSidebar), 'active'));
        ActionMenu.toggleMenu(false);
    }

    hasClass(el, selector) {
        var className = ' ' + selector + ' ';

        if ((' ' + el.className + ' ').replace(/[\n\t]/g, ' ').indexOf(className) > -1) {
            return true;
        }else{
            return false;
        }
    }

    render() {

        var classNameToggle = classNames({
            'btn btn-link btn-sm visible-xs collapsed' : true,
            'active' : this.state.toggleMenu
        });

        var classNameSidebar = classNames({
            'btn btn-link btn-sm visible-xs' : true,
            'active' : this.state.showSidebar
        });

        return (
            <div className="col-xs-12 col-sm-3 col-md-2">
                <div className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu">
                    <div className="navbar-header tooltip-demo" id="topMenu 12">
                        <ul className="nav menu pull-right">
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Call IA">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-comment" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Logout">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-lock" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Full screen">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-fullscreen" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Open/close menu">
                                <a onClick={this.toggleMenuByClick} ref="toggleMenu" data-target=".navbar-collapse" data-toggle="collapse" className={classNameToggle} href="#">
                                    <span className="glyphicon glyphicon-align-justify" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Show/hide the sidebar">
                                <a onClick={this.showSidebarByClick} ref="showSidebar"  data-toggle="offcanvas" id="myoffcanvas" className={classNameSidebar} href="#">
                                    <span className="glyphicon glyphicon-transfer" />
                                </a>
                            </li>
                        </ul>
                        <a title="" data-placement="right" data-toggle="tooltip" className="navbar-brand" href="webrunes-contact.htm" data-original-title="Contact us"> </a>
                    </div>
                    <Plus themeImportUrl={themeImportUrl} />
                </div>
            </div>
        );
    }
};

module.exports = CreateDomLeft;
