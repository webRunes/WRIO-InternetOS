'use strict';

var aps = aps || {};

aps.controller('WrioCtrl', ['$scope', '$state','langSvc','UserParamsSvc', function ($scope, $state,langSvc,UserParamsSvc) {
    $scope.langs=[];
    $scope.userLangs=[];
    var loaded=false;

    $scope.onClickLang=function(lang){
        if(loaded){
            var ind=$scope.userLangs.indexOf(lang);
            if(ind==-1){
                $scope.userLangs.push(lang);
            }else{
                $scope.userLangs.splice(ind,1);
            }
            UserParamsSvc.UpdateUsedLang($scope.userLangs);
        }
    };
    $scope.checkActiveCls=function(lang){
        return $scope.userLangs.indexOf(lang)+1?'active':'';
    };
    $scope.checkSelectedLang=function(lang){
        var tt=checkUserLang(lang);
        return $scope.userLangs.indexOf(lang)+1;
    };
    var checkUserLang=function(lang){
        return _.find($scope.userLangs, function(item){
            return item==lang;
        });
    };
    var init=function(){
        langSvc.getLangs(function(langs){
            $scope.langs=langs;
            UserParamsSvc.getUsedLangs(function(params){
                $scope.userLangs=params;
                loaded=true;
            });
        });
    };

    //init
    init();
}]);