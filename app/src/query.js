/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.query', [
  ])

  .controller('QueryCtrl', QueryCtrl);

  function QueryCtrl ($scope, $rootScope, services) {

    $scope.query = {
      objType: null,
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

    $scope.selectType = (key) => $scope.query.objType = key;

    // date time picker




    // $scope.submitQuery = () => services.query($scope.query);

    $rootScope.$on('newSubmission', updateQueryList)


  }



})();
