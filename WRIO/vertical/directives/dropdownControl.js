'use strict';

var aps=aps || {};

aps.directive('dropDown',function () {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/vertical/templates/drop-down.html',
        scope:{dropdown: '='},
        controller: function($scope){
            $scope.onSelectOption=function(index){
                $scope.dropdown.currValue=(index+1)?$scope.dropdown.options[index]:$scope.dropdown.errorIndex;
                if($scope.dropdown.onSelectOption) $scope.dropdown.onSelectOption(index);
            };
            $scope.showSelectedOption=function(option){
                return $scope.dropdown.currValue==option;
            };
            $scope.onClickLink=function(){
                if($scope.dropdown.onClickLink) $scope.dropdown.onClickLink();
            };
        }
    };
});