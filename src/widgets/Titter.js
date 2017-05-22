import React from 'react';
import {getServiceUrl,getDomain} from '../core/servicelocator.js';
import WindowActions from '../core/actions/WindowActions.js';
import WrioDocument from '../core/store/WrioDocument.js';
import Login from './Login.js';

var domain = getDomain();

class TwitterTimelineWidget {
    constructor(commentId,container) {
        window.onTimelineLoad = this.onTimelineLoad.bind(this);

        container.style.height = '240px';

        var commentTitle = '<ul class="breadcrumb twitter"><li class="active">Comments</li><li class="pull-right"></li></ul>';
        var twitterTemplate = '<a class="twitter-timeline" href="https://twitter.com/search?q=' + window.location.href + '" data-widget-id="' + commentId + '" width="' + window.innerWidth + '" data-chrome="nofooter">Tweets about ' + window.location.href + '</a>';
        container.innerHTML = commentTitle + twitterTemplate;

        var js,
            fjs = document.getElementsByTagName('script')[0],
            p = /^http:/.test(document.location) ? 'http' : 'https';

        js = document.createElement('script');
        js.id = 'twitter-wjs';
        js.src = p + '://platform.twitter.com/widgets.js';
        js.setAttribute('onload', 'twttr.events.bind("rendered",window.onTimelineLoad);');
        fjs.parentNode.insertBefore(js, fjs);

    }

    onTimelineLoad() {
        this.$twitter = document.getElementsByClassName('twitter-timeline-rendered')[0];
        this.$twitter.contentDocument.getElementsByTagName('style')[0].innerHTML +=
            `
            img.autosized-media {
              width:auto;
              height:auto;
            }
            .customisable-border {
              overflow:hidden !important;
            }
            .timeline-Widget {
              max-width:10000px !important;
            }
            .timeline-Widget .stream {
              overflow-y: hidden !important;
            }
            .timeline-Tweet-text{
              font-size: 14px !important;
              line-height: initial !important;
            }
            .timeline-InformationCircle-widgetParent {
               display: none !important;
            }
            `;
        this.interval = setInterval(this.autoSizeTimeline.bind(this), 1000);
    }

    calcHeight(id) {
        var element = this.$twitter.contentDocument.getElementsByClassName("timeline-LoadMore")[0];
        return Number(window.getComputedStyle(element).height.replace('px', ''));
    }

    autoSizeTimeline() {
        if (this.$twitter.contentDocument) {
            const getHeight = ($el) => !!$el ? Number(window.getComputedStyle($el).height.replace('px', '')) : 0;
            const getElm = (name) => this.$twitter.contentDocument.getElementsByClassName(name)[0];

            const $hfeed = getElm("timeline-TweetList");
            const $noMorePane = getElm("timeline-LoadMore");
            const $header = getElm("timeline-Header");
            const twitterht = getHeight($hfeed) + getHeight($noMorePane) ;

            this.$twitter.style.height = twitterht + 20 + 'px';
        }
    }
    cleanup () {
        clearInterval(this.interval);
    }

}

var CreateTitter = React.createClass({
    propTypes: {
        scripts: React.PropTypes.array.isRequired
    },

    componentWillUnmount () {
       this.timelinewidget.cleanup();
    },
    switchToAddCommentMode () {
        this.setState({
            addFundsMode: false
        });
    },
    switchToAddFundsMode (){
        this.setState({
            addFundsMode: true
        });
    },
    prepTwitterTimeline() {
        var timeline = this.refs.timeLineContainer;
        if (!timeline) {
            return;
        }
        let id = WrioDocument.getJsonLDProperty('comment');
        return new TwitterTimelineWidget(id,timeline);

    },
    editIframeStyles: {
        width: '100%',
        height: '650px',
        border: 'none'
    },

    getWrioIdFromAuthor() {
        var author = WrioDocument.getJsonLDProperty('author');
        if (author) {
            var reg = /\?wr\.io=([0-9]*)$/gm;
            var regResult = reg.exec(author);
            var wrioID = regResult ? regResult[1] : !1;
            if (wrioID) {
                return wrioID;
            }
        }
        console.log("ERROR: failed to extract author's WRIO id");
    },

    getInitialState () {


        var authorId = this.getWrioIdFromAuthor();
        if (authorId) {
            authorId = "&id=" + authorId;
        } else {
            authorId = "";
        }

        var origin = encodeURIComponent(window.location.href.replace(/#.+$/m,"")); // strip url hash at the end

        return {
            isAuthor: false,
            addComment: 'Add comment',
            article: WrioDocument.hasArticle(),
            isTemporary: false,
            addFundsMode: false,
            titterFrameUrl: getServiceUrl('titter') + '/iframe/?origin=' + origin + authorId,
            webgoldIframeUrl: getServiceUrl('webgold') + "/add_funds"
        };
    },

    componentDidMount () {
        if (!this.state.article) {
            return;
        }

        this.createListeners();
        this.timelinewidget = this.prepTwitterTimeline();
    },

    createListeners() {
        WindowActions.titterMessage.listen((msg)=> {
            if (msg.titterHeight) {
                this.refs.titteriframe.style.height = msg.titterHeight + 'px';
            }
            if (msg.goAddFunds) {
                this.switchToAddFundsMode();
            }
        });

        WindowActions.webGoldMessage.listen((msg)=> {
            if (msg.webgoldHeight) {
                this.refs.webgoldiframe.style.height = msg.webgoldHeight + 'px';
            }
        });

        WindowActions.forceIframeReload.listen((msg)=> {
            var tIF = this.refs.titteriframe;
            var wIF = this.refs.webgoldiframe;

            if (tIF) {
                tIF.src = tIF.src;
            }
            if (wIF) {
                wIF.src = wIF.src;
            }

        });

        WindowActions.loginMessage.listen((msg)=> {
            if (msg.profile) {
                var auth =  (msg.profile.id === this.getWrioIdFromAuthor());
                this.setState({
                    isTemporary: msg.profile.temporary,
                    isAuthor: auth
                });
            }
        });
    },

    render () {
        var parts = [];
        var addCommentFundsMode;
        var twStyle = {display: "none"};

        if (!this.state.addFundsMode) {
            addCommentFundsMode = (
                <ul className="breadcrumb" key="act">
                    <li className="active" id="Comments">{this.state.addComment}</li>
                    <li style={{display: "none"}}><a onClick={ this.switchToAddFundsMode }>Add funds</a></li>
                </ul>
            );

            if (this.state.isTemporary) {
                parts.push(<LoginAndComment />);
                twStyle = {
                    display: "block"
                };

            } else {
                if (this.state.article) {
                    parts.push(
                        <section key="b">
                            <iframe ref="titteriframe" id="titteriframe" src={this.state.titterFrameUrl} frameBorder="no" scrolling="no"/>
                        </section>
                    );

                    twStyle = {
                        display: "block"
                    };
                }
            }
        } else {
            addCommentFundsMode = (
                <ul className="breadcrumb">
                    <li><a onClick={ this.switchToAddCommentMode }>{this.state.addComment}</a></li>
                    <li className="active">Add funds</li>
                </ul>
            );
            parts.push(<iframe id="webgoldiframe" ref="webgoldiframe" src={this.state.webgoldIframeUrl } style={ this.editIframeStyles }/>);
        }

        parts.push(<div ref="timeLineContainer" style={twStyle}></div>);

        return (
            <div>
                { addCommentFundsMode }
                {parts}
            </div>
        );
    }
});


class LoginAndComment extends React.Component {
    render() {
        return (
            <div className="well enable-comment">
              <h4>Start donating and commenting!</h4>
              <p>Please, login with your Twitter account to comment via tweets and to make donations.
              Looking forward to hearing from you!</p>
                <br />
                <a className="btn btn-sm btn-success" href="#" role="button" onClick={Login.requestLogin}><span
                    className="glyphicon glyphicon-comment"></span>Join the conversation</a>
            </div>);
    }
}

export default CreateTitter;
