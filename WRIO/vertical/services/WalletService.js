aps.service('walletSvc', ['$http', function ($http) {
    //AccountBalance
    this.getBalance = function (callBack) {
        $http.post('/api/AccountBalance').success(function (response) {
            if (callBack) callBack(response);
        });
    };
    this.withdraw = function (model, callBack) {
        $http.post('/api/PayPalWithdraw', model).success(function (response) {
            if (callBack) callBack(response);
        });
    };
    //AddFunds
    this.addFunds = function (model, callBack) {
        $http.post('/api/AddFunds', model).success(function (response) {
            if (callBack) callBack(response);
        });
    };
    this.lastTransaction = function(callBack) {
        $http.post('/api/LastTransaction').success(function (model) {
            if (callBack) callBack(model);
        });
    };
    this.paymentHistory = function (callBack) {
        $http.post('/api/PaymentHistory').success(function (model) {
            if (callBack) callBack(model);
        });
    };
}]);