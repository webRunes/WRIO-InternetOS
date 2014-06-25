'use strict';

var aps = aps || {};

aps.controller('CommentsCtrl', ['$scope', '$rootScope', '$state','PostsService','twitterSvc','profileSrv','userAppSrv',
    function ($scope, $rootScope, $state,postsSrv,twitterSvc,profileSrv,userAppSrv) {
    $scope.model=null;
    $scope.post={TwitterCommentUrl: ''};
    $scope.isReady=true;
    $scope.isCompose=false;
    var postId;

    $scope.checkHasError=function(){
        return $scope.isReady?'':'has-error';
    };
    $scope.changeTCUrl=function(){
        var twUrl = twitterSvc.GetTwitterComment($scope.post.TwitterCommentUrl);
        if(twUrl) {
            $scope.isReady=true;
            $scope.model.TwitterComment=twUrl;
        }else {
            $scope.isReady=false;
            $scope.model.TwitterComment='';
        }
    };
    $scope.checkShowInvite=function(){
        if($scope.model && $scope.model.AuthorPostName===$scope.model.AuthorName) {
            $scope.model.Invite=true;
            return false;
        }
        return true;
    };

    $scope.back=function(){
        postsSrv.setComposeStep(postId, 'invite');
        $state.go('invite', { post: postId });
    };
    $scope.skip=function(){
        if($scope.isCompose){
            postsSrv.setComposeStep(postId, 'share');
            $state.go('share', { post: postId });
        }else{
            $state.go('post', { post: postId });
        }
    };
    $scope.invite=function(){
        if($scope.model.TwitterComment){
            postsSrv.savePost(profileSrv.getUserId(), $scope.model, function(){
                if($scope.isCompose){
                    if($scope.model.Invite) {
                        postsSrv.setComposeStep(postId, 'share');
                        $state.go('share', {post:postId});
                    }
                    else {
                        postsSrv.setComposeStep(postId, 'share');
                        $state.go('share', { post: postId });
                    }
                }else{
                    $state.go('post', { post: postId });
                }
            });
        }else{
            $scope.isReady=false;
        }
    };
    $rootScope.$on('load:error', function(event, model) {
        if (model == 'ticket') {
            $scope.msg['load'] = false;
            userAppSrv.addPostError();
            $state.go('error');
        }
    });
    $scope.msg=[];
    var initMsg=function(){
        $scope.msg['load']=true;
    };
    var init=function(){
        initMsg();
        postId = $state.params.post;
        if(!postId) $state.go('plus');

        var step=postsSrv.getComposeStep(postId);
        if(step)
        {
            $scope.isCompose=step=='comments';
            if(!$scope.isCompose) postsSrv.removeComposeStep(postId);
        }

        postsSrv.getTicketByGuid(postId, function(post){
            if(!post) {
                userAppSrv.addPostError();
                $state.go('error');
            }else{
                $scope.model=post;
                if(post.TwitterComment) $state.go('post', {post: postId});
                $scope.post.TwitterCommentUrl=post.TwitterComment;
                $scope.msg['load']=false;
            }

        });
    };

    //init
    init();
}]);