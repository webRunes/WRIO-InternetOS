var React = require('react'),
    ReactDOM = require('react-dom'),
    Plus = require('../../../widgets/Plus/Plus'),
    Reflux = require('reflux'),
    classNames = require('classnames'),
    ActionMenu = require('../../../widgets/Plus/actions/menu'),
    StoreMenu = require('../../../widgets/Plus/stores/menu'),
    themeImportUrl = require('../global').themeImportUrl;

class CreateDomLeft extends React.Component {

    constructor(props) {
        super(props);
        this.oldheight = -1;
        this.toggleMenu = this.toggleMenu.bind(this);
        this.showSidebar = this.showSidebar.bind(this);
        this.tabsSize = this.tabsSize.bind(this);
        this.windowResize = this.windowResize.bind(this);
        this.toggleMenuByClick = this.toggleMenuByClick.bind(this);
        this.showSidebarByClick = this.showSidebarByClick.bind(this);
        this.state = {
            toggleMenu: false,
            showSidebar: false,
            innerHeight: window.innerHeight,
            height: 'auto'
        };
    }

    componentDidMount() {
        this.listenStoreMenuToggle = StoreMenu.listenTo(ActionMenu.toggleMenu, this.toggleMenu);
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.showSidebar);
        this.listenStoreMenuTabsSize = StoreMenu.listenTo(ActionMenu.tabsSize, this.tabsSize);
        this.listenStoreMenuTabsSize = StoreMenu.listenTo(ActionMenu.windowResize, this.windowResize);
    }

    tabsSize(height) {

        if (this.oldheight == height) { // make sure no constant render loop is triggered, do render only when height is actually changed
            return;
        }
        this.oldheight = height;

        if (this.refs.navbarHeader && window.innerHeight < ReactDOM.findDOMNode(this.refs.navbarHeader).offsetHeight + height + 41 && window.innerWidth > 767) {
            this.setState({
                height: window.innerHeight - (ReactDOM.findDOMNode(this.refs.navbarHeader).offsetHeight + 41),
                innerHeight: window.innerHeight
            });
        } else {
            this.setState({
                height: 'auto',
                innerHeight: window.innerHeight
            });
        }
    }

    windowResize(width, height) {
        if (this.state.innerHeight != window.innerHeight) {
            this.setState({
                innerHeight: window.innerHeight,
                height: (window.innerWidth > 767) ? window.innerHeight - (ReactDOM.findDOMNode(this.refs.navbarHeader).offsetHeight + 41) : 'auto'
            });
        }
    }

    componentWillUnmount() {
        this.listenStoreMenuToggle();
        this.listenStoreMenuSidebar();
        this.listenStoreMenuTabsSize();
    }

    toggleMenu(data) {
        this.setState({
            toggleMenu: data
        });
    }

    showSidebar(data) {
        this.setState({
            showSidebar: data
        });
    }

    toggleMenuByClick() {
        this.setState({
            toggleMenu: !CreateDomLeft.hasClass(React.findDOMNode(this.refs.toggleMenu), 'active')
        });
        ActionMenu.toggleMenu(!CreateDomLeft.hasClass(React.findDOMNode(this.refs.toggleMenu), 'active'), !CreateDomLeft.hasClass(React.findDOMNode(this.refs.toggleMenu), 'active'));
    }

    showSidebarByClick() {
        this.setState({
            showSidebar: !CreateDomLeft.hasClass(React.findDOMNode(this.refs.showSidebar), 'active')
        });

        ActionMenu.showSidebar(!CreateDomLeft.hasClass(React.findDOMNode(this.refs.showSidebar), 'active'));
        ActionMenu.toggleMenu(false);
    }

    static hasClass(el, selector) {
        var className = ' ' + selector + ' ';

        if ((' ' + el.className + ' ').replace(/[\n\t]/g, ' ').indexOf(className) > -1) {
            return true;
        } else {
            return false;
        }
    }


    render() {
        var classNameToggle = classNames({
                'btn btn-link btn-sm visible-xs collapsed': true,
                'active': this.state.toggleMenu
            }),
            classNameSidebar = classNames({
                'btn btn-link btn-sm visible-xs': true,
                'active': this.state.showSidebar
            });

        return (
            <div className="col-xs-12 col-sm-3 col-md-2">
                <div ref="navbar" className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu">
                    <div ref="navbarHeader" className="navbar-header tooltip-demo" id="topMenu 12">
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
                        <a title="" data-placement="right" data-toggle="tooltip" className="navbar-brand" href="//webrunes-contact.htm" data-original-title="Contact us"> </a>
                    </div>
                    <Plus themeImportUrl={themeImportUrl} height={this.state.height}/>
                </div>
            </div>
        );
    }
};

module.exports = CreateDomLeft;
