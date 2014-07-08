//WithdrawCtrl
aps.controller('WalletCtrl', ['$scope', '$rootScope', '$state', 'profileSrv', 'walletSvc',
    function ($scope, $rootScope, $state, profileSrv, walletSvc) {
    $scope.isMsg = [];
    $scope.isMsg['done'] = false;
    $scope.isMsg['error'] = false;
    $scope.profile = {};
    $scope.transactionHistory = [];
    $scope.withdrawModel = {
        Gs: 0,
        Usd:0
    };
    $rootScope.balanceModel = {};
        $scope.lastTransaction = {
            GsStr: 0,
            UsdStr: 0
        };

        var payPalResponseInit = function () {
            switch ($state.params.msgType) {
                case 'error':
                    $scope.isMsg['error'] = true;
                    break;
                case 'succes':
                    walletSvc.lastTransaction(function (model) {
                        $scope.lastTransaction = model;
                        $scope.isMsg['done'] = true;
                    });
                    break;
                case 'cancel':
                    $scope.isMsg['error'] = true;
                    break;
                default:
                    break;
            }
        };

        var transactionsInit = function () {
            walletSvc.paymentHistory(function (modelCollection) {
                $scope.transactionHistory = modelCollection;
            });
        };

        var init = function () {
            switch ($state.current.name) {
                case 'payPalResponse':
                    payPalResponseInit();
                    break;
                case 'transactions':
                    transactionsInit();
                    break;
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
    $scope.changeUsd = function () {
        $scope.withdrawModel.Usd = 0;
        var cur = $scope.balanceModel.Currency;
        var gs = parseFloat($scope.withdrawModel.Gs);
        $scope.withdrawModel.Usd = parseFloat((gs * cur / 10000).toFixed(2));
    };
    $scope.changeGs = function () {
        $scope.withdrawModel.Gs = 0;
        var cur = $scope.balanceModel.Currency;
        var usd = parseFloat($scope.withdrawModel.Usd);
        $scope.withdrawModel.Gs = parseInt((usd * 10000 / cur).toFixed(0));
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