'use strict';

var aps=aps || {};

aps.directive('composeSubcontrol',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/compose-subcontrol.html',
        scope: {},
        controller: function($scope,$state,PostsService){
            $scope.model={};
            $scope.onRead=function(){
                $state.go('post',{post: postId});
            };
            var postId = $state.params.post;
            if(!postId) $state.go('plus');
            PostsService.getTicketByGuid(postId, function(post){
                if(!post) $state.go('plus');
                $scope.model=post;
            });
        }
    };
});