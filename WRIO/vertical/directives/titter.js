'use strict';

var aps = aps || {};

aps.directive('titter', function () {
    return {
        restrict: 'E',
        templateUrl: '/vertical/templates/titter.html',
        scope: { model:'='},
        controller: function ($scope,$state,$http,profileSrv) {
            var limit=72;
            var convert=0.004;
            var limitDesc=672;
            var currUser='';
            $scope.postGuid='';
            $scope.isMsg=[];
            $scope.currUserWrg=0;
            $scope.currUserUsd=0;
            $scope.twitterLimit=limit;
            $scope.descLimit=limitDesc;
            $scope.wrg=0;
            $scope.usd='0.0';
            $scope.title='';
            $scope.description='';
            $scope.isTwitter=false;
            $scope.isClkSend=true;
            $scope.isClkLogin=true;
            $scope.isComment=false;
            $scope.donatedText='';
            $scope.titleChange=function(){
                $scope.isMsg['donated']=false;
                var len = $scope.title.length;
                $scope.twitterLimit=limit-len;
            };
            var setDonatedText=function(wrg){
                if(wrg){
                    $scope.donatedText="You've donated "+wrg+" WRG. Thank you! Comment will appear in a minute";
                }else{
                    $scope.donatedText='Thanks for the comment. It will appear in a minute';
                }
            };
            $scope.sendComment=function(){
                if($scope.twitterLimit>=0 && !$scope.isMsg['addFunds'] && $scope.description){
                    $scope.isClkSend=true;
                    var postUrl = 'http://dev.wr.io/post/'+$scope.model.Guid + ' ';
                    var wrg = !$scope.wrg ? '' : $scope.wrg;
                    setDonatedText(wrg);
                    var donate ='Donate ' + wrg  + ' WRG ';
                    if(!wrg) donate=' ';
                    var tweet = {
                        UserGuid: profileSrv.getUserId(),
                        Title: postUrl+donate+$scope.title,
                        Description: $scope.description,
                        Wrg: wrg,
                        PostGuid: $scope.model.Guid
                    };
                    $http.post('/titter/sendtweet', tweet).success(function(response){
                        $scope.isClkSend=false;
                        $scope.description='';
                        $scope.title='';
                        $scope.wrg=0;
                        if(response.status==='200'){
                            $scope.isMsg['donated']=true;
                        }else if(response.status==='403'){
                            $scope.isTwitter=false;
                        }
                    });
                }
            };
            $scope.changeWrg=function(){
                if(!$scope.wrg || $scope.wrg<0)$scope.wrg=0;
                $scope.isMsg['addFunds'] = $scope.wrg > $scope.currUserWrg;
                $scope.usd=($scope.wrg*convert).toFixed(2);
            };
            $scope.descriptionChange=function(){
                $scope.isMsg['donated']=false;
                if($scope.description.length > 672) $scope.description=$scope.description.substring(0,672);
                var len=$scope.description.length;
                $scope.descLimit=limitDesc-len;
            };
            $scope.addFunds=function(){
                alert('add funds!');
            };
            $scope.twitterLogin=function(){
                $scope.isClkLogin=true;
                $http.get('/titter/login/'+$scope.model.Guid).success(function(response){
                    if(response.OauthToken){
                        window.location.href = 'https://api.twitter.com/oauth/authorize?oauth_token='+response.OauthToken;
                    }
                    $scope.isClkLogin=false;
                });
            };
            $scope.checkDisabledTxt=function(){
                return $scope.isTwitter?'':'disabled';
            };
            $scope.checkDisabledSendBtn=function(){
                return $scope.isClkSend?'disabled':'';
            };
            $scope.checkDisabledLoginBtn=function(){
                return $scope.isClkLogin?'disabled':'';
            };
            $scope.checkLenTitle=function(){
                return $scope.twitterLimit<0;
            };
            $scope.checkLenDesc=function(){
                return $scope.descLimit<0;
            };

            //initialize
            var init=function(){
                $scope.isMsg['donated']=false;
                $scope.isMsg['addFunds']=false;
                $scope.currUserWrg=0;
                $scope.currUserUsd=($scope.currUserWrg*convert).toFixed(2);
                currUser=profileSrv.getUserId();

                $http.get('/titter/twitter/'+currUser).success(function(response){
                    $scope.isTwitter=response==='true';
                    $scope.isClkSend=false;
                    $scope.isClkLogin=false;
                });
            };
            init();
        }
    };
});