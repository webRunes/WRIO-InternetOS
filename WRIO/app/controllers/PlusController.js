'use strict';

var aps = aps || {};

aps.controller('PlusCtrl', ['$scope', '$rootScope', 'AppsService', '$state', 'userAppSrv', 'paginationService',
    function ($scope, $rootScope, appTicketsService, $state, userAppsService, paginationService) {
        $scope.apps = [];
        $scope.currApp = {};
        //----pagination
        $scope.page = 1;
        $scope.pages = [];
        $scope.total = 0;
        //----pagination for
        $scope.counts = [];
        $scope.currCount = 0;
        //msg
        $scope.isMsg = [];
        var initMsg = function() {
            $scope.isMsg['load'] = false;
        };
        $scope.hideMsg = function(name) {
            $scope.isMsg[name] = false;
        };
        //app
        $scope.selectApp = function(appId) {
            userAppsService.addApp(appId, function(app) {
                if (app.AppType == 'Hub') {
                    $state.go('hub.feed', { hubTag: app.AppTag });
                } else if (app.AppType == 'Application' && app.AppTag != 'plus') {
                    $state.go('app', { app: app.AppTag });
                }
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
                getAppTickets($scope.page, $scope.currCount);
            } else {
                paginationService.setCurrPageByAppTag('plus', num);
                $state.go('plus', { page: num });
            }
        };
        //pagination for
        $scope.activeCount = function(count) {
            return ($scope.currCount == count) ? 'active' : '';
        };
        $scope.selectCount = function(count) {
            paginationService.setCurrCountByAppTag('plus', count);
            var model = paginationService.getCountModelByAppTag('plus');
            $scope.currCount = model.currCount;
            this.selectPage(model.currPage);
        };
        //tickets app
        var getAppTickets = function(page, count) {
            initMsg();
            $scope.isMsg['load'] = true;
            appTicketsService.getAppTicketsByPagination(page, count, function(apps) {
                $scope.isMsg['load'] = false;
                $scope.apps = apps.AppTickets;
                var modelCount = paginationService.getPageLinksByAppTag('plus', apps.Count);
                $scope.page = modelCount.currPage;
                $scope.pages = modelCount.pageLinks;
                $scope.total = modelCount.total;
                $scope.counts = modelCount.counts;
                $scope.currCount = modelCount.currCount;
            });
        };
        $rootScope.$on('load:error', function(event, apps) {
            if (apps == 'Apps') {
                $scope.isMsg['load'] = false;
            }
        });
        var getAppTicket = function(tag) {
            appTicketsService.getAppTicketByTag(tag, function(app) {
                if (app) {
                    $scope.currApp = app;
                }
            });
        };
        var init = function() {
            $scope.page = $state.params.page;
            if (!$scope.page) $scope.page = 1;
            initMsg();
            var modelCount = paginationService.getCountModelByAppTag('plus');
            if (modelCount.currPage != $scope.page) {
                $state.go('plus', { page: modelCount.currPage });
            }
            getAppTickets(modelCount.currPage, modelCount.currCount);
            getAppTicket('plus');
        };

        //init
        init();
    }]);
