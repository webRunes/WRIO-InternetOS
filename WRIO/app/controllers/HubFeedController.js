'use strict';

var aps = aps || {};

aps.controller('HubFeedCtrl', ['$scope', '$rootScope', '$state', 'AppsService', 'PostsService', 'userAppSrv', 'paginationService','composeService',
    function($scope, $rootScope, $state, appTicketsService, PostsService, userAppsService, paginationService,composeService) {
        $scope.posts = [];
        $scope.currApp = {};
        var tag;
        //----pagination
        $scope.page = 1;
        $scope.pages = [];
        $scope.total = 0;
        //----pagination for
        $scope.counts = [];
        $scope.currCount = 0;

        $scope.selectPost = function(id) {
            userAppsService.AddAppItem(tag, id, function() {
                $state.go('post', { post: id });
            });
        };
        $scope.compose = function() {
            var state='hub.create';
            composeService.getComposeByHub(tag, function(data) {
                if(data.URL){
                    state='hub.details';
                }
                userAppsService.setCurrApp(tag);
                userAppsService.setCurrTab('');
                userAppsService.setHubState(tag,state,null);
                $state.go(state, { hubTag: tag });
            });
        };

        //pagination
        $scope.activePageLink = function(num) {
            return ($scope.page == num) ? 'active' : '';
        };
        $scope.showPagination = function() {
            return $scope.total > 1;
        };
        $scope.selectPrevPage = function(num) {
            var step = $scope.page;
            if (num == 0) {
                step = 1;
            } else {
                step -= 1;
                if (step < 1) step = 1;
            }

            if (step != $scope.page) {
                this.selectPage(step);
            }
        };
        $scope.selectForwardPage = function(num) {
            var step = $scope.page;
            if (num == 0) {
                step = $scope.total;
            } else {
                step += 1;
                if (step > $scope.total) step = $scope.total;
            }

            if (step != $scope.page) {
                this.selectPage(step);
            }
        };
        $scope.selectPage = function(num) {
            if (num == $scope.page) {
                getTickets($scope.page, $scope.currCount, tag);
            } else {
                paginationService.setCurrPageByAppTag(tag, num);
                $state.go('hub.feed', { numPage: num });
            }
        };
        //pagination for
        $scope.activeCount = function(count) {
            return ($scope.currCount == count) ? 'active' : '';
        };
        $scope.selectCount = function(count) {
            paginationService.setCurrCountByAppTag(tag, count);
            var model = paginationService.getCountModelByAppTag(tag);
            $scope.currCount = model.currCount;
            this.selectPage(model.currPage);
        };

        //msg
        $scope.isMsg = [];
        var initMsg = function() {
            $scope.isMsg['load'] = false;
        };
        $scope.hideMsg = function(name) {
            $scope.isMsg[name] = false;
        };
        var getTickets = function(page, count, tag) {
            initMsg();
            $scope.isMsg['load'] = true;
            PostsService.getTicketsByPagination(page, count, tag, function(data) {
                $scope.isMsg['load'] = false;
                $scope.posts = data.Tickets;
                var modelCount = paginationService.getPageLinksByAppTag(tag, data.Count);
                $scope.page = modelCount.currPage;
                $scope.pages = modelCount.pageLinks;
                $scope.total = modelCount.total;
                $scope.counts = modelCount.counts;
                $scope.currCount = modelCount.currCount;
            });
        };
        $rootScope.$on('load:error', function(event, model) {
            if (model == 'Posts') {
                $scope.isMsg['load'] = false;
            }
        });
        var init = function() {
            tag = $state.params.hubTag;
            appTicketsService.getAppTicketByTag(tag,function(hub){
                if(hub!='null'){
                    $scope.currApp = hub;
                    $scope.page = $state.params.numPage;
                    if (!$scope.page) $scope.page = 1;
                    initMsg();
                    var modelCount = paginationService.getCountModelByAppTag(tag);
                    if (modelCount.currPage != $scope.page) {
                        $state.go('hub.feed', { numPage: modelCount.currPage });
                    }
                    getTickets(modelCount.currPage, modelCount.currCount, tag);
                }else{
                    userAppsService.addPostError();
                    $state.go('error');
                }
            });
        };

        //init
        init();
    }]);