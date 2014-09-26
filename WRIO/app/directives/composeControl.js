'use strict';

var aps=aps || {};

aps.directive('composeControl',function () {
    return {
        restrict: 'A',
        templateUrl: '/app/templates/compose-control.html',
        scope: {},
        controller: function($scope,$state,PostsService,profileSrv){
            var postId;
            $scope.ticket={};
            $scope.isComments=false;
            $scope.isInvite=false;
            $scope.isEdit=false;
            var currState='';
            $scope.onClickBtn = function(name) {
                PostsService.removeComposeStep(postId);
                if(name!=currState) $state.go(name, { post: postId });
            };
            $scope.checkPrimaryCls = function(name) {
                return name==currState?'btn-primary':'btn-default';
            };
            var init = function() {
                postId = $state.params.post;
                currState=$state.current.name;
                if(!postId) $state.go('plus');
                PostsService.getTicketByGuid(postId, function(post){
                    if(!post) $state.go('plus');
                    $scope.ticket=post;
                    $scope.isComments=!post.TwitterComment;
                    $scope.isInvite=!post.Invite;
                    $scope.isEdit=post.AuthorGuid==profileSrv.getUserId();
                });
            };

            init();
        }
    };
});