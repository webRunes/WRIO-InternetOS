import React from 'react';
import {getServiceUrl,getDomain} from '../core/servicelocator.js';
import WindowActions from '../core/actions/WindowActions.js';
import WrioDocument from '../core/store/WrioDocument.js';
import Login from './Login.js';
import TwitterWidget from './TwitterTimeline.js';
import UIActions from "../core/actions/UI.js";
var domain = getDomain();



var CreateTitter = React.createClass({
    propTypes: {
        scripts: React.PropTypes.array.isRequired,
        wrioID: React.PropTypes.string
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
            var twitterWidget = new TwitterWidget(id);
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


        const authorId = this.getWrioIdFromAuthor() || "";
        const origin = encodeURIComponent(window.location.href.replace(/#.+$/m,"")); // strip url hash at the end

        return {
            isAuthor: false,
            addComment: 'Add comment',
            article: WrioDocument.hasArticle(),
            isTemporary: false,
            addFundsMode: false,
            titterFrameUrl: `${getServiceUrl('titter')}/iframe/?origin=${origin}&author=${authorId}&userID=${this.props.wrioID}`,
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
