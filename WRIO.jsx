define(['react','promise','client','jquery','bootstrap','showdown'], function(React) { 
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

//by me 
var wrio = {};
wrio.storageKey = 'plusLdModel';
wrio.storageHubUrl = importUrl;
var $accordion = $('<ul class="nav navbar-nav" id="nav-accordion"></ul>');
var wrioNamespace = window.wrio || {}; 
var storeageKeys=[];
var href =window.location.href; 
//by me


 (function(){
     'use strict';
	 //by me
	  $('body').on('click','.parentNodeA',function() {
		  $('.parentNodeA').addClass("collapsed");
	  });
	  
	  $('body').on('click','.removeParent',function() {
		var parentid=$(this).attr('parent-id');
		var delete_url=$(this).attr('data-url');
		$(".rootNode" + parentid).remove();
		var parent_url="";
		removeStorage(delete_url,parent_url);
	  });
	  
	
	  $('body').on('click','.cross_btn',function() {
		  var delete_url=$(this).attr('data-url');
		  var parentid=$(this).attr('parent-id');
		  
		  var parent_url=$("#root"+parentid).attr('href');
		  
		  var ChildCount=$("#parant"+parentid).html();
		  ChildCount=ChildCount-1;
		  if(ChildCount!=0){
			$("#parant"+parentid).html(ChildCount);
		  }else{
			var crossHTML='<a parent-id="'+parentid+'" href="javascript:void(0)" data-url="'+parent_url+'" class="pull-right removeParent"><span class="glyphicon glyphicon-remove"></span></a>';
			$("#parant"+parentid).remove();
			
			var secoundHTML=$(".rootNode"+parentid).html();
			$(".rootNode"+parentid).html("");
			$(".rootNode"+parentid).append(crossHTML);
			$(".rootNode"+parentid).append(secoundHTML);
		  }
		  
		  var id=$(this).attr('id');
		  $("#child" + id).remove();
		  removeStorage(delete_url,parent_url);
		  
	  });
	  //by me
	 
	 
	 
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

// by me
var localStorageJson;
var finalLocalArray = [];
var complete_script = [];
var page_title=document.title;
// by me

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

//by me
var getlocalStorageJson = function(json){	
   $.each(json,function(i,item){			
		comment = this;
		var is_article = false;
		if(comment['@type']=='Article'){
			is_article = true;
		}
		
		if(comment['author']!=undefined){
	         var authorList = comment['author'];	
				  row = {"@type": comment['author']['@type'],
				         "givenName": authorList.givenName,
						 "familyName": authorList.familyName,
						 "name": page_title,
						 "url": href,  //authorList.sameAs
						 "author":'',
						 "sameAs": authorList.sameAs, //sameAs
						}
			       finalLocalArray.push(row);	
		}	
	});
	if(finalLocalArray.length <= 0){	
		  row = {"@type": "Article",
		         "name": page_title,
				 "author":'',
				 "recentOpenUrl":href,
				 "url": href,
		 }
	  finalLocalArray.push(row);	
	}
	return finalLocalArray;
}
// by me


/*var CreateDomLeft = React.createClass({
  render: function() {
    return (
      <div className="col-xs-12 col-sm-3 col-md-2"><div className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu"><div className="navbar-header"></div><div className="navbar-collapse in"></div></div></div>
    );
  }
});*/

// by me
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
	  var storagehtml;
	     var storageClient = new CrossStorageClient( 'http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/widget/storageHub.htm');
		 storageClient.onConnect().then(function () {
            var storageKey = wrioNamespace.storageKey ? wrioNamespace.storageKey : "plusLdModel";
			return storageClient.get(storageKey);
        }).then(function (model) {
			if (model) {
			   var storagehtml=createCustomWidget(model);
			   reactObj.setState({data: storagehtml});
		    }
            return model;
        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            storageClient.close();
        });		
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
     updatePlusStorage(); 
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

// by me


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
		  if(comment.is_article==false) return false;
		  var href = comment.url ? comment.url : '#' + comment.articlename;
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
	var url = importUrl + 'Titter-WRIO-App/widget/titter.htm';	// Titter Path
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
  var url = 'http://wrio.s3-website-us-east-1.amazonaws.com/Login-WRIO-App/widget/login.htm';
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
  $.ajax({
      url: url,
      dataType: 'html',
//      data: { haspart : title },
      success: function(data) {
     // alert(data);
		 if(hasPart==true){
				if(rawMarkup==""){
						var html='<h2 id="{this.props.articlename}">{this.props.articlename}</h2>';
				}else{
						var html=data.replace('<header class="col-xs-12"><h1 id="{this.props.articlename}">{this.props.articlename}</h1></header>','<h2 id={this.props.articlename}>{this.props.articlename}</h2>');
				}
		  }else{
				var html=data;
		  }
		  var res = html.replace(/{this.props.articlename}/g,title);
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

//by me
//  function for set localStorage
 function updatePlusStorage() {
        var reactObj1 = this;
	    var storage = new CrossStorageClient('http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/widget/storageHub.htm');
        if (typeof CrossStorageClient === 'function'){
		    storage.onConnect().then(function () {
				return storage.get(wrio.storageKey);
            }).then(function (model) {
                if (model) {
                  return model;
                }
                else {
	                return {
                        "@context": "http://schema.org",
                        "@type": ["ItemList"],
                        "name": "My Plus List",
                        "itemList": []
                    };
                }
            }).then(function (model) {
			
			 var urlExists = false;
			 uArray=[];
			 authorArray=[];
			 var is_existq=false;
			 var finalLocalArray=getlocalStorageJson(complete_script);

			 if (model.itemList && model.itemList.length>0) {
					model.itemList.forEach(function (element) {
					uArray.push(element.url);
					authorArray.push(element.author);
					
				 }); 
			 }	
			
			 var parent_url=getParentActiveUrl(href,model); // for get parent tab url
			if (model.itemList && model.itemList.length >0) {
			   finalLocalArray.forEach(function (index) {
				   var is_exist= uArray.indexOf(index.url); 
				   var is_author  = authorArray.indexOf(href); 
				   if(is_exist == -1 ){
					
					     row =   {"@type": 'Article',
								  "name": index.name,
								  "familyName":index.familyName,
								  "givenName":index.givenName,
								  "url": href,
								  "recentOpenUrl": "",
								  "author":'',
								  "sameAs": index.sameAs, //sameAs
								 }
								model.itemList.push(row);
				        is_existq=true;   
						
						  for(i=0;i<model.itemList.length;i++){   
							      if(index.sameAs==model.itemList[i].url){
								      recentUrl=index.url;   
								      model.itemList[i].recentOpenUrl=recentUrl;   
									  updateRecentlyOpenUrl(model); // for update recently use in local storage 
								  }
					      }
					
				   }else{
				              for(i=0;i<model.itemList.length;i++){   
								  if(parent_url==model.itemList[i].url){
								      model.itemList[i].recentOpenUrl=href;   
								  }else if(parent_url!=href){
								     model.itemList[i].recentOpenUrl="";
								  }
						      } 
						  updateRecentlyOpenUrl(model); // for update recently use in local storage
				   }
				});
				
				if(is_existq==true){
				  var storagehtml=createCustomWidget(model);
				  $("#leftMenuwrp").html(storagehtml);
				  return storage.set(wrio.storageKey, model);
		        }
			}else{
			      model.itemList=finalLocalArray;
				  var storagehtml=createCustomWidget(model);
				  $("#leftMenuwrp").html(storagehtml);
				  return storage.set(wrio.storageKey, model);
			}
   		      return model;
            }).catch(function (err) {
                console.log(err);
            }).then(function() {
                storage.close();
            });
        }
    };  //  end localStorage

 //  function for createCustomWidget
  function createCustomWidget(storage) { 
		var plusWidget = Object.create(HTMLElement.prototype);
		// browser address url
		var groupedModel = groupByAthour(storage);
		
		  is_active=false;
		  var is_activeurl=getParentActiveUrl(href,storage); // for get parent active url 
 		  if(is_activeurl!=undefined){
		    is_active=true;
		  }else{
		    is_active=false;
		  }
		
           for (var i = 0; i < groupedModel.length; i++) {
				// check if Tab's url same with browser's, if yes - make active
				var childCount=countSubTabs(storage,groupedModel[i].url);
			
				if(is_active==true){
				    var collapseCss = groupedModel[i].url == is_activeurl ? '' : 'collapsed';
				    var activeCss = groupedModel[i].url == is_activeurl ? 'active' : '';
				}else if (groupedModel[i].url == href) {
				    var collapseCss = "";
				    var activeCss = 'active';
				}else{
				    var collapseCss = groupedModel[i].url == href ? '' : '';
				    var activeCss = groupedModel[i].url == href ? 'active' : '';
				}
				
				var parentStatus="";
				if(href==groupedModel[i].url){
				   var parentStatus="active";
				}
				var $parentTab = $('<li/>', {class: 'panel '+parentStatus+' rootNode'+i});
				  if(groupedModel[i].recentOpenUrl!=groupedModel[i].url && groupedModel[i].recentOpenUrl!="" && groupedModel[i].recentOpenUrl!=href ){
				     var url=groupedModel[i].recentOpenUrl;
				 }else{
				    var url=groupedModel[i].url;
				 }

				if(childCount > 0){
				    var $parentTabTitle = $('<a data-parent="#nav-accordion" data-toggle="" aria-expanded=""  class="parentNodeA" ></a>', {class: collapseCss}).attr('href',url).attr('id','root'+i).html('<span class="qty btn btn-xs pull-right" id="parant'+i+'" >'+childCount+'</span>'+groupedModel[i].name).addClass(collapseCss);
			   }else{
			           var $cross='<a class="pull-right removeParent '+collapseCss+'" data-url="'+groupedModel[i].url+'" href="javascript:void(0)"  parent-id="'+i+'"><span class="glyphicon glyphicon-remove"></span></a>';
			         $parentTab.append($cross);
			         var $parentTabTitle = $('<a data-parent="#nav-accordion" data-toggle="" aria-expanded=""  class="parentNodeA"></a>', {class: collapseCss}).attr('href',groupedModel[i].url).html(groupedModel[i].name).addClass(collapseCss);		 	 
			   }
		
				$parentTab.append($parentTabTitle);
				// draw children tab below main authorTab
				if (groupedModel[i].childTabs.length > 0) {
					
					var $childTabsWrapper = $('<ul class="nav nav-pills nav-stacked sub"></ul>');
					for (var j = 0; j < groupedModel[i].childTabs.length; j++) {

						  if(href==groupedModel[i].childTabs[j].url){
						     var $liTab=$('<li class="active"></li>').attr('id','child'+j);     
						     var $anchoreTag=$('<a href="javascript:void(0)" data-url="http://localhost/react/blog.html" class="pull-right cross_btn" data-url=""><span class="glyphicon glyphicon-remove"></span></a>').attr('data-url', groupedModel[i].childTabs[j].url).attr('id',j).attr('parent-id',i);

						  }else{
						      var $liTab=$('<li></li>').attr('id','child'+j); 
						      var $anchoreTag=$('<a href="javascript:void(0)" data-url="http://localhost/react/blog.html" class="pull-right cross_btn" data-url=""><span class="glyphicon glyphicon-remove"></span></a>').attr('data-url',groupedModel[i].childTabs[j].url).attr('id',j).attr('parent-id',i);  
						  }
				        var $childTab =  $liTab.append($anchoreTag);
					    
						var $childTabTitle = $('<a href="#"></a>').attr('href', groupedModel[i].childTabs[j].url).html(groupedModel[i].childTabs[j].name);
						
						$childTab.append($childTabTitle);
						$childTabsWrapper.append($childTab);
					}
					var status='';
					if(is_active==true){
				        status = groupedModel[i].url == is_activeurl ? 'in' : 'collapse';
					}else{
					    status = groupedModel[i].url == href ? 'in' : 'collapse';
					}
					
					var $div = $('<div/>', {
						id: 'element' + (i + 1),
						class: status
					}).append($childTabsWrapper);
					$parentTab.append($div);
				}
				$accordion.append($parentTab);
			}
			      $accordion.append('<li class="new panel"><a class="collapsed" data-toggle="collapse" data-parent="#nav-accordion" href="#"><span class="glyphicon glyphicon-plus"></span></a><div id="element4" class="collapse"></div></li>');
			
		  return (($accordion.get(0).outerHTML));
		  
	}; // end createCustomWidget
	   
	   
  //  function for groupByAthour
   function  groupByAthour (loModel) {
	  if (!loModel) return [];
		 var parentTabs = getParentTabs(loModel);
		 var childTabs = getChildTabs(loModel);
		 var notInsertedChildren = [];
		// crate relationship parent - children
		 childTabs.forEach(function (child) {
			var childInserted = false;
			parentTabs.forEach(function (parent) {
				// url - key for determining author's tab
				if (child.author === parent.url) {
					parent.childTabs.push(child);
					childInserted = true;
				}
			});
			if (!childInserted) {
				notInsertedChildren.push(child);
			}
		});
		notInsertedChildren.forEach(function (child) {
			child.name = "My article";
			child.childTabs = [];
			parentTabs.push(child);
		})
		return parentTabs.length > 0 ? parentTabs : [];
	}; //  end groupByAthour
            
//  function for get parent tab start
function  getParentTabs (loModel) {
	var models = [];
	for (var i = 0; i < loModel.itemList.length; i++) {
		if(loModel.itemList[i].sameAs){
		   var url=(loModel.itemList[i].url);
		   var sameUrl=(loModel.itemList[i].sameAs);
		   var is_author=checkParentAvailableInLoCalStorage(sameUrl,loModel);
		   if(is_author==true){
		      loModel.itemList[i].author=sameUrl;
		   }
		}
		if (!loModel.itemList[i].author) {
			var parentTab = loModel.itemList[i];
			parentTab.childTabs = [];
			models.push(parentTab);
		}
	}
	return models;
}; //  end getParentTabs
     
	        
//  function for get child tab start
function getChildTabs (loModel) {
	var models = [];
	for (var i = 0; i < loModel.itemList.length; i++) {
		if (loModel.itemList[i].author) {
			models.push(loModel.itemList[i]);
		}
	}
	return models;
}; // end getChildTabs
	
	
		        
//  function for get parent active url
function getParentActiveUrl(url,model) {
     var author;
	 if (model.itemList && model.itemList.length >0) {
	      model.itemList.forEach(function(index){
			 if(index.url==url){
			    if(index.author==''){
				   author=index.url;
				}else{
			   	   author=index.author;
			    }
			 }
		});	
	 }
	 
	 return author;
		
}; // end check

//  function for get parent active url
function checkParentAvailableInLoCalStorage(url,model) {
	 var is_author=false;
	 if (model.itemList && model.itemList.length >0) {
	      model.itemList.forEach(function(index){
			 if(index.url==url){
			 	is_author=true;
			 }
		});	
	 }
	 return is_author;	
}; // end checkParentAvailableInLoCalStorage


//  function for count subtab
 function countSubTabs(model,url) {
	 var childCount=0;
	 if (model.itemList && model.itemList.length >0) {
	      model.itemList.forEach(function(index){
			 if(index.author==url){
			   childCount++;
			 }
		});	
	 }
	 if(childCount > 0){
	   return childCount;
	 }else{
	   return "";
	 }
	 
}; // end countSubTabs


// function for remove 
function removeStorage(delete_url,parent_url){ 
	
	var storageClient1 = new CrossStorageClient( 'http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/widget/storageHub.htm');

        storageClient1.onConnect().then(function() {
          var storageKey = wrioNamespace.storageKey ? wrioNamespace.storageKey : "plusLdModel";
  return storageClient1.get(storageKey);
}).then(function(res) {
   for(i=0; i < res.itemList.length;i++){
		 if(res.itemList[i].url==delete_url){
		   res.itemList.splice(i, 1);
		 }
	}
	
	if(delete_url==href && parent_url==""){
	   parent_url=res.itemList['0'].url;
	}
	 return res;
}).then(function(res) {
     updateonRemove(res,parent_url,delete_url);
});

}


//  function for update on Remove
 function updateonRemove(updatedLocalstorage,parent_url,delete_url) {        
      var storageupdate = new CrossStorageClient('http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/widget/storageHub.htm');
        if (typeof CrossStorageClient === 'function'){
        storageupdate.onConnect().then(function () {
        return storageupdate.get("plusLdModel");
            }).then(function (model) {
                  model = updatedLocalstorage;
                  return model;
            }).then(function (model) {
			   return storageupdate.set("plusLdModel", model);
			}).then(function (model) {
			   if(href==delete_url && parent_url!=''){
			       window.location = parent_url;  
			   }
			}).catch(function (err) {
                console.log(err);
            }).then(function() {
                storageupdate.close();
            });
        }
    };  //  end localStorage


// function for update recently open url
function updateRecentlyOpenUrl(updatedLocalstorage){
      var storageupdateRecent = new CrossStorageClient('http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/widget/storageHub.htm');
        if (typeof CrossStorageClient === 'function'){
        storageupdateRecent.onConnect().then(function () {
        return storageupdateRecent.get("plusLdModel");
            }).then(function (model) {
                  model = updatedLocalstorage;
                  return model;
            }).then(function (model) {
			    return storageupdateRecent.set("plusLdModel", model);
			}).then(function (model) {
			     return storageupdateRecent.get("plusLdModel");
			}).then(function (model) {
			   // return model;
			   //console.log(model);
			}).catch(function (err) {
                console.log(err);
            }).then(function() {
                storageupdateRecent.close();
            });
        }
} 
// by me


//  return CreateDom;
  return React.createFactory(CreateDom)
 // return React.createElement(CreateDom{});
});
