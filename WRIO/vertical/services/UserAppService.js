'use strict';

var aps = aps || {};

aps.service('userAppSrv', ['$http', '$rootScope', 'profileSrv', 'AppsService', 'PostsService', 'composeService',
    function($http, $rootScope, userProfileService, appTicketsService, PostsService, composeService) {
        this.getApps = function(callBack) {
            if (apps.length > 0) {
                if (callBack) callBack(apps,tempAppTab, currApp, currTab, isPostError);
            } else {
                $http.get('/api/CoreUserApps/' + userProfileService.getUserId()).success(function(data) {
                    apps = data;
                    if (callBack) callBack(apps,tempAppTab, currApp, currTab, isPostError);

                }).error(function() {
                    $rootScope.$broadcast('load:error', 'userApps');
                    apps = [];
                });
            }
        };
        this.getAppByTag=function(arr,tag){
            return arr.length>0?fetchAppByTag(tag):-1;
        };
        this.addApp = function(appId, callBack) {
            var ind = fetchAppById(appId);
            var app = appTicketsService.getAppTicketById(appId);
            if (ind < 0) {
                if (app && app.Tag != 'plus') {
                    //var id=apps.length;
                    var ticket = {
                        AppId: app.Id,
                        AppType: app.AppType,
                        AppTag: app.Tag,
                        AppTitle: app.Title,
                        Items: [],
                        UserGuid: userProfileService.getUserId()
                    };
                    apps.push(ticket);
                    currApp = app.Tag;
                    if (callBack) callBack(ticket);
                    $http.put('/api/CoreUserApps/' + userProfileService.getUserId(), ticket).success(function(data) {
                        if (data) {
                            var id = fetchAppByTag(data.AppTag);
                            if (id + 1) {
                                apps[id].Id = data.Id;
                            }
                        }
                    });
                }
            } else {
                currApp = app.Tag;
                if (callBack) callBack(apps[ind]);
            }
        };
        this.removeApp = function(appId) {
            var id = fetchAppById(appId);
            if (id > -1) {
                apps.splice(id, 1);
                $http({method:'DELETE', url:'/api/CoreUserApps/' + appId}).success(function(data) {
                });
            }
        };
        this.removeAppItem = function(userAppId, itemGuid) {
            var index = fetchAppIndByAppId(userAppId);
            if ((index + 1)) {
                var ind = fetchAppItemByGuid(index, itemGuid);
                var item = apps[index].Items[ind];
                if (ind + 1) {
                    apps[index].Items.splice(ind, 1);
                    $http.post('/api/CoreUserAppItems', item).success(function(data) {
                    });
                }
            }
        };
        this.removeAppItemByPostGuid = function(postGuid) {
            var id = fetchAppIdByPostGuid(postGuid);
            if(id+1) {
                var index = fetchAppIndByAppId(id);
                if ((index + 1)) {
                    var ind = fetchAppItemByGuid(index, postGuid);
                    var item = apps[index].Items[ind];
                    if (ind + 1) {
                        apps[index].Items.splice(ind, 1);
                        $http.post('/api/CoreUserAppItems', item).success(function(data) {
                        });
                    }
                    return apps[index].AppTag;
                }

            }
            return null;
        };
        this.updatePostTitlePost=function(postGuid,title){
            var post = fetchAppItemByPostGuid(postGuid);
            if(post){
                post.PostTitle=title;
            }
        };
        this.AddAppItem = function(tag, guid, callBack) {
            var id = fetchAppByTag(tag);
            currApp = tag;
            if (id + 1) {
                if (!(fetchAppItemByGuid(id, guid) + 1)) {
                    PostsService.getTicketByGuid(guid, function(ticket) {
                        var item = {
                            UserAppId: apps[id].Id,
                            PostId: ticket.Id,
                            PostGuid: guid,
                            PostTitle: ticket.Title
                        };
                        apps[id].Items.push(item);
                        currTab = guid;
                        if (callBack) callBack();
                        $rootScope.$broadcast('resize:success', 'userApps');
                        $http.put('/api/CoreUserAppItems/' + apps[id].Id, item).success(function(data) {
                            var idd = fetchAppItemByGuid(id, guid);
                            if (idd + 1) {
                                apps[id].Items[idd].Id = data;
                            }
                        });
                    });
                } else {
                    currTab = guid;
                    if (callBack) callBack();
                }
            }
        };
        this.setCurrApp = function(tag) {
            currApp = tag;
        };
        this.setCurrTab = function(guid) {
            currTab = guid;
        };
        this.removeCompose = function(tag) {
            currApp = tag;
            currTab = '';
            composeService.deleteCompose(tag);
        };
        this.removePostError=function(){
            currApp = 'plus';
            currTab = '';
            isPostError=false;
        };
        this.addPostError=function(){
            currApp = 'error';
            currTab = 'error';
            isPostError=true;
        };
        this.addTempAppTab=function(name){
            if(tempAppTab.indexOf(name)==-1){
                tempAppTab.push(name);
            }
            currApp = name;
            currTab = '';
        };
        this.removeTempAppTab=function(name){
            var ind=tempAppTab.indexOf(name);
            if(ind+1){
                tempAppTab.splice(ind,1);
            }
        };
        this.getContact=function(){
            return contact;
        };
        this.clearEmail=function(){
            contact={first:'',last:'',email:'',message:''};
            isEmail=false;
            return '';
        };
        this.checkEmail=function(){
            return isEmail;
        };

        this.setHubState=function(hubTag,state,page){
            hubs[hubTag] = {currState: state, currPage: page?page:1};
        };
        this.getHubState=function(hubTag){
            if(!hubs[hubTag]){
                hubs[hubTag] = {currState: 'hub.feed', currPage: 1};
            }
            return hubs[hubTag];
        };
        this.getAppState=function(appTag){
            return 'app.plus';
        };

        var fetchAppItemByPostGuid=function(guid){
            for (var i = 0, len = apps.length; i < len; i++) {
                for (var j = 0, ln = apps[i].Items.length; j < ln; j++) {
                    if (apps[i].Items[j].PostGuid == guid) return apps[i].Items[j];
                }
            }
            return null;
        };
        var fetchAppIdByPostGuid=function(guid){
            for (var i = 0, len = apps.length; i < len; i++) {
                for (var j = 0, ln = apps[i].Items.length; j < ln; j++) {
                    if (apps[i].Items[j].PostGuid == guid) return apps[i].Items[j].UserAppId;
                }
            }
            return -1;
        };
        var fetchAppIndByAppId = function(appId) {
            for (var i = 0, len = apps.length; i < len; i++) {
                if (apps[i].Id == appId) return i;
            }
            return -1;
        };
        var fetchAppById = function(appId) {
            for (var i = 0, len = apps.length; i < len; i++) {
                if (apps[i].AppId == appId) return i;
            }
            return -1;
        };
        var fetchAppByTag = function(tag) {
            for (var i = 0, len = apps.length; i < len; i++) {
                if (apps[i].AppTag == tag) return i;
            }
            return -1;
        };
        var fetchAppItemByGuid = function(id, guid) {
            var items = apps[id].Items;
            for (var i = 0, len = items.length; i < len; i++) {
                if (items[i].PostGuid == guid) return i;
            }
            return -1;
        };

        var apps = [];
        var currApp = '';
        var currTab = '';
        var tempAppTab=[];
        var isPostError=false;
        var hubs=[];

        var isEmail=false;
        var contact={first:'',last:'',email:'',message:''};
    }]);
