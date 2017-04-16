'use strict';

var aps = aps || {};

aps.service('profileSrv',['$http', '$rootScope', '$q', '$window',function($http, $rootScope, $q, $window) {
    var userId = $('body').attr('id');
    var profile;
    var robot=true;

    this.getProfile = function (callBack) {
        if (userId) {
            if (profile != null) {
                if (callBack) callBack(profile);
            } else {
                $http.get('/api/UserProfile/' + userId).success(function (data) {
                    if (!data) $window.location.assign('/login');
                    if (!data.Avatar) data.Avatar = '/vertical/img/no-photo.png';
                    profile = data;
                    if (callBack) callBack(profile);
                }).error(function () {
                        if (callBack) callBack('');
                });
            }
        } else {
            if(robot){
                robot=false;
                if (callBack) callBack({});
            }else window.location.assign('/login');
        }
    };
    this.setUser=function(id){
        userId=id;
    };
    this.getUserId = function () {
        if(!userId)  window.location.assign('/login');
        return userId;
    };
    this.getUserName = function () {
        return profile?profile.NickName:'';
    };
    this.checkUser = function () {
        var def = $q.defer();
        if (profile != null) {
            def.resolve(profile);
        }else{
            $http.get('/api/UserProfile/' + userId).success(function (data) {
                if (data && !data.Avatar) data.Avatar = '/vertical/img/no-photo.png';
                profile = data;

                def.resolve(profile);
            }).error(function () {
                    def.resolve('');
                });
        }

        return def.promise;
    };

    var init=function(){
        if(!robot && !userId) $window.location.assign('/login');
    };
    init();
}]);
