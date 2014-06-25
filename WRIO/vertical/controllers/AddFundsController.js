//AddFundsCtrl
aps.controller('AddFundsCtrl', ['$scope', '$rootScope', 'profileSrv', 'walletSvc', function ($scope, $rootScope, profileSrv, walletSvc) {
    $scope.isMsg = [];
    $scope.isMsg['done'] = false;
    $scope.isMsg['error'] = false;
    $scope.profile = {};
    $scope.withdrawModel = {
        Gs: 0,
        Usd: 0
    };
    var init = function () {
        profileSrv.getProfile(function (model) {
            $scope.profile = model;
        });
        walletSvc.getBalance(function (value) {
            $scope.balanceModel = value;
        });
    };
    init();
}]);