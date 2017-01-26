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
      $rootScope.$broadcast('warning', key, error);
      if (key) return console.log(key, 'notdefined');
      console.error('post error:', error)
    }

    const submitCallback = (error, success) => {
      if (error) return emitWarning(null, error)
      $rootScope.$broadcast('queried', $scope.query, success);
      for (let key in $scope.query) {
        $scope.query[key] = '';
      }
    }

    $scope.submitQuery = () => {
      for (let key in $scope.query) {
        if ($scope.query[key] === null) {
          return emitWarning(key, false);
        }
      }
      return services.queryServer($scope.query, submitCallback);
    }


  }



})();
