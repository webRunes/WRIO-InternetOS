'use strict';

var aps=aps || {};

aps.directive('composePostWidget',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/compose-post-widget.html',
        scope: {},
        controller: function($scope,$state,PostsService){
            $scope.model={};
            $scope.getDate=function(){
                if(!$scope.model.Added) return '';
                else{
                    var date=new Date($scope.model.Added);
                    return date.toDateString();
                }
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