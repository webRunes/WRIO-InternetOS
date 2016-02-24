import React from 'react';
import {getServiceUrl,getDomain} from '../WRIO-InternetOS/js/servicelocator.js';
import WindowActions from '../WRIO-InternetOS/js/actions/WindowActions.js';

var domain = getDomain();

var Alert = React.createClass({
    getInitialState: function() {
        return {
            text1: 'You\'ve donated 10 WRG. The author received 82%, which amounts to 8.2 WRG or 0.19 USD. Thank you!',
            text2: 'More information on donations and percentage you can find ',
            link: {
                text: 'here',
                url: '#'
            }
        };
    },
    render: function () {
        return (
            <div className="alert alert-success">
                <button type="button" className="close" data-dismiss="alert">×</button>
                {this.state.text1}<br />{this.state.text2}<a href={this.state.link.url}>{this.state.link.text}</a>
            </div>
        );
    }
});

var CurrentBalance = React.createClass({
    getInitialState: function() {
        return {
            text: 'Current balance\u00A0',
            cur1: 'WRG',
            value1: '\u00A019 135',
            cur2: 'USD',
            value2: 76.54,
            link: {
                text: 'Add funds',
                url: getServiceUrl('webgold')+'/add_funds'
            }
        };
    },
    render: function () {
        return (
            <ul className="leaders">
                <li>
                    <span>{this.state.text}</span>
                    <span>
                        {this.state.value1}<small className="currency">{this.state.cur1}</small>
                        <sup className="currency">
                            {this.state.value2}
                            <span className="currency">{this.state.cur2}</span>
                            {'\u00b7'}
                            <a href={this.state.link.url} target="_blank">{this.state.link.text}</a>
                        </sup>
                    </span>
                </li>
            </ul>
        );
    }
});

var InputNumber = React.createClass({
    getInitialState: function() {
        return {
            cur: 'WRG',
            value: 0,
            per: '82%',
            hint: 'The author will receive 82%, which amounts to 8.2 WRG or 0.19 USD. The bigger the donated amount, the bigger the received percentage up to 95%',
            text: 'Insufficient funds. ',
            link: {
                text: 'Add funds',
                url: getServiceUrl('webgold')+'/add_funds'
            }
        };
    },
    render: function() {
        return (
            <div className="form-group col-xs-12 col-md-4 col-lg-3 has-error">
                <div className="input-group input-group-sm tooltip-demo">
                    <span className="input-group-addon">{this.state.cur}</span>
                    <input type="number" className="form-control" id="inputAmount" value={this.state.value} min="0" />
                    <span className="input-group-addon" data-toggle="tooltip" data-placement="top" title={this.state.hint}>{this.state.per}</span>
                </div>
                <div className="help-block">
                    {this.state.text}
                    <a href={this.state.link.url} target="_blank">
                        {this.state.link.text}
                    </a>
                </div>
            </div>
        );
    }
});

var TweetTitle = React.createClass({
    getInitialState: function() {
        var limit = 72;
        return {
            limit: limit,
            placeholder: 'Title, hashtags or mentions. Max ' + limit + ' characters',
            help: 'Max ' + limit + ' characters'
        };
    },
    render: function() {
        return (
            <div className="form-group col-xs-12 col-md-4 col-lg-7 has-error">
                <div className="input-group input-group-sm">
                    <span className="input-group-addon twitter-limit">{this.state.limit}</span>
                    <input id="IDtweet_title" name="tweet_title" className="form-control" maxLength={this.state.limit} placeholder={this.state.placeholder} type="text" />
                </div>
                <div className="help-block">{this.state.help}</div>
            </div>
        );
    }
});

var LetUsKnow = React.createClass({
    getInitialState: function() {
        var limit = 4096;
        return {
            placeholder: 'Let us know your thoughts! Max ' + limit + ' characters',
            help: 'Max ' + limit + ' characters'
        };
    },
    render: function() {
        return null;//TODO remove iframe auth
        //return (
        //    <div className="form-group col-xs-12 has-error">
        //        <textarea rows="3" className="form-control" placeholder={this.state.placeholder} />
        //        <div className="help-block">{this.state.help}</div>
        //    </div>
        //);
    }
});

var Photo = React.createClass({
    getInitialState: function() {
        return {
            text: 'Photo'
        };
    },
    render: function() {
        return null;
        //return (
        //    <div className="btn-group tooltip-demo">
        //        <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-camera"></span>{this.state.text}</button>
        //    </div>
        //);
    }
});

var Submit = React.createClass({
    getInitialState: function() {
        return {
            label: 1024,
            text: 'Login and submit'
        };
    },
    render: function() {
        return null;//TODO remove iframe auth
        //return (
        //    <div className="pull-right">
        //        <div className="pull-right">
        //            <label className="comment-limit">{this.state.label}</label>
        //            <button type="button" className="btn btn-primary"><span className="glyphicon glyphicon-ok"></span>{this.state.text}</button>
        //        </div>
        //    </div>
        //);
    }
});

var Donate = React.createClass({
    getInitialState: function() {
        return {
            title: 'Donation'
        };
    },
    render: function () {
        return (
            <form className="margin-bottom" role="form">
                <div className="form-group">
                    <Alert />
                    <CurrentBalance />
                </div>
            </form>
        );
    }
});

var CreateTitter = React.createClass({
    propTypes: {
        scripts: React.PropTypes.array.isRequired,
        nocomments: React.PropTypes.bool,
        disabled: React.PropTypes.bool
    },
    createTwitterWidget: function (commentId) {
        window.onTimelineLoad = function () {
            var $twitter = document.getElementsByClassName('twitter-timeline-rendered')[0];

            function autoSizeTimeline() {
                if($twitter.contentDocument) {
                    var twitterht = Number(window.getComputedStyle(
                        $twitter.contentDocument.getElementsByClassName("h-feed")[0]
                    ).height.replace('px', ''));

                    var add_ht = Number(window.getComputedStyle(
                        $twitter.contentDocument.getElementsByClassName("no-more-pane")[0]
                    ).height.replace('px', ''));
                    if (add_ht > 0) {
                        twitterht += add_ht;
                    }

                    $twitter.style.height = twitterht + 100 + 'px';
                }
            }

            $twitter.contentDocument.getElementsByTagName('style')[0].innerHTML += 'img.autosized-media {width:auto;height:auto;}\n.timeline {max-width:10000px !important;}\n.timeline .stream {overflow-y: hidden !important;}';
            window.interval = setInterval(autoSizeTimeline, 1000);
        };

        document.getElementById('titteriframe').style.height = '240px';

        WindowActions.titterMessage.listen((msg)=> {
            if (msg.titterHeight) {
                document.getElementById('titteriframe').style.height = msg.titterHeight+'px';
            }
        });

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

    },
    componentWillUnmount: function() {
        clearInterval(window.interval);
    },
    isArticle: function(json) {
        var i,
            comment;
        for (i = 0; i < json.length; i += 1) {
            comment = json[i];
            if(comment['@type'] === 'Article') {
                return true;
            }
            var hasPart = comment.hasPart;
            if ((typeof hasPart === 'object') && (hasPart.length > 0)) {
                return this.isArticle(hasPart);
            }
        }
    },
    switchToAddCommentMode: function() {
        this.setState({
            addFundsMode: false
        });
    },
    switchToAddFundsMode: function() {
        this.setState({
            addFundsMode: true
        });
    },
    prepTwitWidget: function() {
        var that = this;
        var titteriframe = document.getElementById('titteriframe');
        if (!titteriframe) {return;}
        if (this.props.nocomments) {
            that.setState({nocomments: true});
            return;
        }
        titteriframe.addEventListener('load', function () {
            var comment, author;
            var id = that.getJsonLDProperty(that.props.scripts,'comment');
            if (id === null) {
                that.setState({nocomments: true});
            } else {
                that.createTwitterWidget(id);
            }
        });
    },
    editIframeStyles: {
        width: '100%',
        height: '650px',
        border: 'none'
    },
    getInitialState: function() {
        var id = "";
        var author = this.getJsonLDProperty(this.props.scripts,'author');
        if (author) { // add author reference
            var reg = /\?wr\.io=([0-9]*)$/gm;
            var regResult = reg.exec(author);
            var wrioID =  regResult ? regResult[1] : !1;
            if (wrioID) {
                id = "&id="+wrioID;
            }
        }

        return {
            addComment: 'Add comment',
            article: this.isArticle(this.props.scripts),
            addFundsMode: false,
            titterFrameUrl:  getServiceUrl('titter') +'/iframe/?origin='+encodeURIComponent(window.location.href)+id,
            webgoldIframeUrl: getServiceUrl('webgold') +"/add_funds"
        };
    },
    getJsonLDProperty: function (json,field) {
        for (var j = 0; j < json.length; j++) {
            var section = json[j];
            var data = section[field];
            if (data) {
                return data;
            }

        }
        return null;
    },
    componentDidMount: function () {
        if (!this.state.article) {
            return;
        }
        this.prepTwitWidget();
    },
    render: function () {
        var parts = [];

        var isComment = this.props.scripts
            .map(function(item) {
                return item.comment;
            })
            .filter(function(item) {
                return typeof item !== 'undefined';
            })
            .length > 0;

        if(!isComment) {
            return null;
        }

        var addCommentFundsMode;

        if (!this.state.addFundsMode) {
            addCommentFundsMode = (
                <ul className="breadcrumb">
                    <li className="active">{this.state.addComment}</li>
                    <li><a onClick={ this.switchToAddFundsMode }>Add funds</a></li>
                </ul>
            );
            if (this.props.nocomments) {
                return (
                    <div key="a" className="alert alert-warning">Comments are disabled. </div>
                );
            }
            if (this.state.article) {

                parts.push(
                    <section key="b">
                        <iframe id="titteriframe" src={this.state.titterFrameUrl} frameBorder="no" scrolling="no"/>
                        <div id="twitter_frame_container"></div>
                    </section>
                );
            }
        } else {
          addCommentFundsMode = (
            <ul className="breadcrumb">
            <li><a onClick={ this.switchToAddCommentMode }>{this.state.addComment}</a></li>
            <li className="active">Add funds</li>
            </ul>
          );
          parts.push(<iframe src={this.state.webgoldIframeUrl } style={ this.editIframeStyles } />);
        }



        return (
            <div>
                { addCommentFundsMode }

                {parts}
            </div>
        );
    }
});

export default CreateTitter;
