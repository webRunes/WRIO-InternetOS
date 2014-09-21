'use strict';

var aps = aps || {};

aps.service('fbSvc',['$http', '$rootScope', '$q', '$window',function($http, $rootScope, $q, $window) {
    var appId = '1474466086110694';

    var getUserFbIdByAccount=function(account,callBack){
        var rex=/[http|https]+:\/\/(?:www\.|)facebook\.com\/([a-zA-Z0-9_\.]+)/i;
        var arr=rex.exec(account);
        if(arr && arr[1]){
            $http.get('https://graph.facebook.com/'+arr[1]+'?fields=id')
                .success(function(data){
                    if(callBack) callBack(data.id);
                })
                .error(function(){
                    if(callBack) callBack(null);
                });
        }else if(callBack) {
            callBack(null);
        }

    };
    this.sendMessageToUser=function(model,callBack){
        getUserFbIdByAccount(model.AuthorPostContact,function(authorId){
            if(authorId){
                var send = {
                    app_id: appId,
                    to: authorId,
                    method: 'send',
                    link: 'http://dev.wr.io/post/'+model.Guid,
                    description: 'Dear User! I published your post on http://dev.wr.io/post/'+model.Guid
                };

                FB.ui(send, callBack);
            }
        });

    };
}]);
