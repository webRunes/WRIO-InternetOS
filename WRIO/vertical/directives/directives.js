'use strict';

var aps=aps || {};

aps.directive('userProfile',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/user-profile.html',
        scope: {},
        controller: function($scope, $window, profileSrv){
            $scope.profile=null;
            $scope.logout=function(){
                $window.location.assign('/login');
            };
            profileSrv.getProfile(function (profile) {
                $scope.profile=profile;
            });
        }
    };
});
aps.directive('appTicket',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/app-ticket.html'
    };
});
aps.directive('hubTicket',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/hub-ticket.html'
    };
});
aps.directive('postTicket',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/post-ticket.html'
    };
});
aps.directive('postWidget',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/post-widget.html'
    };
});

aps.directive('composeWidget',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/compose-widget.html'
    };
});
aps.directive('paginationFor',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/pagination-for.html'
    };
});
aps.directive('pagination',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/pagination.html'
    };
});
aps.directive('hubWidget',function () {
    return {
        restrict: 'A',
        templateUrl: '/vertical/templates/hub-widget.html',
        scope:{},
        controller:function($scope,$state,AppsService){
            $scope.hub={};
            var init=function(){
                var hubTag=$state.params.hubTag;
                AppsService.getAppTicketByTag(hubTag,function(app){
                    if(app){
                        $scope.hub=app;
                    }
                });
            };
            init();
        }
    };
});




