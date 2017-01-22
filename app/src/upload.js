/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.upload', [])
  .controller('UploadCtrl', UploadCtrl);

  function UploadCtrl ($scope, $rootScope, services) {
    let file;
    $scope.hasData = false;

    const callback = (json) => {
      $scope.hasData = true;
      $rootScope.$emit('updateDisplay');
      console.log('json is on upload controller', json);
    }

    $scope.selectFile = (evt) => file = evt.target.files[0];
    $scope.submitFile = () => services.submitFile(file, callback);

  }



})();
