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
            alertWarning: false,
            alertWelcome: false,
            editAllowed: false,
            notDisplayCenter: false,
            fromRead: false,
            editModeFromUrl: false,
            urlParams: this.UrlMixin.searchToObject()
        };
        this.onShowSidebar = this.onShowSidebar.bind(this);
        this.hideAlertWarning = this.hideAlertWarning.bind(this);
        this.hideAlertWelcome = this.hideAlertWelcome.bind(this);
        this.hideAlertWarningByClick = this.hideAlertWarningByClick.bind(this);
        this.hideAlertWelcomeByClick = this.hideAlertWelcomeByClick.bind(this);
    }

    formatUrl(url) {
        var splittedUrl = url.split('://');
        var host;
        var path;
        if (splittedUrl.length == 2) {
            host = splittedUrl[0];
            path = splittedUrl[1];
        } else {
            host = 'http';
            path = url;
        }

        var splittedPath = path.split('/');
        var lastNode = splittedPath[splittedPath.length - 1];
        if (splittedPath.length > 1 && lastNode) {
            if (!endsWith(lastNode, '.htm') && !endsWith(lastNode, '.html')) {
                path += '/';
            }
        } else if (splittedPath.length == 1) {
            path += '/';
        }
        var resultUrl = host + '://' + path;

        return resultUrl;
    }

    getAuthorWrioID(cb) {
        if (this.state.urlParams.edit && this.state.urlParams.edit !== "undefined") {
            var url = this.formatUrl(this.state.urlParams.edit);
            StoreLd.getHttp(url,(article) => {
                article = article.filter((json) => json['@type'] == 'Article')[0];
                var id = article['author'].match(/\?wr.io=([0-9]+)$/);
                cb(id ? id[1] : undefined);
            });
        } else {
            var data = this.props.data;
            for (var i in data) {
                var element = data[i];
                if (element && element.author) {
                    var id = element.author.match(/\?wr.io=([0-9]+)$/);
                    cb(id ? id[1] : undefined);
                }
            }
        }
    }

    componentDidMount(){
        var that = this;
        this.listenStoreLd = StoreLd.listen((state) => {
            that.onStateChange(state);
        });
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);

        CenterActions.gotWrioID.listen( function(id) {
            that.getAuthorWrioID(function(authorId) {
                console.log('Checking if editing allowed: ', id, authorId);
                if (id == authorId) {
                    that.setState({
                        editAllowed: true
                    });
                }
            });

        });

        window.addEventListener('message', function (e) {

            var httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                let jsmsg = JSON.parse(e.data);
                if (jsmsg.profile) this.userId(jsmsg.profile.id);

                localStorage.setItem(this.state.userId  + ' close welcome alert', false);
                localStorage.setItem(this.state.userId  + ' close warning alert', false);

                this.hideAlertWarning();
                this.hideAlertWelcome();
            }

        }.bind(this));

    }

    onStateChange(state) {
        //console.log('State:',state);
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

    redirectFromEditMode () {
        window.location.replace(this.formatUrl(this.state.urlParams.edit) + '?edit');
    }

    switchToReadMode () {
        this.setState({
            editMode: false,
            editModeFromUrl: false,
            notDisplayCenter: false,
            fromRead: true
        });
    }

    switchToEditMode () {
        this.setState({
            editMode: true,
            notDisplayCenter: true,
            fromRead: false
        });
    }

    userId (userId){
        this.setState({
            'userId': userId
        });
    }

    hideAlertWelcome (){
        if(localStorage && !localStorage.getItem(this.state.userId + ' close welcome alert')) {
            this.setState({
                'alertWelcome': false
            });
        }else{
            this.setState({
                'alertWelcome': true
            });
        }
    }
    hideAlertWelcomeByClick (){
        localStorage.setItem(this.state.userId  + ' close welcome alert', false);
        this.setState({
            'alertWelcome': false
        });
    }

    hideAlertWarning (){
        if(localStorage && !localStorage.getItem(this.state.userId + ' close warning alert')) {
            this.setState({
                'alertWarning': false
            });
        }else{
            this.setState({
                'alertWarning': true
            });
        }
    }
    hideAlertWarningByClick (){
        this.setState({
            'alertWarning': false
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

        //var urlParams = this.UrlMixin.searchToObject();
        //var notDisplayCenter = false;

        if (this.state.urlParams.add_funds) {
            condition = false;
            displayWebgold = ( <iframe src={'//webgold.'+process.env.DOMAIN+'/add_funds'} style={ this.editIframeStyles }/>);
            this.state.notDisplayCenter=true;
        }

        if (this.state.urlParams.transactions) {
            condition = false;
            displayWebgold = (
                <CreateTransactions />
            );
            this.state.notDisplayCenter=true;
        }

        if (this.state.urlParams.create) {
           condition = false;
           nocomments = true;
           this.state.notDisplayCenter=true;
            displayCore =  ( <iframe src={'//core.'+process.env.DOMAIN+'/create'} style={ this.editIframeStyles }/>);
        }

        if (this.state.urlParams.edit && this.state.editAllowed) {
            if (!this.state.fromRead) {
                condition = false;
                this.state.editModeFromUrl = true;
                this.state.editMode = true;
                this.state.notDisplayCenter=true;
                displayCore =  ( <iframe src={'//core.'+process.env.DOMAIN+'/edit?article=' + (this.state.urlParams.edit === "undefined" ? window.location.host : this.state.urlParams.edit)} style={ this.editIframeStyles }/>);
            }
        }

        if (this.state.urlParams.start) {
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
                    {!this.state.alertWelcome || <Alert bsStyle="warning" className="callout" onDismiss={this.hideAlertWelcomeByClick}>
                        <h5>First time here?</h5><br/><p>Pay attention to the icon above <span className="glyphicon glyphicon-transfer"></span>. Click it to open a side menu</p>
                    </Alert>}
                    {!this.state.alertWarning || <Alert bsStyle="warning" onDismiss={this.hideAlertWarningByClick}>
                        <strong>Внимание</strong> - эксперементальный проект, в стадии разработки. Заявленные функции будут подключаться по мере его развития.
                    </Alert>}
                    <Login importUrl={importUrl} theme={theme} />
                    <CreateBreadcrumb
                        converter={this.props.converter}
                        editMode={ this.state.editMode }
                        onReadClick={ this.state.urlParams.edit && this.state.urlParams.edit !== "undefined" ? this.redirectFromEditMode.bind(this) : this.switchToReadMode.bind(this) }
                        onEditClick={ this.switchToEditMode.bind(this) }
                        editAllowed ={ this.state.editAllowed }
                        />
                    { (this.state.editMode && !this.state.editModeFromUrl) ? <iframe src={'http://core.'+process.env.DOMAIN+'/edit?article=' + window.location.href} style={ this.editIframeStyles }/> : null }
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
