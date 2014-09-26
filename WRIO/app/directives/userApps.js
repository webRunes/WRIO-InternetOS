'use strict';

var aps=aps || {};

aps.directive('userApps',function () {
    return {
        restrict: 'A',
        templateUrl: '/app/templates/user-apps.html',
        scope:{},
        controller: function ($scope, $rootScope, userAppSrv, $state, paginationService) {
            $scope.apps=[];
            $scope.tempApps=[];
            $scope.currApp='';
            $scope.currTab='';
            $scope.isPostError=false;
            $scope.errorPostTitle='Error 404 - Page not found';
            $scope.selectAppTab=function(appType,appTag){
                userAppSrv.setCurrApp(appTag);
                userAppSrv.setCurrTab('');
                var count=paginationService.getCountModelByAppTag(appTag);
                if(appType.toLowerCase()=='hub'){
                    var state=userAppSrv.getHubState(appTag);
                    $state.go(state.currState,{hubTag:appTag,numPage:count.currPage});
                }else{
                    var state=userAppSrv.getAppState(appTag);
                    $state.go(state);
                }
            };
            $scope.selectTempAppTab=function(name){
                userAppSrv.getApps(function(apps){
                    if(name=='webRunes'){
                        var ind=userAppSrv.getAppByTag(apps,'webrunes');
                        if(ind+1){
                            userAppSrv.setHubState('webrunes','hub.contact',null);

                        }else{
                            userAppSrv.addTempAppTab('webRunes');
                        }
                        userAppSrv.setCurrApp('webRunes');
                        userAppSrv.setCurrTab('');
                        $state.go('hub.contact',{hubTag: 'webrunes'});
                    }else if(name=='WRIO'){
                        var ind=userAppSrv.getAppByTag(apps,'wrio');
                        if(ind+1){
                            userAppSrv.setHubState('wrio','hub.contact',null);

                        }else{
                            userAppSrv.addTempAppTab('WRIO');
                        }
                        userAppSrv.setCurrApp('WRIO');
                        userAppSrv.setCurrTab('');
                        $state.go('wrio');
                    }
                });
            };
            $scope.selectTab=function(guid){
                userAppSrv.setCurrTab(guid);
                $state.go('post',{post:guid});
            };
            $scope.removeTab=function(appType,appId,itemGuid){
                userAppSrv.removeAppItem(appId, itemGuid);
                if($scope.currTab==itemGuid){
                    userAppSrv.setCurrApp($scope.currApp);
                    userAppSrv.setCurrTab('');
                    var model = paginationService.getCountModelByAppTag($scope.currApp);
                    userAppSrv.setHubState($scope.currApp,'hub.feed',model.currPage);
                    $state.go('hub.feed', { hubTag: $scope.currApp, numPage: model.currPage });
                }
            };
            $scope.onPlusClick=function(){
                userAppSrv.setCurrApp('plus');
                userAppSrv.setCurrTab('');
                var count=paginationService.getCountModelByAppTag('plus');
                $state.go('plus',{page:count.currPage});
            };
            $rootScope.$on('resize:success',function(event,model){
                if(model=='userApps') init();
            });
            $scope.getClass=function(tag){
                if(tag==$scope.currApp) return 'in';
                return 'collapse';
            };
            $scope.checkActiveApp=function(tag){
                if(tag.toLowerCase()==$scope.currApp.toLowerCase() && !$scope.currTab) return 'active';
                return '';
            };
            $scope.checkClassApp=function(tag){
                if(tag.toLowerCase()==$scope.currApp.toLowerCase()) return '';
                return 'collapsed';
            };
            $scope.checkActiveTab=function(tag){
                if(tag==$scope.currTab) return 'active';
                return '';
            };
            $scope.selectPostErrorTab=function(){
                userAppSrv.setCurrApp('error');
                userAppSrv.setCurrTab('error');
                $state.go('error');
            };
            $scope.removePostErrorTab=function(){
                userAppSrv.removePostError();
                $state.go('plus');
            };
            var init=function(){
                var tagApp=$state.params.tag;

                userAppSrv.getApps(function (data, tempApps, currApp, currTab, isErrorPost) {
                    $scope.apps=data;
                    $scope.tempApps=tempApps;
                    $scope.currApp=currApp;
                    $scope.currTab=currTab;
                    $scope.isPostError=isErrorPost;
                    if(!currApp && tagApp && ($state.is('hub') || $state.is('app'))){
                        userAppSrv.setCurrApp(tagApp);
                        $scope.currApp=tagApp;
                    }
                });
            };
            init();
        }
    };
});