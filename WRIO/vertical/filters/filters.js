'use strict';

var aps=aps||{};

aps.filter('unsafeHtml', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
aps.filter('limitName', function() {
    return function(val) {
        if(val.length>16){
            var temp=val.substring(0, 12);
            val=temp + '...';
        }
        return val;
    };
});
aps.filter('limitName256', function() {
    return function(val) {
        if(val.length>256){
            var temp=val.substring(0, 252);
            val=temp + '...';
        }
        return val;
    };
});