/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.upload', [])
  .controller('UploadCtrl', UploadCtrl);

  function UploadCtrl ($scope, $rootScope, services) {

    $scope.selectFile = (evt) => {
      $scope.file = evt.target.files[0];
      $scope.$apply(() => $scope.fileSelected = true);
    }

    const submitComplete = (data, success, response) => $rootScope.$broadcast('uploaded', data, success, response);

    $scope.submitFile = () => services.submitFile($scope.file, submitComplete);
  }
})();
