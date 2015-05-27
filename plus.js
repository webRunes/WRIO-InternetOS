var $ = require('jquery');
var CrossStorageClient = require('./client');
var importUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'http://wrio.s3-website-us-east-1.amazonaws.com/';
var wrio = {};
wrio.storageKey = 'plusLdModel';
wrio.storageHubUrl = importUrl;
var $accordion = $('<ul class="nav navbar-nav" id="nav-accordion"></ul>');
var wrioNamespace = window.wrio || {}; 
var storeageKeys=[];
var href =window.location.href; 

if(href!= undefined ){
   href = href.replace('index.html', '');  // to remove index.html
   href = href.replace('index.htm', '');  // to remove index.htm
}

if(href!= undefined && href.substr(-1) == '/') {
	href  = href.substring(0,href.length - 1);   // for remove "/" from string
}

// to remove # from url
if(href!= undefined && href.indexOf("#") != -1){
   var hrefArray = href.split("#"); 
   href=hrefArray['0']?hrefArray['0']:'';
   if(href!= undefined && href.substr(-1) == '/') {
	 href  = href.substring(0,href.length - 1);  
   }
}

var storageHubPath='http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/widget/storageHub.htm';
var localStorageJson;
var finalLocalArray = [];
var page_title=document.title;

(function(){ 
      'use strict';
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
	 
	 
  })();


var getlocalStorageJson = function(json){	
   $.each(json,function(i,item){			
		comment = this;
		var is_article = false;
		if(comment['@type']=='Article'){
			is_article = true;
		}
		if(comment['author']!=undefined){
	         var authorList = comment['author'];	
			 var sameas=authorList.sameAs; //sameAs
			 
			 if(sameas!= undefined ){
			   sameas = sameas.replace('index.html', '');  // for remove index.html
			   sameas = sameas.replace('index.htm', '');  // for remove index.htm
			 }  
			 
			 if(sameas!= undefined && sameas.substr(-1) == '/') {
	           sameas  = sameas.substring(0,sameas.length - 1); // for remove "/" from string 
              }
				 
				 row = {"@type": comment['author']['@type'],
				         "givenName": authorList.givenName,
						 "familyName": authorList.familyName,
						 "name": page_title,
						 "url": href,  //authorList.sameAs
						 "author":'',
						 "sameAs": sameas, //sameAs
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

function loadPlusHtml(){
     var url = importUrl + 'Plus-WRIO-App/widget/plus.htm';
		 $.ajax({
			   url: url,
			   dataType: 'html',
			   success: function(data) {
				 plus_html= data;
	             $('#nav-accordion').append(plus_html);	
		  }
		 });	
}

//  function to createCustomWidget
  function createCustomWidget(storage) {
     
	 var plusWidget = Object.create(HTMLElement.prototype);
		// browser address url
		var groupedModel = groupByAthour(storage);
		
		// sign '+' markup
        //var $plus = $(importDoc.querySelector('#plus-plus-template').innerHTML);
		  is_active=false;
		  var is_activeurl=getParentActiveUrl(href,storage); // for get parent active url 
 		  if(is_activeurl!=undefined){
		    is_active=true;
		  }else{
		    is_active=false;
		  }
		
           for (var i = 0; i < groupedModel.length; i++) {
				// check if Tab's url same with browser's, if yes - make active
				
				//is_child=checkChildAvailability(storage,groupedModel[i].url); 
				
				var childCount=countSubTabs(storage,groupedModel[i].url);
				//var childCount=getSubTabsUrl(storage,groupedModel[i].url);
				
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
	  
			return (($accordion[0].outerHTML));
		  
	}; // end createCustomWidget
	   
	   
  //  function to groupByAthour
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
            
//  function to get parent tab start
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
     
	        
//  function to get child tab start
function getChildTabs (loModel) {
	var models = [];
	for (var i = 0; i < loModel.itemList.length; i++) {
		if (loModel.itemList[i].author) {
			models.push(loModel.itemList[i]);
		}
	}
	return models;
}; // end getChildTabs


//  function to get parent active url
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

//  function to get parent active url
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


//  function to count subtab
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


// function for removing
function removeStorage(delete_url,parent_url){ 
	
	var storageClient1 = new CrossStorageClient(storageHubPath);

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

//  function to update on removing
 function updateonRemove(updatedLocalstorage,parent_url,delete_url) {        
      var storageupdate = new CrossStorageClient(storageHubPath);
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


// function to update recently opened url
function updateRecentlyOpenUrl(updatedLocalstorage){
      var storageupdateRecent = new CrossStorageClient(storageHubPath);
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

var globalStorage;

function getLeftHtml(){  
  	     var storagehtml="storage";
	     var storageClient = new CrossStorageClient(storageHubPath);
		 storageClient.onConnect().then(function () {
         
		 var storageKey = wrioNamespace.storageKey ? wrioNamespace.storageKey : "plusLdModel";
		   return storageClient.get(storageKey);
        }).then(function (model) {
        	if (model) {
			   var storagehtml=createCustomWidget(model);
			   globalStorage = storagehtml;
			   return storagehtml;
		    }
            //return model;
        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            storageClient.close();
        });		 
	return storagehtml;
}


module.exports = {
            color: "blue",
            size: "large",
            updatePlusStorage: function() {
            var wrio = {};
			wrio.storageKey = 'plusLdModel';
			wrio.storageHubUrl = importUrl;
			var $accordion = $('<ul class="nav navbar-nav" id="nav-accordion"></ul>');
			var wrioNamespace = window.wrio || {}; 
			var href =window.location.href; 
			if(href!= undefined ){
			   href = href.replace('index.html', '');  // to remove index.html
			   href = href.replace('index.htm', '');  // to remove index.htm
			}
			if(href!= undefined && href.substr(-1) == '/') {
				href  = href.substring(0,href.length - 1);   // for remove "/" from string
			}
			
			// for remove # from url
			if(href!= undefined && href.indexOf("#") != -1){
			   var hrefArray = href.split("#"); 
			   href=hrefArray['0']?hrefArray['0']:'';
			   if(href!= undefined && href.substr(-1) == '/') {
	              href  = href.substring(0,href.length - 1);  
               }
		    }
			
	var storageHubPath='http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/widget/storageHub.htm';
    
        var reactObj1 = this;
	    var storage = new CrossStorageClient(storageHubPath);
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
			
			
			var parent_url=getParentActiveUrl(href,model); // to get parent tab url
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
				  loadPlusHtml();  // for plus button
				  return storage.set(wrio.storageKey, model);
		        }
			}else{
			      model.itemList=finalLocalArray;
				  var storagehtml=createCustomWidget(model);
				  $("#leftMenuwrp").html(storagehtml);
				  loadPlusHtml();  // for plus button
				  return storage.set(wrio.storageKey, model);
			}
				 var storagehtml=createCustomWidget(model);
				 $("#leftMenuwrp").html(storagehtml);
			    loadPlusHtml();  // for plus button
				//return model;
            }).catch(function (err) {
                console.log(err);
            }).then(function() {
                storage.close();
            });
        }
    
            }
        };
