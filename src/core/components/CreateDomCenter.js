import {getServiceUrl,getDomain} from '../servicelocator.js';
import React from 'react';
import Reflux from 'reflux';
import Login from '../../widgets/Login.js';
import Chess from '../../widgets/Chess.js';
import Core from '../../widgets/Core.js';
import Details from '../../widgets/Details.js';
import {importUrl} from '../global';
import {theme} from '../global';
import CreateBreadcrumb from './CreateBreadcrumb';
import CreateTitter from '../../widgets/Titter.js';
import WrioDocumentBody from './WrioDocumentBody.js';
import getHttp from '../store/request.js';
import classNames from 'classnames';
import ActionMenu from '../../widgets/Plus/actions/menu';
import StoreMenu from '../../widgets/Plus/stores/menu';
import UrlMixin from '../mixins/UrlMixin';
import CreateTransactions from '../../widgets/Transactions.js';
import PlusStore from '../../widgets/Plus/stores/PlusStore.js';
import WindowActions from '../actions/WindowActions.js';
import {AlertWelcome, AlertWarning} from './Alerts.js';
import UserStore from '../store/UserStore.js';
import WrioDocument from '../store/WrioDocument.js';
import UIActions from '../actions/UI.js';

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

    editAllowed() {
        return this.state.urlParams.edit && this.state.urlParams.edit !== 'undefined';
    }


    getAuthorWrioID(cb) {
        if (this.editAllowed()) {
            var url = this.formatUrl(this.state.urlParams.edit);
            getHttp(url,(article) => {
                article = article.filter((json) => json['@type'] == 'Article')[0];
                var id = article['author'].match(/\?wr.io=([0-9]+)$/);
                cb(id ? id[1] : undefined);
            });
        } else {
            var data = WrioDocument.getData();
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
        if (this.editAllowed()) {
            var url = this.formatUrl(this.state.urlParams.edit);
            getHttp(url,(article) => {
                article = article.filter((json) => json['@type'] == 'Article')[0];
                var author = article['author'];
                cb(author);
            });
        } else {
            var data = WrioDocument.getData();
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
        this.state = {
            editMode: false,
            actionButton: false,
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

    }


    allowEdit() {
        console.log("Editing is allowed");
        this.setState({
            editAllowed: true
        });
    }

    componentWillMount() {
        UIActions.gotProfileUrl.listen((profileUrl) => {
            this.getAuthor((_author) => {
                console.log('Checking if editing allowed: ', profileUrl, _author);
                if (UrlMixin.compareProfileUrls(profileUrl,_author)) {
                    this.allowEdit();
                } else {
                    var url = WrioDocument.getUrl();
                    var exp = new RegExp(profileUrl,"g");
                    if (url.match(exp)) {
                        this.allowEdit();
                    }
                }
            });
        });
        UIActions.switchToEditMode.listen((data) => {
            if (data.editMode) {
                this.switchToEditMode();
            }
        });
    }

    componentDidMount() {
        var that = this;

        WindowActions.loginMessage.listen((msg)=> {
            if (msg.profile) {
                this.userId(msg.profile.id);
            }
        });

    }


    componentWillUnmount() {

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


    userId(userId) {
        this.setState({
            'userId': userId
        });
    }

    isArticleShown() {
        var search =  UrlMixin.searchToObject();
        if (search) {
            if (search.list || search.cover) {
                return false;
            }
        }
        return true;
    }

    getEditUrl() {
        var condition = this.state.urlParams.edit === 'undefined' ||  this.state.urlParams.edit == undefined;
        return condition ? window.location.href : this.state.urlParams.edit;
    }

    render() {
        var displayTitterCondition = WrioDocument.hasArticle();
        var displayCore = '';

        if (!this.isArticleShown()) {
            displayTitterCondition = false;
        }

        if (!this.state.byButton) {

            if (this.state.urlParams.edit && this.state.editAllowed) {
                displayTitterCondition = true;
                this.state.editModeFromUrl = true;
                this.state.editMode = true;
                this.state.notDisplayCenter = true;
                displayCore = (<Core article={this.getEditUrl()}/>);
            }

        }


        displayTitterCondition |= this.state.displayTitterCondition;

        var ArticleContent = this.getCenter();
        var data = WrioDocument.getData();
        var contents = (<div>
                            {ArticleContent}
                            { displayCore }
                            <div style={{display: displayTitterCondition ? 'block' : 'none'}}>
                                <CreateTitter scripts={data} />
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
                    <Login />
                    <CreateBreadcrumb
                        converter={this.props.converter}
                        editMode={ this.state.editMode }
                        actionButton={ this.state.actionButton }
                        onReadClick={ this.state.urlParams.edit && this.state.urlParams.edit !== 'undefined' ? this.redirectFromEditMode.bind(this) : this.switchToReadMode.bind(this) }
                        onEditClick={ this.switchToEditMode.bind(this) }
                        editAllowed ={ this.state.editAllowed }/>
                    { (this.state.editMode && !this.state.editModeFromUrl) ?
                        <Core article={this.getEditUrl()}/>
                        : null }
                    {contents}
                </div>
            </div>
        );
    }

    getCenter() {

        if (this.state.notDisplayCenter) {
            return false;
        }
        return  (<WrioDocumentBody/>);
    }
}

CreateDomCenter.propTypes = {
    converter: React.PropTypes.object.isRequired
};


export class TransactionsCenter extends CreateDomCenter {
    render() {
       // this.state.actionButton = "Transactions";
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

