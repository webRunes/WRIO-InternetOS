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
    UrlMixin = require('../mixins/UrlMixin'),
    CenterActions = require('../actions/center');


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
            active: false,
            editAllowed: false
        };
        this.onShowSidebar = this.onShowSidebar.bind(this);
    }


    getAuthorWrioID() {
        var data = this.props.data;
        for (var i in data) {
            var element = data[i];
            if (element.author) {
                var id = element.author.match(/\?wr.io=([0-9]+)$/);
                if (id) {
                    return id[1];
                }
            }
        }
    }

    componentDidMount(){
        this.listenStoreLd = StoreLd.listen(this.onStateChange);
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);

        var that = this;

        CenterActions.gotWrioID.listen( function(id) {
           console.log('Checking if editing allowed: ',id,that.getAuthorWrioID());
            if (id == that.getAuthorWrioID()) {
                that.setState({
                    editAllowed: true
                });
            }

        });
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


    render (){
        var type = this.UrlMixin.searchToObject().list,
            condition = type === 'Cover' || this.state.content.type === 'external' || typeof type !== 'undefined',
            className = classNames({
                'col-xs-12 col-sm-5 col-md-7 content content-offcanvas' : true,
                'active': this.state.active
            });

        var displayCore = '';
        var displayWebgold = '';
        var nocomments = false;

        var notDisplayCenter = false;
        switch (window.location.search) {
            case '?create':
                condition = false;
                nocomments = true;
                notDisplayCenter=true;
                break;
            case '?add_funds':
                condition = false;
                displayWebgold = ( <iframe src={'//webgold.'+process.env.DOMAIN+'/add_funds'} style={ this.editIframeStyles }/>);
                notDisplayCenter=true;
                break;
            case '?edit':
                notDisplayCenter=true;
                displayCore =  ( <iframe src={'http://core.'+process.env.DOMAIN+'/?edit=' + notDisplayCenter.href} style={ this.editIframeStyles }/>);
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
                        onEditClick={ this.switchToEditMode.bind(this) }
                        editAllowed ={ this.state.editAllowed }
                        />
                    { this.state.editMode ? <iframe src={'http://core.'+process.env.DOMAIN+'/?edit=' + window.location.href} style={ this.editIframeStyles }/> : null }
                    { notDisplayCenter ? '' : <Center data={this.props.data} content={this.state.content} type={type} />}
                    { displayCore }
                    { displayWebgold }
                    <div style={{display: condition ? 'none' : 'block'}}>
                        <CreateTitter scripts={this.props.data} nocomments={ nocomments }/>
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