define(['react','plus','promise','client','jquery','bootstrap','showdown'], function(React,plus) {   
/**  
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.  
 * Facebook reserves all rights not expressly granted.  
 *       
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN    
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
 */      
  
var importUrl = 'http://wrio.s3-website-us-east-1.amazonaws.com/';
var cssUrl = 'http://webrunes.github.io/';
var theme = 'Default-WRIO-Theme';
var themeImportUrl='https://raw.githubusercontent.com/webRunes/';

//by me 
var wrio = {};
wrio.storageKey = 'plusLdModel';
wrio.storageHubUrl = importUrl;
var $accordion = $('<ul class="nav navbar-nav" id="nav-accordion"></ul>');
var wrioNamespace = window.wrio || {};
var updatedStorageHtml=""; 
var storeageKeys=[];
var href =window.location.href; 
//by me


 (function(){
     'use strict';
	 
	 // for plus tab
	  $('body').on('click','.plusIcon',function() {
		  $('.active').removeClass('active');
		  $('.removeParent').removeClass('collapsed');
		  $('.parentNodeA').removeClass('collapsed');
		  $('.new').addClass('active');
		  defaultList();
	  });
	  // for plus tab
	 
 var addBootstrapLink = function(){
         var link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css';
         document.head.appendChild(link);

         link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = cssUrl + theme + '/css/webrunes.css';
         document.head.appendChild(link);

         link = document.createElement('link');
         link.rel = 'shortcut icon';
         link.href = cssUrl + theme + '/ico/favicon.ico';
         document.head.appendChild(link);
     };
	 addBootstrapLink();
 })();

var converter = new Showdown.converter();

var finalJson;
var finalJsonArray = [];

var getScripts = function(){
	var scripts = document.getElementsByTagName("script");
	var jsonData = new Object();
	var jsonArray = [];
	var has = false;
  	for(var i=0; i< scripts.length; i++){
		if(scripts[i].type=='application/ld+json'){
			has = true;
			jsonData = JSON.parse(scripts[i].innerHTML);
			jsonArray.push(jsonData);
		}
	}
	var completeJson = jsonArray;
	complete_script=completeJson;

	finalJson = getFinalJSON(completeJson);
}

var getFinalJSON = function(json,hasPart){
	if(hasPart==undefined){
		hasPart = false;
	}
	$.each(json,function(i,item){	
		comment = this;
		var is_article = false;
		if(comment['@type']=='Article'){
			is_article = true;
		}
		
		var articlebody = comment['articleBody'];
		if(comment['articleBody']==undefined){
			articlebody = '';
		}
		var newArticle='';
		for(var i=0;i < articlebody.length;i++){
			if(i>0){
			}
			newArticle +=  '<p>' + articlebody[i]  + '</p>';
		}
		
		row = {
			"is_article": is_article,
			"articlename": comment['name'],
			"articleBody": newArticle,
			"url": '',//comment['url']
			"hasPart": hasPart
		}
		finalJsonArray.push(row);
		//console.log((finalJsonArray).length);
		if(comment.hasPart!=undefined){
			if((comment.hasPart).length > 0){
				hasParts = comment.hasPart;	
				getFinalJSON(hasParts,true);
			}
		}
	});
	return finalJsonArray;
}

var CreateDomLeft = React.createClass({
  render: function() {    
    return (
      <div className="col-xs-12 col-sm-3 col-md-2"><div className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu"><div className="navbar-header" id="leftMenuwrp"><CreateLeftCommentMenus></CreateLeftCommentMenus></div><div className="navbar-collapse in"></div></div></div>
    );
  }
});

var CreateLeftCommentMenus = React.createClass({
  loadCommentsFromServer: function() {
    
	
	     var reactObj = this;
		 
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
      // for plus tab
     // var url = importUrl + 'Default-WRIO-Theme/widget/defaultList.htm';
	  var url= themeImportUrl + 'defaultList.htm';
	  
      var jsonItemArray = [];
	  $.get(url, function(result){
        jQuery('<div/>', {
        id: 'foo',
        css:{
          display:'none'
        },
        html: result
      }).appendTo('body');
           defaultPlusList=$('script#defaultPlusList').html();
		   $('#foo').remove();
	       defaultPlusListJson = JSON.parse(defaultPlusList);	  
		   plusItemList=defaultPlusListJson.itemListElement;
	       localStorage.setItem("plusTabItem", JSON.stringify( plusItemList ));  //set plus tab item
	  }); // for plus tab
  
     plus.updatePlusStorage(); 
	 this.loadCommentsFromServer();
  },
  render: function() {
    return (  	
			<CreateLeftItemMenu data={this.state.data} />		
    );
  }           
}); 

var CreateLeftItemMenu = React.createClass({
  render: function(data) {
      var rawMarkup = converter.makeHtml(this.props.data.toString());
	  return (    
		<section dangerouslySetInnerHTML={{__html: rawMarkup}}></section>
    );
  }
}); 


var CreateDomRight = React.createClass({
  render: function() {
    return (
      <div className="col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas" id="sidebar">
      <div className="sidebar-margin"><CreateCommentMenus></CreateCommentMenus></div></div>
    );
  }
});

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
				  <li key={index}><a href={href}>{comment.articlename}</a></li>   
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
      <div className="content col-xs-12 col-sm-5 col-md-7">
      <div className="margin"><Login></Login><CreateArticleList  url="comments.json"></CreateArticleList><CreateTitter></CreateTitter></div></div>
    );
  }
});

var CreateTitter = React.createClass({
  loadTwittCommentsFromServer: function() {
  var url = importUrl + 'Titter-WRIO-App/widget/titter.htm';  // Titter Path
  $.ajax({
      url: url,
      dataType: 'html',
      success: function(data) {
      this.setState({data: data});
             $( "#comment" ).keypress(function() {
        lineHeight = 14;
        var canvas = document.getElementById('twitterPost');
        if (canvas.getContext) {    
          var ctx = canvas.getContext('2d');
          var context=ctx;
          var text=document.getElementById('comment').value;
          var x=5;
          var y=20;
          var maxWidth=canvas.width;
          var lineHeight=lineHeight;
          var simulate=true;
          console.log(text.length)
          var words = text.split(' ');
          var line = '';
          
          for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              context.fillText(line, x, y);
              line = words[n] + ' ';
              y += lineHeight;
            }
            else {
              line = testLine;
            }
          }
          //if (!simulate) {
            context.fillText(line, x, y);
          //} 
          ms_height =y + lineHeight + lineHeight*2;     
          canvas.height = ms_height+5;    
          ctx.fillStyle = '#ffffff'; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);    
          ctx.font = '12px Tahoma';   
          ctx.fillStyle = '#292f33';   
          ctx.fillStyle = '#666666';    
          ctx.fillText('Posted via Titter - Advanced tweets http://titter.webrunes.com', 2, ms_height);
        }
  }); 
   $( "#sendComment" ).on('click',function(event) {
      event.preventDefault();
      var canvas = document.getElementById('twitterPost');
            var comment = document.getElementById('comment').value;
            var imageData = canvas.toDataURL('image/png');
            
            //dataType: 'json', removed because of ajax error
            $.ajax({
              url: 'http://54.235.73.25:5001/sendComment',
              type: 'post',
              dataType: 'json',
              data: {
              'fileData': imageData,
              'comment': window.location.origin
            },
            }).done(function(data) {
              document.getElementById('comment').value = '';
              console.log('successfully sent');
              $('#result').html('Successfully sent!').removeClass('redError');
            
            }).fail(function(request,error) {
              console.log('Request: ' + JSON.stringify(request));
              $('#result').html('Error while executing your request :(').addClass('redError');
            });   
  });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadTwittCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  !function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https'; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = p + "://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); } }(document, "script", "twitter-wjs");
  },
  render: function() {
    return (
        <CreateOneTitter data={this.state.data} />
    );
  }

});

var CreateOneTitter = React.createClass({
  render: function() {
	  var rawMarkup = converter.makeHtml(this.props.data.toString());
	  if(rawMarkup=="") return false;
      return (
		<section dangerouslySetInnerHTML={{__html: rawMarkup}}></section>
      );
  }
});

var CreateDom = React.createClass({
  render: function() {
	  getScripts();
    return (
      <div id="content" className="container-liquid">
      <div className="row row-offcanvas row-offcanvas-right">
	  <CreateDomLeft></CreateDomLeft>
      <CreateDomCenter></CreateDomCenter>
      <CreateDomRight></CreateDomRight>
      </div>
      </div>
    );
  }
});

var CreateArticleList = React.createClass({
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
    	<CreateArticle data={this.state.data} />
    );
  }
});


var Login = React.createClass({loadLoginFromServer: function() {
  var url = importUrl + 'Login-WRIO-App/widget/login.htm';
  $.ajax({
      url: url,
      dataType: 'html',
      success: function(data) {
     // alert(data);
        var html=data;     
       this.setState({data: html});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadLoginFromServer(); 
  },
  render: function() {
     return data =  <section  dangerouslySetInnerHTML={{__html: this.state.data}}>
        </section>;
  }
    });

var printJson = function(json){
	 var commentNodes = json.map(function(comment, index) {
		if(comment.is_article==false) return false;
      return (
        <CreatArticleEl articlename={comment.articlename} key={index} hasPart={comment.hasPart}>
          {comment.articleBody}
        </CreatArticleEl>
      );
    });
	
    return (
      	<article>
        {commentNodes}
        </article>
    );
}

var CreateArticle = React.createClass({
  render: function() {
	return printJson(this.props.data);
  }
});

var CreatArticleEl = React.createClass({
  loadArticleFromServer: function(title,children,hasPart,rawMarkup) {
	var url = 'https://webrunes.github.io/' + theme + '/widget/article.htm';	// Article Path  
  var CreatArticleID = title.replace(/\s/g, '_'); // Article ID
  $.ajax({
      url: url,
      dataType: 'html',
     // data: { haspart : title },
      success: function(data) {
     //alert(data);
		 if(hasPart==true){
				if(rawMarkup==""){
						var html='<h2 id="{this.props.articleid}">{this.props.articlename}</h2>';
				}else{
						var html=data.replace('<header class="col-xs-12"><h1 id="{this.props.articleid}">{this.props.articlename}</h1></header>','<h2 id={this.props.articleid}>{this.props.articlename}</h2>');
				}
		  }else{
				var html=data;
		  }
		  var res = html.replace(/{this.props.articlename}/g,title);
      res = res.replace(/{this.props.articleid}/g,CreatArticleID);
		   res = res.replace("{description}",children);
		   res = res.replace(/<p>/g,'<div class="paragraph"><div class="col-xs-12 col-md-6"><p itemprop="description">');
		   res = res.replace(/p>/g,'</p></div><div class="col-xs-12 col-md-6"><aside><span class="glyphicon glyphicon-comment" data-toggle="tooltip" data-placement="right" title="Not yet available"></span></aside></div></div>');
		   this.setState({data: res});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
	  var rawMarkup = converter.makeHtml(this.props.children.toString());
    this.loadArticleFromServer(this.props.articlename,this.props.children,this.props.hasPart,rawMarkup);
  },
  render: function() {
     return data =  <section  dangerouslySetInnerHTML={{__html: this.state.data}}>
     </section>;
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


// get default List on click of plus tab
function defaultList(){
     plusArray= JSON.parse(localStorage.getItem('plusTabItem'));
      //var url = importUrl + 'Default-WRIO-Theme/widget/itemList.htm';
	  
	  var url= themeImportUrl + 'itemList.htm';
	  
		
	if ( !$('#plusWrp').hasClass('plusList')) {  // for check default list available or not
   	 $.ajax({
			   url: url,
			   dataType: 'html',
			   success: function(data) {
			   var tHtml="";  
		   	   if(plusArray!=undefined){ 
					for(var i=0; i< plusArray.length; i++){
					   var plusHtml = data.replace("{title}", plusArray[i].name);
						 plusHtml = plusHtml.replace("{sub_title}",plusArray[i].name);
						 plusHtml = plusHtml.replace("{about}",plusArray[i].about);
						 plusHtml = plusHtml.replace("{image}", plusArray[i].image);
						 plusHtml = plusHtml.replace("{url}", plusArray[i].url);
						 
						 plusHtml = plusHtml.replace("{created_date}","22 Jun 2013");
						 plusHtml = plusHtml.replace("{rating}", "244");
						 plusHtml = plusHtml.replace("{readers}", "1,634");
						 plusHtml = plusHtml.replace("{access}", "Free");
						 tHtml=tHtml+plusHtml ;
					}
		    	 }
				 $('.content').html(tHtml);
				}
		 });
		 	
	 } // if end 
 }  // for plus tab


//  return CreateDom;
  return React.createFactory(CreateDom)
 // return React.createElement(CreateDom{});
});
