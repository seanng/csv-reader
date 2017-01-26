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

    const emitWarning = (key, error) => {
      if (key) return console.log(key, 'notdefined');

    }

    const submitCallback = (error, success) => {
      if (error) return emitWarning(null, error)
      $rootScope.$broadcast('queried', $scope.query, success);
    }

    $scope.submitQuery = () => {
      for (let key in $scope.query) {
        if ($scope.query[key] === null) {
          return emitWarning(key);
        }
      }
      return services.queryServer($scope.query, submitCallback);
    }


  }



})();
