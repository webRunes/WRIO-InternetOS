/*jshint ignore:start */
/*jshint ignore:end */
/*global complete_script*/
var
    domready = require('domready'),
    React = require('react'),
    Reflux = require('reflux'),
    Plus = require('plus'),
    ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin,
    request = require('superagent'),
    scriptsStore = require('./js/storages/scripts'),
    Showdown = require('./showdown.min'),
    converter = new Showdown.converter(),
    getFinalJSON = require('./js/storages/getFinalJSON'),
    finalMentionsArray = require('./js/storages/finalMentionsArray'),
    finalMenuJsonArray = require('./js/storages/finalMenuJsonArray'),
    finalListJsonArray = require('./js/storages/finalListJsonArray'),

    CreateDomCenter = require('./js/components/CreateDomCenter'),
    scriptsActions = require('./js/actions/scripts'),

    importUrl = require('./js/global').importUrl,
    cssUrl = require('./js/global').cssUrl,
    theme = require('./js/global').theme,
    themeImportUrl = require('./js/global').themeImportUrl,

    wrio = {
        storageKey: 'plusLdModel',
        storageHubUrl: importUrl
    },
    wrioNamespace = window.wrio || {};
    updatedStorageHtml = '',
    storeageKeys = [],
    href = window.location.href,
    is_hashUrl = false,
    is_cover = false,
    addBootstrapLink = require('./js/addBootstrapLink');

var finalJson;
var itemListArray = [];

var CreateDomLeft = React.createClass({
    render: function() {
        return (
            <div className="col-xs-12 col-sm-3 col-md-2">
                <div className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu">
                    <div className="navbar-header tooltip-demo" id="topMenu">
                        <ul className="nav menu pull-right">
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Call IA">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-comment" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Logout">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-lock" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Full screen">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-fullscreen" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Open/close menu">
                                <a data-target=".navbar-collapse" data-toggle="collapse" className="btn btn-link btn-sm visible-xs collapsed" href="#">
                                    <span className="glyphicon glyphicon-align-justify" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Show/hide the sidebar">
                                <a data-toggle="offcanvas" id="myoffcanvas" className="btn btn-link btn-sm visible-xs" href="#">
                                    <span className="glyphicon glyphicon-transfer" />
                                </a>
                            </li>
                        </ul>
                        <a title="" data-placement="right" data-toggle="tooltip" className="navbar-brand" href="webrunes-contact.htm" data-original-title="Contact us">&nbsp;</a>
                    </div>
                    <Plus themeImportUrl={themeImportUrl} />
                </div>
            </div>
        );
    }
});



var CreateDomRight = React.createClass({
  render: function() {
    return (
      <div className="col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas" id="sidebar">
        <div className="sidebar-margin">
          <CreateArticleItemMenu data={this.props.data}/>
        </div>
      </div>
    );
  }
});

var CreateArticleItemMenu = React.createClass({
  render: function() {
     var commentItemMenus = this.props.data.map(function(comment, index) {
       var commentMenustring = comment.name.replace(/\s/g, '_');
       var href = comment.url ? comment.url : '#' + commentMenustring;
     var listURl = '#' + commentMenustring;
     var menuClass =comment.class;
    
      return (
          <li key={index}><a href={listURl}  className={menuClass} data-url={href}>{comment.name}</a></li>  
      );
    });        
    
    return (    
        <ul className="nav nav-pills nav-stacked">
        {commentItemMenus}
        </ul>
    );
  }
});

// for right menu

var CreateCommentMenus = React.createClass({
  loadCommentsFromServer: function() {
  this.setState({data: finalJson});
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
        <CreateItemMenu data={this.state.data} />
    );
  }
});

var CreateItemMenu = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  render: function() {
    var commentMenus = this.props.data.map(function(comment, index) {
      var commentMenustring = comment.articlename.replace(/\s/g, '_');
      var href = comment.url ? comment.url : '#' + commentMenustring;
      return (
        <li key={index}>
            <a href={href}>{comment.articlename}</a>
        </li>
      );
    });
    return (
        <ul className="nav nav-pills nav-stacked">
            {commentMenus}
        </ul>
    );
  }
});

var Main = React.createClass({
    mixins: [
        ReactScriptLoaderMixin,
        Reflux.connect(getFinalJSON, 'jsonld')
    ],
    getScriptURL: function () {
        return '//code.jquery.com/jquery-2.1.4.js';
    },
    onScriptLoaded: function () {
        addBootstrapLink();
    },
    onScriptError: function () {
        console.error('jquery not loaded');
    },
    render: function() {
        return (
            <div id="content" className="container-liquid">
                <div className="row row-offcanvas row-offcanvas-right">
                    <CreateDomLeft />
                    <CreateDomCenter converter={converter} data={this.state.jsonld} />
                    <CreateDomRight data={finalMenuJsonArray} />
                </div>
            </div>
        );
    }
});




var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        <Comment author={comment.author} key={index}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

Reflux.createStore({
    init: function() {
        this.listenTo(scriptsStore, function (data) {
            window.complete_script = data;
        });
    }
});

Reflux.createStore({
    init: function() {
        this.listenTo(getFinalJSON, function (data) {
            finalJson = data;
        });
    }
});

scriptsActions.read();

domready(function () {
    React.render(
        <Main />,
        document.body
    );
});

module.exports = Main;
