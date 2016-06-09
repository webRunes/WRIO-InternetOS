var React = require('react'),
    ReactDOM = require('react-dom'),
    Reflux = require('reflux'),
    classNames = require('classnames'),
    ActionMenu = require('../../widgets/Plus/actions/menu'),
    StoreMenu = require('../../widgets/Plus/stores/menu');


class CreateDomLeft extends React.Component {

    constructor(props) {
        super(props);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.showSidebar = this.showSidebar.bind(this);
        this.toggleMenuByClick = this.toggleMenuByClick.bind(this);
        this.showSidebarByClick = this.showSidebarByClick.bind(this);
        this.windowResize = this.windowResize.bind(this);
        this.state = {
            toggleMenu: false,
            showSidebar: false,
            height: 'auto'
        };
    }

    componentDidMount() {
        this.listenStoreMenuToggle = StoreMenu.listenTo(ActionMenu.toggleMenu, this.toggleMenu);
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.showSidebar);
        this.listenActionsResize = ActionMenu.windowResize.listen(this.windowResize);
    }


    componentWillUnmount() {
        this.listenStoreMenuToggle();
        this.listenStoreMenuSidebar();
        this.listenActionsResize();
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

    windowResize(width, height) {

        if (this.refs.navbarHeader && window.innerHeight < ReactDOM.findDOMNode(this.refs.navbarHeader).offsetHeight + height + 41 && window.innerWidth > 767) {
            var pht = window.innerHeight - (ReactDOM.findDOMNode(this.refs.navbarHeader).offsetHeight + 41);
            ActionMenu.leftHeight.trigger( pht + 'px');
        } else {
            ActionMenu.leftHeight.trigger('auto');
        }
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
        var header = this.getHeader(classNameToggle,classNameSidebar);
        return (
            <div className="col-xs-12 col-sm-3 col-md-2">
                <div ref="navbar" className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu">
                    {header}
                    {this.props.list}
                </div>
            </div>
        );
    }

    getHeader(classNameToggle,classNameSidebar) {
        return ( <div ref="navbarHeader" className="navbar-header tooltip-demo" id="topMenu 12">
            /*<ul className="nav menu pull-right">
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
            </ul>*/
            <a title="" data-placement="right" data-toggle="tooltip" className="navbar-brand" href="//wrioos.com" data-original-title="WRIO Internet OS"> </a>
        </div>);
    }
}

CreateDomLeft.propTypes = {
    list: React.PropTypes.any
};

module.exports = CreateDomLeft;
