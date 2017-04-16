aps.controller('LoginCtrl', ['$scope', 'loginService', '$state','profileSrv', function ($scope, loginService, $state, profileSrv) {
    $scope.loginModel = {};
    $scope.isMsg = [];
    $scope.signInModel = {
        email: '',
        password: '',
        remember: false
    };
    $scope.isMsg['incorrectData'] = false;
    $scope.isMsg['emailSentSuccessfully'] = false;
    $scope.isMsg['isEmailExist'] = false;
    $scope.isMsg['isEmailRegistred'] = false;
    $scope.isMsg['isPasswordIncorrect'] = false;
    $scope.fogotPasswordModel = {};
    
    var isEmailExist = function() {
        loginService.checkEmail($scope.signInModel,function (isExist) {
            if(!isExist) {
                $scope.isMsg['emailNotExist'] = true;
            }
        });
    };
    isEmailExist();
    
    var isAuthenticated = function () {
        loginService.isLogin(function (isLogin) {
            if (isLogin) {
                $state.go('plus');
            }
        });
    };
    isAuthenticated();
    
    $scope.login = function () {
        $scope.isMsg['incorrectData'] = false;
        $scope.isMsg['emailSentSuccessfully'] = false;
        loginService.tryToLogin($scope.signInModel,function (userId) {
            if (userId != "null") {
                profileSrv.setUser(userId);
                $state.go('plus');
            }else {
                $scope.isMsg['incorrectData'] = true;
            }
        });
    };

    $scope.restoreAccount = function() {
        $scope.isMsg['dataIsIncorrect'] = false;
        $scope.isMsg['success'] = false;
        loginService.restoreAccount($scope.signInModel, function(isCorrectEmail) {
            if(isCorrectEmail) {
                $scope.isMsg['success'] = true;
            }else {
                $scope.isMsg['incorrectEmail'] = true;
            }
        });
    };

    
    $scope.guestLogin = function() {
        loginService.guestLogin(function (isLogin) {
            if (isLogin) {
                $state.go('plus');
            }
        });
    };

    $scope.registredUser = function () {
        loginService.isPasswordValid($scope.signInModel, function (isValid) {
            if (isValid) {
                $scope.isMsg['isPasswordIncorrect'] = false;
                
                loginService.registredUser($scope.signInModel, function (isLogin) {
                    if (isLogin) {
                        $state.go('plus');
                    } else {
                        $scope.isMsg['isEmailRegistred'] = true;
                    }
                });
            } else {
                {
                    $scope.isMsg['isPasswordIncorrect'] = true;

                }
            }
        });


    };
    
    $scope.forgotPassword = function () {
        loginService.forgotPassword($scope.signInModel, function (isForgotPassword) {
            if (isForgotPassword) {
                $scope.isMsg['emailSentSuccessfully'] = true;
                $scope.isMsg['emailNotExist'] = false;
            } else {
                $scope.isMsg['emailSentSuccessfully'] = false;
                $scope.isMsg['emailNotExist'] = true;
            }
        });
    };
    
}]);