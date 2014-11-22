'use strict';

var aps = aps || {};

aps.service('composeService', ['$http', '$rootScope', 'profileSrv', 'PostsService','iframelySvc',
    function($http, $rootScope, profileSrv, PostsService, iframly) {
        this.getComposes = function(callBack) {
            if (!loaded) {
                $http.get('/api/CoreCompose/' + profileSrv.getUserId()).success(function(data) {
                    composes = data;
                    loaded = true;
                    if (callBack) callBack(composes);
                });
            } else if (callBack) callBack(composes);
        };
        this.saveCompose = function(hubTag, callBack) {
            var ind = getComposeIndexByHubTag(hubTag);
            if (ind + 1) {
                var id = composes[ind].Id;
                composes[ind].Id=0;
                if(!composes[ind].Hubs)composes[ind].Hubs=[{tag: hubTag}];
                PostsService.savePost(profileSrv.getUserId(), composes[ind], function(data) {
                    $http({method: 'DELETE', url : '/api/CoreCompose/' + id}).success(function() {
                    }).error(function(){
                            if (callBack) callBack('');
                        });
                    if (callBack) callBack(data.Guid);
                });
            }
        };
        this.deleteCompose = function(tag) {
            var ind = getComposeIndexByHubTag(tag);
            if(ind+1){
                var id = composes[ind].Id;
                composes.splice(ind, 1);
                if(id+1){
                    $http({method: 'DELETE', url : '/api/CoreCompose/' + id}).success(function() {});
                }
            }
        };
        this.getComposeByHub = function(hubTag, callBack) {
            if (loaded) {
                if (callBack) callBack(getComposeByHubTag(hubTag));
            } else {
                this.getComposes(function() {
                    var compose=getComposeByHubTag(hubTag);
                    if (callBack) callBack(compose);
                });
            }
        };
        this.setComposeUrl = function(hubTag,url, callBack) {
            var ind = getComposeIndexByHubTag(hubTag);
            if(ind<0 || !url){
                if (callBack) callBack(false);
            }else{
                composes[ind].URL=url;

//                iframly.getPostData(url,function(data){
//                    if(!data){
//                        if(callBack) callBack(data);
//                    }else{
//                        var tt=data;
//                    }
//
//                });
                CalculatePostData(ind, function(data) {
                    if (!data){
                        callBack(data);
                    }else{
                        var user=profileSrv.getUserId();
                        if(user){
                            $http.put('/api/CoreCompose/' + user, composes[ind]).success(function(response) {
                                if (!composes[ind].Id) composes[ind].Id = response.Id;
                                if (!composes[ind].Guid) composes[ind].Guid = response.Guid;

                                if (callBack) callBack(true);
                            }).error(function(){
                                    if (callBack) callBack(false);
                                });
                        }else{
                            if (callBack) callBack(false);
                        }
                    }
                });
            }
        };
        var getComposeByHubTag = function(hubTag) {
            var ind = getComposeIndexByHubTag(hubTag);
            if (ind < 0) {
                var compose = getComposeEmpty(hubTag);
                composes.push(compose);
                ind=composes.length-1;
            }
            return composes[ind];
        };
        var getComposeIndexByHubTag = function(tag) {
            for (var i = 0; i < composes.length; i++) {
                if (composes[i].HubTag == tag) return i;
            }
            return -1;
        };
        var getComposeEmpty = function(hubTag) {
            return {
                Id: 0,
                Guid: '',
                URL: '',
                Title: '',
                Description: '',
                Picture: '/app/img/no-photo.png',
                HubTag: hubTag,
                AuthorGuid: profileSrv.getUserId(),
                AuthorName: profileSrv.getUserName(),
                PostType: '',
                PostName: '',
                PostContent: '',
                AuthorPostName: 'Unknown',
                AuthorPostAccount: '',
                AuthorPostContactType: '',
                AuthorPostContact: '',
                Invite: false,
                Hubs: [{tag: hubTag}],
                Lang:''
            };
        };
        var CalculatePostData = function(ind, callBack) {
            composes[ind].PostType = getPostType(composes[ind].URL);
            composes[ind].PostName = getPostName(composes[ind].URL);
            composes[ind].PostContent='';
            composes[ind].Picture='/app/img/no-photo.png';
            composes[ind].AuthorPostAccount='';
            composes[ind].AuthorPostName='';
            composes[ind].Title='';
            composes[ind].Description='';

            if(composes[ind].PostType=='Post link'){
                PostLinkContent(ind,callBack);
            }else if(composes[ind].PostType=='Photo'){
                PhotoContent(ind,callBack);
            }else if(composes[ind].PostType=='Video'){
                VideoContent(ind,callBack);
            }else if(composes[ind].PostType=='Social network post'){
                SnpContent(ind,callBack);
            }else {
                if(callBack) callBack(false);
            }
        };
        var PostLinkContent=function(ind,callBack){
            var url=composes[ind].URL.replace('http://','').replace('https://','');
            composes[ind].URL='http://'+url;
            composes[ind].PostContent = composes[ind].URL;
            if(callBack) callBack(true);
        };
        var PhotoContent=function(ind,callBack){
            composes[ind].PostContent = composes[ind].URL;
            composes[ind].Picture=composes[ind].PostContent;
            if(callBack) callBack(true);
        };
        var VideoContent=function(ind,callBack){
            if(composes[ind].PostName == 'Youtube') YoutubeContent(ind,callBack);
            else if(composes[ind].PostName == 'Vimeo') VimeoContent(ind,callBack);
            else {
                if(callBack) callBack(false);
            }
        };
        var VimeoContent=function(ind,callBack){
            var rex0=/player\.vimeo\.com\/video\/([a-zA-Z0-9_\-]+)(&.+)?/i;
            var rex1=/[http|https]+:\/\/(?:www\.|)vimeo\.com\/([a-zA-Z0-9_\-]+)(&.+)?/i;
            var rex2=/[http|https]+:\/\/player\.vimeo\.com\/video\/([a-zA-Z0-9_\-]+)(&.+)?/i;
            var rex3=/[http|https]+:\/\/(?:www\.|)vimeo\.com\/channels\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/i;
            var arr=rex0.exec(composes[ind].URL);
            if(arr==null){
                arr=rex1.exec(composes[ind].URL);
            }
            if(arr==null){
                arr=rex2.exec(composes[ind].URL);
            }
            var arr3=rex3.exec(composes[ind].URL);
            if(arr3 && arr3[2]){
                composes[ind].PostContent='//player.vimeo.com/video/'+arr3[2]+'?badge=0';
                if(callBack) callBack(true);
            }else if(arr && arr[1]){
                composes[ind].PostContent='//player.vimeo.com/video/'+arr[1]+'?badge=0';
                $http.get('http://vimeo.com/api/v2/video/'+arr[1]+'.json').success(function(data){
                    composes[ind].Picture=data[0].thumbnail_small;
                    composes[ind].AuthorPostName=data[0].user_name;
                    composes[ind].AuthorPostAccount=data[0].user_url;
                    composes[ind].Title=data[0].title;
                    composes[ind].Description=data[0].description;
                    if(callBack) callBack(true);
                }).error(function(){
                        if(callBack) callBack(true);
                    });
            }else if(callBack) callBack(false);
        };
        var YoutubeContent=function(ind,callBack){
            var rex0=/\/\/(?:www\.|)youtube\.com\/embed\/([a-zA-Z0-9_\-]+)/i;
            var rex1=/[http|https]+:\/\/(?:www\.|)youtube\.com\/watch\?v=([a-zA-Z0-9_\-]+)/i;
            var rex2=/[http|https]+:\/\/(?:www\.|)youtube\.com\/embed\/([a-zA-Z0-9_\-]+)/i;
            var arr=rex0.exec(composes[ind].URL);
            if(!arr){
                arr=rex1.exec(composes[ind].URL);
            }
            if(!arr){
                arr=rex2.exec(composes[ind].URL);
            }

            if(arr && arr[1]){
                composes[ind].PostContent='//www.youtube.com/embed/'+arr[1]+'?feature=player_detailpage';
                composes[ind].Picture='http://img.youtube.com/vi/'+arr[1]+'/0.jpg';
                if(callBack) callBack(true);
            }else if(callBack) callBack(false);

        };
        var SnpContent=function(ind,callBack){
            if(composes[ind].PostName == 'Google+') GoogleContent(ind,callBack);
            else if(composes[ind].PostName == 'Facebook') FacebookContent(ind,callBack);
            else if(composes[ind].PostName == 'Twitter') TwitterContent(ind,callBack);
            else if(callBack) callBack(false);
        };
        var FacebookContent=function(ind,callBack){
            //var rex1=/[http|https]+:\/\/(?:www\.|)facebook\.com\/([a-zA-Z0-9_\.]+)\/posts\/([0-9\-]+)/i;

            //var rex2=/[http|https]+:\/\/(?:www\.|)facebook\.com\/photo\.php\?fbid=([0-9]+)&amp;set=(?:[a-zA-Z0-9\.]+)&amp;type=(?:[0-9]+)/i;

            var rex3=/"[http|https]+:\/\/(?:www\.|)facebook\.com\/([a-zA-Z0-9_\.]+)"/i;

            //var arr1=rex1.exec(composes[ind].URL);
            //var arr2=rex2.exec(composes[ind].URL);
            var arr3=rex3.exec(composes[ind].URL);

            var userId='';
            composes[ind].Picture='/app/img/facebook.png';
            composes[ind].PostContent = composes[ind].URL;

            if(arr3){
                userId=arr3[1];
            }

            if(userId){
                $http.get('https://graph.facebook.com/'+userId+'?fields=id,name,username,link').success(function(data){
                    if(data.name) composes[ind].AuthorPostName=data.name;
                    else if(data.username) composes[ind].AuthorPostName=data.username;

                    composes[ind].AuthorPostAccount=data.link;
                    //composes[ind].PostContent = composes[ind].URL;

                    if(callBack) callBack(true);
                }).error(function(){
                        if(callBack) callBack(false);
                    });
            }else{
                if(callBack) callBack(false);
            }
        };
        var GoogleContent=function(ind,callBack){
            composes[ind].Picture='/app/img/google.png';

            var rex=/[http|https]+:\/\/(?:www\.|)plus.google\.com\/([0-9\.]+)\/posts\/([a-zA-Z0-9]+)/i;
            var arr=rex.exec(composes[ind].URL);
            if(arr && arr[1]){
                composes[ind].PostContent = arr[0];
                composes[ind].AuthorPostAccount='https://plus.google.com/u/0/'+arr[1];
            }else if(callBack) callBack(false);

            if(callBack) callBack(true);
        };
        var TwitterContent=function(ind,callBack){
            composes[ind].Picture='/app/img/twitter.png';

            var rex=/[http|https]+:\/\/(?:www\.|)twitter\.com\/([a-zA-Z0-9_\.]+)\/statuses\//i;
            var arr=rex.exec(composes[ind].URL);
            if(arr && arr[1]){
                composes[ind].AuthorPostAccount='https://twitter.com/'+ arr[1];
                composes[ind].AuthorPostName=arr[1];
                composes[ind].PostContent = composes[ind].URL;
                if(callBack) callBack(true);
            }else if(callBack) {
                if(callBack) callBack(false);
            }
        };
        var getPostName=function(data){
            var postName='';
            if(data.indexOf('plus.google.com')+1) postName='Google+';
            else if(data.indexOf('twitter.com')+1) postName='Twitter';
            else if(data.indexOf('facebook.com')+1) postName='Facebook';
            else if(data.indexOf('vimeo')+1) postName='Vimeo';
            else if(data.indexOf('www.youtube.com')+1) postName='Youtube';

            return postName;
        };
        var getPostType=function(data){
            var postType='Post link';

            if((data.indexOf('plus.google.com')+1)||
               (data.indexOf('twitter.com')+1)||
               (data.indexOf('facebook.com')+1)) postType='Social network post';
            else if((data.indexOf('vimeo')+1)||
               (data.indexOf('youtube')+1)) postType='Video';
            else if((data.indexOf('.jpg')+1)||
               (data.indexOf('.png')+1)||
               (data.indexOf('.ico')+1)||
               (data.indexOf('.gif')+1)||
               (data.indexOf('.bmp')+1)) postType='Photo';

            return postType;
        };


        var composes = [];
        var loaded = false;
    }]);
