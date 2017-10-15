/* @flow */
import React from "react";
import { getServiceUrl, getDomain } from "../../servicelocator.js";
import {
  titterHeight,
  webgoldHeight,
  forceIframeReload,
  getHeight
} from "base/actions/WindowMessage";
import { performLogin } from "./Login.js";
import TwitterTimelineWidget from "./TwitterTimeline.js";
import LdJsonDocument from "../../jsonld/LdJsonDocument";

var domain = getDomain();

type TitterProps = {
  document: LdJsonDocument,
  profile: ?Object,
  wrioID: ?string
};

const addComment = "Add comment";

class TitterWidget extends React.Component {
  props: TitterProps;

  state: {
    addComment: string,
    article: boolean,
    titterFrameUrl: string
  };
  timelinewidget: TwitterTimelineWidget;

  constructor(props: TitterProps) {
    super(props);
    this.initProps(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps: TitterProps) {
    this.initProps(nextProps);
  }

  initProps(props: TitterProps) {
    const authorId = this.props.document.getAuthorWrioId();
    const origin = encodeURIComponent(
      window.location.href.replace(/#.+$/m, "")
    ); // strip url hash at the end

    if (!props.profile) {
      console.log("PROFILE not ready yet");
      return;
    }

    this.setState({
      article: this.props.document.hasArticle(),
      titterFrameUrl: `${getServiceUrl(
        "titter"
      )}/iframe/?origin=${origin}&author=${authorId || ""}&userID=${this.props
        .wrioID || ""}`
    });
  }

  componentDidMount() {
    if (!this.state.article) {
      return;
    }

    this.createListeners();
    this.timelinewidget = this.prepTwitterTimeline();
  }

  componentWillUnmount() {
    this.timelinewidget.cleanup();
  }

  prepTwitterTimeline() {
    var timeline = this.refs.timeLineContainer;
    if (!timeline) {
      return;
    }
    let id = this.props.document.getJsonLDProperty("comment");
    return new TwitterTimelineWidget(id, timeline);
  }

  createListeners() {
    titterHeight.subscribe(ht => {
      this.refs.titteriframe.style.height = ht + "px";
    });

    webgoldHeight.subscribe(ht => {
      this.refs.webgoldiframe.style.height = ht + "px";
    });

    forceIframeReload.subscribe(reload => {
      if (reload == true) {
        var tIF = this.refs.titteriframe;
        var wIF = this.refs.webgoldiframe;

        if (tIF) {
          tIF.src = tIF.src;
        }
        if (wIF) {
          wIF.src = wIF.src;
        }
      }
    });
  }

  render() {
    let body = null;
    let showTimeline = false;

    if (!this.props.profile) {
      body = <img src="https://default.wrioos.com/img/loading.gif" />;
    } else {
      if (this.props.profile.temporary) {
        body = <LoginAndComment />;
        showTimeline = true;
      } else {
        if (this.state.article) {
          body = (
            <section key="b">
              <iframe
                ref="titteriframe"
                id="titteriframe"
                src={this.state.titterFrameUrl}
                frameBorder="no"
                scrolling="no"
              />
            </section>
          );
          showTimeline = true;
        }
      }
    }

    return (
      <div>
        <ul className="breadcrumb" key="act">
          <li className="active" id="Comments">
            {addComment}
          </li>
        </ul>
        {body}
        <div
          ref="timeLineContainer"
          style={showTimeline ? { display: "block" } : { display: "none" }}
        />
      </div>
    );
  }
}

const addFundsIfrmame = () => {
  const editIframeStyles = {
    width: "100%",
    height: "650px",
    border: "none"
  };
  const webgoldIframeUrl = getServiceUrl("webgold") + "/add_funds";
  return (
    <iframe
      id="webgoldiframe"
      ref="webgoldiframe"
      src={webgoldIframeUrl}
      style={editIframeStyles}
    />
  );
};

class LoginAndComment extends React.Component {
  render() {
    return (
      <div className="well enable-comment">
        <h4>Start donating and commenting!</h4>
        <p>
          Please, login with your Twitter account to comment via tweets and to
          make donations. Looking forward to hearing from you!
        </p>
        <br />
        <a
          className="btn btn-sm btn-success"
          href="#"
          role="button"
          onClick={performLogin}
        >
          <span className="glyphicon glyphicon-comment" />Join the conversation
        </a>
      </div>
    );
  }
}

export default TitterWidget;
