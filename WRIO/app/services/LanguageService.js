'use strict';

var aps = aps || {};

aps.service('langSvc',['$http',function($http) {
    this.getLangs=function(callBack){
        if(langs.length){
            if(callBack) callBack(langs);
        }else{
            $http.get('/api/CoreWrioLang').success(function(response){
                langs=response;
                if(callBack) callBack(langs);
            }).error(function(){
                    if(callBack) callBack([]);
                });
        }
    };
    var langs=[];
}]);