import {getServiceUrl,getDomain} from '../servicelocator.js';
import React from 'react';
import Reflux from 'reflux';
import Login from '../../widgets/Login.jsx';
import Chess from '../../widgets/Chess.jsx';
import Core from '../../widgets/Core.jsx';
import Details from '../../widgets/Details.jsx';
import {importUrl} from '../global';
import {theme} from '../global';
import CreateBreadcrumb from './CreateBreadcrumb';
import CreateTitter from '../../widgets/titter.jsx';
import CenterContent from './CenterContent';
import StoreLd from '../store/center';
import classNames from 'classnames';
import ActionMenu from '../../widgets/Plus/actions/menu';
import StoreMenu from '../../widgets/Plus/stores/menu';
import UrlMixin from '../mixins/UrlMixin';
import CreateTransactions from '../../widgets/transactions.jsx';
import CenterActions from '../actions/center';
import PlusStore from '../../widgets/Plus/stores/PlusStore.js';
import WindowActions from '../actions/WindowActions.js';
import {AlertWelcome, AlertWarning} from './Alerts.js';
import UserStore from '../store/UserStore.js';

var domain = getDomain();

class ArticleCenter  extends React.Component {
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

    getAuthor(cb) {
        if (this.state.urlParams.edit && this.state.urlParams.edit !== 'undefined') {
            var url = this.formatUrl(this.state.urlParams.edit);
            StoreLd.getHttp(url,(article) => {
                article = article.filter((json) => json['@type'] == 'Article')[0];
                var author = article['author'];
                cb(author);
            });
        } else {
            var data = this.props.data;
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    var element = data[i];
                    if (element && element.author) {
                        var author = element.author;
                        cb(author);
                    }
                }
            }
        }
    }

}

ArticleCenter.propTypes = {
    data: React.PropTypes.array.isRequired,
    converter: React.PropTypes.object.isRequired
};



export class CreateDomCenter extends ArticleCenter {

    constructor(props) {
        super(props);
        this.editIframeStyles = {
            width: '100%',
            border: 'none'
        };
        this.startIframeStyles = {
            width: '100%',
            border: 'none'
        };
        var locationSearch = UrlMixin.getUrlParams();
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
            editAllowed: false,
            notDisplayCenter: false,
            byButton: false,
            editModeFromUrl: false,
            transactionsModeFromUrl: false,
            urlParams: UrlMixin.searchToObject()
        };
        this.onShowSidebar = this.onShowSidebar.bind(this);

    }


    componentWillMount() {
        CenterActions.gotAuthor.listen((author) => {
            this.getAuthor((_author) => {
                console.log('Checking if editing allowed: ', author, _author);
                if (UrlMixin.fixUrlProtocol(author) == UrlMixin.fixUrlProtocol(_author)) {
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

        WindowActions.loginMessage.listen((msg)=> {
            if (msg.profile) {
                this.userId(msg.profile.id);
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
      //  this.listenStoreMenuSidebar();
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
            displayTitterCondition: false
        });
    }

    switchToEditMode() {
        this.setState({
            editMode: true,
            notDisplayCenter: true,
            byButton: true,
            displayTitterCondition: true
        });
    }

    switchToTransactionsMode() {
        this.setState({
            editMode: false,
            byButton: true,
            transactionsMode: true,
            actionButton: "Transactions",
            displayTitterCondition: true,
            notDisplayCenter: true
        });
    }

    userId(userId) {
        this.setState({
            'userId': userId
        });
    }



    render() {
        var type = UrlMixin.searchToObject().list,
            displayTitterCondition = type === 'Cover' || this.state.content.type === 'external' || typeof type !== 'undefined';


        this.props.data.forEach((e) => {
            displayTitterCondition = e['@type'] !== 'Article';
        });

        var displayCore = '';


        if (!this.state.byButton) {

            if (this.state.urlParams.edit && this.state.editAllowed) {
                displayTitterCondition = true;
                this.state.editModeFromUrl = true;
                this.state.editMode = true;
                this.state.notDisplayCenter = true;
                displayCore = (<Core article={(this.state.urlParams.edit === 'undefined' ? window.location.host : this.state.urlParams.edit)}/>);
            }

        }


        displayTitterCondition |= this.state.displayTitterCondition;

        var ArticleContent = this.getCenter();
        var contents = (<div>
                            {ArticleContent}
                            { displayCore }
                            <div style={{display: displayTitterCondition ? 'block' : 'none'}}>
                                <CreateTitter scripts={this.props.data} nocomments={ this.state.nocomments }/>
                            </div>
                        </div>);


        return this.generateCenterWithContents(contents);
    }

    generateCenterWithContents(contents) {

        var className = classNames({
            'col-xs-12 col-sm-5 col-md-7 content content-offcanvas': true,
            'active': this.state.active
        });

        return (
            <div className={className} id="centerWrp">
                <div className="margin">
                    <AlertWelcome  />
                    <AlertWarning  />
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
                    {contents}
                </div>
            </div>
        );
    }

    getCenter() {
        var type = UrlMixin.searchToObject().list;
        var centerData;

        if (this.state.data && (type == 'cover' || type == 'Cover')) {
            centerData = this.state.data; // if we got some data from the store, let's diplay it in center component
        } else {
            centerData = this.props.data; // otherwise use default data provided in props
        }
        if (this.state.notDisplayCenter) {
            return false;
        }
        return  (<CenterContent data={centerData} content={this.state.content} type={type} />);
    }
}

CreateDomCenter.propTypes = {
    data: React.PropTypes.array.isRequired,
    converter: React.PropTypes.object.isRequired
};


export class TransactionsCenter extends CreateDomCenter {
    render() {
        this.state.actionButton = "Transactions";
        this.state.transactionsModeFromUrl = true;
        return this.generateCenterWithContents (<CreateTransactions />);

    }
}

export class ChessCenter extends CreateDomCenter {
    render() {
        this.state.actionButton = "Start";
        return this.generateCenterWithContents (<Chess uuid={this.state.urlParams.start}/>);

    }
}


export class CoreCreateCenter extends CreateDomCenter {
    render() {

        return this.generateCenterWithContents (<Core />);

    }
}

export class WebGoldCenter extends CreateDomCenter {
    render() {
        this.state.actionButton = "Start";
        var wg = (<iframe src={getServiceUrl('webgold')+'/add_funds'} style={ this.editIframeStyles }/>);
        return this.generateCenterWithContents (wg);

    }
}

