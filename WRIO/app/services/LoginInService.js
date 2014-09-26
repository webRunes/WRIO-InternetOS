'use strict';

var aps = aps || {};

aps.service('LoginInService',['$http','profileSrv',function($http,profileSrv) {
    this.signout=function(callback){
        var id=profileSrv.getUserId();
        $http({method:'POST', url:'/LoginService/LogOut/' + id}).success(function (isSuccess) {
            if(isSuccess.toLowerCase() == 'true'){
                profileSrv.ClearCurrentUser();
                if (callback) callback(true);
            }
            if (callback) callback('');
        });
    };
    this.LoginInBySocialNT=function(socialName, response,callBack){
        switch(socialName){
            case 'facebook':
                getFacebook(socialName, response,callBack);
                break;
            case 'twitter':
                getTwitter(socialName, response,callBack);
                break;
            case 'google':
                getGoogle(socialName, response,callBack);
                break;
        }
    };
    var getFacebook=function(socialName, result,callback){
        var msg = getTokenModel(socialName, result);
        if(result){
            result.get('/me')
                .done(function (response) {
                    msg.Account=response.id;
                    msg.FirstName=response.first_name;
                    msg.LastName=response.last_name;
                    authotize(msg,callback);
                })
                .fail(function () {
                    if(callback) callback('');
                });
        }else{
            if(callback) callback('');
        }
    };
    var getTwitter=function(socialName, result,callback){
        var msg = getTokenModel(socialName, result);
        if(result){
            result.get('1.1/account/verify_credentials.json')
                .done(function (response) {
                    msg.Account=response.id;
                    msg.FirstName=response.first_name;
                    msg.LastName=response.last_name;
                    authotize(msg,callback);
                })
                .fail(function () {
                    if(callback) callback('');
                });
        }else{
            if(callback) callback('');
        }
    };
    var getGoogle=function(socialName, result,callback){
        var msg = getTokenModel(socialName, result);
//        if(result){
//            result.get('1.1/account/verify_credentials.json')
//                .done(function (response) {
//                    msg.Account=response.id;
//                    msg.FirstName=response.first_name;
//                    msg.LastName=response.last_name;
//                    authotize(msg,callback);
//                })
//                .fail(function () {
//                    if(callback) callback('');
//                });
//        }else{
//            if(callback) callback('');
//        }
        if(callback) callback('');
    };

    var authotize=function(msg,callback){
        $http.post('/LoginService/login',msg).success(function(response){
            if(callback) callback(response);
        }).error(function(){
                if(callback) callback('');
            });
    };
    var getTokenModel=function(name,response){
        var model={Provider: name};
        if(response.oauth_token){
            model.Oauth2=false;
            model.Token=response.oauth_token;
            model.Secret=response.oauth_token_secret;
        }else if(response.access_token){
            model.Oauth2=true;
            model.Access=response.access_token;
            model.ExpiresIn=response.expires_in;
        }
        return model;
    };
}]);