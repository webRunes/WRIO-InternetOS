'use strict';

var aps = aps || {};

aps.service('AppsService', ['$http', '$rootScope', function($http, $rootScope) {
    this.getAppTicketsByPagination = function(page, count, callBack) {
        $http.post('/api/CoreApps/', { Page: page, PageCount: count }).success(function(data) {
            addAppTickets(data.AppTickets);
            if (callBack) callBack(data);
        }).error(function() {
            $rootScope.$broadcast('load:error', 'Apps');
        });
    };

    this.getAppTicketByTag = function(tag, callBack) {
        var ind = fetchAppTicketByTag(tag);
        if (ind + 1) {
            if (callBack) callBack(appTickets[ind]);
        } else {
            $http.get('/api/CoreApps/' + tag).success(function(data) {
                if (callBack) callBack(data);
            });
        }
    };
    this.getAppTicketById = function(id) {
        var ind = fetchAppTicketById(id);
        if (ind + 1) return appTickets[ind];
        return null;
    };
    var addAppTickets = function(data) {
        for (var i = 0, len = data.length; i < len; i++) {
            if (!(fetchAppTicketById(data[i].Id) + 1)) appTickets.push(data[i]);
        }
    };
    var fetchAppTicketByTag = function(tag) {
        for (var i = 0, len = appTickets.length; i < len; i++) {
            if (appTickets[i].Tag == tag) return i;
        }
        return -1;
    };
    var fetchAppTicketById = function(id) {
        for (var i = 0, len = appTickets.length; i < len; i++) {
            if (appTickets[i].Id == id) return i;
        }
        return -1;
    };
    var appTickets = [];
}]);
