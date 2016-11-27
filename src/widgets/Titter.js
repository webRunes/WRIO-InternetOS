import React from 'react';
import {getServiceUrl,getDomain} from '../core/servicelocator.js';
import WindowActions from '../core/actions/WindowActions.js';
import WrioDocument from '../core/store/WrioDocument.js';
import Login from './Login.js';

var domain = getDomain();


class TwitterWidet {
    constructor(commentId) {
        window.onTimelineLoad = this.onTimelineLoad.bind(this);

        document.getElementById('titteriframe').style.height = '240px';

        var commentTitle = '<ul class="breadcrumb twitter"><li class="active">Comments</li><li class="pull-right"></li></ul>';
        var twitterTemplate = '<a class="twitter-timeline" href="https://twitter.com/search?q=' + window.location.href + '" data-widget-id="' + commentId + '" width="' + window.innerWidth + '" data-chrome="nofooter">Tweets about ' + window.location.href + '</a>';
        document.getElementById('twitter_frame_container').innerHTML = commentTitle + twitterTemplate;

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
        this.$twitter.contentDocument.getElementsByTagName('style')[0].innerHTML += 'img.autosized-media {width:auto;height:auto;}\n.timeline-Widget {max-width:10000px !important;}\n.timeline-Widget .stream {overflow-y: hidden !important;}';
        window.interval = setInterval(this.autoSizeTimeline.bind(this), 1000);
    }

    calcHeight(id) {
        var element = this.$twitter.contentDocument.getElementsByClassName("timeline-LoadMore")[0];
        return Number(window.getComputedStyle(element).height.replace('px', ''));
    }

    autoSizeTimeline() {
        if (this.$twitter.contentDocument) {
            var $hfeed = this.$twitter.contentDocument.getElementsByClassName("timeline-TweetList")[0];
            var $noMorePane = this.$twitter.contentDocument.getElementsByClassName("timeline-LoadMore")[0];
            var twitterht = 0;
            var add_ht = 0;
            if ($hfeed) {
                twitterht = Number(window.getComputedStyle($hfeed).height.replace('px', ''));
            }
            if ($noMorePane) {
                add_ht = Number(window.getComputedStyle($noMorePane).height.replace('px', ''));
            }

            if (add_ht > 0) {
                twitterht += add_ht;
            }

            this.$twitter.style.height = twitterht + 90 + 'px';
        }
    }


}

var CreateTitter = React.createClass({
    propTypes: {
        scripts: React.PropTypes.array.isRequired
    },

    componentWillUnmount: function () {
        clearInterval(window.interval);
    },
    switchToAddCommentMode: function () {
        this.setState({
            addFundsMode: false
        });
    },
    switchToAddFundsMode: function () {
        this.setState({
            addFundsMode: true
        });
    },
    prepTwitWidget () {
        var titteriframe = document.getElementById('titteriframe');
        if (!titteriframe) {
            return;
        }
        this.setState({nocomments: false});

        let comment;
        let id = WrioDocument.getJsonLDProperty('comment');
        if (id === null) {
            this.setState({nocomments: true});
        } else {
            var twitterWidget = new TwitterWidet(id);
        }
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

    getInitialState: function () {


        var authorId = this.getWrioIdFromAuthor();
        if (authorId) {
            authorId = "&id=" + authorId;
        } else {
            authorId = "";
        }

        return {
            isAuthor: false,
            addComment: 'Add comment',
            article: WrioDocument.hasArticle(),
            isTemporary: false,
            addFundsMode: false,
            titterFrameUrl: getServiceUrl('titter') + '/iframe/?origin=' + encodeURIComponent(window.location.href) + authorId,
            webgoldIframeUrl: getServiceUrl('webgold') + "/add_funds"
        };
    },

    componentDidMount: function () {
        if (!this.state.article) {
            return;
        }

        this.createListeners();
        this.prepTwitWidget();
    },

    createListeners() {
        WindowActions.titterMessage.listen((msg)=> {
            if (msg.titterHeight) {
                document.getElementById('titteriframe').style.height = msg.titterHeight + 'px';
            }
            if (msg.goAddFunds) {
                this.switchToAddFundsMode();
            }
        });

        WindowActions.webGoldMessage.listen((msg)=> {
            if (msg.webgoldHeight) {
                document.getElementById('webgoldiframe').style.height = msg.webgoldHeight + 'px';
            }
        });

        WindowActions.forceIframeReload.listen((msg)=> {
            var tIF = document.getElementById('titteriframe');
            var wIF = document.getElementById('webgoldiframe');

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

    render: function () {
        var parts = [];

        if (!WrioDocument.hasCommentId() || this.state.nocomments) {
            parts.push(
                <ul className="breadcrumb" key="comm">
                    <li className="active">Comments</li>
                </ul>);
            parts.push(<CommentsDisabled key="comdis" isAuthor={this.state.isAuthor}/>);
            return <div>{parts}</div>;
        }

        var addCommentFundsMode;
        var twStyle = {display: "none"};

        if (!this.state.addFundsMode) {
            addCommentFundsMode = (
                <ul className="breadcrumb" key="act">
                    <li className="active">{this.state.addComment}</li>
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
                            <iframe id="titteriframe" src={this.state.titterFrameUrl} frameBorder="no" scrolling="no"/>
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
            parts.push(<iframe id="webgoldiframe" src={this.state.webgoldIframeUrl } style={ this.editIframeStyles }/>);
        }

        parts.push(<div id="twitter_frame_container" style={twStyle}></div>);


        return (
            <div>
                { addCommentFundsMode }

                {parts}
            </div>
        );
    }
});

class CommentsDisabled extends React.Component {
    render() {

        var iStyle = {
            width: '100%',
            height: '190px',
            border: 'none'
        };

        var frameUrl = getServiceUrl('core') + '/edit?comment_article=' + window.location.href;
        if (this.props.isAuthor) {
            return (<iframe src={frameUrl} style={ iStyle }/>);
        } else { // do not open iframe if it isn't author
            return (
                <div className="well enable-comment text-left">
                    <h4>Comments disabled</h4>

                    <p>Comments haven't been enabled by author</p>

                </div>);
        }

    }
}

CommentsDisabled.propTypes = {
    isAuthor: React.PropTypes.bool
};


class LoginAndComment extends React.Component {
    render() {
        return (
            <div className="well enable-comment">
                <h4>Start to donate and comment!</h4>

                <p>Please login with Twitter account to be able to comment via tweets and make donations.<br />Looking
                    forward to hearing from you!</p>
                <br />
                <a className="btn btn-sm btn-success" href="#" role="button" onClick={Login.requestLogin}><span
                    className="glyphicon glyphicon-comment"></span>Join the conversation</a>
            </div>);
    }
}

export default CreateTitter;

