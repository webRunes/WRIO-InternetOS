var React = require('react'),
    Reflux = require('reflux'),
    Login = require('../../../widgets/login.jsx'),
    importUrl = require('../global').importUrl,
    theme = require('../global').theme,
    CreateBreadcrumb = require('./CreateBreadcrumb'),
    CreateTitter = require('../../../widgets/titter.jsx'),
    Center = require('./Center'),
    StoreLd = require('../store/center'),
    classNames = require('classnames'),
    ActionMenu = require('plus/js/actions/menu'),
    StoreMenu = require('plus/js/stores/menu'),
    UrlMixin = require('../mixins/UrlMixin');

class CreateDomCenter extends React.Component{

    constructor(props){
        super(props);
        this.UrlMixin = UrlMixin;
        this.editIframeStyles = {
            width: '100%',
            height: '700px',
            border: 'none'
        };
        var locationSearch = this.UrlMixin.getUrlParams();
        this.state = {
            editMode: false,
            content: {
                type: (locationSearch) ? locationSearch : 'article'
            },
            active: false
        };
        this.onShowSidebar = this.onShowSidebar.bind(this);
    }

    componentDidMount(){
        this.listenStoreLd = StoreLd.listen(this.onStateChange);
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);
    }

    onShowSidebar(data) {
        this.setState({
            active: data
        });
    }

    componentWillUnmount() {
        this.listenStoreLd();
        this.listenStoreMenuSidebar();
    }

    onStatusChange (x) {
        this.setState({
            content: x
        });
    }

    switchToReadMode () {
        this.setState({
            editMode: false
        });
    }

    switchToEditMode (){
        this.setState({
            editMode: true
        });
    }

    checkLocation () {
        if (window.location.search != '') {
            return true;
        } else {
            return false;
        }
    }

    render (){
        var type = this.UrlMixin.searchToObject().list,
            condition = type === 'Cover' || this.state.content.type === 'external' || typeof type !== 'undefined',
            className = classNames({
                'col-xs-12 col-sm-5 col-md-7 content content-offcanvas' : true,
                'active': this.state.active
            });

        var displayCore = '';
        var displayWebgold = '';

        var location = this.checkLocation();
        switch (window.location.search) {
            case '?create':
                condition = false;
                break;
            case '?add_funds':
                condition = false;
                displayWebgold = ( <iframe src={'//webgold.'+process.env.DOMAIN+'/add_funds'} style={ this.editIframeStyles }/>);
                break;
            case '?edit':
                displayCore =  ( <iframe src={'http://core.'+process.env.DOMAIN+'/?edit=' + location.href} style={ this.editIframeStyles }/>);
                break;
            default:
        }


        return (
            <div className={className} id="centerWrp">
                <div className="margin">
                    <Login importUrl={importUrl} theme={theme} />
                    <CreateBreadcrumb
                        converter={this.props.converter}
                        editMode={ this.state.editMode }
                        onReadClick={ this.switchToReadMode.bind(this) }
                        onEditClick={ this.switchToEditMode.bind(this) } />
                    { this.state.editMode ? <iframe src={'http://core.'+process.env.DOMAIN+'/?edit=' + window.location.href} style={ this.editIframeStyles }/> : null }
                    { location ? '' : <Center data={this.props.data} content={this.state.content} type={type} />}
                    { displayCore }
                    { displayWebgold }
                    <div style={{display: condition ? 'none' : 'block'}}>
                        <CreateTitter scripts={this.props.data} />
                    </div>
                </div>
            </div>
        );
    }
}

CreateDomCenter.propTypes = {
    data: React.PropTypes.array.isRequired,
    converter: React.PropTypes.object.isRequired
};

module.exports = CreateDomCenter;