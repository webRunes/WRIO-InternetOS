'use strict';

var aps = aps || {};

aps.controller('AppCtrl', ['$scope', '$state', function ($scope, $state) {

    $scope.isMsg=[];
    $scope.isMsg['load']=true;

    var init=function(){
        $scope.isMsg['load'] = false;
        var start = false;
        $state.go('plus');
    };

    //init
    init();
}]);