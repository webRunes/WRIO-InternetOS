'use strict';

var aps = aps || {};

aps.controller('CreateCtrl', ['$scope', '$state', 'composeService', 'userAppSrv','AppsService','paginationService',
    function($scope, $state, composeSvc, userAppSrv,AppsService,paginationService) {
        var hubTag;
        $scope.model={urlCode: ''};
        $scope.msg = [];
        var edit = false;

        $scope.preview = function() {
            if (checkUrl()) {
                if (edit) {
                    $scope.msg['url-data'] = true;
                    composeSvc.setComposeUrl(hubTag, $scope.model.urlCode, function(data) {
                        if(data){
                            userAppSrv.setHubState(hubTag,'hub.details',null);
                            $state.go('hub.details', { hubTag: hubTag });
                        }else{
                            $scope.msg['url-data'] = false;
                            $scope.msg['url'] = true;
                            $scope.model.urlCode='';
                        }
                    });
                }else {
                    userAppSrv.setHubState(hubTag,'hub.details',null);
                    $state.go('hub.details', { hubTag: hubTag });
                }
            }
        };
        $scope.onFeedClc=function(){
            var model = paginationService.getCountModelByAppTag(hubTag);
            userAppSrv.setHubState(hubTag,'hub.feed',model.currPage);
            $state.go('hub.feed', { hubTag: hubTag, numPage: model.currPage });
        };
        $scope.getHasError=function(){
            return $scope.msg['url']?'has-error':'';
        };
        $scope.changeUrlCode = function() {
            edit = true;
            $scope.msg['url'] = !$scope.model.urlCode;
        };
        var checkUrl = function() {
            $scope.msg['url'] = !$scope.model.urlCode;
            return !$scope.msg['url'];
        };
        $scope.remove = function() {
            userAppSrv.removeCompose(hubTag);
            var model = paginationService.getCountModelByAppTag(hubTag);
            userAppSrv.setHubState(hubTag,'hub.feed',model.currPage);
            $state.go('hub.feed', { hubTag: hubTag, numPage: model.currPage });
        };
        var init = function() {
            $scope.msg['url'] = false;
            $scope.msg['url-data'] = false;

            hubTag = $state.params.hubTag;
            AppsService.getAppTicketByTag(hubTag,function(hub){
                if(hub!='null'){
                    composeSvc.getComposeByHub(hubTag, function(data) {
                        $scope.model.urlCode = data.URL;
                    });
                }else{
                    userAppSrv.addPostError();
                    $state.go('error');
                }
            });
        };

        init();
    }]);