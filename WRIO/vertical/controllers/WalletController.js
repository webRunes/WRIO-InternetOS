//WithdrawCtrl
aps.controller('WalletCtrl', ['$scope', '$rootScope','$state', 'profileSrv', 'walletSvc', function ($scope, $rootScope, $state, profileSrv, walletSvc) {
    $scope.isMsg = [];
    $scope.isMsg['done'] = false;
    $scope.isMsg['error'] = false;
    $scope.profile = {};
    $scope.withdrawModel = {
        Gs: 0,
        Usd:0
    };
    $rootScope.balanceModel = {};

    var init = function () {
        if($state.params['isSuccess']) {
            if ($state.params['isSuccess'] == 'completed') {
                walletSvc.lastTransaction(function(model) {
                    $scope.withdrawModel.Gs = model.Gs;
                    $scope.withdrawModel.Usd = model.Usd;
                });
                $scope.isMsg['done'] = true;
            }else {
                $scope.isMsg['error'] = true;
            }
        }
        profileSrv.getProfile(function (model) {
            $scope.profile = model;
        });
        walletSvc.getBalance(function (value) {
            $scope.balanceModel = value;
        });
    };
    init();

    $scope.withdraw = function () {
        $scope.isMsg['done'] = false;
        $scope.isMsg['error'] = false;
        walletSvc.withdraw({ Amount: $scope.withdrawModel.Usd, Email: $scope.profile.Email }, function (model) {
            //todo:
            if (model.IsTransferCanseled) {
                alert('Error type:' + model.ErrorType + " ;Error message:" + model.ErrorMessage);
            } else {
                walletSvc.getBalance(function (value) {
                    $scope.balanceModel = value;
                    $scope.isMsg['done'] = true;
                });
            }
        });
    };
    $scope.closeAlertMsg = function() {
        $scope.isMsg['alertMsg'] = false;
    };
    $scope.changeUsd = function() {
        var cur = $scope.balanceModel.Currency;
        var gs = parseFloat($scope.withdrawModel.Gs);
        $scope.withdrawModel.Usd = gs * cur / 10000;
    };
    $scope.changeGs = function () {
        var cur = $scope.balanceModel.Currency;
        var usd = parseFloat($scope.withdrawModel.Usd);
        $scope.withdrawModel.Gs = usd * 10000 / cur;
    };
    $scope.addFunds = function () {
        $scope.isMsg['done'] = false;
        $scope.isMsg['error'] = false;
        //{ Amount: $scope.withdrawModel.Usd}
        walletSvc.addFunds({ Amount: $scope.withdrawModel.Usd }, function (model) {
            if (model.IsSucces) {
                window.location = model.Url;
            }else {
                $scope.isMsg['error'] = true;
            }
        });
    };
}]);