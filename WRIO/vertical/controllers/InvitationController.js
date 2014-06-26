'use strict';

var aps = aps || {};

aps.controller('InvitationCtrl', ['$scope', '$state','PostsService', function ($scope, $state,PostsService) {
    $scope.userAccount='@twitter_acc';
    $scope.onClickIam=function(){
        alert('Iam author');
    };
    var init=function(){
        var postId = $state.params.post;

        PostsService.getTicketByGuid(postId, function(post){
            if(!post) {
                userAppSrv.addPostError();
                $state.go('error');
            }

            $scope.userAccount=post.AuthorPostAccount;
        });
    };

    //init
    init();
}]);