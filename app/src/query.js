/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.query', [
  ])

  .controller('QueryCtrl', QueryCtrl);

  function QueryCtrl ($scope, $rootScope, services) {

    $scope.query = {
      objType: null,
      objId: null,
      timestamp: null
    }

    const updateQueryList = (e, store) => {
      $scope.$apply(() => {
        $scope.showPanel = true;
        $scope.objTypes = store;
      });
    }

    // date time picker

    const emitWarning (key) => {
      console.log(key, 'not defined.')
    }

    $scope.submitQuery = () => {
      for (let key in $scope.query) {
        if ($scope.query[key] === null) {
          return emitWarning(key);
        }
      }
      return services.queryInput($scope.query);
    }

    $rootScope.$on('newSubmission', updateQueryList)


  }



})();
