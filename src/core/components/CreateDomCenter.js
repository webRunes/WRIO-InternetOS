import {getServiceUrl,getDomain} from '../servicelocator.js';
import React from 'react';
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
import UrlMixin from '../mixins/UrlMixin';
import CreateTransactions from '../../widgets/Transactions.js';
import CreatePresale from '../../widgets/Presale.js';
import WindowActions from '../actions/WindowActions.js';
import {AlertWelcome, AlertWarning} from './Alerts.js';
import UserStore from '../store/UserStore.js';
import WrioDocument from '../store/WrioDocument.js';
import UIActions from '../actions/UI.js';
import CommentsDisabled from './misc/CommentsDisabled.js';

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

    isEditingRemotePage() {
        return this.state.urlParams.edit && this.state.urlParams.edit !== 'undefined';
    }

    getAuthor(cb) {
        if (this.isEditingRemotePage()) {
            var url = this.formatUrl(this.state.urlParams.edit);
            getHttp(url,(article) => {
                article = article.filter((json) => json['@type'] == 'Article')[0];
                var author = article['author'];
                cb(author);
            });
        } else {
            let author = WrioDocument.getJsonLDProperty('author');
            if (author) {
                cb(author);
            }
        }
    }

}

ArticleCenter.propTypes = {

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
        this.setState({editMode: false});
    }

    switchToEditMode() {
        this.setState({editMode: true});
    }

    userId(userId) {
        this.setState({userId});
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
        const showArticle = this.isArticleShown();
        const displayTitterStyle = (WrioDocument.hasArticle() && showArticle) ? {display:"block"} : {display:"none"}; // make sure titter is hidden for covers and lists

        if ((this.state.urlParams.edit && this.state.editAllowed) ||  this.state.editMode) {
            let coreFrame = <Core article={this.getEditUrl()}/>;
            return this.generateCenterWithContents(coreFrame);
        }

        const commentsDisabledFrame = showArticle &&  <CommentsDisabled isAuthor={this.state.editAllowed}/>;
        const contents = (<div>
          <WrioDocumentBody/>
          { !WrioDocument.hasCommentId() ?
                                commentsDisabledFrame :
                                  <div style={displayTitterStyle}>
                                    {this.state.userId && <CreateTitter scripts={WrioDocument.getData()} wrioID={this.state.userId}/> }
                                  </div> }
        </div>);

        return this.generateCenterWithContents(contents);
    }

    generateCenterWithContents(contents) {

        var className = classNames({
            '': true,
            'active': this.state.active
        });

        return (
          <div>
            <div className={className} id="centerWrp">
              <AlertWelcome />
              <AlertWarning />
              <Login />
              <CreateBreadcrumb
                converter={this.props.converter}
                editMode={ this.state.editMode }
                actionButton={ this.state.actionButton }
                onReadClick={ this.state.urlParams.edit && this.state.urlParams.edit !== 'undefined' ? this.redirectFromEditMode.bind(this) : this.switchToReadMode.bind(this) }
                onEditClick={ this.switchToEditMode.bind(this) }
                editAllowed ={ this.state.editAllowed }/>
              {contents}
            </div>
          </div>
        );
    }

}

CreateDomCenter.propTypes = {

};


export class TransactionsCenter extends CreateDomCenter {
    render() {
       // this.state.actionButton = "Transactions";
        this.state.transactionsModeFromUrl = true;
        return this.generateCenterWithContents (<CreateTransactions />);

    }
}


export class PresaleCenter extends CreateDomCenter {
    render() {
        // this.state.actionButton = "Transactions";
        this.state.transactionsModeFromUrl = true;
        return this.generateCenterWithContents (<CreatePresale />);

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
