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
    getFinalJSON = require('./js/storages/getFinalJSON'),
	getParaGraph = require('./js/storages/getParaGraph'),
	finalMetionsArray = require('./js/storages/finalMetionsArray'),
	finalMenuJsonArray = require('./js/storages/finalMenuJsonArray'),
	finalListJsonArray = require('./js/storages/finalListJsonArray'),

    importUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'http://wrio.s3-website-us-east-1.amazonaws.com/',
    cssUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'http://webrunes.github.io/',
    theme = 'Default-WRIO-Theme',
    themeImportUrl = importUrl + theme + '/widget/',

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
    is_airticlelist = false,
    is_hashUrl = false,
    is_cover = false;

 (function(){
     'use strict';
   
    $('body').on('click','#myoffcanvas',function() {
     $('.row-offcanvas').toggleClass('active');
       $('.row-offcanvas-menu').toggleClass('active');
    });
   
   // for plus tab
    $('body').on('click','.plusIcon',function() {
      $('.active').removeClass('active');
      $('.removeParent').removeClass('collapsed');
      $('.parentNodeA').removeClass('collapsed');
      $('.new').addClass('active');
      defaultList();
    });
    // for plus tab
    
    
    // right menu click
     $('body').on('click','.listView',function() {
        var url=$(this).attr('data-url');
          $('.listView').removeClass('active');
      $(".listView").parent().removeClass("active");
        $(this).addClass('active');
      $(".active").parent().addClass("active");
     getListJson(url);
      });
    
    $('body').on('click','.articleView',function() {
        var url=$(this).attr('data-url');
          $(".listView").parent().removeClass("active");
      $('.itemListWrp').css('display','none');
      $("section").parent("article").css('display','block');
          $('#titter_frame_container').css('display','block');      
      
      });
    // right menu click
   
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
var itemListArray = [];


var CreateDomLeft = React.createClass({
  render: function() {    
    return (
      <div className="col-xs-12 col-sm-3 col-md-2"><div className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu"><div className="navbar-header tooltip-demo" id="topMenu"><ul className="nav menu pull-right"><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Call IA"><a className="btn btn-link btn-sm" href="#"><span className="glyphicon glyphicon-comment"></span></a></li><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Logout"><a className="btn btn-link btn-sm" href="#"><span className="glyphicon glyphicon-lock"></span></a></li><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Full screen"><a className="btn btn-link btn-sm" href="#"><span className="glyphicon glyphicon-fullscreen"></span></a></li><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Open/close menu"><a data-target=".navbar-collapse" data-toggle="collapse" className="btn btn-link btn-sm visible-xs collapsed" href="#"><span className="glyphicon glyphicon-align-justify"></span></a></li><li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Show/hide the sidebar"><a data-toggle="offcanvas" id="myoffcanvas"  className="btn btn-link btn-sm visible-xs" href="#"><span className="glyphicon glyphicon-transfer"></span></a></li></ul><a title="" data-placement="right" data-toggle="tooltip" className="navbar-brand" href="webrunes-contact.htm" data-original-title="Contact us">{'&nbsp;'}</a></div><div className="navbar-collapse in"><div className="navbar-header" id="leftMenuwrp"><CreateLeftCommentMenus /></div></div></div></div>
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
          <CreateArticleMenus />
        </div>
      </div>
    );
  }
});

// for right menu
var CreateArticleMenus = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
  if(is_airticlelist==false){
    getListJson(href); 
  }else{
     this.setState({data: finalMenuJsonArray});
    }
  },
  render: function() {
    return (
            <CreateArticleItemMenu data={this.state.data} />
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
    if(rawMarkup=="") return false;
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
    checkUrl(); // for check # url 
    return (
      <div id="content" className="container-liquid">
      <div className="row row-offcanvas row-offcanvas-right">
    //<CreateDomLeft></CreateDomLeft>
      <CreateDomCenter></CreateDomCenter>
      <CreateDomRight></CreateDomRight>
      </div>
      </div>
    );
  }
});

var CreateArticleList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment, index) {
			if(comment.is_article === false) {
				return false;
			}
			if (comment.url !== '') {
				return (
					<CreatArticleLists articlename={comment.articlename} url={comment.url} key={index} about={comment.about}>
						{comment.articleBody}
					</CreatArticleLists>
				);
			} else {
				return (
					<CreatArticleEl articlename={comment.articlename} key={index} hasPart={comment.hasPart}>
						{comment.articleBody}
					</CreatArticleEl>
				);
			}
		});
		return (
			<article>
				{commentNodes}
			</article>
		);
	}
});

// for article list in itemList view (if have url in json-ld then show aticle in listview otherwise same as article formate)
var CreatArticleLists = React.createClass({
  loadArticleFromServer: function(title,urlArticle,about,rawMarkup) {
  var url = themeImportUrl + 'itemList.htm';  // itemList Path  
  var CreatArticleID = title.replace(/\s/g, '_'); // Article ID
  var tHtml="";
  
  $.ajax({
      url: url,
      dataType: 'html',
      success: function(data) {
          
        var data = data.replace('<ul class="actions"><li><a href="#"><span class="glyphicon glyphicon-plus"></span>Add</a></li><li><a href="#"><span class="glyphicon glyphicon-share"></span>Share</a></li></ul>', '');
        
          var listHtml = data.replace("{title}", "<a href='"+urlArticle+"'>"+title+"</a>")
         .replace("{sub_title}",title)
         .replace("{about}",about)
         .replace("{image}",cssUrl + theme + '/img/no-photo-200x200.png')
         .replace("{created_date}","22 Jun 2013")
         .replace("{rating}", "244")
         .replace("{readers}", "1,634")
         .replace("{access}", "Free");
          
          tHtml="<div id='"+CreatArticleID+"'>"+listHtml+"</div>";
       
       this.setState({data: tHtml});
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
    this.loadArticleFromServer(this.props.articlename,this.props.url,this.props.about,rawMarkup);
  },
  render: function() {
     return data =  <section  dangerouslySetInnerHTML={{__html: this.state.data}}>
     </section>;
  }
});


var CreatArticleEl = React.createClass({
  loadArticleFromServer: function(title,children,hasPart,rawMarkup) {
  var url = importUrl + theme + '/widget/article.htm';  // Article Path  
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
    
    
  if ( !$('.plusActive').hasClass('plusList')) {  // for check default list available or not
    $.ajax({
      url: url,
      dataType: 'html',
      success: function(data) {  
        if(plusArray !== undefined && typeof plusArray[0] === 'object'){ 
              $('#centerWrp').html(
             data
            .replace("{title}", plusArray[0].name)
            .replace("{sub_title}",plusArray[0].name)
            .replace("{about}",plusArray[0].about)
            .replace("{image}", plusArray[0].image)
            .replace("{url}", plusArray[0].url)
            .replace("{created_date}","22 Jun 2013")
            .replace("{rating}", "244")
            .replace("{readers}", "1,634")
            .replace("{access}", "Free")
          );
          $('#plusWrp').addClass('plusActive');
          }
      }
    });   
  }
}
 
 
 // for list
function getListJson(listurl){

       var url=listurl;
     if(url.indexOf("?cover") != -1){
        is_cover=true;
     }
     var jsonItemArray = [];
    $.get(url, function(result){
           var rHtml = result.replace('<script type="text/javascript" src="http://wrio.s3-website-us-east-1.amazonaws.com/WRIO-InternetOS/WRIO.js"></script>', '');
     
     jQuery('<div/>', {
        id: 'foo1',
        css:{
          display:'none'
        },
        html: rHtml
      }).appendTo('body');
           defaultPlusList=$("#foo1 [type^='application/ld+json']" ).html();
       $('#foo1').remove();
         defaultPlusListJson = JSON.parse(defaultPlusList);   
       itemListArray=defaultPlusListJson.itemListElement;
       getlist(itemListArray);
       
       if(is_list==true){
        //  var htmlList=getlist();
       }
    }); 
}
 
 
// get List  for list 
function getlist(itemListArray){
      
              var url = themeImportUrl + 'itemList.htm'; 
        var coverHtml='<div class="{status}"><div style="background: url({contentUrl}) center center" class="img"></div><div class="carousel-caption"><div class="carousel-text"><h2>{name}</h2><ul class="features">{text}</ul></div></div></div>';
         var contentdiv='<li><span class="glyphicon glyphicon-ok"></span>{content}</li>';         
         var coverHeader='<ul class="breadcrumb"><li class="active">Cover</li></ul><div data-ride="carousel" class="carousel slide" id="cover-carousel"><div class="carousel-inner">';
         var coverFooter='</div><a data-slide="prev" href="#cover-carousel" class="left carousel-control"><span class="glyphicon glyphicon-chevron-left"></span></a><a data-slide="next" href="#cover-carousel" class="right carousel-control"><span class="glyphicon glyphicon-chevron-right"></span></a></div>';
    
    $.ajax({
         url: url,
         dataType: 'html',
         success: function(data) {
         var tHtml="";  
           if(itemListArray!="" && itemListArray!=undefined){ 
          for(var i=0; i< itemListArray.length; i++){
                if(is_cover!=true){
               var listHtml = data.replace("{title}", itemListArray[i].name);
               listHtml = listHtml.replace("{sub_title}",itemListArray[i].name);
               listHtml = listHtml.replace("{about}",itemListArray[i].about);
              // listHtml = listHtml.replace("{image}", itemListArray[i].image);
              
               listHtml = listHtml.replace("{image}","http://wrio.s3-website-us-east-1.amazonaws.com/Default-WRIO-Theme/img/no-photo-200x200.png");
               listHtml = listHtml.replace("{url}", itemListArray[i].url);
               
               listHtml = listHtml.replace("{created_date}","22 Jun 2013");
               listHtml = listHtml.replace("{rating}", "244");
               listHtml = listHtml.replace("{readers}", "1,634");
               listHtml = listHtml.replace("{access}", "Free");
               tHtml=tHtml+listHtml ;
            
             }else{  // for cover structure
                  
                 var listHtml = coverHtml.replace("{name}", itemListArray[i].name);
                 var text=""; 
                 if(itemListArray[i].text != undefined){
                  
                   for(var j=0; j< itemListArray[i].text.length; j++){
                      li=itemListArray[i].text[j];
                      var allcont = contentdiv.replace("{content}",li);          
                      text=text + allcont; 
                   }  
                   
                 }
                  
                        
                       listHtml = listHtml.replace("{contentUrl}",itemListArray[i].contentUrl);
                listHtml = listHtml.replace("{text}",text); 

                 if(i==0){
                   listHtml = listHtml.replace("{status}",'item active'); 
                 }else{
                    listHtml = listHtml.replace("{status}",'item');
                 }
                 tHtml=tHtml+listHtml;  
                
              }
          }
           }
         
        if(is_cover==true){
            tHtml=coverHeader+tHtml+coverFooter;
            is_cover=false;
        }
         
            is_append=false;
            if(tHtml!="") {  
          $('.itemListWrp').css('display','block');
             if($(".itemListWrp").length==0){
                tHtml='<div class="itemListWrp">'+tHtml+'</div>';
                is_append=true;
             }
             
             if(is_airticlelist==false){
                $("section").parent("article").css('display','block');
                          $('#titter_frame_container').css('display','block');
            }else{
                 $("section").parent("article").css('display','none');
                           $('#titter_frame_container').css('display','none');
             }
          }
          
          if($(".paragraph").length==0){ 
                if(is_append==true){
                $('#centerWrp').append(tHtml);
                $('#titter_frame_container').remove();
              $('#titter-id').remove();
                    $('#titter-template').remove();
              }else{
                $('.itemListWrp').html(tHtml);
                $('#titter_frame_container').remove();
              $('#titter-id').remove();
                    $('#titter-template').remove();
              } 
          }else{
                  if(is_append==true){
                   $('#centerWrp').append(tHtml);
              }else{
                   $('.itemListWrp').html(tHtml);
              }  
          }                                       
          
        }
     });
 }
 // for list  


// function for check url
function checkUrl(){
     if(href!= undefined ){
       href = href.replace('index.html', '');  // for remove index.html
       href = href.replace('index.htm', '');  // for remove index.htm
     }
   if(href!= undefined && href.substr(-1) == '/') {
    href  = href.substring(0,href.length - 1);   // for remove "/" from string "30-04-15"
   }
       //console.log(finalMenuJsonArray);
    
     // for remove # from url
     hashName='';
   if(href.indexOf("#") != -1){
     var hrefArray = href.split("#"); 
     url=hrefArray['0']?hrefArray['0']:'';
     hashName=hrefArray['1']?hrefArray['1']:'';
       is_hashUrl=true;
  }
     hashUrl="";
     for (i=0;i<finalMenuJsonArray.length;i++){
                if(finalMenuJsonArray[i].name==hashName){
              hashUrl=finalMenuJsonArray[i].url;
             getListJson(hashUrl); 
          }     
     }  
        
}
// end fn

domready(function () {
	React.render(
		<Main />,
		document.body
	);
});
