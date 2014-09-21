'use strict';

var aps = aps || {};

aps.service('loginService', ['$http', function ($http) {
    
//    var isAuthenticated = false;
//    //var isValidemail = false;
//
//    this.tryToLogin = function(model, callBack) {
//        $http.post('/api/LoginSignIn', model).success(function(data) {
//            //var isLogin = JSON.parse(data);
//            if (callBack) callBack(data);
//        });
//    };
//
//    this.checkEmail = function (model, callBack) {
//        $http.post('/api/ProfileCheckEmail', model).success(function (data) {
//            var isExist = JSON.parse(data);
//            if (callBack) callBack(isExist);
//        });
//    };
//
//    this.isLogin = function(callBack) {
//        if (!isAuthenticated) {
//            $http.post('/api/Login').success(function(data) {
//                var isLogin = JSON.parse(data);
//                if (callBack) callBack(isLogin);
//            });
//        } else {
//            if (callBack) callBack(isAuthenticated);
//        }
//
//    };
//
//    this.restoreAccount = function(model, callBack) {
//        $http.post('/api/LoginAccount', model).success(function(data) {
//            var isSuccess = JSON.parse(data);
//            if (callBack) callBack(isSuccess);
//        });
//    };
//
//    this.guestLogin = function (callBack) {
//        $http.post('/api/ProfileGuestlogin').success(function (data) {
//            var isSuccess = JSON.parse(data);
//            if (callBack) callBack(isSuccess);
//        });
//    };
//
//    this.signout = function (callBack) {
//        $http.post('/api/SignOut').success(function (data) {
//            var isSuccess = JSON.parse(data);
//            if (callBack) callBack(isSuccess);
//        });
//    };
//
//    this.registredUser = function(model, callBack) {
//        $http.post('/api/ProfileRegistration', model).success(function (data) {
//            var isSuccess = JSON.parse(data);
//            if (callBack) callBack(isSuccess);
//        });
//    };
//
//    this.forgotPassword = function (model, callBack) {
//        $http.post('/api/LoginResetPassword', model).success(function (data) {
//            var isSuccess = JSON.parse(data);
//            if (callBack) callBack(isSuccess);
//        });
//    };
//
//    this.isPasswordValid = function (model, callBack) {
//        $http.post('/api/Password', model).success(function (data) {
//            var isSuccess = JSON.parse(data);
//            if (callBack) callBack(isSuccess);
//        });
//    };
}]);