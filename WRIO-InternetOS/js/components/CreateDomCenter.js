var domain = '';
if (process.env.DOMAIN === undefined) {
    domain = 'wrioos.com';
} else {
    domain = process.env.DOMAIN;
}
var React = require('react'),
    Reflux = require('reflux'),
    Login = require('../../../widgets/Login.jsx'),
    Details = require('../../../widgets/Details.jsx'),
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
    Alert = require('react-bootstrap').Alert,
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
        this.startIframeStyles = {
            width: '100%',
            height: '200px',
            border: 'none'
        };
        var locationSearch = this.UrlMixin.getUrlParams();
        this.state = {
            editMode: false,
            content: {
                type: (locationSearch) ? locationSearch : 'article'
            },
            active: false,
            userId: false,
            alertVisible: false,
            editAllowed: false,
            notDisplayCenter: false
        };
        this.onShowSidebar = this.onShowSidebar.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.hideAlertByClick = this.hideAlertByClick.bind(this);
    }

    getAuthorWrioID() {
        var data = this.props.data;
        for (var i in data) {
            if(data.hasOwnProperty(i)) {

                if (element.author) {
                    var id = element.author.match(/\?wr.io=([0-9]+)$/);
                    if (id) {
                        return id[1];
                    }
                }
            }
            var element = data[i];
        }
    }

    componentDidMount(){
        var that = this;
        this.listenStoreLd = StoreLd.listen((state) => {
            that.onStateChange(state);
        });
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);

        CenterActions.gotWrioID.listen( function(id) {
           console.log('Checking if editing allowed: ',id,that.getAuthorWrioID());
            if (id == that.getAuthorWrioID()) {
                that.setState({
                    editAllowed: true
                });
            }

        });

        window.addEventListener('message', function (e) {

            var httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                let jsmsg = JSON.parse(e.data);
                this.userId(jsmsg.profile.id);
                this.hideAlert();
            }

        }.bind(this));

    }

    onStateChange(state) {
        console.log('State:',state);
        this.setState(
            { data: state.data}
        );
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
            editMode: false,
            notDisplayCenter: false
        });
    }

    switchToEditMode (){
        this.setState({
            editMode: true
            notDisplayCenter: true
        });
    }

    userId (userId){
        this.setState({
            'userId': userId
        });
    }

    hideAlert (){
        if(localStorage && localStorage.getItem(this.state.userId + ' close alert')) {
            this.setState({
                'alertVisible': false
            });
        }else{
            this.setState({
                'alertVisible': true
            });
        }
    }

    hideAlertByClick (){
        localStorage.setItem(this.state.userId  + ' close alert', true);
        this.setState({
            'alertVisible': false
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
        var displayChess = '';
        var nocomments = false;

        var urlParams = this.UrlMixin.searchToObject();
        //var notDisplayCenter = false;

        if (urlParams.add_funds) {
            condition = false;
            displayWebgold = ( <iframe src={'//webgold.'+process.env.DOMAIN+'/add_funds'} style={ this.editIframeStyles }/>);
            this.state.notDisplayCenter=true;
        }

        if (urlParams.transactions) {
            condition = false;
            displayWebgold = ( <iframe src={'//webgold.'+process.env.DOMAIN+'/transactions'} style={ this.editIframeStyles }/>);
            this.state.notDisplayCenter=true;
        }

        if (urlParams.create) {
           condition = false;
           nocomments = true;
           this.state.notDisplayCenter=true;
            displayCore =  ( <iframe src={'//core.'+process.env.DOMAIN+'/create'} style={ this.editIframeStyles }/>);
        }

        if (urlParams.edit) {
            this.state.notDisplayCenter=true;
            displayCore =  ( <iframe src={'//core.'+process.env.DOMAIN+'/edit?article=' + window.location.host} style={ this.editIframeStyles }/>);
        }

        if (urlParams.start) {
            this.state.notDisplayCenter=true;
            displayChess =  ( <iframe src={'//chess.'+process.env.DOMAIN+'/start?uuid=' + urlParams.start} style={ this.startIframeStyles }/>);
        }

        var centerData;

        if (this.state.data && (type == 'cover' || type == 'Cover')) {
            centerData = this.state.data; // if we got some data from the store, let's diplay it in center component
        } else {
            centerData = this.props.data; // otherwise use default data provided in props
        }

        return (
            <div className={className} id="centerWrp">
                <div className="margin">
                    {!this.state.alertVisible || <Alert bsStyle="warning" onDismiss={this.hideAlertByClick}><strong>Внимание</strong> - эксперементальный проект, в стадии разработки. Заявленные функции будут подключаться по мере его развития.</Alert>}
                    <Login importUrl={importUrl} theme={theme} />
                    <CreateBreadcrumb
                        converter={this.props.converter}
                        editMode={ this.state.editMode }
                        onReadClick={ this.switchToReadMode.bind(this) }
                        onEditClick={ this.switchToEditMode.bind(this) }
                        editAllowed ={ this.state.editAllowed }
                        />
                    { this.state.editMode ? <iframe src={'//core.'+process.env.DOMAIN+'/edit?article=' + window.location.href} style={ this.editIframeStyles }/> : null }
                    { this.state.notDisplayCenter ? '' : <Center data={centerData} content={this.state.content} type={type} />}
                    { displayCore }
                    { displayWebgold }
                    { displayChess }
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
