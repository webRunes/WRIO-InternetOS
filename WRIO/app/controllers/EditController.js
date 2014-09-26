'use strict';

var aps = aps || {};

aps.controller('EditCtrl', ['$scope', '$state','$rootScope', 'PostsService', 'profileSrv','userAppSrv','UserParamsSvc','langSvc','paginationService',
    function($scope, $state, $rootScope, PostsSrv,profileSrv,userAppSrv,UserParamsSvc,langSvc,paginationService) {
        var postId,userLangs,languages,isLoaded=false;
        var edit=false;
        $scope.ticket={};
        $scope.isErrTitle=false;
        $scope.isErrDesc=false;

        //language dropdown
        var onClickManageLang=function(){
            userAppSrv.selectTempAppTab('WRIO');
            $state.go('wrio');
        };
        var onSelectLang=function(index){
            edit=true;
            $scope.isSpecified=index==-1;
        };
        $scope.dropdownLanguage={
            title: 'Language',
            currValue: '',
            defaultValue: 'Not specified',
            isVisibleDefault: true,
            linkTitle: 'Manage',
            isVisibleLink: true,
            onClickLink: onClickManageLang, //fx()
            options:[],
            onSelectOption: onSelectLang, //fx()
            errorIndex: 'Not specified'
        };

        $scope.remove = function() {
            PostsSrv.deletePost($scope.ticket.Id);
            var hubTag = userAppSrv.removeAppItemByPostGuid($scope.ticket.Guid);
            if(hubTag) {
                var model = paginationService.getCountModelByAppTag(hubTag);
                userAppSrv.setHubState(hubTag,'hub.feed',model.currPage);
                $state.go('hub.feed', { hubTag: hubTag, numPage: model.currPage });
            }
            else $state.go('plus');
        };
        $scope.update = function() {
            if(checkPost()){
                if(edit){
                    $scope.ticket.Lang=getAllLangByTitle($scope.dropdownLanguage.currValue);
                    PostsSrv.savePost(profileSrv.getUserId(),$scope.ticket, function(data){
                        userAppSrv.updatePostTitlePost(postId,$scope.ticket.Title);
                        $state.go('post', { post: postId });
                    });
                }else{
                    $state.go('post', { post: postId });
                }

            }
        };
        $scope.change=function(name){
            edit=true;
            if(name=='title'){
                if(!$scope.ticket.Title || $scope.ticket.Title.length > 128){
                    $scope.isErrTitle=true;
                }else $scope.isErrTitle=false;
            }else if(name=='description'){
                if(!$scope.ticket.Description || $scope.ticket.Description.length > 512){
                    $scope.isErrDesc=true;
                }else $scope.isErrDesc=false;
            }
        };
        $rootScope.$on('load:error', function(event, model) {
            if (model == 'ticket') {
                $scope.msg['load'] = false;
                userAppSrv.addPostError();
                $state.go('error');
            }
        });
        var checkPost=function(){
            return !$scope.isErrTitle && !$scope.isErrDesc;
        };
        var setUsedLangs=function(){
            if(languages && userLangs){
                for(var i= 0,len=userLangs.length;i<len;i++){
                    for(var j= 0,ln=languages.length;j<ln;j++){
                        if(userLangs[i]==languages[j].Language) $scope.dropdownLanguage.options.push(languages[j].Name);
                    }
                }
                setPrepareData();
                isLoaded=true;
            }
        };
        var setPrepareData=function(){
            if(isLoaded){
                $scope.dropdownLanguage.currValue=getAllLangTitle($scope.ticket.Lang);
                $scope.msg['load']=false;
            }
        };
        var getAllLangTitle=function(lang){
            for(var i= 0,len=languages.length;i<len;i++){
                if(languages[i].Language==lang) return languages[i].Name;
            }
            return 'Not specified';
        };
        var getAllLangByTitle=function(title){
            for(var i= 0,len=languages.length;i<len;i++){
                if(languages[i].Name==title) return languages[i].Language;
            }
            return '';
        };

        $scope.msg=[];
        var initMsg=function(){
            $scope.msg['load']=true;
        };
        var init = function() {
            initMsg();
            postId = $state.params.post;
            PostsSrv.getTicketByGuid(postId, function(post){
                if(!post) {
                    userAppSrv.addPostError();
                    $state.go('error');
                }else{
                    $scope.ticket=post;
                    setPrepareData();
                    isLoaded=true;

                    UserParamsSvc.getUsedLangs(function(params){
                        userLangs=params;
                        setUsedLangs();
                    });
                    langSvc.getLangs(function(langs){
                        languages=langs;
                        setUsedLangs();
                    });
                }

            });
        };

        init();
    }]);
