'use strict';

var aps = aps || {};

aps.controller('PostCtrl', ['$scope', '$rootScope', '$state', 'PostsService', 'servicePostLink','profileSrv','CommSvc','userAppSrv',
    function($scope, $rootScope, $state, ticketsService, servicePostLink,profileSrv,CommSvc,userAppSrv) {
        $scope.ticket = {};
        $scope.link = '<div></div>';
        $scope.comment='<div></div>';
        $scope.isComments=true;
        $scope.isAuthor=false;

        //popup
        $scope.openWindow = function(name) {
            //share URL TEXT
            var URL = 'http://dev.wr.io/post/' + $scope.ticket.Guid;
            var TEXT = $scope.ticket.Title;

            var url = '';
            if (name == 'google') {
                url = 'https://plus.google.com/share?url=' + URL;
            } else if (name == 'facebook') {
                url = 'http://www.facebook.com/sharer.php?u=' + URL + '&t=' + TEXT;
            } else if (name == 'twitter') {
                url = 'http://twitter.com/share?url=' + URL + '&text=' + TEXT;
            }

            window.open(url, name, "resizable=no,width=600,height=400,menubar=no,toolbar=no");
        };

        $scope.checkShowEdit=function(){
            var userId=profileSrv.getUserId();
            return userId==$scope.ticket.AuthorGuid;
        };
        $scope.checkShowInvite=function(){
            return !$scope.ticket.Invite;
        };
        $scope.checkShowEnableComm=function(){
            var userId=profileSrv.getUserId();
            return !$scope.ticket.TwitterComment && $scope.ticket.AuthorGuid==userId;
        };
        $scope.edit=function(){
            $state.go('edit',{post: $scope.ticket.Guid});
        };
        $scope.enableComment=function(){
            $state.go('comments',{post: $scope.ticket.Guid});
        };
        $scope.invite=function(){
            $state.go('invite',{post: $scope.ticket.Guid});
        };
        $scope.share=function(){
            $state.go('share',{post: $scope.ticket.Guid});
        };

        //msg
        $scope.isMsg = [];
        $scope.isMsg['load'] = false;
        $scope.hideMsg = function(name) {
            $scope.isMsg[name] = false;
        };

        var getTicket = function(guid) {
            $scope.isMsg['load'] = true;
            ticketsService.getTicketByGuid(guid, function(ticket) {
                if(ticket){
                    $scope.isMsg['load'] = false;
                    $scope.ticket = ticket;
                    if(!ticket.TwitterComment) $scope.isComments=false;
                    $scope.isAuthor=!$scope.isComments && ticket.AuthorGuid==profileSrv.getUserId();
                    $scope.link = servicePostLink.getLinkHtml(ticket.PostType, ticket.PostName, ticket.PostContent, ticket.Title);
                    if(ticket.TwitterComment){
                        $scope.comment=CommSvc.getComment(ticket.Guid,ticket.TwitterComment);
                        if(window.twttr) window.twttr.widgets.load();
                    }
                }else{
                    userAppSrv.addPostError();
                    $state.go('error');
                }

            });
        };
        $rootScope.$on('load:error', function(event, model) {
            if (model == 'ticket') {
                $scope.isMsg['load'] = false;
                userAppSrv.addPostError();
                $state.go('error');
            }
        });
        var init = function() {
            var guid = $state.params.post;
            //if(!guid) $state.go('plus');
            getTicket(guid);
        };

        //init
        if (window.FB != null) {
            window.FB = null;
            var element = document.getElementById("facebook-jssdk");
            if (element) element.parentNode.removeChild(element);
        }

        init();
    }]);