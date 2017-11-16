/* @flow */
import React from "react";
// $FlowFixMe
import {
  CreateDomCenter,
  TransactionsCenter,
  PresaleCenter,
  ChessCenter,
  WebGoldCenter
} from "./CreateDomCenter";
import {
  VerticalNav,
  LeftNav
} from "base/containers/ArticleNavigationContainer";
import { getServiceUrl, getDomain } from "../servicelocator.js";
import LdJsonDocument from "../jsonld/LdJsonDocument";
import UrlMixin from "../mixins/UrlMixin.js";
import * as PlusActions from "../Plus/actions/PlusActions";
import * as Actions from "base/actions/actions";
import Login from "../components/widgets/Login.js";
import CoverHeader from "../containers/CoverHeaderContainer";
import Tabs from "../components/Tabs";
import { Provider, connect } from "react-redux";
import { loadDocumentWithData } from "base/actions/actions";
import RedBox from "redbox-react";
import { postUpdateHook } from "base/actions/hashUpdateHook";

const RightNav = ({ onCloseTab }) => {
  return (
    <div className="right-nav">
      <a
        href="#"
        onClick={onCloseTab}
        className="btn btn-just-icon btn-simple btn-default btn-sm btn-flat pull-right"
      >
        <i className="material-icons dp_big">highlight_off</i>
      </a>
      <a
        href="#"
        className="hidden btn btn-just-icon btn-simple btn-default btn-lg"
      >
        <i className="material-icons dp_big">bookmark</i>
      </a>
      <a
        href="#"
        className="hidden btn btn-just-icon btn-simple btn-default btn-lg"
      >
        <i className="material-icons dp_big">share</i>
      </a>
    </div>
  );
};

const LoginBar = ({ profile }) => {
  const loginStyle = {
    margin: "10px 110px",
    position: "absolute",
    right: 0,
    zIndex: 120
  };
  return (
    <div style={loginStyle}>{!!profile && <Login profile={profile} />}</div>
  );
};

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  propTypes: {
    document: LdJsonDocument
  };

  componentDidMount() {
    // hide preloader
    const preloader = document.getElementById("preloader");
    preloader ? (preloader.style.display = "none") : true;
    this.props.dispatch(
      loadDocumentWithData(this.props.document, window.location.href)
    );
  }

  componentDidUpdate() {
    postUpdateHook();
  }

  renderWithCenter(center) {
    let data: LdJsonDocument = this.props.document;
    let externals = this.props.externals;

    return (
      <div>
        <VerticalNav vertical={true} showUp={false} />
        <LoginBar profile={this.props.profile} />
        <RightNav onCloseTab={() => {
          this.props.dispatch(PlusActions.onCloseTab())
        }}/>
        <CoverHeader />
        <LeftNav />

        <div className="main col-xs-12 col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-0 col-lg-6">
          <Tabs
            center={center}
            externals={externals}
            editAllowed={this.props.editAllowed}
            RIL={this.props.readItLater}
            tabKey={this.props.tabKey}
            tabClick={tab => this.props.dispatch(Actions.tabClick(tab))}
          />
        </div>
      </div>
    );
  }

  render() {
    const url: string = this.props.url;
    const urlDecoded = UrlMixin.searchToObject(url);

    if (urlDecoded.start && window.location.origin === getServiceUrl("chess")) {
      return this.renderWithCenter(
        <ChessCenter
          data={this.props.document}
          url={url}
          profile={this.props.profile}
          wrioID={this.props.wrioID}
        />
      );
    }

    if (urlDecoded.transactions) {
      return this.renderWithCenter(
        <TransactionsCenter
          data={this.props.document}
          url={url}
          profile={this.props.profile}
          wrioID={this.props.wrioID}
        />
      );
    }

    if (
      urlDecoded.presale &&
      (window.location.hostname.startsWith("webgold.wrioos.") ||
        window.location.hostname.startsWith("wrioos.local"))
    ) {
      return this.renderWithCenter(
        <PresaleCenter
          data={this.props.document}
          url={url}
          profile={this.props.profile}
          wrioID={this.props.wrioID}
        />
      );
    }

    if (urlDecoded.add_funds) {
      return this.renderWithCenter(
        <WebGoldCenter
          data={this.props.document}
          url={url}
          profile={this.props.profile}
          wrioID={this.props.wrioID}
        />
      );
    }

    return this.renderWithCenter(
      <CreateDomCenter
        data={this.props.document}
        url={url}
        profile={this.props.profile}
        wrioID={this.props.wrioID}
      />
    );
  }
}

const mapStateToProps = state => ({
  url: state.document.url,
  profile: state.login.profile,
  wrioID: state.login.wrioID,
  editAllowed: state.document.editAllowed,
  toc: state.document.toc,
  lists: state.document.lists,
  readItLater: state.plusReducer.readItLater,
  tabKey: state.document.tabKey,
  externals: state.header.externals,
});

const MainMapped = connect(mapStateToProps)(Main);

let doc = new LdJsonDocument(document.getElementsByTagName("script"));

export default class App extends React.Component {
  render() {
    return <MainMapped document={doc} />;
  }
}
