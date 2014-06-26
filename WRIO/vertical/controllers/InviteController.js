'use strict';

var aps = aps || {};

aps.controller('InviteCtrl', ['$scope', '$state', 'PostsService','profileSrv','$rootScope','fbSvc','twitterSvc','emailSvc','userAppSrv',
    function($scope, $state, postsSrv,profileSrv,$rootScope,fbSvc,twitterSvc,emailSvc,userAppSrv) {
        var postId;
        var isSendInvite=true;
        $scope.contactHasError='';
        $scope.firstHasError='';
        $scope.secondHasError='';
        $scope.ticket={};
        $scope.inviteTxt='';
        $scope.model = { authorAccount: '', placeHolder: 'Enter email', placeError: 'Email required', firstName:'', secondName:'' };
        $scope.select = {};
        $scope.select.authors = ["I'm the author", 'Email', 'Google+', 'Facebook', 'Twitter', 'Unknown'];
        $scope.select.author = $scope.select.authors[5];
        $scope.isContact=false;
        $scope.isErrorContact=false;
        $scope.isInvite=false;
        $scope.isGoogle=false;
        $scope.isEmail=false;
        $scope.isFacebook=false;
        $scope.isWelcom=false;
        $scope.plusUrl='';
        $scope.isPublished=false;

        $scope.checkShowEdit=function(){
            var userId=profileSrv.getUserId();
            return userId==$scope.ticket.AuthorGuid;
        };
        $scope.checkShowComm=function(){
            return !$scope.ticket.TwitterComment;
        };
        $scope.skip = function() {
            if($scope.select.author=="I'm the author") postsSrv.savePost(profileSrv.getUserId(),$scope.ticket,null);
            if($scope.isCompose){
                postsSrv.setComposeStep(postId, 'comments');
                $state.go('comments', { post: postId });
            }else{
                $state.go('post', { post: postId });
            }
        };
        $scope.back=function(){
            postsSrv.setComposeStep(postId, 'edit');
            $state.go('edit', { post: postId });
        };
        $scope.sendInvite = function() {
            if(!isSendInvite && $scope.isInvite){
                isSendInvite=true;

                if(checkContactData()){
                    //postsSrv.setComposeStep(postId, 'share');
                    $scope.ticket.AuthorPostContactType=$scope.select.author;
                    $scope.ticket.AuthorPostContact=$scope.model.authorAccount;

                    if($scope.select.author=='Facebook'){
                        fbSvc.sendMessageToUser($scope.ticket, function(response){
                            if (response && response.success==true) {
                                postsSrv.savePost(profileSrv.getUserId(),$scope.ticket,null);
                            }
                            if($scope.isCompose){
                                postsSrv.setComposeStep(postId, 'comments');
                                $state.go('comments', { post: postId });
                            }else{
                                $state.go('post', { post: postId });
                            }
                        });
                    }else if($scope.select.author=='Twitter'){
                        twitterSvc.getUserTwitterByAccount($scope.ticket.AuthorPostContact, function(twitAuthor){
                            if(!twitAuthor) $state.go('comments', { post: postId });

                            var text = 'I published your post on http://dev.wr.io/post/'+$scope.ticket.Guid;
                            var url = 'https://twitter.com/intent/tweet?screen_name='+twitAuthor+'&text='+text;
                            var tweet = window.open(url, 'twitter', "resizable=no,width=600,height=400,menubar=no,toolbar=no");
                            var interval = window.setInterval(function() {
                                try {
                                    if (tweet == null || tweet.closed) {
                                        window.clearInterval(interval);
                                        postsSrv.savePost(profileSrv.getUserId(),$scope.ticket,null);
                                        if($scope.isCompose){
                                            postsSrv.setComposeStep(postId, 'share');
                                            $state.go('comments', { post: postId });
                                        }else{
                                            $state.go('post', { post: postId });
                                        }
                                    }
                                }
                                catch (e) {
                                    if($scope.isCompose){
                                        postsSrv.setComposeStep(postId, 'comments');
                                        $state.go('comments', { post: postId });
                                    }else{
                                        $state.go('post', { post: postId });
                                    }
                                }
                            }, 1000);
                        });
                    }else if($scope.select.author == 'Email'){
                        emailSvc.sendEmail($scope.ticket.AuthorPostContact,'Invite from webRunes',$scope.inviteTxt,function(data){
                            if(data){
                                postsSrv.savePost(profileSrv.getUserId(),$scope.ticket,null);
                            }
                            if($scope.isCompose){
                                postsSrv.setComposeStep(postId, 'comments');
                                $state.go('comments', { post: postId });
                            }else{
                                $state.go('post', { post: postId });
                            }
                        });
                    }else if($scope.select.author == 'Google+'){
                        var google = window.open($scope.ticket.AuthorPostContact);
                        var interval = window.setInterval(function() {
                            try {
                                if (google == null || google.closed) {
                                    window.clearInterval(interval);
                                    postsSrv.savePost(profileSrv.getUserId(),$scope.ticket,null);
                                    if($scope.isCompose){
                                        postsSrv.setComposeStep(postId, 'comments');
                                        $state.go('comments', { post: postId });
                                    }else{
                                        $state.go('post', { post: postId });
                                    }
                                }
                            }
                            catch (e) {
                                if($scope.isCompose){
                                    postsSrv.setComposeStep(postId, 'comments');
                                    $state.go('comments', { post: postId });
                                }else{
                                    $state.go('post', { post: postId });
                                }
                            }
                        }, 1000);
                    }
                }else isSendInvite=false;
            }
        };
        $scope.changeContact=function(){
            var contactType = $scope.select.author;
            $scope.isEmail=false;
            $scope.isGoogle=false;
            $scope.isContact=false;
            $scope.isInvite=true;
            $scope.isWelcom=true;
            $scope.isFacebook=false;
            if(contactType=="I'm the author"){
                $scope.isInvite=false;
            }else if(contactType=='Email'){
                $scope.model.placeHolder = 'Enter email';
                $scope.model.placeError = 'Email required';
                $scope.isEmail=true;
                $scope.isContact=true;
            }else if(contactType=='Google+'){
                $scope.model.placeHolder = 'Enter author account URL';
                $scope.model.placeError = 'Field is required';
                $scope.isContact=true;
                $scope.isInvite=true;
                $scope.isGoogle=true;
            }else if(contactType=='Facebook'){
                $scope.model.placeHolder = 'Enter author account URL';
                $scope.model.placeError = 'Field is required';
                $scope.isFacebook=true;
                $scope.isContact=true;
            }else if(contactType=='Twitter'){
                $scope.model.placeHolder = 'Enter author account URL';
                $scope.model.placeError = 'Field is required';
                $scope.isContact=true;
            }else if(contactType=='Unknown'){
                $scope.isInvite=false;
                $scope.isWelcom=false;
            }
            $scope.isErrorContact=false;
        };
        $scope.changeContactData=function(){
            $scope.isErrorContact=false;
        };
        $scope.checkHasError=function(){
            return $scope.isErrorContact ? 'has-error':'';
        };
        $scope.getInviteText=function(){
            var first = $scope.model.firstName?$scope.model.firstName:($scope.ticket? $scope.ticket.AuthorName:'');
            var id=$scope.ticket?$scope.ticket.Guid:'';
            return 'Dear Author! My name is '+first+' '+$scope.model.secondName+'. I liked your content very much and made a post '+
                'based on it, which you can find at http://dev.wrio/post/'+id+'. The webRunes platform differs from '+
                'the others by the fact that users can financially support interesting authors. All you need is to '+
                'register by following the link http://webrunes.com/registration_url_via_social_contact, '+
                'and you will receive donations transferred to you by gratefull users. Thank you!\n\nP.S. If you '+
                'do not want your materials to be available at webRunes, you can follow the link '+
                'http://webrunes.com/post_delete and the post will be automatically deleted '+
                'while all transferred donations will be cancelled.';
        };
        var getAuthorIndex = function (postName) {
            if($scope.ticket.AuthorPostName==$scope.ticket.AuthorName) return 0;
            if (postName=='Google+') {
                return 2;
            } else if (postName=='Facebook') {
                return 3;
            } else if (postName=='Twitter') {
                return 4;
            }else if(postName=='Email') return 1;

            return 5;
        };
        var checkContactData=function(){
            var success=true;
            if(!$scope.model.firstName){
                $scope.model.firstName='Anonymous';
            }
            if(!$scope.model.secondName){
                $scope.model.secondName='';
            }
            if($scope.select.author=='Email'){
                var rex=/\S+@\S+\.\S+/i;
                var arr=rex.test($scope.model.authorAccount);
                if(!arr) {
                    $scope.isErrorContact=true;
                    success=false;
                }
            }
            if($scope.select.author=='Google+'){
                var rex=/[http|https]+:\/\/(?:www\.|)plus\.google\.com\/u\/0\/([0-9]+)/i;
                var arr=rex.test($scope.model.authorAccount);
                if(!arr) {
                    $scope.isErrorContact=true;
                    success=false;
                }
            }
            if($scope.select.author=='Facebook'){
                var rex=/[http|https]+:\/\/(?:www\.|)facebook\.com\/([a-zA-Z0-9_\.]+)/i;
                var arr=rex.test($scope.model.authorAccount);
                if(!arr) {
                    $scope.isErrorContact=true;
                    success=false;
                }
            }
            if($scope.select.author=='Twitter'){
                var rex=/[http|https]+:\/\/(?:www\.|)twitter\.com\/([a-zA-Z0-9_\.]+)/i;
                var arr=rex.test($scope.model.authorAccount);
                if(!arr) {
                    $scope.isErrorContact=true;
                    success=false;
                }
            }

            return success;
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
        var init = function() {
            initMsg();
            postId = $state.params.post;

            postsSrv.getTicketByGuid(postId, function(post){
                if(!post) {
                    userAppSrv.addPostError();
                    $state.go('error');
                }else{
                    var step=postsSrv.getComposeStep(postId);
                    if(step)
                    {
                        $scope.isPublished=true;
                        $scope.isCompose=step=='invite';
                        if(!$scope.isCompose) postsSrv.removeComposeStep(postId);
                    }
                    $scope.msg['load']=false;
                    if(post.Invite) $state.go('comments', {post: postId});
                    $scope.ticket=post;
                    var ind;
                    var contact;
                    if(post.AuthorPostContactType){
                        ind=getAuthorIndex(post.AuthorPostContactType);
                        contact=post.AuthorPostContact;
                    }else{
                        ind=getAuthorIndex(post.PostName);
                        contact=post.AuthorPostAccount;
                    }
                    $scope.select.author=$scope.select.authors[ind];
                    $scope.model.firstName=post.AuthorName;
                    $scope.model.authorAccount=contact;
                    $scope.changeContact();

                    //Facebook post
                    if(post.PostName==='Facebook') {
                        var count=0;
                        var fn = setInterval(function(){
                            count++;
                            if(count>10){
                                clearTimeout(fn);
                            }
                            if(window.FB){
                                isSendInvite=false;
                                clearTimeout(fn);
                            }
                        },500);
                    }else{
                        isSendInvite=false;
                    }
                }

            });
        };

        //init
        if (window.FB != null) {
            window.FB = null;
            var element = document.getElementById("facebook-jssdk");
            if (element) element.parentNode.removeChild(element);
        }
        init();
    }]);
