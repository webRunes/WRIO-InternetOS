'use strict';

var aps = aps || {};

aps.controller('DetailsCtrl', ['$scope', '$rootScope', '$state', 'composeService',
    'servicePostLink', 'userAppSrv','PostsService','UserParamsSvc','langSvc','AppsService','paginationService',
    function($scope, $rootScope, $state, composeService, servicePostLink, userAppsService,
             PostsService,UserParamsSvc,langSvc,AppsService,paginationService) {
        var hubTag, edit, isSend=false, languages, userLangs,isLoaded=false;
        $scope.compose = {};
        $scope.model = { authorAccount: '', placeHolder: 'Enter email', placeError: 'Email required' };
        $scope.isErrTitle=false;
        $scope.isErrDesc=false;
        $scope.isErrContact=false;
        $scope.isContactShow=false;
        $scope.isSpecified=false;
        $scope.currLang='';
        $scope.usedLangs=[];

        //contact dropdown
        var onChangeContact=function(){
            edit = true;
            $scope.isErrContact=false;
            $scope.isContactShow=false;
            if($scope.dropdownContact.currValue=='Email'){
                $scope.isContactShow=true;
                $scope.model.placeHolder = 'Enter email';
                $scope.model.placeError = 'Email required';
            }else if($scope.dropdownContact.currValue=='Google+'){
                $scope.isContactShow=true;
                $scope.model.placeHolder = 'Enter author account URL';
                $scope.model.placeError = 'Field is required';
            }else if($scope.dropdownContact.currValue=='Facebook'){
                $scope.isContactShow=true;
                $scope.model.placeHolder = 'Enter author account URL';
                $scope.model.placeError = 'Field is required';
            }else if($scope.dropdownContact.currValue=='Twitter'){
                $scope.isContactShow=true;
                $scope.model.placeHolder = 'Enter author account URL';
                $scope.model.placeError = 'Field is required';
            }
        };
        $scope.dropdownContact={
            title: 'Author contact',
            currValue: '',
            defaultValue: '',
            isVisibleDefault: false,
            linkTitle: '',
            isVisibleLink: false,
            onClickLink: '', //fx()
            options:["I'm the author", 'Email', 'Google+', 'Facebook', 'Twitter', 'Unknown'],
            onSelectOption: onChangeContact, //fx()
            errorIndex: ''
        };
        //language dropdown
        var onClickManageLang=function(){
            userAppsService.getApps(function(apps){
                var ind=userAppsService.getAppByTag(apps,'wrio');
                if(ind+1){
                    userAppsService.setHubState('wrio','hub.contact',null);

                }else{
                    userAppsService.addTempAppTab('WRIO');
                }
                userAppsService.setCurrApp('WRIO');
                userAppsService.setCurrTab('');
                $state.go('wrio');
            });
            userAppsService.selectTempAppTab('WRIO');
            $state.go('wrio');
        };
        var onSelectLang=function(index){
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

        $scope.publish = function () {
            if (checkFields() && !isSend) {
                $scope.msg['load']=true;
                isSend=true;
                $scope.compose.Lang=getLangByTitle($scope.dropdownLanguage.currValue);

                if($scope.dropdownContact.currValue=="I'm the author"){
                    $scope.compose.AuthorPostName=$scope.compose.AuthorName;
                    $scope.compose.Invite=true;
                }else if($scope.dropdownContact.currValue!='Unknown'){
                    $scope.compose.AuthorPostContactType=$scope.dropdownContact.currValue;//$scope.select.author;
                    $scope.compose.AuthorPostContact=$scope.model.authorAccount;
                }

                composeService.saveCompose(hubTag, function (id) {
                    if(id){
                        PostsService.setComposeStep($scope.compose.Guid, 'invite');
                        userAppsService.removeCompose(hubTag);
                        var model = paginationService.getCountModelByAppTag(hubTag);
                        userAppsService.setHubState(hubTag,'hub.feed',model.currPage);
                        userAppsService.AddAppItem(hubTag, id, function() {
                            $state.go('invite', { post: id });
                        });
                    }
                    $scope.msg['load']=false;
                });
            }
        };
        $scope.onFeedClc=function(){
            var model = paginationService.getCountModelByAppTag(hubTag);
            userAppsService.setHubState(hubTag,'hub.feed',model.currPage);
            $state.go('hub.feed', { hubTag: hubTag, numPage: model.currPage });
        };
        $scope.back = function () {
            userAppsService.setHubState(hubTag,'hub.create',null);
            $state.go('hub.create', { hubTag: hubTag });
        };
        $scope.remove = function () {
            userAppsService.removeCompose(hubTag);
            var model = paginationService.getCountModelByAppTag(hubTag);
            userAppsService.setHubState(hubTag,'hub.feed',model.currPage);
            $state.go('hub.feed', { hubTag: hubTag, numPage: model.currPage });
        };
        $scope.checkHasError = function (field) {
            if(field==='title'){
                if($scope.isErrTitle) return 'has-error';
                else return '';
            }else if(field==='description'){
                if($scope.isErrDesc) return 'has-error';
                else return '';
            }else if(field==='contact'){
                if($scope.isErrContact) return 'has-error';
                else return '';
            }else return '';
        };
        $scope.change = function (field) {
            edit = true;
            if (field == 'title') {
                //ToDo
                $scope.isErrTitle = $scope.compose.Title.length > 128;
            } else if (field == 'description') {
                $scope.isErrDesc = $scope.compose.Description.length > 512;
            }else if (field == 'contact') {
                $scope.isErrContact=false;
            }
        };
        $scope.getMsgAuthorExist=function(){
            return $scope.select.author=='Email'?'Wrong email address':'The author does not exist';
        };
        var checkFields = function () {
            var success=true;
            if (!$scope.compose.Title) {
                $scope.compose.Title='Untitled';
            }else if($scope.compose.Title.length>128){
                $scope.isErrTitle=false;
                success=false;
            }
            if (!$scope.compose.Description) {
                $scope.compose.Description='No description';
            }else if($scope.compose.Description.length>512){
                $scope.isErrDesc=false;
                success=false;
            }
            if($scope.dropdownContact.currValue=='Email'){
                if(!$scope.model.authorAccount){
                    $scope.model.placeError = 'Email required';
                    $scope.isErrContact=true;
                    success=false;
                }else{
                    var rex=/\S+@\S+\.\S+/i;
                    var arr=rex.test($scope.model.authorAccount);
                    if(!arr) {
                        $scope.model.placeError = 'Incorrect data';
                        $scope.isErrContact=true;
                        success=false;
                    }
                }
            }
            if($scope.dropdownContact.currValue=='Google+'){
                if(!$scope.model.authorAccount){
                    $scope.model.placeError = 'Field is required';
                    $scope.isErrContact=true;
                    success=false;
                }else{
                    var rex=/[http|https]+:\/\/(?:www\.|)plus\.google\.com\/u\/0\/([0-9]+)/i;
                    var arr=rex.test($scope.model.authorAccount);
                    if(!arr) {
                        $scope.model.placeError = 'Incorrect data';
                        $scope.isErrContact=true;
                        success=false;
                    }
                }
            }
            if($scope.dropdownContact.currValue=='Facebook'){
                if(!$scope.model.authorAccount){
                    $scope.model.placeError = 'Field is required';
                    $scope.isErrContact=true;
                    success=false;
                }else{
                    var rex=/[http|https]+:\/\/(?:www\.|)facebook\.com\/([a-zA-Z0-9_\.]+)/i;
                    var arr=rex.test($scope.model.authorAccount);
                    if(!arr) {
                        $scope.model.placeError = 'Incorrect data';
                        $scope.isErrContact=true;
                        success=false;
                    }
                }
            }
            if($scope.dropdownContact.currValue=='Twitter'){
                $scope.model.placeError = 'Field is required';
                if(!$scope.model.authorAccount){
                    $scope.isErrContact=true;
                    success=false;
                }else{
                    var rex=/[http|https]+:\/\/(?:www\.|)twitter\.com\/([a-zA-Z0-9_\.]+)/i;
                    var arr=rex.test($scope.model.authorAccount);
                    if(!arr) {
                        $scope.model.placeError = 'Incorrect data';
                        $scope.isErrContact=true;
                        success=false;
                    }
                }
            }
            return success;
        };
        var getPostId = function (postUrl) {
            if (postUrl=='Google+') {
                return 2;
            } else if (postUrl=='Facebook') {
                return 3;
            } else if (postUrl=='Twitter') {
                return 4;
            }
            return 5;
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
        var getLangTitle=function(lang){
            for(var i= 0,len=languages.length;i<len;i++){
                if(languages[i].Language==lang) return languages[i].Name;
            }
            return 'Not specified';
        };
        var getLangByTitle=function(title){
            for(var i= 0,len=languages.length;i<len;i++){
                if(languages[i].Name==title) return languages[i].Language;
            }
            return '';
        };
        var setPrepareData=function(){
            if(isLoaded){
                $scope.dropdownLanguage.currValue=getLangTitle($scope.compose.Lang);
                $scope.model.authorAccount = $scope.compose.AuthorPostAccount;
                var postId = getPostId($scope.compose.PostName);

                $scope.dropdownContact.currValue=$scope.dropdownContact.options[postId];

                if (postId==2 || postId==3 || postId==4) {
                    $scope.model.placeHolder = 'Enter author account URL';
                    $scope.model.placeError = 'Field is required';
                }
                if(postId!=0 && postId!=5) $scope.isContactShow=true;

                //preview
                $scope.model.Preview = servicePostLink.getLinkHtml($scope.compose.PostType,$scope.compose.PostName, $scope.compose.PostContent, $scope.compose.Title);

                if($scope.compose.Description)$scope.change('description');
                edit = false;

                $scope.msg['load']=false;
            }
        };
        $scope.msg=[];
        var initMsg=function(){
            $scope.msg['load']=true;
        };
        var init = function () {
            initMsg();
            hubTag = $state.params.hubTag;
            AppsService.getAppTicketByTag(hubTag,function(hub){
                if(hub!='null'){
                    composeService.getComposeByHub(hubTag, function (compose) {
                        $scope.compose = compose;
                        setPrepareData();
                        isLoaded=true;
                    });
                    UserParamsSvc.getUsedLangs(function(params){
                        userLangs=params;
                        setUsedLangs();
                    });
                    langSvc.getLangs(function(langs){
                        languages=langs;
                        setUsedLangs();
                    });
                }else{
                    userAppsService.addPostError();
                    $state.go('error');
                }
            });
        };
        if (window.FB != null) {
            window.FB = null;
            var element = document.getElementById("facebook-jssdk");
            if (element) element.parentNode.removeChild(element);
        }
        init();
    }]);
