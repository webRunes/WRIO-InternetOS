'use strict';

var aps = aps || {};

aps.service('paginationService', [function() {
    this.getCountModelByAppTag = function(appTag) {
        if (!counts[appTag]) {
            counts[appTag] = {};
            counts[appTag].counts = [5, 25, 50];
            counts[appTag].currCount = counts[appTag].counts[0];
            counts[appTag].currPage = 1;
            counts[appTag].total = 1;
            counts[appTag].pageLinks = [];
        }
        return counts[appTag];
    };
    this.setCurrCountByAppTag = function(tag, count) {
        var ticket = ((counts[tag].currPage - 1) * counts[tag].currCount) + 1;
        counts[tag].currPage = Math.ceil(ticket / count);
        counts[tag].currCount = count;
    };
    this.setCurrPageByAppTag = function(tag, numPage) {
        counts[tag].currPage = numPage;
    };
    this.getPageLinksByAppTag = function(tag, count) {
        counts[tag].total = Math.ceil(count / counts[tag].currCount);
        var min = counts[tag].currPage - 2;
        if (min < 1) min = 1;
        var max = min + 5;
        if (max > counts[tag].total) {
            max = counts[tag].total;
            if (max - min < 5) {
                min = max - 5;
                if (min < 1) min = 1;
            }
        }
        counts[tag].pageLinks = [];
        for (var i = min; i <= max; i++) {
            counts[tag].pageLinks.push(i);
        }

        return counts[tag];
    };

    var counts = [];
}]);
