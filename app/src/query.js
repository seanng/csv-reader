/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.query', [])

  .controller('QueryCtrl', QueryCtrl);

  function QueryCtrl ($scope, $rootScope, services) {

    $scope.showPanel = false;
    $scope.selectIdDropdown = false;

    const updateQueryList = (e, store) => {
      $scope.$apply(() => {
        $scope.showPanel = true;
        $scope.objTypes = store;
      });
    }

    $scope.selectType = (key) => {
      $scope.selectIdDropdown = true;
      $scope.objIds = $scope.objTypes[key];
    }

    $scope.selectId = (key) => {
      $scope.selectTimesDropdown = true;
      $scope.objChanges = $scope.objIds[key];
    }

    $scope.selectTime = (index) => {
      console.log($scope.objChanges[index]);
      // display the data from this object.
    }

    $rootScope.$on('newSubmission', updateQueryList)


  }



})();
