'use strict';

var aps = aps || {};

aps.controller('HubCtrl', ['$scope', '$rootScope', '$state',
    function($scope, $rootScope, $state) {

        var init = function() {
            var hubTag = $state.params.hubTag;
            var app=hubTag;
        };

        //init
        init();
    }]);