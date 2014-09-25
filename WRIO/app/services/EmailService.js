'use strict';

var aps = aps || {};

aps.service('emailSvc',['$http',function($http) {

    this.sendEmail=function(email,subj,body,callBack){
        var msg = {To: email, Subj: subj, Body: body};
        $http.post('/api/CoreEmail',msg).success(function(response){
            if(callBack) callBack(response);
        });
    };

    this.checkEmail=function(email){
        var rex=/\S+@\S+\.\S+/i;
        var arr=rex.test(email);
        return arr;
    };
}]);