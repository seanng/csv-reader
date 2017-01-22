/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.query', [])

  .controller('QueryCtrl', QueryCtrl);

  function QueryCtrl ($scope, $rootScope, services) {

    const updateQueryList = (e, store) => {
      console.log('submitted')
      $scope.$apply(() => {
        $scope.data = store;
        console.log($scope.data)
      } );

    }

    $rootScope.$on('newSubmission', updateQueryList)


  }



})();
