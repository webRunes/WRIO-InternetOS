'use strict';

var aps = aps || {};

aps.service('UserParamsSvc',['$http','profileSrv',function($http,profileSrv) {
    var getUserParams=function(callBack){
        $http.get('/api/CoreUserParams/'+profileSrv.getUserId()).success(function(response){
            params=response;
            params.langs=response.UsedLangs.split('|');
            if(callBack) callBack();
        }).error(function(){
                if(callBack) callBack();
            });
    };
    this.getUsedLangs=function(callBack){
        if(params){
            if(callBack) callBack(params.langs);
        }else{
            getUserParams(function(){
                if(callBack) callBack(params?params.langs:[]);
            });
        }
    };
    this.UpdateUsedLang=function(langs){
        params.UsedLangs=langs.length>1?params.UsedLangs=langs.join('|'):params.UsedLangs=langs[0];
        $http.post('/api/CoreUserParams',params).success(function(){});
    };
    var params;
}]);