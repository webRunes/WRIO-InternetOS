'use strict';

var aps = aps || {};

aps.controller('ContactCtrl', ['$scope','$state', 'emailSvc','userAppSrv',"profileSrv",'paginationService',
    function ($scope, $state, emailSvc, userAppSrv,profileSrv,paginationService) {
    var toEmail= 'alexey.anshakov@gmail.com';
    $scope.email={first:'',last:'',email:'',message:''};
    $scope.isErrorMessage=false;
    $scope.isErrorEmail=false;
    $scope.isSendMsg=false;

    $scope.checkMessageCls=function(){
        return $scope.isErrorMessage?'has-error':'';
    };
    $scope.checkEmailCls=function(){
        return $scope.isErrorEmail?'has-error':'';
    };
    $scope.onChange=function(field){
        $scope.isSendMsg=false;
        if(field=='email') $scope.isErrorEmail=false;
        if(field=='message') {
            if($scope.email.message.length>4096) $scope.isErrorMessage=true;
            $scope.isErrorMessage=false;
        }
    };
    $scope.onCancel=function(){
        userAppSrv.getApps(function(apps){
            userAppSrv.clearEmail();
            var ind=userAppSrv.getAppByTag(apps,'webrunes');
            if(ind+1){
                var model = paginationService.getCountModelByAppTag('webrunes');
                userAppSrv.setHubState('webrunes','hub.feed',model.currPage);
                $state.go('hub.feed', { hubTag: 'webrunes', numPage: model.currPage });
            }else{
                userAppSrv.removeTempAppTab('webRunes');
                userAppSrv.setCurrApp('plus');
                userAppSrv.setCurrTab('');
                $state.go('plus');
            }
        });

    };
    $scope.onSubmit=function(){
        if(checkFields()){
            emailSvc.sendEmail(toEmail,'Contact form message',$scope.email.message,null);
            userAppSrv.clearEmail();
            $scope.email.message='';
            $scope.isSendMsg=true;
//            userAppSrv.getApps(function(apps){
//                var ind=userAppSrv.getAppByTag(apps,'webrunes');
//                if(ind+1){
//                    var model = paginationService.getCountModelByAppTag('webrunes');
//                    userAppSrv.setHubState('webrunes','hub.feed',model.currPage);
//                    $state.go('hub.feed', { hubTag: 'webrunes', numPage: model.currPage });
//                }else{
//                    userAppSrv.removeTempAppTab('webRunes');
//                    userAppSrv.setCurrApp('plus');
//                    userAppSrv.setCurrTab('');
//                    $state.go('plus');
//                }
//            });
        }
    };
    var checkFields=function(){
        var success=true;
        if(!$scope.email.first) $scope.email.first='Anonymous';
        if(!emailSvc.checkEmail($scope.email.email)){
            $scope.isErrorEmail=true;
            success=false;
        }
        if(!$scope.email.message || $scope.email.message.length>4096){
            $scope.isErrorMessage=true;
            success=false;
        }
        if(success) $scope.email.message=$scope.email.message+'\n\n\nfrom: '
            +$scope.email.first+' '+$scope.email.last+' \n'+$scope.email.email;
        return success;
    };
    var init=function(){
        var contact=userAppSrv.getContact();
        if(!contact.first || !contact.email){
            profileSrv.getProfile(function(profile){
                if(!contact.first) contact.first=profile.NickName;
                if(!contact.email) contact.email=profile.Email;
                $scope.email=contact;
            });
        }else $scope.email=contact;
    };
    init();
}]);