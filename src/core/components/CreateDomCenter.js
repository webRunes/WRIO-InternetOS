

import {getServiceUrl,getDomain} from '../servicelocator.js';
import React from 'react';
import Login from '../../widgets/Login.js';
import Chess from '../../widgets/Chess.js';
import Core from '../../widgets/Core.js';
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
import UIActions from '../actions/UI.js';
import CommentsDisabled from './misc/CommentsDisabled.js';
import LdJsonDocument from '../jsonld/LdJsonDocument';


var domain = getDomain();



export class CreateDomCenter extends React.Component {

    propTypes: {
        data : LdJsonDocument,
        url : string
    };

    constructor(props) {
        super(props);

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
        const document = this.props.data;
        const showArticle = this.isArticleShown();
        const displayTitterStyle = (document.hasArticle() && showArticle) ? {display:"block"} : {display:"none"}; // make sure titter is hidden for covers and lists

        if ((this.state.urlParams.edit && this.state.editAllowed) ||  this.state.editMode) {
            let coreFrame = <Core article={this.getEditUrl()}/>;
            return this.generateCenterWithContents(coreFrame);
        }

        const commentsDisabledFrame = showArticle &&  <CommentsDisabled isAuthor={this.state.editAllowed}/>;
        const contents = (<div>
          <WrioDocumentBody
              document={document}
              url={this.props.url}
          />
          { !document.hasCommentId() ?
                                commentsDisabledFrame :
                                  <div style={displayTitterStyle}>
                                    {this.state.userId && <CreateTitter scripts={document.getData()} wrioID={this.state.userId}/> }
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

const editIframeStyles = {
    width: '100%',
    border: 'none'
};

export class WebGoldCenter extends CreateDomCenter {
    render() {
        this.state.actionButton = "Start";
        var wg = (<iframe src={getServiceUrl('webgold')+'/add_funds'} style={ editIframeStyles }/>);
        return this.generateCenterWithContents (wg);

    }
}
