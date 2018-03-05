/* @flow */

import { getServiceUrl, getDomain } from '../servicelocator.js';
import React from 'react';
import Chess from '../components/widgets/Chess.js';
import CreatePinger from '../components/widgets/Pinger.js';
import WrioDocumentBody from '../components/WrioDocumentBody.js';
// $FlowFixMe
import classNames from 'classnames';
import UrlMixin from '../mixins/UrlMixin';
import CreateTransactions from '../components/widgets/Transactions.js';
import CreatePresale from '../components/widgets/Presale.js';
import CommentsDisabled from '../components/misc/CommentsDisabled.js';
import LdJsonDocument from '../jsonld/LdJsonDocument';

type CenterProps = {
  data: LdJsonDocument,
  profile: ?Object,
  url: string,
  wrioID: ?string,
};

export class CreateDomCenter extends React.Component {
  props: CenterProps;

  state: {
    editMode: boolean,
    pingerDisabled: boolean,
    active: boolean,
    editAllowed: boolean,
    profile: ?Object,
    wrioID: ?string,
  };

  constructor(props: CenterProps) {
    super(props);
    this.state = {
      editMode: false,
      editAllowed: false,
      pingerDisabled: false,
      active: false,
    };
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
    const displayPingerStyle =
      document.hasArticle() && showArticle ? { display: 'block' } : { display: 'none' }; // make sure pinger is hidden for covers and lists

    const commentsDisabledFrame = showArticle && (
      <CommentsDisabled isAuthor={this.state.editAllowed} />
    );
    const contents = (
      <div id="centerWrp">
        <WrioDocumentBody document={document} url={this.props.url} />
        {document.hasCommentId()
          ?
            (
              <div style={displayPingerStyle}>
                <CreatePinger
                  document={document}
                  profile={this.props.profile}
                  wrioID={this.props.wrioID}
                />
              </div>
            )
          :
            commentsDisabledFrame
        }
      </div>
    );

    return contents;
  }

  generateCenterWithContents(contents) {
    return <div id="centerWrp">{contents}</div>;
  }
}

export class TransactionsCenter extends CreateDomCenter {
  render() {
    return this.generateCenterWithContents(<CreateTransactions />);
  }
}

export class PresaleCenter extends CreateDomCenter {
  render() {
    return this.generateCenterWithContents(<CreatePresale />);
  }
}

export class ChessCenter extends CreateDomCenter {
  render() {
    const urlParams = UrlMixin.searchToObject(this.props.url);
    return this.generateCenterWithContents(<Chess uuid={urlParams.start} />);
  }
}

const editIframeStyles = {
  width: '100%',
  border: 'none',
};

export class WebGoldCenter extends CreateDomCenter {
  render() {
    const wg = <iframe src={`${getServiceUrl('webgold')}/add_funds`} style={editIframeStyles} />;
    return this.generateCenterWithContents(wg);
  }
}
