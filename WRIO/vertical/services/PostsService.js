'use strict';

var aps = aps || {};

aps.service('PostsService', ['$http', '$rootScope','profileSrv', function ($http, $rootScope,profileSrv) {
    this.getTicketsByPagination = function (page, count, tag, callBack) {
        $http.post('/api/CorePosts/', { Page: page, PageCount: count, PageTag: tag, AuthorGuid: profileSrv.getUserId() }).success(function (data) {
            posts = data.Tickets;
            if (callBack) callBack(data);
        }).error(function () {
            $rootScope.$broadcast('load:error', 'Posts');
        });
    };
    this.getTicketByGuid = function (guid, callBack) {
        var ticket = fetchTicketByTag(guid);
        if (ticket) {
            if (callBack) callBack(ticket);
        } else {
            $http.get('/api/CorePosts/' + guid).success(function (data) {
                var posts=data==='null'?'':data;
                if (callBack) callBack(posts);
            }).error(function () {
                    $rootScope.$broadcast('load:error', 'ticket');
                });
        }
    };
    this.savePost = function (userGuid, post, callBack) {
        if(!callBack){
            post.Invite=true;
            var ticket = fetchTicketByTag(post.Guid);
            if(ticket){
                ticket.Invite=true;
            }
        }
        $http.put('/api/CorePosts/' + userGuid, post).success(function (data) {
            if (callBack) callBack(data);
        });
    };
    this.deletePost = function(id) {
        //ToDo delete tab
        $http({method: 'DELETE', url: '/api/CorePosts/' + id}).success(function() {
        });
    };

    this.setComposeStep=function(guid,step){
        composes[guid]=step;
    };
    this.getComposeStep=function(guid){
        return composes[guid];
    };
    this.removeComposeStep=function(guid){
        if(composes[guid]) composes[guid]=null;
    };

    var fetchTicketByTag = function (guid) {
        for (var i = 0, len = posts.length; i < len; i++) {
            if (posts[i].Guid == guid) return posts[i];
        }
        return '';
    };
    var posts = [];
    var composes=[];
}]);
