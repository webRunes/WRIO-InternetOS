'use strict';

var aps = aps || {};

aps.service('twitterSvc',['$http',function($http) {

    this.getUserTwitterByAccount=function(account,callBack){
        var rex=/[http|https]+:\/\/(?:www\.|)twitter\.com\/([a-zA-Z0-9_\.]+)/i;
        var arr=rex.exec(account);
        if(arr && arr[1]){
            if(callBack) callBack(arr[1]);
        }else if(callBack) {
            if(callBack) callBack(null);
        }

    };


    this.GetTwitterComment=function(url){
        var id;
        var reg=/data-widget-id="([a-zA-Z0-9]+)"/i;
        var arr=reg.exec(url);
        if(arr && arr[1]){
            id=arr[1];
        }

        return id;
    };
}]);