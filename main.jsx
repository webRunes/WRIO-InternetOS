var
    domready = require('domready'),
    React = require('react'),
    Reflux = require('reflux'),
    Showdown = require('./showdown.min'),
    converter = new Showdown.converter(),
    getFinalJSON = require('./js/storages/getFinalJSON'),
    finalMenuJsonArray = require('./js/storages/finalMenuJsonArray'),
    CreateDomLeft = require('./js/components/CreateDomLeft'),
    CreateDomCenter = require('./js/components/CreateDomCenter'),
    scriptsActions = require('./js/actions/scripts'),
    importUrl = require('./js/global').importUrl,
    wrio = {
        storageKey: 'plusLdModel',
        storageHubUrl: importUrl
    },
    wrioNamespace = window.wrio || {},
    updatedStorageHtml = '',
    storeageKeys = [],
    href = window.location.href,
    is_hashUrl = false,
    is_cover = false,
    addBootstrapLink = require('./js/addBootstrapLink');

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
          <li key={index}><a href={listURl} className={menuClass} data-url={href}>{comment.name}</a></li>  
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
  mixins: [Reflux.connect(getFinalJSON, 'data')],
  getInitialState: function() {
    return {data: []};
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
    mixins: [Reflux.ListenerMixin],
    componentDidMount: function () {
        this.listenTo(getFinalJSON, this.onStatusChange);
    },
    onStatusChange: function (status) {
        this.setState({
            jsonld: status
        });
    },
    getInitialState: function () {
        return {
            jsonld: []
        };
    },
    render: function() {
        return (
            <div className="row row-offcanvas row-offcanvas-right">
                <CreateDomLeft />
                <CreateDomCenter converter={converter} data={this.state.jsonld} />
                <CreateDomRight data={finalMenuJsonArray} />
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

domready(function () {
    addBootstrapLink(function () {
        React.render(
            <Main />,
            document.body.appendChild((function () {
              var d = document.createElement('div');
              d.id = 'content';
              d.className = 'container-liquid';
              return d;
            }())),
            scriptsActions.read
        );
    });
});

module.exports = Main;
