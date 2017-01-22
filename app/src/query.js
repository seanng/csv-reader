/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.query', [])

  .controller('QueryCtrl', QueryCtrl);

  function QueryCtrl ($scope, $rootScope, services) {
    $rootScope.$on('newSubmission', (e, store) => $scope.data = store)
  }



})();
