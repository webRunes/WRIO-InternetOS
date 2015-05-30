/*jshint ignore:start */
/*jshint ignore:end */
var
    domready = require('domready'),
    React = require('react'),
    plus = require('./js/ext/plus'),
    CreateTitter = require('./js/ext/titter.jsx'),
    Login = require('./js/ext/login.jsx'),
    getScripts = require('./js/getScripts'),
    $ = require('jquery'),
    Showdown = require('./showdown.min'),
    converter = new Showdown.converter(),
    getFinalJSON = require('./js/storages/getFinalJSON'),
    finalMetionsArray = require('./js/storages/finalMetionsArray'),
    finalMenuJsonArray = require('./js/storages/finalMenuJsonArray'),
    finalListJsonArray = require('./js/storages/finalListJsonArray'),

    CreateArticleList = require('./js/components/CreateArticleList'),

    importUrl = require('./js/global').importUrl,
    cssUrl = require('./js/global').cssUrl,
    theme = require('./js/global').theme,
    themeImportUrl = require('./js/global').themeImportUrl,

    wrio = {
        storageKey: 'plusLdModel',
        storageHubUrl: importUrl
    },
    $accordion = $('<ul class="nav navbar-nav" id="nav-accordion"></ul>'),
    wrioNamespace = window.wrio || {};
    updatedStorageHtml = "",
    storeageKeys = [],
    href = window.location.href,
    is_list = false,
    isAirticlelist = require('./js/global').isAirticlelist,
    is_hashUrl = false,
    is_cover = false,
    addBootstrapLink = require('./js/addBootstrapLink');

addBootstrapLink();

var finalJson;
var itemListArray = [];


var CreateDomLeft = React.createClass({
  render: function() {    
    return (
      <div className="col-xs-12 col-sm-3 col-md-2"><div className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu"><div className="navbar-header tooltip-demo" id="topMenu"><ul className="nav menu pull-right"><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Call IA"><a className="btn btn-link btn-sm" href="#"><span className="glyphicon glyphicon-comment"></span></a></li><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Logout"><a className="btn btn-link btn-sm" href="#"><span className="glyphicon glyphicon-lock"></span></a></li><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Full screen"><a className="btn btn-link btn-sm" href="#"><span className="glyphicon glyphicon-fullscreen"></span></a></li><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Open/close menu"><a data-target=".navbar-collapse" data-toggle="collapse" className="btn btn-link btn-sm visible-xs collapsed" href="#"><span className="glyphicon glyphicon-align-justify"></span></a></li><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Show/hide the sidebar"><a data-toggle="offcanvas" id="myoffcanvas"  className="btn btn-link btn-sm visible-xs" href="#"><span className="glyphicon glyphicon-transfer"></span></a></li></ul><a title="" data-placement="right" data-toggle="tooltip" className="navbar-brand" href="webrunes-contact.htm" data-original-title="Contact us">&nbsp;</a></div><div className="navbar-collapse in"><div className="navbar-header" id="leftMenuwrp"><CreateLeftCommentMenus /></div></div></div></div>
    );
  }
});

var CreateLeftCommentMenus = React.createClass({
  componentDidMount: function() {
    $.get(
        themeImportUrl + 'defaultList.htm',
        function (result) {
            var e = document.createElement('div');
            e.innerHTML = result
            localStorage.setItem("plusTabItem", JSON.stringify(JSON.parse(e.getElementsByTagName('script')[0].innerText).itemListElement));
        }
    );
    plus.updatePlusStorage();
  },
  render: function() {
    return (    
    <CreateLeftItemMenu />    
    );
  }           
});

var CreateLeftItemMenu = React.createClass({
    render: function() {
        return (    
            <section />
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


var CreateDomCenter = React.createClass({
  render: function() {
    return (
      <div className="content col-xs-12 col-sm-5 col-md-7" id="centerWrp">
        <div className="margin">
          <Login importUrl={importUrl} theme={theme} />
          <CreateBreadcrumb />
          <CreateItemList />
          <CreateArticleList data={finalJson} />
          <CreateTitter scripts={window.complete_script} />
        </div>
      </div>
    );
  }
});

var CreateBreadcrumb = React.createClass({
  render: function() {
   
         var htmlBreadcrumb='<ul class="breadcrumb controls tooltip-demo"><li title="Read time" data-placement="top" data-toggle="tooltip"><span class="glyphicon glyphicon-time"></span>4-5 minutes</li><li title="Last modified" data-placement="top" data-toggle="tooltip"><span class="glyphicon glyphicon-calendar"></span>30 May, 2014</li></ul><ul itemprop="breadcrumb" class="breadcrumb"><li class="active">Read</li><li><a href="#">Edit</a></li></ul>';
   
      var rawMarkup = converter.makeHtml(htmlBreadcrumb.toString());
    if(rawMarkup === "") return null;
      return (
        <section dangerouslySetInnerHTML={{__html: rawMarkup}}></section>
      );
  }
});


// for list
var CreateItemList = React.createClass({
  loadCommentsFromServer: function() {
  
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
   // for list tab
    if(is_list==true){
     localStorage.setItem("myListItem", JSON.stringify(finalListJsonArray ));  //set plus tab item
    // getlist();
  }
  // for list tab
  this.loadCommentsFromServer();
  },
  render: function() {
    return (  
            <CreateList data={this.state.data} />
   );
  }
});

var CreateList = React.createClass({
  render: function() {
      var rawMarkup = converter.makeHtml(this.props.data.toString());
    if(rawMarkup=="") return false;
      return (                    
    <section dangerouslySetInnerHTML={{__html: rawMarkup}}></section>
      );
  }
});
// for list


var Main = React.createClass({
  render: function() {
    window.complete_script = getScripts();
    finalJson = getFinalJSON(complete_script);
    return (
        <div id="content" className="container-liquid">
            <div className="row row-offcanvas row-offcanvas-right">
                <CreateDomLeft />
                <CreateDomCenter />
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

domready(function () {
    React.render(
        <Main />,
        document.body
    );
});
