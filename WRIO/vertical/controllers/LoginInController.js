'use strict';

var aps = aps || {};

aps.controller('LoginInCtrl', ['$scope', '$state', 'LoginInService', 'profileSrv', function ($scope, $state, LoginInService,profileSrv) {
    $scope.LoginBySocialNT = function(name){
        OAuth.popup(name, function (error, result) {
            if(result){
                LoginInService.LoginInBySocialNT(name, result,function(guid){
                    if(guid){
                        profileSrv.setUser(guid.UserId);
                        $state.go('plus');
                    }
                });
            }
        });

    };
    OAuth.initialize('4keNKRRPPMbqK-Xh7377CyRn59I');
}]);