'use strict';

var aps = aps || {};

aps.service('iframelySvc',['$http',function($http) {

    this.getPostData=function(urlCode,callBack){
        var sourceUrl = getSourceUrl(urlCode);
        $http.get('http://54.235.73.25:8061/api/iframely?url=' + sourceUrl)
            .success(function(response){
                if(callBack) callBack(response);
            }).error(function(data, status, headers, config){
                if(callBack) callBack('');
            });
    };

    var getSourceUrl=function(urlCode){
        return "https://plus.google.com/111401917971052287374/posts/ckMH7sYmFnz";
    };
}]);