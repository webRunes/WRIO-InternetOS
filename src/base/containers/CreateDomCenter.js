/* @flow */

import {getServiceUrl,getDomain} from '../servicelocator.js';
import React from 'react';
import Chess from '../components/widgets/Chess.js';
import CreateTitter from '../components/widgets/Titter.js';
import WrioDocumentBody from '../components/WrioDocumentBody.js';
// $FlowFixMe
import classNames from 'classnames';
import UrlMixin from '../mixins/UrlMixin';
import CreateTransactions from '../components/widgets/Transactions.js';
import CreatePresale from '../components/widgets/Presale.js';
import CommentsDisabled from '../components/misc/CommentsDisabled.js';
import LdJsonDocument from '../jsonld/LdJsonDocument';


type CenterProps = {
    data : LdJsonDocument,
    profile : ?Object,
    url : string,
    wrioID: ?string
};


export class CreateDomCenter extends React.Component {

    props: CenterProps;

    state: {
        editMode: boolean,
        titterDisabled: boolean,
        active: boolean,
        editAllowed: boolean,
        profile: ?Object,
        wrioID: ?string
    };

    constructor(props : CenterProps) {
        super(props);
        this.state = {
            editMode: false,
            editAllowed: false,
            titterDisabled: false,
            active: false,
            wrioID: props.wrioID,
            profile: null
        };
    }

    componentWillReceiveProps(nextProps : CenterProps) {
        this.setState({profile: nextProps.profile,
                        wrioID:nextProps.wrioID});
    }

    isArticleShown() {
        const search = UrlMixin.searchToObject(this.props.url);
        if (search) {
            if (search.list || search.cover) {
                return false;
            }
        }
        return true;
    }



    render() {
        const urlParams = UrlMixin.searchToObject(this.props.url);
        const document = this.props.data;
        const showArticle = this.isArticleShown();
        const displayTitterStyle = (document.hasArticle() && showArticle) ? {display:"block"} : {display:"none"}; // make sure titter is hidden for covers and lists


        const commentsDisabledFrame = showArticle &&  <CommentsDisabled isAuthor={this.state.editAllowed}/>;
        const contents = (<div id="centerWrp">
          <WrioDocumentBody
              document={document}
              url={this.props.url}
          />
          { !document.hasCommentId() ?
                                commentsDisabledFrame :
                                  <div style={displayTitterStyle}>
                                    <CreateTitter document={document}
                                                  profile={this.state.profile}
                                                  wrioID={this.state.wrioID}
                                    />
                                  </div> }
        </div>);

        return contents;
    }

    generateCenterWithContents(contents) {

        return (
            <div id="centerWrp">
              {contents}
            </div>
        );
    }

}


export class TransactionsCenter extends CreateDomCenter {
    render() {
        return this.generateCenterWithContents (<CreateTransactions />);

    }
}


export class PresaleCenter extends CreateDomCenter {
    render() {
        return this.generateCenterWithContents (<CreatePresale />);

    }
}

export class ChessCenter extends CreateDomCenter {
    render() {
        const urlParams = UrlMixin.searchToObject(this.props.url);
        return this.generateCenterWithContents (<Chess uuid={urlParams.start}/>);

    }
}


export class CoreCreateCenter extends CreateDomCenter {
    render() {
        return this.generateCenterWithContents (<Core wrioID={this.state.wrioID}/>);
    }
}

const editIframeStyles = {
    width: '100%',
    border: 'none'
};

export class WebGoldCenter extends CreateDomCenter {
    render() {
        var wg = (<iframe src={getServiceUrl('webgold')+'/add_funds'} style={ editIframeStyles }/>);
        return this.generateCenterWithContents (wg);

    }
}
