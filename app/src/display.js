/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.display', [])
  .controller('DisplayCtrl', DisplayCtrl);

  function DisplayCtrl ($scope, $rootScope, services) {
    const displayData = ()=>{
      $scope.data = services.getData;
    }

    $rootScope.$on('updateDisplay', displayData)

  }



})();
