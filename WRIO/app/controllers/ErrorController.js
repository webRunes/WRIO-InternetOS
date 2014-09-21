'use strict';

var aps = aps || {};

aps.controller('ErrorCtrl', ['$scope', '$state', 'userAppSrv', function ($scope, $state, userAppSrv) {
    $scope.onClickBack=function(){
        //$state.go('plus');
    };
    $scope.onClickClose=function(){
        userAppSrv.removePostError();
        $state.go('plus');
    };
}]);