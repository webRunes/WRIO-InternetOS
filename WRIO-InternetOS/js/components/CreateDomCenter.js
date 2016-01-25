import {getServiceUrl,getDomain} from '../servicelocator.js';

var domain = getDomain();

var React = require('react'),
    Reflux = require('reflux'),
    Login = require('../../../widgets/Login.jsx'),
    Chess = require('../../../widgets/Chess.jsx'),
    Details = require('../../../widgets/Details.jsx'),
    importUrl = require('../global').importUrl,
    theme = require('../global').theme,
    CreateBreadcrumb = require('./CreateBreadcrumb'),
    CreateTitter = require('../../../widgets/titter.jsx'),
    Center = require('./Center'),
    StoreLd = require('../store/center'),
    classNames = require('classnames'),
    ActionMenu = require('../../../widgets/Plus/actions/menu'),
    StoreMenu = require('../../../widgets/Plus/stores/menu'),
    UrlMixin = require('../mixins/UrlMixin'),
    Alert = require('react-bootstrap').Alert,
    CreateTransactions = require('../../../widgets/transactions.jsx'),
    CenterActions = require('../actions/center'),
    PlusStore = require('../../../widgets/Plus/stores/jsonld');

class CreateDomCenter extends React.Component {

    constructor(props) {
        super(props);
        this.UrlMixin = UrlMixin;
        this.editIframeStyles = {
            width: '100%',
            border: 'none'
        };
        this.startIframeStyles = {
            width: '100%',
            border: 'none'
        };
        var locationSearch = this.UrlMixin.getUrlParams();
        this.state = {
            editMode: false,
            actionButton: false,
            content: {
                type: (locationSearch) ? locationSearch : 'article'
            },
            nocomments: false,
            titterDisabled: false,
            active: false,
            userId: false,
            alertWarning: false,
            alertWelcome: true,
            editAllowed: false,
            notDisplayCenter: false,
            byButton: false,
            editModeFromUrl: false,
            transactionsModeFromUrl: false,
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
        if (this.state.urlParams.edit && this.state.urlParams.edit !== 'undefined') {
            var url = this.formatUrl(this.state.urlParams.edit);
            StoreLd.getHttp(url,(article) => {
                article = article.filter((json) => json['@type'] == 'Article')[0];
                var id = article['author'].match(/\?wr.io=([0-9]+)$/);
                cb(id ? id[1] : undefined);
            });
        } else {
            var data = this.props.data;
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    var element = data[i];
                    if (element && element.author) {
                        var id = element.author.match(/\?wr.io=([0-9]+)$/);
                        cb(id ? id[1] : undefined);
                    }
                }
            }
        }
    }

    componentWillMount() {
        CenterActions.gotWrioID.listen((id) => {
            this.getAuthorWrioID((authorId) => {
                console.log('Checking if editing allowed: ', id, authorId);
                if (id == authorId) {
                    this.setState({
                        editAllowed: true
                    });
                }
            });
        });
        CenterActions.switchToEditMode.listen((data) => {
            if (data.editMode) {
                this.switchToEditMode();
            }
        });
    }

    componentDidMount() {
        var that = this;
        this.listenStoreLd = StoreLd.listen((state) => {
            that.onStateChange(state);
        });
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);

        window.addEventListener('message', (e) => {

            var httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                let jsmsg = JSON.parse(e.data);
                if (jsmsg.profile) {
                    this.userId(jsmsg.profile.id);
                }
                PlusStore.hideAlertWarning(this.state.userId, this.hideAlertWarning);
                PlusStore.hideAlertWelcome(this.state.userId, this.hideAlertWelcome);
            }

        });
    }

    onStateChange(state) {
        this.setState({
            data: state.data
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

    onStatusChange(x) {
        this.setState({
            content: x
        });
    }

    redirectFromEditMode() {
        window.location.replace(this.formatUrl(this.state.urlParams.edit) + '?edit');
    }

    switchToReadMode() {
        this.setState({
            editMode: false,
            editModeFromUrl: false,
            notDisplayCenter: false,
            byButton: true,
            condition: false
        });
    }

    switchToEditMode() {
        this.setState({
            editMode: true,
            notDisplayCenter: true,
            byButton: true,
            condition: true
        });
    }

    switchToTransactionsMode() {
        this.setState({
            editMode: false,
            byButton: true,
            transactionsMode: true,
            actionButton: "Transactions",
            condition: true,
            notDisplayCenter: true
        });
    }

    userId(userId) {
        this.setState({
            'userId': userId
        });
    }

    hideAlertWelcome (result){
        this.setState({
            'alertWelcome': result
        });
    }

    hideAlertWarning (result){
        this.setState({
            'alertWarning': result
        });
    }

    hideAlertWarningByClick (){
        PlusStore.hideAlertWarningByClick(this.state.userId);
        this.setState({
            'alertWarning': true
        });
    }

    hideAlertWelcomeByClick (){
        PlusStore.hideAlertWelcomeByClick(this.state.userId);
        this.setState({
            'alertWelcome': true
        });
    }

    render() {
        var type = this.UrlMixin.searchToObject().list,
            condition = type === 'Cover' || this.state.content.type === 'external' || typeof type !== 'undefined',
            className = classNames({
                'col-xs-12 col-sm-5 col-md-7 content content-offcanvas': true,
                'active': this.state.active
            });

        var displayCore = '';
        var displayWebgold = '';
        var displayChess = '';
        var nocomments = false;

        //var urlParams = this.UrlMixin.searchToObject();
        //var notDisplayCenter = false;
        if (!this.state.byButton) {
            if (this.state.urlParams.add_funds) {
                condition = true;
                displayWebgold = (<iframe src={'//webgold.'+process.env.DOMAIN+'/add_funds'} style={ this.editIframeStyles }/>);
                this.state.notDisplayCenter = true;
            }

            if (this.state.urlParams.transactions) {
                condition = true;
                this.state.actionButton = "Transactions";
                this.state.transactionsModeFromUrl = true;
                displayWebgold = (
                    <CreateTransactions />
                );
                this.state.notDisplayCenter = true;
            }

            if (this.state.urlParams.create) {
                condition = true;
                this.state.notDisplayCenter = true;
                displayCore = (<iframe src={'//core.'+process.env.DOMAIN+'/create'} style={ this.editIframeStyles }/>);
            }

            if (this.state.urlParams.edit && this.state.editAllowed) {
                condition = true;
                this.state.editModeFromUrl = true;
                this.state.editMode = true;
                this.state.notDisplayCenter = true;
                displayCore = (<iframe src={'//core.'+process.env.DOMAIN+'/edit?article=' + (this.state.urlParams.edit === 'undefined' ? window.location.host : this.state.urlParams.edit)} style={ this.editIframeStyles }/>);
            }

            if (this.state.urlParams.start && (window.location.origin === getServiceUrl('chess'))) {
                condition = true;
                this.state.notDisplayCenter = true;
                this.state.actionButton = "Start";
                displayChess = (<Chess uuid={this.state.urlParams.start}/>);
            }
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
                    {this.state.alertWelcome || <Alert bsStyle="warning" className="callout" onDismiss={this.hideAlertWelcomeByClick}>
                        <h5>First time here?</h5><br/><p>Pay attention to the icon above <span className="glyphicon glyphicon-transfer"></span>. Click it to open a side menu</p>
                    </Alert>}
                    {this.state.alertWarning || <Alert bsStyle="warning" onDismiss={this.hideAlertWarningByClick}>
                        <strong>Внимание</strong> - эксперементальный проект, в стадии разработки. Заявленные функции будут подключаться по мере его развития.
                    </Alert>}
                    <Login importUrl={importUrl} theme={theme} />
                    <CreateBreadcrumb
                        converter={this.props.converter}
                        editMode={ this.state.editMode }
                        actionButton={ this.state.actionButton }
                        onReadClick={ this.state.urlParams.edit && this.state.urlParams.edit !== 'undefined' ? this.redirectFromEditMode.bind(this) : this.switchToReadMode.bind(this) }
                        onEditClick={ this.switchToEditMode.bind(this) }
                        onTransactionsClick={ this.switchToTransactionsMode.bind(this) }
                        editAllowed ={ this.state.editAllowed }/>
                    { (this.state.editMode && !this.state.editModeFromUrl) ? <iframe src={'//core.'+process.env.DOMAIN+'/edit?article=' + window.location.href} style={ this.editIframeStyles }/> : null }
                    { (this.state.transactionsMode && !this.state.transactionsModeFromUrl) ? <CreateTransactions /> : null }
                    { this.state.notDisplayCenter ? '' : <Center data={centerData} content={this.state.content} type={type} />}
                    { displayCore }
                    { displayWebgold }
                    { displayChess }
                    <div style={{display: condition || this.state.condition ? 'none' : 'block'}}>
                        <CreateTitter scripts={this.props.data} nocomments={ this.state.nocomments }/>
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
