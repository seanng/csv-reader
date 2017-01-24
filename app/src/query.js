/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.query', [
  ])

  .controller('QueryCtrl', QueryCtrl);

  function QueryCtrl ($scope, $rootScope, services) {

    $scope.query = {
      objType: '',
      objId: '',
      date: undefined,
      time: undefined
    }

    const updateQueryList = (e, store) => {
      $scope.$apply(() => {
        $scope.showPanel = true;
        $scope.objTypes = store;
      });
    }

    // date time picker

    // $scope.submitQuery = () => services.query($scope.query);

    $rootScope.$on('newSubmission', updateQueryList)


  }



})();
