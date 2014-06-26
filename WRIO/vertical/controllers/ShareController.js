'use strict';

var aps = aps || {};

aps.controller('ShareCtrl', ['$scope', '$state','$rootScope', 'PostsService','userAppSrv',
    function($scope, $state, $rootScope, PostsSrv,userAppSrv) {
        var postId;
        $scope.ticket = {};
        $scope.isCompose=false;

        $scope.finish = function() {
            PostsSrv.removeComposeStep(postId);
            $state.go('post', { post: postId });
        };
        $scope.back=function(){
            PostsSrv.setComposeStep(postId, 'invite');
            $state.go('invite', { post: postId });
        };

        //popup
        $scope.openWindow = function(name) {
            //share URL TEXT
            if(!$scope.msg['load']){
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
        var init = function() {
            initMsg();
            postId = $state.params.post;
            PostsSrv.getTicketByGuid(postId, function(post){
                if(!post) {
                    userAppSrv.addPostError();
                    $state.go('error');
                }else{
                    var step=PostsSrv.getComposeStep(postId);
                    if(step)
                    {
                        $scope.isCompose=step=='share';
                        if(!$scope.isCompose) PostsSrv.removeComposeStep(postId);
                    }
                    $scope.ticket=post;
                    $scope.msg['load']=false;
                }

            });
        };

        //init
        init();
    }]);
