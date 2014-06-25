aps.controller('ProfileCtrl', ['$scope', 'loginService', '$state', function ($scope, loginService, $state) {

    $scope.onDeleteAccountClick = function () {
       $state.go('profiledelete');
    };
    
    $scope.onBackToProfileEditClick = function () {
        $state.go('profileedit');
    };
    
    $scope.signout = function () {
        loginService.signout(function (isSignout) {
            if (isSignout) {
                $state.go('login');
            }
        });
    };
    
}]);