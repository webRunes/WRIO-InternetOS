function loadScripts(array,callback){
    var loader = function(src,handler){
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function(){
        script.onreadystatechange = script.onload = null;
          handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild( script );
    };
    (function(){
        if(array.length!=0){
          loader(array.shift(),arguments.callee);
        }else{
          callback && callback();
        }
    })();
}


loadScripts([
   "http://wrio.s3-website-us-east-1.amazonaws.com/WRIO-InternetOS/require.js"
],function(){
    require.config({
            waitSeconds : 0,
            baseUrl: "scripts/",
          
            paths: {
            "jquery": "jquery.min",
            "bootstrap":"bootstrap.min",
            "react": "react",  
            "JSXTransformer": "JSXTransformer",
            "showdown": "showdown.min",
            "plus":"http://codingserver.com/react/Plus-WRIO-App-master/plus",
            "client":"client",
            "promise":"promise-1.0.0.min",
            "wrio": "WRIODEMO"
            },   
            jsx: {
            fileExtension: '.jsx',
            harmony: true,   
            stripTypes: true
            }, shim : {
              "bootstrap" : { "deps" :['jquery'] }
            },
          });
        require(['react', 'jsx!wrio'], function(React, CreateDom) { 
        // Mount the JSX component in the app container 
        React.render(
            CreateDom(),            
            document.body);
        });
});



///**
// * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
// * Facebook reserves all rights not expressly granted.
// *
// * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// */
//
//var importUrl = '.';
//var cssUrl = 'http://webrunes.github.io';
//var theme = '/Default-WRIO-Theme';
//// (function(){
////     'use strict';
//// var addBootstrapLink = function(){
////         var link = document.createElement('link');
////         link.rel = 'stylesheet';
////         link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css';
////         document.head.appendChild(link);
//
////         link = document.createElement('link');
////         link.rel = 'stylesheet';
////         link.href = cssUrl + theme + '/css/webrunes.css';
////         document.head.appendChild(link);
//
////         link = document.createElement('link');
////         link.rel = 'shortcut icon';
////         link.href = cssUrl + theme + '/ico/favicon.ico';
////         document.head.appendChild(link);
//
////         var script = document.createElement('script');
////         script.src = '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js';
////         document.head.appendChild(script);
////     };
//// })();
//
//var converter = new Showdown.converter();
//
//// var Head = React.createClass({
////   render: function() {
////     return (
////       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
////       <link rel="stylesheet" href="http://webrunes.github.io/Default-WRIO-Theme/css/webrunes.css" />
////       <link rel="shortcut icon" href="http://webrunes.github.io/Default-WRIO-Theme/ico/favicon.ico" />
////       <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
////     );                      
////   }
//// });
//
//var finalJson;
//var finalJsonArray = [];
//var getScripts = function(){  
//  var scripts = document.getElementsByTagName("script");
//  var jsonData = new Object();
//  var jsonArray = [];
//  var has = false;
//    for(var i=0; i< scripts.length; i++){
//    if(scripts[i].type=='application/ld+json'){
//      has = true;
//      jsonData = JSON.parse(scripts[i].innerHTML);
//      jsonArray.push(jsonData);
//    }
//  }
//  var completeJson = jsonArray;
//  finalJson = getFinalJSON(completeJson);
//}
//var getFinalJSON = function(json,hasPart){
//  if(hasPart==undefined){
//    hasPart = false;
//  }
//  $.each(json,function(i,item){     
//    comment = this;
//    var is_article = false;
//    if(comment['@type']=='Article'){
//      is_article = true;
//    }
//    
//    var articlebody = comment['articleBody'];
//    if(comment['articleBody']==undefined){
//      articlebody = '';
//    }
//    var newArticle='';
//    for(var i=0;i < articlebody.length;i++){
//   //   alert(i)
////   console.log(articlebody);
//      if(i>0){        
//        //newArticle = newArticle +'</p>';
//      //  alert(newArticle);
//      }
//      newArticle +=  '<p>' + articlebody[i]  + '</p>';
//    }
//    
//    row = {
//      "is_article": is_article,
//      "articlename": comment['name'],
//      "articleBody": newArticle,
//      "url": '',//comment['url']
//      "hasPart": hasPart
//    }
//    finalJsonArray.push(row);
//    //console.log((finalJsonArray).length);
//    if(comment.hasPart!=undefined){
//      if((comment.hasPart).length > 0){
//        hasParts = comment.hasPart;   
//        getFinalJSON(hasParts,true);
//      }
//    }
//  });
//  return finalJsonArray;
//}
//
//var CreateDomLeft = React.createClass({
//  render: function() {    
//    return (
//      <div className="col-xs-12 col-sm-3 col-md-2"><div className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu"><div className="navbar-header"></div><div className="navbar-collapse in"></div></div></div>
//    );
//  }
//});
//
//var CreateDomRight = React.createClass({
//  render: function() {    
//    return (
//      <div className="col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas" id="sidebar">
//      <div className="sidebar-margin"><CreateCommentMenus></CreateCommentMenus></div></div>
//    );
//  }
//});
//
//var CreateCommentMenus = React.createClass({
//  loadCommentsFromServer: function() {
//  this.setState({data: finalJson});
//  },
//  getInitialState: function() {
//    return {data: []};
//  },
//  componentDidMount: function() {
//    this.loadCommentsFromServer();
//    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//  },
//  render: function() {
//    return (  
//            <CreateItemMenu data={this.state.data} />
//
//    );
//  }
//});
//
//var CreateItemMenu = React.createClass({
//  render: function() {
//    var commentMenus = this.props.data.map(function(comment, index) {
//      if(comment.is_article==false) return false;
//      var href = comment.url ? comment.url : '#' + comment.articlename;
//      return (          
//          <li><a href={href}>{comment.articlename}</a></li>
//      );
//    });
//    
//    return (
//        <ul className="nav nav-pills nav-stacked">
//        {commentMenus}
//        </ul>
//    );
//  }
//});
//
//var CreateDomCenter = React.createClass({
//  render: function() {
//    return (
//      <div className="content col-xs-12 col-sm-5 col-md-7">
//      <div className="margin"><CreateArticleList  url="comments.json"></CreateArticleList><CreateTitter></CreateTitter></div></div>
//    );
//  }
//});
//
//var CreateTitter = React.createClass({
//  loadTwittCommentsFromServer: function() {
//    var url = importUrl + '/Titter-WRIO-App/widget/titter.htm';
//  $.ajax({
//      url: url,
//      dataType: 'html',
//      success: function(data) {
//      //console.log(data);
//      this.setState({data: data});
//      }.bind(this),
//      error: function(xhr, status, err) {
//        console.error(url, status, err.toString());
//      }.bind(this)
//    });
//  },
//  getInitialState: function() {
//    return {data: []};
//  },
//  componentDidMount: function() {
//    this.loadTwittCommentsFromServer();
//    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//  !function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https'; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = p + "://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); } }(document, "script", "twitter-wjs");
//  },
//  render: function() {    
//    return (  
//        <CreateOneTitter data={this.state.data} />
//    );  
//  }
//  /*
//  render: function() {
//    
//    return (
//      <div id="titter-id">
//        <form className="margin-bottom" role="form">
//            <div className="form-group col-xs-12 has-error">
//                <textarea rows="3" className="form-control" placeholder="Let us know your thoughts! Max 672 characters"></textarea>
//                <div className="help-block">Max 672 characters</div>
//            </div>
//            <div className="form-group col-xs-12">
//                <div className="btn-group tooltip-demo">
//                    <button type="button" className="btn btn-default active"><span className="glyphicon glyphicon-pencil"></span>Text</button>
//                    <button type="button" className="btn btn-default disabled" data-toggle="tooltip" data-placement="right" title="Coming soon"><span className="glyphicon glyphicon-camera"></span>Photo</button>
//                </div>
//                <div className="pull-right">
//                    <div className="pull-right">
//                        <label className="comment-limit">672</label>
//                        <button type="button" className="btn btn-primary"><span className="glyphicon glyphicon-ok"></span>Submit</button>
//                    </div>
//                </div>
//            </div>
//        </form>
//        </div>
//    );
//  }*/
//});
//
//var CreateOneTitter = React.createClass({
//  render: function() {
//    var rawMarkup = converter.makeHtml(this.props.data.toString());
//    if(rawMarkup=="") return false;
//      return (                    
//    <section dangerouslySetInnerHTML={{__html: rawMarkup}}></section>
//      );
//  
//    /*return (
//      <titter-widget>
//        {titterWidget}
//      </titter-widget>
//    );*/
//  }
//});
//
//var CreateDom = React.createClass({
//  render: function() {
//    getScripts();
//    return (
//      <div id="content" className="container-liquid">
//      <div className="row row-offcanvas row-offcanvas-right">
//    <CreateDomLeft></CreateDomLeft>
//      <CreateDomCenter></CreateDomCenter>
//      <CreateDomRight></CreateDomRight>
//      </div>
//      </div>
//    );
//  }
//});
//
//var CreateArticleList = React.createClass({
//  loadCommentsFromServer: function() {
//  this.setState({data: finalJson});
//    /*$.ajax({
//      url: this.props.url,
//      dataType: 'json',
//      success: function(data) {
//        //this.setState({data: data});
//      }.bind(this),
//      error: function(xhr, status, err) {
//        console.error(this.props.url, status, err.toString());
//      }.bind(this)
//    });*/
//  },
//  getInitialState: function() {
//    return {data: []};
//  },
//  componentDidMount: function() {
//    this.loadCommentsFromServer();
//    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//  },
//  render: function() {
//    return (  
//            <CreateArticle data={this.state.data} />
//
//    );
//  }
//});
//
//var printJson = function(json){  
//   var commentNodes = json.map(function(comment, index) {
//    if(comment.is_article==false) return false;
//      return (
//        // `key` is a React-specific concept and is not mandatory for the
//        // purpose of this tutorial. if you're curious, see more here:
//        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
//        <CreatArticleEl articlename={comment.articlename} key={index} hasPart={comment.hasPart}>
//          {comment.articleBody}
//        </CreatArticleEl>
//      );
//    });
//  
//    return (
//        <article>
//        {commentNodes}
//        </article>
//    );
//}
//
//var CreateArticle = React.createClass({
//  render: function() {
//  
//  return printJson(this.props.data);
//    
//    /*var commentNodes = this.props.data.map(function(comment, index) { 
//      return (
//        // `key` is a React-specific concept and is not mandatory for the
//        // purpose of this tutorial. if you're curious, see more here:
//        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
//        <CreatArticleEl articlename={comment.name} key={index}>
//          {comment.articleBody}
//        </CreatArticleEl>
//      );
//    });
//  
//    return (
//      <div className="commentList">
//        {commentNodes}
//      </div>
//    );*/
//  }
//});
//
//var CreatArticleEl = React.createClass({
//  loadArticleFromServer: function(title,children,hasPart,rawMarkup) {
//  var url = importUrl + '/Titter-WRIO-App/widget/article.htm';
//  $.ajax({
//      url: url,
//      dataType: 'html',
//      data: { haspart : title },
//      success: function(data) {
//     // alert(data);
//     if(hasPart==true){
//        if(rawMarkup==""){
//            var html='<h2 id="{this.props.articlename}">{this.props.articlename}</h2>';
//        }else{
//            var html=data.replace('<header class="col-xs-12"><h1 id="{this.props.articlename}">{this.props.articlename}</h1></header>','<h2 id={this.props.articlename}>{this.props.articlename}</h2>');
//        }
//      }else{
//        var html=data;
//      }
//      var res = html.replace(/{this.props.articlename}/g,title);
//       res = res.replace("{description}",children);
//       res = res.replace(/<p>/g,'<div class="paragraph"><div class="col-xs-12 col-md-6"><p itemprop="description">');
//       res = res.replace(/p>/g,'</p></div><div class="col-xs-12 col-md-6"><aside><span class="glyphicon glyphicon-comment" data-toggle="tooltip" data-placement="right" title="Not yet available"></span></aside></div></div>');
//       this.setState({data: res});
//      }.bind(this),
//      error: function(xhr, status, err) {
//        console.error(url, status, err.toString());
//      }.bind(this)
//    });
//  },
//  getInitialState: function() {
//    return {data: []};
//  },
//  componentDidMount: function() {
//    var rawMarkup = converter.makeHtml(this.props.children.toString()); 
//    this.loadArticleFromServer(this.props.articlename,this.props.children,this.props.hasPart,rawMarkup); 
//  },
//  render: function() {
//     return data =  <section  dangerouslySetInnerHTML={{__html: this.state.data}}>
//        </section>;
//  
//  /*if(rawMarkup!=""){
//    var array = rawMarkup.split('<br/><br/>');
//    if(array.length > 1){
//      newRawMarkup = '';
//      for(var i=0;i<array.length;i++){
//        newRawMarkup += <div className="paragraph">
//          <div className="col-xs-12 col-md-6" dangerouslySetInnerHTML={{__html: array[i]}} />
//          <div className="col-xs-12 col-md-6">
//          <aside>
//            <span className="glyphicon glyphicon-comment" data-toggle="tooltip" data-placement="right" title="Not yet available"></span>
//          </aside>
//          </div>
//        </div>
//        alert(newRawMarkup);
//      }
//    }
//  }*/  
//   /* if(this.props.hasPart==true){
//    if(rawMarkup==""){
//      data = 
//       <section>
//        <h2 id={this.props.articlename}>{this.props.articlename}</h2>       
//        </section>
//    }else{
//      data = 
//       <section>
//        <h2 id={this.props.articlename}>{this.props.articlename}</h2>
//        <div className="paragraph">
//          <div className="col-xs-12 col-md-6" dangerouslySetInnerHTML={{__html: rawMarkup}} />
//          <div className="col-xs-12 col-md-6">
//          <aside>
//            <span className="glyphicon glyphicon-comment" data-toggle="tooltip" data-placement="right" title="Not yet available"></span>
//          </aside>
//          </div>
//        </div>
//        </section>
//    }
//  }else{
//    data = (
//     <section>
//        <header className="col-xs-12">
//            <h1 id={this.props.articlename}>{this.props.articlename}</h1>                 
//          </header>
//      <div className="paragraph">
//            <div className="col-xs-12 col-md-6" dangerouslySetInnerHTML={{__html: rawMarkup}} />
//        <div className="col-xs-12 col-md-6">
//        <aside>
//          <span className="glyphicon glyphicon-comment" data-toggle="tooltip" data-placement="right" title="Not yet available"></span>
//        </aside>
//        </div>
//      </div>
//      </section>
//    );
//  }*/
//  // var article_data = converter.makeHtml(this.state.data.toString());
//  // data = (
//  //     <span dangerouslySetInnerHTML={{__html: article_data}} />
//  //   );
//  /*return data;*/
//  }
//});
//
//
//var Comment = React.createClass({
//  render: function() {
//    var rawMarkup = converter.makeHtml(this.props.children.toString());
//    return (
//      <div className="comment">
//        <h2 className="commentAuthor">
//          {this.props.author}
//        </h2>
//        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
//      </div>
//    );
//  }
//});
//
//var CommentBox = React.createClass({
//  loadCommentsFromServer: function() {
//    $.ajax({
//      url: this.props.url,
//      dataType: 'json',
//      success: function(data) {
//        this.setState({data: data});
//      }.bind(this),
//      error: function(xhr, status, err) {
//        console.error(this.props.url, status, err.toString());
//      }.bind(this)
//    });
//  },
//  handleCommentSubmit: function(comment) {
//    var comments = this.state.data;
//    comments.push(comment);
//    this.setState({data: comments}, function() {
//      // `setState` accepts a callback. To avoid (improbable) race condition,
//      // `we'll send the ajax request right after we optimistically set the new
//      // `state.
//      $.ajax({
//        url: this.props.url,
//        dataType: 'json',
//        type: 'POST',
//        data: comment,
//        success: function(data) {
//          this.setState({data: data});
//        }.bind(this),
//        error: function(xhr, status, err) {
//          console.error(this.props.url, status, err.toString());
//        }.bind(this)
//      });
//    });
//  },
//  getInitialState: function() {
//    return {data: []};
//  },
//  componentDidMount: function() {
//    this.loadCommentsFromServer();
//    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//  },
//  render: function() {
//    return (
//      <div className="commentBox">
//        <h1>Comments</h1>
//        <CommentList data={this.state.data} />
//        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
//      </div>
//    );
//  }
//});
//
//var CommentList = React.createClass({
//  render: function() {
//    var commentNodes = this.props.data.map(function(comment, index) {
//      return (
//        // `key` is a React-specific concept and is not mandatory for the
//        // purpose of this tutorial. if you're curious, see more here:
//        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
//        <Comment author={comment.author} key={index}>
//          {comment.text}
//        </Comment>
//      );
//    });
//    return (
//      <div className="commentList">
//        {commentNodes}
//      </div>
//    );
//  }
//});
//
//var CommentForm = React.createClass({
//  handleSubmit: function(e) {
//    e.preventDefault();
//    var author = this.refs.author.getDOMNode().value.trim();
//    var text = this.refs.text.getDOMNode().value.trim();
//    if (!text || !author) {
//      return;
//    }
//    this.props.onCommentSubmit({author: author, text: text});
//    this.refs.author.getDOMNode().value = '';
//    this.refs.text.getDOMNode().value = '';
//  },
//  render: function() {
//    return (
//      <form className="commentForm" onSubmit={this.handleSubmit}>
//        <input type="text" placeholder="Your name" ref="author" />
//        <input type="text" placeholder="Say something..." ref="text" />
//        <input type="submit" value="Post" />
//      </form>
//    );
//  }
//});

// React.render(
//   <CommentBox url="comments.json"/>,
//   document.getElementById('content')
// );

//React.render(
//    <CreateDom/>,
//    document.body
//  );

// React.render(
//   <Head />,
//   document.getElementById('head')
// );




